import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

interface GmailAuthResponse {
  authorization_url: string;
  state: string;
}

interface GmailStatus {
  is_connected: boolean;
  email: string;
  last_sync_at?: string;
  total_emails_processed: number;
  receipts_found: number;
}

interface GmailSyncResult {
  emails_processed: number;
  receipts_found: number;
  receipts_created: number;
  sync_duration: number;
  last_sync_at: string;
}

interface IntegrationStatus {
  gmail: GmailStatus;
  plaid: {
    is_connected: boolean;
    connected_accounts: number;
    last_sync_at?: string;
  };
}

class IntegrationService {
  // Gmail Integration Methods
  async getGmailAuthUrl(): Promise<ApiResponse<GmailAuthResponse>> {
    return await apiService.get<GmailAuthResponse>(
      API_ENDPOINTS.EXTERNAL.GMAIL.AUTHORIZE
    );
  }

  async getGmailStatus(): Promise<ApiResponse<GmailStatus>> {
    return await apiService.get<GmailStatus>(
      API_ENDPOINTS.EXTERNAL.GMAIL.STATUS
    );
  }

  async disconnectGmail(): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(
      API_ENDPOINTS.EXTERNAL.GMAIL.DISCONNECT
    );
  }

  async syncGmailReceipts(): Promise<ApiResponse<GmailSyncResult>> {
    return await apiService.post<GmailSyncResult>(
      '/integrations/gmail/sync'
    );
  }

  // Complete Gmail OAuth flow
  async completeGmailAuth(
    authCode: string,
    state: string
  ): Promise<ApiResponse<GmailStatus>> {
    return await apiService.post<GmailStatus>(
      '/auth/gmail/callback',
      {
        code: authCode,
        state,
      }
    );
  }

  // Get overall integration status
  async getIntegrationStatus(): Promise<ApiResponse<IntegrationStatus>> {
    try {
      const [gmailResponse] = await Promise.all([
        this.getGmailStatus(),
        // Add other integration status calls here
      ]);

      const integrationStatus: IntegrationStatus = {
        gmail: gmailResponse.data || {
          is_connected: false,
          email: '',
          total_emails_processed: 0,
          receipts_found: 0,
        },
        plaid: {
          is_connected: false,
          connected_accounts: 0,
        },
      };

      return {
        success: true,
        data: integrationStatus,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get integration status',
      };
    }
  }

  // Auto-sync all connected integrations
  async syncAllIntegrations(): Promise<ApiResponse<{
    gmail?: GmailSyncResult;
    plaid?: any;
    total_receipts_found: number;
    total_sync_time: number;
  }>> {
    try {
      const startTime = Date.now();
      const results: any = {};
      let totalReceiptsFound = 0;

      // Check Gmail status and sync if connected
      const gmailStatus = await this.getGmailStatus();
      if (gmailStatus.success && gmailStatus.data?.is_connected) {
        const gmailSync = await this.syncGmailReceipts();
        if (gmailSync.success && gmailSync.data) {
          results.gmail = gmailSync.data;
          totalReceiptsFound += gmailSync.data.receipts_found;
        }
      }

      // Add other integration syncs here (Plaid, etc.)

      const totalSyncTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          ...results,
          total_receipts_found: totalReceiptsFound,
          total_sync_time: totalSyncTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to sync integrations',
      };
    }
  }

  // Check if any integrations need attention
  async getIntegrationAlerts(): Promise<ApiResponse<Array<{
    type: 'warning' | 'error' | 'info';
    integration: string;
    message: string;
    action?: string;
  }>>> {
    try {
      const alerts: Array<{
        type: 'warning' | 'error' | 'info';
        integration: string;
        message: string;
        action?: string;
      }> = [];

      // Check Gmail integration
      const gmailStatus = await this.getGmailStatus();
      if (gmailStatus.success && gmailStatus.data) {
        const gmail = gmailStatus.data;
        
        if (!gmail.is_connected) {
          alerts.push({
            type: 'info',
            integration: 'Gmail',
            message: 'Connect your Gmail account to automatically import receipt emails',
            action: 'Connect Gmail',
          });
        } else if (gmail.last_sync_at) {
          const lastSync = new Date(gmail.last_sync_at);
          const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceSync > 24) {
            alerts.push({
              type: 'warning',
              integration: 'Gmail',
              message: `Gmail hasn't synced in ${Math.floor(hoursSinceSync)} hours`,
              action: 'Sync Now',
            });
          }
        }
      }

      // Add checks for other integrations here

      return {
        success: true,
        data: alerts,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get integration alerts',
      };
    }
  }

  // Format last sync time for display
  formatLastSyncTime(lastSyncAt?: string): string {
    if (!lastSyncAt) return 'Never';
    
    const lastSync = new Date(lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }

  // Get integration health score (0-100)
  calculateIntegrationHealth(status: IntegrationStatus): number {
    let score = 0;
    let maxScore = 0;

    // Gmail health (40 points max)
    maxScore += 40;
    if (status.gmail.is_connected) {
      score += 20;
      if (status.gmail.last_sync_at) {
        const lastSync = new Date(status.gmail.last_sync_at);
        const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSync < 24) score += 20;
        else if (hoursSinceSync < 72) score += 10;
      }
    }

    // Plaid health (40 points max)
    maxScore += 40;
    if (status.plaid.is_connected) {
      score += 20;
      if (status.plaid.connected_accounts > 0) {
        score += 20;
      }
    }

    // Base functionality (20 points)
    maxScore += 20;
    score += 20; // Always available

    return Math.round((score / maxScore) * 100);
  }

  // Get recommended actions based on integration status
  getRecommendedActions(status: IntegrationStatus): Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }> {
    const recommendations: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      action: string;
    }> = [];

    // Gmail recommendations
    if (!status.gmail.is_connected) {
      recommendations.push({
        title: 'Connect Gmail',
        description: 'Automatically import receipts from your email',
        priority: 'high',
        action: 'connect_gmail',
      });
    } else if (status.gmail.receipts_found === 0) {
      recommendations.push({
        title: 'Check Gmail Settings',
        description: 'No receipts found in recent emails',
        priority: 'medium',
        action: 'check_gmail_settings',
      });
    }

    // Plaid recommendations
    if (!status.plaid.is_connected) {
      recommendations.push({
        title: 'Connect Bank Account',
        description: 'Automatically import transactions from your bank',
        priority: 'high',
        action: 'connect_bank',
      });
    } else if (status.plaid.connected_accounts === 0) {
      recommendations.push({
        title: 'Add Bank Accounts',
        description: 'Connect your bank accounts for automatic transaction import',
        priority: 'medium',
        action: 'add_bank_accounts',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Test integration connectivity
  async testIntegrationConnectivity(): Promise<ApiResponse<{
    gmail: boolean;
    plaid: boolean;
    api: boolean;
  }>> {
    try {
      const results = {
        gmail: false,
        plaid: false,
        api: true, // If we can make this call, API is working
      };

      // Test Gmail connectivity
      try {
        const gmailResponse = await this.getGmailStatus();
        results.gmail = gmailResponse.success;
      } catch {
        results.gmail = false;
      }

      // Test Plaid connectivity (would need to implement)
      // results.plaid = await this.testPlaidConnectivity();

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to test integration connectivity',
      };
    }
  }
}

export const integrationService = new IntegrationService();
export default IntegrationService;
