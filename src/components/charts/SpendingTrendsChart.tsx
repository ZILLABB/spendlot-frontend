import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { Card } from '../ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TrendData {
  period: string;
  amount: number;
  date: string;
}

interface SpendingTrendsChartProps {
  data: TrendData[];
  currency: string;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({
  data,
  currency,
  period,
  onPeriodChange,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<TrendData | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatPeriod = (dateString: string) => {
    const date = new Date(dateString);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return dateString;
    }
  };

  const maxAmount = Math.max(...data.map(item => item.amount));
  const minAmount = Math.min(...data.map(item => item.amount));
  const chartHeight = 120;
  const chartWidth = SCREEN_WIDTH - (SPACING.lg * 4);
  const pointWidth = chartWidth / Math.max(data.length - 1, 1);

  const getPointY = (amount: number) => {
    if (maxAmount === minAmount) return chartHeight / 2;
    return chartHeight - ((amount - minAmount) / (maxAmount - minAmount)) * chartHeight;
  };

  const handlePointPress = (point: TrendData) => {
    setSelectedPoint(selectedPoint?.date === point.date ? null : point);
  };

  const renderLineChart = () => {
    if (data.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                {
                  top: chartHeight * ratio,
                  width: chartWidth,
                },
              ]}
            />
          ))}

          {/* Data points and line */}
          {data.map((point, index) => {
            const x = index * pointWidth;
            const y = getPointY(point.amount);
            const isSelected = selectedPoint?.date === point.date;

            return (
              <View key={point.date}>
                {/* Line to next point */}
                {index < data.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      {
                        left: x,
                        top: y,
                        width: Math.sqrt(
                          Math.pow(pointWidth, 2) + 
                          Math.pow(getPointY(data[index + 1].amount) - y, 2)
                        ),
                        transform: [{
                          rotate: `${Math.atan2(
                            getPointY(data[index + 1].amount) - y,
                            pointWidth
                          )}rad`,
                        }],
                      },
                    ]}
                  />
                )}

                {/* Data point */}
                <TouchableOpacity
                  style={[
                    styles.dataPoint,
                    {
                      left: x - 6,
                      top: y - 6,
                      backgroundColor: isSelected ? COLORS.primary[600] : COLORS.primary[500],
                      transform: [{ scale: isSelected ? 1.2 : 1 }],
                    },
                  ]}
                  onPress={() => handlePointPress(point)}
                  activeOpacity={0.8}
                />

                {/* Value label */}
                {isSelected && (
                  <View
                    style={[
                      styles.valueLabel,
                      {
                        left: x - 30,
                        top: y - 35,
                      },
                    ]}
                  >
                    <Text style={styles.valueLabelText}>
                      {formatAmount(point.amount)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {data.map((point, index) => (
            <Text
              key={point.date}
              style={[
                styles.xAxisLabel,
                {
                  left: index * pointWidth - 20,
                  color: selectedPoint?.date === point.date 
                    ? COLORS.primary[600] 
                    : COLORS.gray[600],
                  fontWeight: selectedPoint?.date === point.date ? '600' : 'normal',
                },
              ]}
            >
              {formatPeriod(point.date)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const getTrendDirection = () => {
    if (data.length < 2) return 'neutral';
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.amount, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) return 'up';
    if (secondAvg < firstAvg * 0.9) return 'down';
    return 'neutral';
  };

  const getTrendIcon = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendText = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up': return 'Spending is trending up';
      case 'down': return 'Spending is trending down';
      default: return 'Spending is stable';
    }
  };

  const getTrendColor = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up': return COLORS.error[500];
      case 'down': return COLORS.success[500];
      default: return COLORS.gray[600];
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={styles.chartCard}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Spending Trends</Text>
            <View style={styles.trendIndicator}>
              <Text style={styles.trendIcon}>{getTrendIcon()}</Text>
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {getTrendText()}
              </Text>
            </View>
          </View>

          {/* Period Toggle */}
          {onPeriodChange && (
            <View style={styles.periodToggle}>
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodButton,
                    period === p && styles.periodButtonActive,
                  ]}
                  onPress={() => onPeriodChange(p)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    period === p && styles.periodButtonTextActive,
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Chart */}
        {data.length > 0 ? (
          renderLineChart()
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>📊</Text>
            <Text style={styles.emptyChartSubtext}>
              No data available for the selected period
            </Text>
          </View>
        )}

        {/* Summary Stats */}
        {data.length > 0 && (
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>
                {formatAmount(data.reduce((sum, item) => sum + item.amount, 0) / data.length)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Highest</Text>
              <Text style={styles.statValue}>
                {formatAmount(maxAmount)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lowest</Text>
              <Text style={styles.statValue}>
                {formatAmount(minAmount)}
              </Text>
            </View>
          </View>
        )}
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  chartCard: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  titleContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  trendText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
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
    color: COLORS.gray[600],
  },
  periodButtonTextActive: {
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  chartContainer: {
    marginBottom: SPACING.lg,
  },
  chart: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: COLORS.gray[200],
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.primary[500],
    transformOrigin: '0 50%',
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  valueLabel: {
    position: 'absolute',
    backgroundColor: COLORS.gray[900],
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    width: 60,
    alignItems: 'center',
  },
  valueLabelText: {
    color: 'white',
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  xAxisLabels: {
    position: 'relative',
    height: 20,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    width: 40,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyChartText: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyChartSubtext: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    marginBottom: 2,
  },
  statValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
});

export default SpendingTrendsChart;
