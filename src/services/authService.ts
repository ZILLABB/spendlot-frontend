import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { User, LoginForm, RegisterForm, ApiResponse } from '../types';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      await this.storeAuthData(response.data);
      apiService.setAuthToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterForm): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    if (response.success && response.data) {
      await this.storeAuthData(response.data);
      apiService.setAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server call fails
      console.warn('Server logout failed:', error);
    } finally {
      await this.clearAuthData();
      apiService.clearAuthToken();
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    if (response.success && response.data) {
      await this.storeAuthData(response.data);
      apiService.setAuthToken(response.data.token);
    }

    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password: newPassword,
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    const user = await this.getCurrentUser();
    return !!(token && user);
  }

  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, authData.token],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Validate token expiration (if you store expiration time)
  async isTokenValid(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;

      // You can decode JWT token here to check expiration
      // For now, we'll make a simple API call to verify
      const response = await apiService.get('/auth/verify');
      return response.success;
    } catch {
      return false;
    }
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<boolean> {
    const isValid = await this.isTokenValid();
    
    if (!isValid) {
      const refreshResult = await this.refreshToken();
      return refreshResult.success;
    }
    
    return true;
  }
}

export const authService = new AuthService();
export default AuthService;
