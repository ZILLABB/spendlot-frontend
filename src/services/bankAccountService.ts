import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { BankAccount, ApiResponse } from '../types';

interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
}

interface PlaidExchangeTokenData {
  public_token: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      subtype: string;
    }>;
  };
}

interface PlaidExchangeTokenResponse {
  access_token: string;
  item_id: string;
  accounts: BankAccount[];
}

interface SyncAccountResponse {
  transactions_added: number;
  transactions_modified: number;
  transactions_removed: number;
  last_sync_at: string;
}

class BankAccountService {
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return await apiService.get<BankAccount[]>(API_ENDPOINTS.BANK_ACCOUNTS.LIST);
  }

  async getBankAccountById(id: number): Promise<ApiResponse<BankAccount>> {
    const url = `${API_ENDPOINTS.BANK_ACCOUNTS.LIST}/${id}`;
    return await apiService.get<BankAccount>(url);
  }

  // Plaid Integration Methods
  async createPlaidLinkToken(): Promise<ApiResponse<PlaidLinkTokenResponse>> {
    return await apiService.post<PlaidLinkTokenResponse>(
      API_ENDPOINTS.BANK_ACCOUNTS.PLAID_LINK_TOKEN
    );
  }

  async exchangePlaidToken(
    data: PlaidExchangeTokenData
  ): Promise<ApiResponse<PlaidExchangeTokenResponse>> {
    return await apiService.post<PlaidExchangeTokenResponse>(
      API_ENDPOINTS.BANK_ACCOUNTS.PLAID_EXCHANGE_TOKEN,
      data
    );
  }

  async syncBankAccount(accountId: number): Promise<ApiResponse<SyncAccountResponse>> {
    const url = API_ENDPOINTS.BANK_ACCOUNTS.SYNC.replace(':id', accountId.toString());
    return await apiService.post<SyncAccountResponse>(url);
  }

  async updateBankAccount(
    id: number,
    data: Partial<BankAccount>
  ): Promise<ApiResponse<BankAccount>> {
    const url = `${API_ENDPOINTS.BANK_ACCOUNTS.LIST}/${id}`;
    return await apiService.put<BankAccount>(url, data);
  }

  async deleteBankAccount(id: number): Promise<ApiResponse<void>> {
    const url = `${API_ENDPOINTS.BANK_ACCOUNTS.LIST}/${id}`;
    return await apiService.delete<void>(url);
  }

  // Utility Methods
  async getActiveBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    const response = await this.getBankAccounts();
    if (response.success && response.data) {
      const activeAccounts = response.data.filter(account => account.is_active);
      return {
        success: true,
        data: activeAccounts,
      };
    }
    return response;
  }

  async getBankAccountsByInstitution(
    institutionName: string
  ): Promise<ApiResponse<BankAccount[]>> {
    const response = await this.getBankAccounts();
    if (response.success && response.data) {
      const filteredAccounts = response.data.filter(
        account => account.institution_name.toLowerCase().includes(institutionName.toLowerCase())
      );
      return {
        success: true,
        data: filteredAccounts,
      };
    }
    return response;
  }

  async getTotalBalance(): Promise<ApiResponse<{ total: number; currency: string }>> {
    const response = await this.getActiveBankAccounts();
    if (response.success && response.data) {
      const total = response.data.reduce((sum, account) => {
        return sum + (account.current_balance || 0);
      }, 0);
      
      // Assume all accounts use the same currency for simplicity
      const currency = response.data[0]?.currency || 'USD';
      
      return {
        success: true,
        data: { total, currency },
      };
    }
    return {
      success: false,
      error: 'Failed to calculate total balance',
    };
  }

  async syncAllAccounts(): Promise<ApiResponse<SyncAccountResponse[]>> {
    try {
      const accountsResponse = await this.getActiveBankAccounts();
      if (!accountsResponse.success || !accountsResponse.data) {
        return {
          success: false,
          error: 'Failed to get bank accounts',
        };
      }

      const syncResults: SyncAccountResponse[] = [];
      
      for (const account of accountsResponse.data) {
        try {
          const syncResponse = await this.syncBankAccount(account.id);
          if (syncResponse.success && syncResponse.data) {
            syncResults.push(syncResponse.data);
          }
        } catch (error) {
          console.error(`Failed to sync account ${account.id}:`, error);
        }
      }

      return {
        success: true,
        data: syncResults,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to sync accounts',
      };
    }
  }

  // Format account display name
  formatAccountDisplayName(account: BankAccount): string {
    return `${account.institution_name} - ${account.account_name} (${account.account_type})`;
  }

  // Format balance for display
  formatBalance(account: BankAccount): string {
    if (!account.current_balance) return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    });
    
    return formatter.format(account.current_balance);
  }

  // Check if account needs sync (last sync > 24 hours ago)
  needsSync(account: BankAccount): boolean {
    if (!account.last_sync_at) return true;
    
    const lastSync = new Date(account.last_sync_at);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceSync > 24;
  }

  // Get accounts that need syncing
  async getAccountsNeedingSync(): Promise<ApiResponse<BankAccount[]>> {
    const response = await this.getActiveBankAccounts();
    if (response.success && response.data) {
      const accountsNeedingSync = response.data.filter(account => 
        this.needsSync(account)
      );
      return {
        success: true,
        data: accountsNeedingSync,
      };
    }
    return response;
  }

  // Validate Plaid configuration
  async validatePlaidConfiguration(): Promise<boolean> {
    try {
      const response = await this.createPlaidLinkToken();
      return response.success;
    } catch {
      return false;
    }
  }

  // Get account type display name
  getAccountTypeDisplayName(accountType: string): string {
    const typeMap: Record<string, string> = {
      'checking': 'Checking Account',
      'savings': 'Savings Account',
      'credit': 'Credit Card',
      'loan': 'Loan Account',
      'investment': 'Investment Account',
      'other': 'Other Account',
    };
    
    return typeMap[accountType.toLowerCase()] || accountType;
  }

  // Get institution logo URL (placeholder for future implementation)
  getInstitutionLogoUrl(institutionName: string): string {
    // This would typically come from Plaid or a logo service
    return `https://logo.clearbit.com/${institutionName.toLowerCase().replace(/\s+/g, '')}.com`;
  }
}

export const bankAccountService = new BankAccountService();
export default BankAccountService;
