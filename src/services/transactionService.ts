import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { Transaction, ApiResponse, PaginatedResponse, SpendingSummary, CategorySpending } from '../types';

interface CreateTransactionData {
  merchantName: string;
  amount: number;
  currency: string;
  date: string;
  categoryId: string;
  description?: string;
  receiptId?: string;
}

interface UpdateTransactionData {
  merchantName?: string;
  amount?: number;
  currency?: string;
  date?: string;
  categoryId?: string;
  description?: string;
}

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  merchantName?: string;
  minAmount?: number;
  maxAmount?: number;
  source?: string;
}

class TransactionService {
  async createTransaction(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return await apiService.post<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.CREATE,
      data
    );
  }

  async getTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: TransactionFilters
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return await apiService.get<PaginatedResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.LIST,
      params
    );
  }

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    const url = API_ENDPOINTS.TRANSACTIONS.DETAIL.replace(':id', id);
    return await apiService.get<Transaction>(url);
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionData
  ): Promise<ApiResponse<Transaction>> {
    const url = API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id);
    return await apiService.put<Transaction>(url, data);
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    const url = API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', id);
    return await apiService.delete<void>(url);
  }

  async searchTransactions(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = {
      q: query,
      page,
      limit,
    };

    return await apiService.get<PaginatedResponse<Transaction>>(
      `${API_ENDPOINTS.TRANSACTIONS.LIST}/search`,
      params
    );
  }

  async getSpendingSummary(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<SpendingSummary>> {
    const params = {
      period,
      startDate,
      endDate,
    };

    return await apiService.get<SpendingSummary>(
      API_ENDPOINTS.TRANSACTIONS.SUMMARY,
      params
    );
  }

  async getTransactionsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return await this.getTransactions(page, limit, { categoryId });
  }

  async getTransactionsByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return await this.getTransactions(page, limit, { startDate, endDate });
  }

  async getTransactionsByMerchant(
    merchantName: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return await this.getTransactions(page, limit, { merchantName });
  }

  // Mock data generators for development
  async getMockTransactions(): Promise<Transaction[]> {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'user1',
        receiptId: 'receipt1',
        merchantName: 'Whole Foods Market',
        amount: 45.67,
        currency: 'USD',
        date: '2024-01-15',
        category: {
          id: '2',
          name: 'Groceries',
          icon: '🛒',
          color: '#22c55e',
        },
        description: 'Weekly grocery shopping',
        source: 'receipt',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        userId: 'user1',
        merchantName: 'Starbucks',
        amount: 8.95,
        currency: 'USD',
        date: '2024-01-14',
        category: {
          id: '1',
          name: 'Food & Dining',
          icon: '🍽️',
          color: '#0ea5e9',
        },
        description: 'Morning coffee',
        source: 'manual',
        createdAt: '2024-01-14T08:15:00Z',
        updatedAt: '2024-01-14T08:15:00Z',
      },
      {
        id: '3',
        userId: 'user1',
        merchantName: 'Shell Gas Station',
        amount: 52.30,
        currency: 'USD',
        date: '2024-01-13',
        category: {
          id: '3',
          name: 'Transportation',
          icon: '🚗',
          color: '#f59e0b',
        },
        description: 'Gas fill-up',
        source: 'bank',
        createdAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-13T16:45:00Z',
      },
      {
        id: '4',
        userId: 'user1',
        merchantName: 'Target',
        amount: 127.89,
        currency: 'USD',
        date: '2024-01-12',
        category: {
          id: '4',
          name: 'Shopping',
          icon: '🛍️',
          color: '#ef4444',
        },
        description: 'Household items',
        source: 'receipt',
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
      },
      {
        id: '5',
        userId: 'user1',
        merchantName: 'Netflix',
        amount: 15.99,
        currency: 'USD',
        date: '2024-01-11',
        category: {
          id: '5',
          name: 'Entertainment',
          icon: '🎬',
          color: '#64748b',
        },
        description: 'Monthly subscription',
        source: 'bank',
        createdAt: '2024-01-11T12:00:00Z',
        updatedAt: '2024-01-11T12:00:00Z',
      },
    ];

    return mockTransactions;
  }

  async getMockSpendingSummary(): Promise<SpendingSummary> {
    const categoryBreakdown: CategorySpending[] = [
      {
        category: {
          id: '4',
          name: 'Shopping',
          icon: '🛍️',
          color: '#ef4444',
        },
        amount: 127.89,
        percentage: 51.2,
        transactionCount: 1,
      },
      {
        category: {
          id: '3',
          name: 'Transportation',
          icon: '🚗',
          color: '#f59e0b',
        },
        amount: 52.30,
        percentage: 20.9,
        transactionCount: 1,
      },
      {
        category: {
          id: '2',
          name: 'Groceries',
          icon: '🛒',
          color: '#22c55e',
        },
        amount: 45.67,
        percentage: 18.3,
        transactionCount: 1,
      },
      {
        category: {
          id: '5',
          name: 'Entertainment',
          icon: '🎬',
          color: '#64748b',
        },
        amount: 15.99,
        percentage: 6.4,
        transactionCount: 1,
      },
      {
        category: {
          id: '1',
          name: 'Food & Dining',
          icon: '🍽️',
          color: '#0ea5e9',
        },
        amount: 8.95,
        percentage: 3.6,
        transactionCount: 1,
      },
    ];

    return {
      totalAmount: 250.80,
      currency: 'USD',
      period: 'monthly',
      categoryBreakdown,
      transactionCount: 5,
    };
  }

  // Utility methods for offline support
  async saveTransactionOffline(transaction: Transaction): Promise<void> {
    try {
      const offlineTransactions = await this.getOfflineTransactions();
      offlineTransactions.push(transaction);
      await AsyncStorage.setItem('offline_transactions', JSON.stringify(offlineTransactions));
    } catch (error) {
      console.error('Error saving transaction offline:', error);
    }
  }

  async getOfflineTransactions(): Promise<Transaction[]> {
    try {
      const offlineData = await AsyncStorage.getItem('offline_transactions');
      return offlineData ? JSON.parse(offlineData) : [];
    } catch (error) {
      console.error('Error getting offline transactions:', error);
      return [];
    }
  }

  async syncOfflineTransactions(): Promise<void> {
    try {
      const offlineTransactions = await this.getOfflineTransactions();
      
      for (const transaction of offlineTransactions) {
        try {
          await this.createTransaction({
            merchantName: transaction.merchantName,
            amount: transaction.amount,
            currency: transaction.currency,
            date: transaction.date,
            categoryId: transaction.category.id,
            description: transaction.description,
            receiptId: transaction.receiptId,
          });
        } catch (error) {
          console.error('Error syncing transaction:', transaction.id, error);
        }
      }

      // Clear offline transactions after successful sync
      await AsyncStorage.removeItem('offline_transactions');
    } catch (error) {
      console.error('Error syncing offline transactions:', error);
    }
  }
}

export const transactionService = new TransactionService();
export default TransactionService;
