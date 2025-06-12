import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse, Category } from '../types';

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

interface ReceiptStats {
  total_receipts: number;
  processed_receipts: number;
  pending_receipts: number;
  failed_receipts: number;
  average_processing_time: number;
  ocr_accuracy: number;
}

interface SpendingFilters {
  start_date?: string;
  end_date?: string;
  category_ids?: number[];
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface CategoryStatsFilters {
  start_date?: string;
  end_date?: string;
  include_subcategories?: boolean;
}

interface TrendsFilters {
  months?: number;
  category_id?: number;
}

class AnalyticsService {
  async getSpendingSummary(
    filters?: SpendingFilters
  ): Promise<ApiResponse<SpendingSummary>> {
    return await apiService.get<SpendingSummary>(
      API_ENDPOINTS.ANALYTICS.SPENDING_SUMMARY,
      filters
    );
  }

  async getCategoryStats(
    filters?: CategoryStatsFilters
  ): Promise<ApiResponse<CategorySpending[]>> {
    return await apiService.get<CategorySpending[]>(
      API_ENDPOINTS.ANALYTICS.CATEGORY_STATS,
      filters
    );
  }

  async getMonthlyTrends(
    filters?: TrendsFilters
  ): Promise<ApiResponse<MonthlyTrend[]>> {
    return await apiService.get<MonthlyTrend[]>(
      API_ENDPOINTS.ANALYTICS.MONTHLY_TRENDS,
      filters
    );
  }

  async getReceiptStats(): Promise<ApiResponse<ReceiptStats>> {
    return await apiService.get<ReceiptStats>(
      API_ENDPOINTS.ANALYTICS.RECEIPT_STATS
    );
  }

  // Current month spending summary
  async getCurrentMonthSummary(): Promise<ApiResponse<SpendingSummary>> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await this.getSpendingSummary({
      start_date: startOfMonth.toISOString().split('T')[0],
      end_date: endOfMonth.toISOString().split('T')[0],
      period: 'monthly',
    });
  }

  // Previous month spending summary
  async getPreviousMonthSummary(): Promise<ApiResponse<SpendingSummary>> {
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return await this.getSpendingSummary({
      start_date: startOfPrevMonth.toISOString().split('T')[0],
      end_date: endOfPrevMonth.toISOString().split('T')[0],
      period: 'monthly',
    });
  }

  // Year-to-date spending summary
  async getYearToDateSummary(): Promise<ApiResponse<SpendingSummary>> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return await this.getSpendingSummary({
      start_date: startOfYear.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
      period: 'yearly',
    });
  }

  // Weekly spending summary
  async getWeeklySummary(): Promise<ApiResponse<SpendingSummary>> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return await this.getSpendingSummary({
      start_date: startOfWeek.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
      period: 'weekly',
    });
  }

  // Top spending categories
  async getTopSpendingCategories(
    limit: number = 5,
    filters?: CategoryStatsFilters
  ): Promise<ApiResponse<CategorySpending[]>> {
    const response = await this.getCategoryStats(filters);
    if (response.success && response.data) {
      const sortedCategories = response.data
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedCategories,
      };
    }
    return response;
  }

  // Spending comparison between periods
  async getSpendingComparison(
    currentPeriod: { start: string; end: string },
    previousPeriod: { start: string; end: string }
  ): Promise<ApiResponse<{
    current: SpendingSummary;
    previous: SpendingSummary;
    change_amount: number;
    change_percentage: number;
  }>> {
    try {
      const [currentResponse, previousResponse] = await Promise.all([
        this.getSpendingSummary({
          start_date: currentPeriod.start,
          end_date: currentPeriod.end,
        }),
        this.getSpendingSummary({
          start_date: previousPeriod.start,
          end_date: previousPeriod.end,
        }),
      ]);

      if (!currentResponse.success || !previousResponse.success) {
        return {
          success: false,
          error: 'Failed to get spending data for comparison',
        };
      }

      const current = currentResponse.data!;
      const previous = previousResponse.data!;
      const changeAmount = current.total_amount - previous.total_amount;
      const changePercentage = previous.total_amount > 0 
        ? (changeAmount / previous.total_amount) * 100 
        : 0;

      return {
        success: true,
        data: {
          current,
          previous,
          change_amount: changeAmount,
          change_percentage: changePercentage,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to compare spending periods',
      };
    }
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Format percentage for display
  formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
  }

  // Get spending trend direction
  getSpendingTrend(changePercentage: number): 'up' | 'down' | 'stable' {
    if (changePercentage > 5) return 'up';
    if (changePercentage < -5) return 'down';
    return 'stable';
  }

  // Calculate average daily spending
  calculateAverageDailySpending(
    totalAmount: number,
    startDate: string,
    endDate: string
  ): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 0 ? totalAmount / daysDiff : 0;
  }

  // Get category color for charts
  getCategoryColor(categoryId: number, defaultColors: string[]): string {
    const colorIndex = categoryId % defaultColors.length;
    return defaultColors[colorIndex];
  }

  // Prepare data for pie chart
  preparePieChartData(categoryStats: CategorySpending[]): Array<{
    name: string;
    value: number;
    color: string;
  }> {
    const colors = [
      '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#f97316', '#6b7280', '#10b981', '#3b82f6'
    ];

    return categoryStats.map((category, index) => ({
      name: category.category_name,
      value: category.amount,
      color: colors[index % colors.length],
    }));
  }

  // Prepare data for line chart (trends)
  prepareLineChartData(trends: MonthlyTrend[]): {
    labels: string[];
    datasets: Array<{
      data: number[];
      color: () => string;
    }>;
  } {
    const labels = trends.map(trend => `${trend.month} ${trend.year}`);
    const data = trends.map(trend => trend.total_amount);

    return {
      labels,
      datasets: [
        {
          data,
          color: () => '#0ea5e9',
        },
      ],
    };
  }

  // Get insights based on spending data
  generateSpendingInsights(summary: SpendingSummary): string[] {
    const insights: string[] = [];

    // Top category insight
    if (summary.category_breakdown.length > 0) {
      const topCategory = summary.category_breakdown[0];
      insights.push(
        `Your highest spending category is ${topCategory.category_name} at ${this.formatPercentage(topCategory.percentage)} of total spending.`
      );
    }

    // Average transaction insight
    if (summary.average_transaction > 0) {
      insights.push(
        `Your average transaction amount is ${this.formatCurrency(summary.average_transaction, summary.currency)}.`
      );
    }

    // Transaction frequency insight
    if (summary.transaction_count > 0) {
      const period = summary.period_end && summary.period_start 
        ? Math.ceil((new Date(summary.period_end).getTime() - new Date(summary.period_start).getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      const avgPerDay = summary.transaction_count / period;
      insights.push(
        `You made ${summary.transaction_count} transactions, averaging ${avgPerDay.toFixed(1)} per day.`
      );
    }

    return insights;
  }
}

export const analyticsService = new AnalyticsService();
export default AnalyticsService;
