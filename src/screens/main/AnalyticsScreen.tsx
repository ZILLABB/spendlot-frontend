import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Loading } from '../../components/ui';
import { PieChart } from '../../components/charts/PieChart';
import { LineChart } from '../../components/charts/LineChart';
import { analyticsService } from '../../services/analyticsService';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

interface SpendingSummary {
  total_amount: number;
  currency: string;
  period: string;
  category_breakdown: CategorySpending[];
  transaction_count: number;
  average_transaction: number;
  period_start: string;
  period_end: string;
}

interface CategorySpending {
  category_id: number;
  category_name: string;
  amount: number;
  percentage: number;
  transaction_count: number;
  average_amount: number;
}

interface MonthlyTrend {
  month: string;
  year: number;
  total_amount: number;
  transaction_count: number;
  average_amount: number;
  top_category: string;
}

export const AnalyticsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [comparison, setComparison] = useState<{
    current: SpendingSummary;
    previous: SpendingSummary;
    change_amount: number;
    change_percentage: number;
  } | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      const [summaryResponse, trendsResponse, comparisonResponse] = await Promise.all([
        getSummaryForPeriod(selectedPeriod),
        analyticsService.getMonthlyTrends({ months: 6 }),
        getComparisonData(selectedPeriod),
      ]);

      if (summaryResponse.success && summaryResponse.data) {
        setSpendingSummary(summaryResponse.data);
      }

      if (trendsResponse.success && trendsResponse.data) {
        setMonthlyTrends(trendsResponse.data);
      }

      if (comparisonResponse.success && comparisonResponse.data) {
        setComparison(comparisonResponse.data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getSummaryForPeriod = (period: 'week' | 'month' | 'year') => {
    switch (period) {
      case 'week':
        return analyticsService.getWeeklySummary();
      case 'month':
        return analyticsService.getCurrentMonthSummary();
      case 'year':
        return analyticsService.getYearToDateSummary();
      default:
        return analyticsService.getCurrentMonthSummary();
    }
  };

  const getComparisonData = (period: 'week' | 'month' | 'year') => {
    const now = new Date();
    let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date;

    switch (period) {
      case 'week':
        currentStart = new Date(now);
        currentStart.setDate(now.getDate() - now.getDay());
        currentEnd = new Date(now);
        previousStart = new Date(currentStart);
        previousStart.setDate(currentStart.getDate() - 7);
        previousEnd = new Date(currentStart);
        previousEnd.setDate(currentStart.getDate() - 1);
        break;
      case 'month':
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        currentEnd = new Date(now);
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'year':
        currentStart = new Date(now.getFullYear(), 0, 1);
        currentEnd = new Date(now);
        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return Promise.resolve({ success: false, error: 'Invalid period' });
    }

    return analyticsService.getSpendingComparison(
      {
        start: currentStart.toISOString().split('T')[0],
        end: currentEnd.toISOString().split('T')[0],
      },
      {
        start: previousStart.toISOString().split('T')[0],
        end: previousEnd.toISOString().split('T')[0],
      }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getChangeColor = (percentage: number) => {
    if (percentage > 0) return COLORS.error[500];
    if (percentage < 0) return COLORS.success[500];
    return COLORS.gray[500];
  };

  const preparePieChartData = () => {
    if (!spendingSummary?.category_breakdown) return [];
    
    return spendingSummary.category_breakdown.slice(0, 6).map((category, index) => ({
      name: category.category_name,
      value: category.amount,
      color: COLORS.primary[500 + index * 100] || COLORS.gray[500],
      percentage: category.percentage,
    }));
  };

  const prepareLineChartData = () => {
    return monthlyTrends.map(trend => ({
      label: `${trend.month.slice(0, 3)} ${trend.year}`,
      value: trend.total_amount,
    }));
  };

  if (loading) {
    return <Loading text="Loading analytics..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        {spendingSummary && (
          <View style={styles.summaryContainer}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Spending</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(spendingSummary.total_amount, spendingSummary.currency)}
              </Text>
              {comparison && (
                <View style={styles.changeContainer}>
                  <Text
                    style={[
                      styles.changeText,
                      { color: getChangeColor(comparison.change_percentage) },
                    ]}
                  >
                    {formatPercentage(comparison.change_percentage)} vs last {selectedPeriod}
                  </Text>
                </View>
              )}
            </Card>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Transactions</Text>
                <Text style={styles.statValue}>{spendingSummary.transaction_count}</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(spendingSummary.average_transaction, spendingSummary.currency)}
                </Text>
              </Card>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        {spendingSummary?.category_breakdown && spendingSummary.category_breakdown.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            <PieChart
              data={preparePieChartData()}
              showLegend={true}
              centerText={formatCurrency(spendingSummary.total_amount, spendingSummary.currency)}
              centerSubtext="Total"
            />
          </Card>
        )}

        {/* Monthly Trends */}
        {monthlyTrends.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending Trends</Text>
            <LineChart
              data={prepareLineChartData()}
              formatValue={(value) => formatCurrency(value)}
              formatLabel={(label) => label}
            />
          </Card>
        )}
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
  periodSelector: {
    flexDirection: 'row',
    margin: SPACING.md,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: 'white',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  periodButtonTextActive: {
    color: COLORS.primary[600],
  },
  summaryContainer: {
    margin: SPACING.md,
  },
  summaryCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  chartCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  chartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});

export default AnalyticsScreen;
