import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Loading } from '../../components/ui';
import SpendingChart from '../../components/charts/SpendingChart';
import SpendingTrendsChart from '../../components/charts/SpendingTrendsChart';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { transactionService } from '../../services/transactionService';
import { analyticsService } from '../../services/analyticsService';
import { Transaction, SpendingSummary } from '../../types';

interface HomeScreenProps {
  navigation: any; // Replace with proper navigation type
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
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
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.firstName || 'User'}! 👋
        </Text>
        <Text style={styles.subtitle}>
          Here's your spending overview
        </Text>
      </View>

      {/* Monthly Summary Card */}
      <Card style={styles.summaryCard} variant="elevated">
        <Text style={styles.summaryTitle}>This Month</Text>
        <Text style={styles.totalAmount}>
          {spendingSummary ? formatAmount(spendingSummary.totalAmount, spendingSummary.currency) : '$0.00'}
        </Text>
        <Text style={styles.transactionCount}>
          {spendingSummary?.transactionCount || 0} transactions
        </Text>

        {/* Category Breakdown Preview */}
        {spendingSummary && spendingSummary.categoryBreakdown.length > 0 && (
          <View style={styles.categoryPreview}>
            <Text style={styles.categoryPreviewTitle}>Top Categories</Text>
            <View style={styles.categoryList}>
              {spendingSummary.categoryBreakdown.slice(0, 3).map((item, index) => (
                <View key={item.category.id} style={styles.categoryItem}>
                  <Text style={styles.categoryIcon}>{item.category.icon}</Text>
                  <Text style={styles.categoryAmount}>
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
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Button
            title="📷 Scan Receipt"
            onPress={() => navigation.navigate('Receipts', { screen: 'ReceiptCamera' })}
            style={styles.actionButton}
            variant="outline"
          />
          <Button
            title="➕ Add Expense"
            onPress={() => navigation.navigate('Transactions')}
            style={styles.actionButton}
            variant="outline"
          />
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Button
            title="View All"
            onPress={() => navigation.navigate('Transactions')}
            variant="ghost"
            size="small"
          />
        </View>
        
        {recentTransactions.length === 0 ? (
          <Card style={styles.transactionsCard}>
            <Text style={styles.emptyText}>
              No recent transactions
            </Text>
            <Text style={styles.emptySubtext}>
              Start by scanning a receipt or adding an expense manually
            </Text>
          </Card>
        ) : (
          <Card style={styles.transactionsCard}>
            {recentTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  index < recentTransactions.length - 1 && styles.transactionItemBorder
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
                    <Text style={styles.transactionMerchant}>{transaction.merchantName}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category.name}</Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    {formatAmount(transaction.amount, transaction.currency)}
                  </Text>
                  <Text style={styles.transactionDate}>
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
    backgroundColor: COLORS.gray[50],
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  totalAmount: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: 'bold',
    color: COLORS.primary[600],
    marginBottom: SPACING.xs,
  },
  transactionCount: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  categoryPreview: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  categoryPreviewTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
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
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryAmount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  quickActions: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  recentSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  transactionsCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  chartSection: {
    marginBottom: SPACING.xl,
  },
  chartCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
});

export default HomeScreen;
