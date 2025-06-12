import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

const { width: screenWidth } = Dimensions.get('window');

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = screenWidth - SPACING.lg * 2,
  height = 200,
  color = COLORS.primary[500],
  strokeWidth = 3,
  showDots = true,
  showGrid = true,
  showLabels = true,
  formatValue = (value) => value.toString(),
  formatLabel = (label) => label,
}) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate min and max values
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Calculate points
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...item };
  });

  // Create path string
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Grid lines
  const gridLines = [];
  if (showGrid) {
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * chartHeight;
      gridLines.push(
        <Line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke={COLORS.gray[200]}
          strokeWidth={1}
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      gridLines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
          stroke={COLORS.gray[200]}
          strokeWidth={1}
        />
      );
    }
  }

  // Y-axis labels
  const yAxisLabels = [];
  if (showLabels) {
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (i / 4) * valueRange;
      const y = padding + chartHeight - (i / 4) * chartHeight;
      yAxisLabels.push(
        <SvgText
          key={`y-${i}`}
          x={padding - 10}
          y={y + 4}
          fontSize={FONT_SIZES.xs}
          fill={COLORS.gray[600]}
          textAnchor="end"
        >
          {formatValue(value)}
        </SvgText>
      );
    }
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <G>
          {/* Grid lines */}
          {gridLines}

          {/* Y-axis labels */}
          {yAxisLabels}

          {/* Line path */}
          <Path
            d={pathData}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {showDots && points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
            />
          ))}

          {/* X-axis labels */}
          {showLabels && points.map((point, index) => (
            <SvgText
              key={`x-${index}`}
              x={point.x}
              y={height - 10}
              fontSize={FONT_SIZES.xs}
              fill={COLORS.gray[600]}
              textAnchor="middle"
            >
              {formatLabel(point.label)}
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default LineChart;
