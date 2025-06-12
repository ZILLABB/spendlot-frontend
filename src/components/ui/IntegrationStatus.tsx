import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { integrationService } from '../../services/integrationService';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants';

interface IntegrationStatusProps {
  onGmailConnect?: () => void;
  onBankConnect?: () => void;
}

interface IntegrationStatus {
  gmail: {
    is_connected: boolean;
    email: string;
    last_sync_at?: string;
    total_emails_processed: number;
    receipts_found: number;
  };
  plaid: {
    is_connected: boolean;
    connected_accounts: number;
    last_sync_at?: string;
  };
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  onGmailConnect,
  onBankConnect,
}) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [syncing, setSyncing] = useState<{ gmail: boolean; plaid: boolean }>({
    gmail: false,
    plaid: false,
  });

  useEffect(() => {
    loadIntegrationStatus();
  }, []);

  const loadIntegrationStatus = async () => {
    try {
      setLoading(true);
      const response = await integrationService.getIntegrationStatus();
      
      if (response.success && response.data) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error loading integration status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailSync = async () => {
    if (!status?.gmail.is_connected) return;

    try {
      setSyncing(prev => ({ ...prev, gmail: true }));
      const response = await integrationService.syncGmailReceipts();
      
      if (response.success && response.data) {
        Alert.alert(
          'Sync Complete',
          `Found ${response.data.receipts_found} receipts in ${response.data.emails_processed} emails`
        );
        await loadIntegrationStatus();
      } else {
        Alert.alert('Error', 'Failed to sync Gmail receipts');
      }
    } catch (error) {
      console.error('Error syncing Gmail:', error);
      Alert.alert('Error', 'Failed to sync Gmail receipts');
    } finally {
      setSyncing(prev => ({ ...prev, gmail: false }));
    }
  };

  const handleGmailDisconnect = async () => {
    Alert.alert(
      'Disconnect Gmail',
      'Are you sure you want to disconnect your Gmail account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: disconnectGmail },
      ]
    );
  };

  const disconnectGmail = async () => {
    try {
      const response = await integrationService.disconnectGmail();
      
      if (response.success) {
        Alert.alert('Success', 'Gmail account disconnected');
        await loadIntegrationStatus();
      } else {
        Alert.alert('Error', 'Failed to disconnect Gmail');
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      Alert.alert('Error', 'Failed to disconnect Gmail');
    }
  };

  const formatLastSync = (lastSyncAt?: string) => {
    if (!lastSyncAt) return 'Never';
    return integrationService.formatLastSyncTime(lastSyncAt);
  };

  const getHealthScore = () => {
    if (!status) return 0;
    return integrationService.calculateIntegrationHealth(status);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return COLORS.success[500];
    if (score >= 60) return COLORS.warning[500];
    return COLORS.error[500];
  };

  if (loading) {
    return (
      <Card style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading integrations...</Text>
        </View>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card style={styles.container}>
        <Text style={styles.errorText}>Failed to load integration status</Text>
      </Card>
    );
  }

  const healthScore = getHealthScore();

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Integrations</Text>
        <View style={styles.healthScore}>
          <View style={[
            styles.healthDot,
            { backgroundColor: getHealthColor(healthScore) }
          ]} />
          <Text style={styles.healthText}>{healthScore}% Health</Text>
        </View>
      </View>

      {/* Gmail Integration */}
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationIcon}>📧</Text>
            <View style={styles.integrationDetails}>
              <Text style={styles.integrationName}>Gmail</Text>
              <Text style={styles.integrationStatus}>
                {status.gmail.is_connected 
                  ? `Connected: ${status.gmail.email}`
                  : 'Not connected'
                }
              </Text>
            </View>
          </View>
          
          <View style={[
            styles.statusIndicator,
            { backgroundColor: status.gmail.is_connected ? COLORS.success[500] : COLORS.gray[400] }
          ]} />
        </View>

        {status.gmail.is_connected && (
          <View style={styles.integrationStats}>
            <Text style={styles.statText}>
              Last sync: {formatLastSync(status.gmail.last_sync_at)}
            </Text>
            <Text style={styles.statText}>
              {status.gmail.receipts_found} receipts found from {status.gmail.total_emails_processed} emails
            </Text>
          </View>
        )}

        <View style={styles.integrationActions}>
          {status.gmail.is_connected ? (
            <>
              <Button
                title="Sync Now"
                onPress={handleGmailSync}
                loading={syncing.gmail}
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Disconnect"
                onPress={handleGmailDisconnect}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
            </>
          ) : (
            <Button
              title="Connect Gmail"
              onPress={onGmailConnect}
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>

      {/* Bank Integration */}
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationIcon}>🏦</Text>
            <View style={styles.integrationDetails}>
              <Text style={styles.integrationName}>Bank Accounts</Text>
              <Text style={styles.integrationStatus}>
                {status.plaid.is_connected 
                  ? `${status.plaid.connected_accounts} account${status.plaid.connected_accounts !== 1 ? 's' : ''} connected`
                  : 'Not connected'
                }
              </Text>
            </View>
          </View>
          
          <View style={[
            styles.statusIndicator,
            { backgroundColor: status.plaid.is_connected ? COLORS.success[500] : COLORS.gray[400] }
          ]} />
        </View>

        {status.plaid.is_connected && (
          <View style={styles.integrationStats}>
            <Text style={styles.statText}>
              Last sync: {formatLastSync(status.plaid.last_sync_at)}
            </Text>
          </View>
        )}

        <View style={styles.integrationActions}>
          <Button
            title={status.plaid.is_connected ? "Manage Accounts" : "Connect Bank"}
            onPress={onBankConnect}
            size="small"
            style={styles.actionButton}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  errorText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.error[600],
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  healthScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  healthText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  integrationItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  integrationIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  integrationDetails: {
    flex: 1,
  },
  integrationName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  integrationStatus: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  integrationStats: {
    marginLeft: 40,
    marginBottom: SPACING.sm,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  integrationActions: {
    flexDirection: 'row',
    marginLeft: 40,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default IntegrationStatus;
