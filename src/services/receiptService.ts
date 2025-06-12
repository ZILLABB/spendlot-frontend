import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { Receipt, ApiResponse, PaginatedResponse, OCRStatus } from '../types';

interface UploadReceiptData {
  imageUri: string;
  merchantName?: string;
  amount?: number;
  date?: string;
  categoryId?: string;
}

interface UpdateReceiptData {
  merchantName?: string;
  amount?: number;
  date?: string;
  categoryId?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface ReceiptFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  merchantName?: string;
  minAmount?: number;
  maxAmount?: number;
  ocrStatus?: OCRStatus;
}

class ReceiptService {
  async uploadReceipt(data: UploadReceiptData): Promise<ApiResponse<Receipt>> {
    const formData = new FormData();
    
    // Add the image file
    formData.append('image', {
      uri: data.imageUri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    } as any);

    // Add optional metadata
    if (data.merchantName) {
      formData.append('merchantName', data.merchantName);
    }
    if (data.amount) {
      formData.append('amount', data.amount.toString());
    }
    if (data.date) {
      formData.append('date', data.date);
    }
    if (data.categoryId) {
      formData.append('categoryId', data.categoryId);
    }

    return await apiService.upload<Receipt>(
      API_ENDPOINTS.RECEIPTS.UPLOAD,
      formData
    );
  }

  async getReceipts(
    page: number = 1,
    limit: number = 20,
    filters?: ReceiptFilters
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return await apiService.get<PaginatedResponse<Receipt>>(
      API_ENDPOINTS.RECEIPTS.LIST,
      params
    );
  }

  async getReceiptById(id: string): Promise<ApiResponse<Receipt>> {
    const url = API_ENDPOINTS.RECEIPTS.DETAIL.replace(':id', id);
    return await apiService.get<Receipt>(url);
  }

  async updateReceipt(
    id: string,
    data: UpdateReceiptData
  ): Promise<ApiResponse<Receipt>> {
    const url = API_ENDPOINTS.RECEIPTS.UPDATE.replace(':id', id);
    return await apiService.put<Receipt>(url, data);
  }

  async deleteReceipt(id: string): Promise<ApiResponse<void>> {
    const url = API_ENDPOINTS.RECEIPTS.DELETE.replace(':id', id);
    return await apiService.delete<void>(url);
  }

  async getOCRStatus(id: string): Promise<ApiResponse<{ status: OCRStatus; progress?: number }>> {
    const url = API_ENDPOINTS.RECEIPTS.OCR_STATUS.replace(':id', id);
    return await apiService.get<{ status: OCRStatus; progress?: number }>(url);
  }

  async searchReceipts(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    const params = {
      q: query,
      page,
      limit,
    };

    return await apiService.get<PaginatedResponse<Receipt>>(
      `${API_ENDPOINTS.RECEIPTS.LIST}/search`,
      params
    );
  }

  async getReceiptsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    return await this.getReceipts(page, limit, { categoryId });
  }

  async getReceiptsByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    return await this.getReceipts(page, limit, { startDate, endDate });
  }

  async getReceiptsByMerchant(
    merchantName: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    return await this.getReceipts(page, limit, { merchantName });
  }

  async retryOCR(id: string): Promise<ApiResponse<Receipt>> {
    const url = `${API_ENDPOINTS.RECEIPTS.DETAIL.replace(':id', id)}/retry-ocr`;
    return await apiService.post<Receipt>(url);
  }

  // Utility methods for offline support
  async saveReceiptOffline(receipt: Receipt): Promise<void> {
    try {
      const offlineReceipts = await this.getOfflineReceipts();
      offlineReceipts.push(receipt);
      await AsyncStorage.setItem('offline_receipts', JSON.stringify(offlineReceipts));
    } catch (error) {
      console.error('Error saving receipt offline:', error);
    }
  }

  async getOfflineReceipts(): Promise<Receipt[]> {
    try {
      const offlineData = await AsyncStorage.getItem('offline_receipts');
      return offlineData ? JSON.parse(offlineData) : [];
    } catch (error) {
      console.error('Error getting offline receipts:', error);
      return [];
    }
  }

  async syncOfflineReceipts(): Promise<void> {
    try {
      const offlineReceipts = await this.getOfflineReceipts();
      
      for (const receipt of offlineReceipts) {
        try {
          // Try to upload each offline receipt
          await this.uploadReceipt({
            imageUri: receipt.imageUrl,
            merchantName: receipt.merchantName,
            amount: receipt.amount,
            date: receipt.date,
            categoryId: receipt.category.id,
          });
        } catch (error) {
          console.error('Error syncing receipt:', receipt.id, error);
        }
      }

      // Clear offline receipts after successful sync
      await AsyncStorage.removeItem('offline_receipts');
    } catch (error) {
      console.error('Error syncing offline receipts:', error);
    }
  }
}

export const receiptService = new ReceiptService();
export default ReceiptService;
