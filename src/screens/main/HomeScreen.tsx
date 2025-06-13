import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Loading, Text } from '../../components/ui';
import SpendingChart from '../../components/charts/SpendingChart';
import SpendingTrendsChart from '../../components/charts/SpendingTrendsChart';
import { SPACING } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { transactionService } from '../../services/transactionService';
import { analyticsService } from '../../services/analyticsService';
import { Transaction, SpendingSummary } from '../../types';

interface HomeScreenProps {
  navigation: any; // Replace with proper navigation type
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load current month summary and recent transactions
      const [summaryResponse, transactionsResponse] = await Promise.all([
        analyticsService.getCurrentMonthSummary(),
        transactionService.getTransactions(1, 5), // Get first 5 transactions
      ]);

      if (summaryResponse.success && summaryResponse.data) {
        // Convert analytics data to SpendingSummary format
        const analyticsData = summaryResponse.data;
        const spendingSummaryData: SpendingSummary = {
          totalAmount: analyticsData.total_amount,
          currency: analyticsData.currency,
          period: 'monthly',
          categoryBreakdown: analyticsData.category_breakdown.map(cat => ({
            category: {
              id: cat.category_id.toString(),
              name: cat.category_name,
              icon: '📊', // Default icon
              color: '#0ea5e9', // Default color
            },
            amount: cat.amount,
            percentage: cat.percentage,
            transactionCount: cat.transaction_count,
          })),
          transactionCount: analyticsData.transaction_count,
        };
        setSpendingSummary(spendingSummaryData);
      } else {
        // Fallback to mock data if analytics service fails
        const mockData = await transactionService.getMockSpendingSummary();
        setSpendingSummary(mockData);
      }

      if (transactionsResponse.success && transactionsResponse.data) {
        // Convert new transaction format to old format for compatibility
        const convertedTransactions: Transaction[] = transactionsResponse.data.items.map(t => ({
          id: t.id.toString(),
          userId: 'user1',
          receiptId: undefined,
          merchantName: t.merchant_name || 'Unknown Merchant',
          amount: t.amount,
          currency: t.currency,
          date: t.transaction_date,
          category: {
            id: t.category_id?.toString() || '1',
            name: 'General',
            icon: '💳',
            color: '#0ea5e9',
          },
          description: t.description,
          source: 'manual',
          createdAt: t.created_at,
          updatedAt: t.created_at,
        }));
        setRecentTransactions(convertedTransactions);
      } else {
        // Fallback to mock data
        const mockTransactions = await transactionService.getMockTransactions();
        setRecentTransactions(mockTransactions.slice(0, 5));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data on error
      try {
        const [mockSummary, mockTransactions] = await Promise.all([
          transactionService.getMockSpendingSummary(),
          transactionService.getMockTransactions(),
        ]);
        setSpendingSummary(mockSummary);
        setRecentTransactions(mockTransactions.slice(0, 5));
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: Navigate to transaction detail
    console.log('Transaction pressed:', transaction.id);
  };

  if (isLoading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h2" weight="bold" color="primary">
          Hello, {user?.firstName || 'User'}! 👋
        </Text>
        <Text variant="subtitle1" color="secondary">
          Here's your spending overview
        </Text>
      </View>

      {/* Monthly Summary Card */}
      <Card style={styles.summaryCard} variant="elevated" padding="xl">
        <Text variant="h6" weight="semibold" color="secondary" style={styles.summaryTitle}>
          This Month
        </Text>
        <Text variant="h1" weight="bold" color="accent" style={styles.totalAmount}>
          {spendingSummary ? formatAmount(spendingSummary.totalAmount, spendingSummary.currency) : '$0.00'}
        </Text>
        <Text variant="body1" color="secondary">
          {spendingSummary?.transactionCount || 0} transactions
        </Text>

        {/* Category Breakdown Preview */}
        {spendingSummary && spendingSummary.categoryBreakdown.length > 0 && (
          <View style={styles.categoryPreview}>
            <Text variant="body2" weight="semibold" color="secondary" style={styles.categoryPreviewTitle}>
              Top Categories
            </Text>
            <View style={styles.categoryList}>
              {spendingSummary.categoryBreakdown.slice(0, 3).map((item, index) => (
                <View key={item.category.id} style={styles.categoryItem}>
                  <Text style={styles.categoryIcon}>{item.category.icon}</Text>
                  <Text variant="body2" weight="semibold" color="primary">
                    {formatAmount(item.amount, spendingSummary.currency)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text variant="h5" weight="semibold" color="primary" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionButtons}>
          <Button
            title="📷 Scan Receipt"
            onPress={() => navigation.navigate('Receipts', { screen: 'ReceiptCamera' })}
            style={styles.actionButton}
            variant="gradient"
            size="large"
          />
          <Button
            title="➕ Add Expense"
            onPress={() => navigation.navigate('Transactions')}
            style={styles.actionButton}
            variant="outline"
            size="large"
          />
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h5" weight="semibold" color="primary">
            Recent Transactions
          </Text>
          <Button
            title="View All"
            onPress={() => navigation.navigate('Transactions')}
            variant="ghost"
            size="small"
          />
        </View>
        
        {recentTransactions.length === 0 ? (
          <Card variant="filled" padding="xl">
            <Text variant="h6" weight="medium" color="secondary" style={styles.emptyText}>
              No recent transactions
            </Text>
            <Text variant="body2" color="tertiary" align="center">
              Start by scanning a receipt or adding an expense manually
            </Text>
          </Card>
        ) : (
          <Card variant="default" padding="lg">
            {recentTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  index < recentTransactions.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.primary
                  }
                ]}
                onPress={() => handleTransactionPress(transaction)}
                activeOpacity={0.7}
              >
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.category.color + '20' }
                  ]}>
                    <Text style={styles.transactionEmoji}>{transaction.category.icon}</Text>
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text variant="body1" weight="semibold" color="primary">
                      {transaction.merchantName}
                    </Text>
                    <Text variant="body2" color="secondary">
                      {transaction.category.name}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text variant="body1" weight="bold" color="primary" align="right">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </Text>
                  <Text variant="caption" color="tertiary" align="right">
                    {formatDate(transaction.date)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </View>

      {/* Spending Charts */}
      {spendingSummary && spendingSummary.categoryBreakdown.length > 0 && (
        <>
          <SpendingChart
            data={spendingSummary.categoryBreakdown}
            totalAmount={spendingSummary.totalAmount}
            currency={spendingSummary.currency}
          />

          <SpendingTrendsChart
            data={[
              { period: 'Week 1', amount: 180.50, date: '2024-01-01' },
              { period: 'Week 2', amount: 220.30, date: '2024-01-08' },
              { period: 'Week 3', amount: 195.75, date: '2024-01-15' },
              { period: 'Week 4', amount: 250.80, date: '2024-01-22' },
            ]}
            currency={spendingSummary.currency}
            period="weekly"
          />
        </>
      )}

      {(!spendingSummary || spendingSummary.categoryBreakdown.length === 0) && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Spending Analytics</Text>
          <Card style={styles.chartCard}>
            <Text style={styles.emptyText}>
              📊 Charts will appear here
            </Text>
            <Text style={styles.emptySubtext}>
              Add some transactions to see your spending breakdown and trends
            </Text>
          </Card>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING['2xl'],
  },
  header: {
    marginBottom: SPACING['3xl'],
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  summaryTitle: {
    marginBottom: SPACING.lg,
  },
  totalAmount: {
    marginBottom: SPACING.md,
  },
  categoryPreview: {
    marginTop: SPACING['2xl'],
    paddingTop: SPACING['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(203, 213, 225, 0.5)',
  },
  categoryPreviewTitle: {
    marginBottom: SPACING.lg,
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: SPACING.md,
  },
  quickActions: {
    marginBottom: SPACING['3xl'],
  },
  sectionTitle: {
    marginBottom: SPACING.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionButton: {
    flex: 1,
  },
  recentSection: {
    marginBottom: SPACING['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyText: {
    marginBottom: SPACING.md,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
});

export default HomeScreen;
