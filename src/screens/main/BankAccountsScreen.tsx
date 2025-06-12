import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/ui';
import { bankAccountService } from '../../services/bankAccountService';
import { BankAccount } from '../../types';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

export const BankAccountsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [syncingAccounts, setSyncingAccounts] = useState<Set<number>>(new Set());
  const [connectingPlaid, setConnectingPlaid] = useState(false);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await bankAccountService.getBankAccounts();
      
      if (response.success && response.data) {
        setAccounts(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load bank accounts');
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      Alert.alert('Error', 'Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBankAccounts();
    setRefreshing(false);
  };

  const handleConnectPlaid = async () => {
    try {
      setConnectingPlaid(true);
      
      // Create Plaid link token
      const linkTokenResponse = await bankAccountService.createPlaidLinkToken();
      
      if (!linkTokenResponse.success || !linkTokenResponse.data) {
        Alert.alert('Error', 'Failed to initialize bank connection');
        return;
      }

      // In a real app, you would open Plaid Link here
      // For now, we'll show a placeholder
      Alert.alert(
        'Connect Bank Account',
        'Plaid integration would open here. This requires additional setup with Plaid Link SDK.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => simulatePlaidConnection() },
        ]
      );
    } catch (error) {
      console.error('Error connecting Plaid:', error);
      Alert.alert('Error', 'Failed to connect bank account');
    } finally {
      setConnectingPlaid(false);
    }
  };

  const simulatePlaidConnection = () => {
    // Simulate successful Plaid connection
    Alert.alert(
      'Success',
      'Bank account connected successfully! In a real app, this would exchange the public token and create the account.',
      [{ text: 'OK', onPress: loadBankAccounts }]
    );
  };

  const handleSyncAccount = async (accountId: number) => {
    try {
      setSyncingAccounts(prev => new Set(prev).add(accountId));
      
      const response = await bankAccountService.syncBankAccount(accountId);
      
      if (response.success && response.data) {
        Alert.alert(
          'Sync Complete',
          `Added ${response.data.transactions_added} new transactions`
        );
        await loadBankAccounts();
      } else {
        Alert.alert('Error', response.error || 'Failed to sync account');
      }
    } catch (error) {
      console.error('Error syncing account:', error);
      Alert.alert('Error', 'Failed to sync account');
    } finally {
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
    }
  };

  const handleToggleAccount = async (account: BankAccount) => {
    try {
      const updatedAccount = { ...account, is_active: !account.is_active };
      const response = await bankAccountService.updateBankAccount(account.id, updatedAccount);
      
      if (response.success) {
        await loadBankAccounts();
      } else {
        Alert.alert('Error', response.error || 'Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to update account');
    }
  };

  const handleDeleteAccount = (account: BankAccount) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to remove ${bankAccountService.formatAccountDisplayName(account)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteAccount(account.id) },
      ]
    );
  };

  const deleteAccount = async (accountId: number) => {
    try {
      const response = await bankAccountService.deleteBankAccount(accountId);
      
      if (response.success) {
        await loadBankAccounts();
      } else {
        Alert.alert('Error', response.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account');
    }
  };

  const renderAccountCard = (account: BankAccount) => {
    const isSyncing = syncingAccounts.has(account.id);
    const needsSync = bankAccountService.needsSync(account);

    return (
      <Card key={account.id} style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.account_name}</Text>
            <Text style={styles.institutionName}>{account.institution_name}</Text>
            <Text style={styles.accountType}>
              {bankAccountService.getAccountTypeDisplayName(account.account_type)}
            </Text>
          </View>
          
          <View style={styles.accountActions}>
            <Text style={styles.balance}>
              {bankAccountService.formatBalance(account)}
            </Text>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: account.is_active ? COLORS.success[500] : COLORS.gray[400] }
            ]} />
          </View>
        </View>

        <View style={styles.accountFooter}>
          <View style={styles.syncInfo}>
            <Text style={styles.lastSync}>
              Last sync: {bankAccountService.formatLastSyncTime(account.last_sync_at)}
            </Text>
            {needsSync && (
              <Text style={styles.needsSyncText}>Sync recommended</Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.syncButton]}
              onPress={() => handleSyncAccount(account.id)}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.syncButtonText}>Sync</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.toggleButton]}
              onPress={() => handleToggleAccount(account)}
            >
              <Text style={styles.toggleButtonText}>
                {account.is_active ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteAccount(account)}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading bank accounts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bank Accounts</Text>
          <Text style={styles.subtitle}>
            Connect your bank accounts to automatically import transactions
          </Text>
        </View>

        {accounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Bank Accounts Connected</Text>
            <Text style={styles.emptySubtitle}>
              Connect your bank account to automatically import transactions and get better insights into your spending.
            </Text>
          </View>
        ) : (
          <View style={styles.accountsList}>
            {accounts.map(renderAccountCard)}
          </View>
        )}

        <View style={styles.connectButtonContainer}>
          <Button
            title="Connect Bank Account"
            onPress={handleConnectPlaid}
            loading={connectingPlaid}
            style={styles.connectButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  accountsList: {
    padding: SPACING.md,
  },
  accountCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  institutionName: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  accountType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  accountActions: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
  },
  syncInfo: {
    marginBottom: SPACING.md,
  },
  lastSync: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  needsSyncText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning[600],
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: COLORS.primary[500],
  },
  syncButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: COLORS.gray[200],
  },
  toggleButtonText: {
    color: COLORS.gray[700],
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.error[500],
  },
  deleteButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  connectButtonContainer: {
    padding: SPACING.lg,
  },
  connectButton: {
    backgroundColor: COLORS.primary[500],
  },
});

export default BankAccountsScreen;
