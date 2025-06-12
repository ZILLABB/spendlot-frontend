import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card } from '../ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';
import { CategorySpending } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH - (SPACING.lg * 4);

interface SpendingChartProps {
  data: CategorySpending[];
  totalAmount: number;
  currency: string;
  type?: 'pie' | 'bar';
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  data,
  totalAmount,
  currency,
  type = 'pie',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategorySpending | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>(type);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
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

  const handleCategoryPress = (category: CategorySpending) => {
    setSelectedCategory(selectedCategory?.category.id === category.category.id ? null : category);
  };

  const renderPieChart = () => {
    const radius = CHART_SIZE / 2 - 20;
    const centerX = CHART_SIZE / 2;
    const centerY = CHART_SIZE / 2;
    
    let currentAngle = -90; // Start from top

    return (
      <View style={styles.pieChartContainer}>
        <View style={[styles.pieChart, { width: CHART_SIZE, height: CHART_SIZE }]}>
          {/* Mock pie chart using positioned circles */}
          {data.map((item, index) => {
            const angle = (item.percentage / 100) * 360;
            const nextAngle = currentAngle + angle;
            
            // Calculate position for category indicator
            const indicatorAngle = currentAngle + angle / 2;
            const indicatorRadius = radius * 0.7;
            const indicatorX = centerX + indicatorRadius * Math.cos((indicatorAngle * Math.PI) / 180);
            const indicatorY = centerY + indicatorRadius * Math.sin((indicatorAngle * Math.PI) / 180);
            
            currentAngle = nextAngle;
            
            return (
              <TouchableOpacity
                key={item.category.id}
                style={[
                  styles.pieSlice,
                  {
                    position: 'absolute',
                    left: indicatorX - 25,
                    top: indicatorY - 25,
                    backgroundColor: item.category.color + '20',
                    borderColor: item.category.color,
                    borderWidth: selectedCategory?.category.id === item.category.id ? 3 : 2,
                  },
                ]}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.pieSliceIcon}>{item.category.icon}</Text>
              </TouchableOpacity>
            );
          })}
          
          {/* Center circle with total */}
          <View style={styles.centerCircle}>
            <Text style={styles.centerAmount}>{formatAmount(totalAmount)}</Text>
            <Text style={styles.centerLabel}>Total Spent</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    const maxAmount = Math.max(...data.map(item => item.amount));
    
    return (
      <View style={styles.barChartContainer}>
        {data.map((item, index) => {
          const barHeight = (item.amount / maxAmount) * 120;
          
          return (
            <TouchableOpacity
              key={item.category.id}
              style={styles.barItem}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.barContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.category.color,
                      opacity: selectedCategory?.category.id === item.category.id ? 1 : 0.8,
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.barIcon}>{item.category.icon}</Text>
              <Text style={styles.barLabel}>{item.category.name}</Text>
              <Text style={styles.barAmount}>{formatAmount(item.amount)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Card style={styles.chartCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Spending by Category</Text>
          
          <View style={styles.chartTypeToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                chartType === 'pie' && styles.toggleButtonActive,
              ]}
              onPress={() => setChartType('pie')}
            >
              <Text style={[
                styles.toggleButtonText,
                chartType === 'pie' && styles.toggleButtonTextActive,
              ]}>
                📊
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                chartType === 'bar' && styles.toggleButtonActive,
              ]}
              onPress={() => setChartType('bar')}
            >
              <Text style={[
                styles.toggleButtonText,
                chartType === 'bar' && styles.toggleButtonTextActive,
              ]}>
                📈
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {chartType === 'pie' ? renderPieChart() : renderBarChart()}
        </View>

        {/* Selected Category Details */}
        {selectedCategory && (
          <Animated.View style={styles.selectedCategoryContainer}>
            <View style={styles.selectedCategoryHeader}>
              <Text style={styles.selectedCategoryIcon}>{selectedCategory.category.icon}</Text>
              <View style={styles.selectedCategoryInfo}>
                <Text style={styles.selectedCategoryName}>{selectedCategory.category.name}</Text>
                <Text style={styles.selectedCategoryAmount}>
                  {formatAmount(selectedCategory.amount)}
                </Text>
              </View>
              <View style={styles.selectedCategoryStats}>
                <Text style={styles.selectedCategoryPercentage}>
                  {selectedCategory.percentage.toFixed(1)}%
                </Text>
                <Text style={styles.selectedCategoryTransactions}>
                  {selectedCategory.transactionCount} transaction{selectedCategory.transactionCount !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          {data.slice(0, 4).map((item, index) => (
            <TouchableOpacity
              key={item.category.id}
              style={styles.legendItem}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.legendColor, { backgroundColor: item.category.color }]} />
              <Text style={styles.legendText}>{item.category.name}</Text>
              <Text style={styles.legendPercentage}>{item.percentage.toFixed(0)}%</Text>
            </TouchableOpacity>
          ))}
          
          {data.length > 4 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: COLORS.gray[400] }]} />
              <Text style={styles.legendText}>Others</Text>
              <Text style={styles.legendPercentage}>
                {data.slice(4).reduce((sum, item) => sum + item.percentage, 0).toFixed(0)}%
              </Text>
            </View>
          )}
        </View>
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
  chartTypeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 16,
  },
  toggleButtonTextActive: {
    // Active state styling
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSliceIcon: {
    fontSize: 24,
  },
  centerCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  centerAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  centerLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 180,
    paddingHorizontal: SPACING.sm,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: SPACING.xs,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8,
  },
  barIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 2,
  },
  barAmount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  selectedCategoryContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  selectedCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  selectedCategoryInfo: {
    flex: 1,
  },
  selectedCategoryName: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  selectedCategoryAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary[600],
  },
  selectedCategoryStats: {
    alignItems: 'flex-end',
  },
  selectedCategoryPercentage: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  selectedCategoryTransactions: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  legendText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
  },
  legendPercentage: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
});

export default SpendingChart;
