import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle, Path, Text as SvgText } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = Math.min(screenWidth * 0.7, 250),
  strokeWidth = 2,
  showLabels = true,
  showLegend = true,
  centerText,
  centerSubtext,
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate angles for each slice
  const dataWithAngles = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    return {
      ...item,
      percentage,
      angle,
      startAngle: data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0),
    };
  });

  // Create SVG path for pie slice
  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', center, center,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  // Convert polar coordinates to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Get label position
  const getLabelPosition = (startAngle: number, angle: number) => {
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    return polarToCartesian(center, center, labelRadius, labelAngle);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G>
            {dataWithAngles.map((item, index) => {
              const endAngle = item.startAngle + item.angle;
              const path = createPath(item.startAngle, endAngle);
              
              return (
                <G key={index}>
                  <Path
                    d={path}
                    fill={item.color}
                    stroke={COLORS.gray[100]}
                    strokeWidth={strokeWidth}
                  />
                  {showLabels && item.percentage > 5 && (
                    <SvgText
                      x={getLabelPosition(item.startAngle, item.angle).x}
                      y={getLabelPosition(item.startAngle, item.angle).y}
                      fontSize={FONT_SIZES.xs}
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {item.percentage.toFixed(0)}%
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
          
          {/* Center circle for donut effect */}
          <Circle
            cx={center}
            cy={center}
            r={radius * 0.4}
            fill="white"
            stroke={COLORS.gray[200]}
            strokeWidth={1}
          />
          
          {/* Center text */}
          {centerText && (
            <SvgText
              x={center}
              y={center - 5}
              fontSize={FONT_SIZES.lg}
              fill={COLORS.gray[900]}
              textAnchor="middle"
              fontWeight="bold"
            >
              {centerText}
            </SvgText>
          )}
          
          {centerSubtext && (
            <SvgText
              x={center}
              y={center + 15}
              fontSize={FONT_SIZES.sm}
              fill={COLORS.gray[600]}
              textAnchor="middle"
            >
              {centerSubtext}
            </SvgText>
          )}
        </Svg>
      </View>
      
      {showLegend && (
        <View style={styles.legend}>
          {dataWithAngles.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.legendValue}>
                {item.percentage?.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: SPACING.md,
  },
  legend: {
    width: '100%',
    maxWidth: 300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
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
    fontWeight: '500',
  },
  legendValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[900],
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});

export default PieChart;
