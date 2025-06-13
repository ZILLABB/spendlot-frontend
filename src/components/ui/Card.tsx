import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
  onPress,
  ...touchableProps
}) => {
  const { colors, design } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.xl,
      backgroundColor: colors.surface.card,
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        Object.assign(baseStyle, design.shadows.lg);
        baseStyle.backgroundColor = colors.surface.elevated;
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border.primary;
        baseStyle.backgroundColor = colors.surface.primary;
        break;
      case 'filled':
        baseStyle.backgroundColor = colors.background.secondary;
        Object.assign(baseStyle, design.shadows.xs);
        break;
      default: // default
        Object.assign(baseStyle, design.shadows.md);
    }

    // Padding styles
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = SPACING.md;
        break;
      case 'large':
        baseStyle.padding = SPACING['2xl'];
        break;
      case 'xl':
        baseStyle.padding = SPACING['3xl'];
        break;
      default: // medium
        baseStyle.padding = SPACING.xl;
    }

    // Margin styles
    switch (margin) {
      case 'none':
        break;
      case 'small':
        baseStyle.margin = SPACING.md;
        break;
      case 'large':
        baseStyle.margin = SPACING.xl;
        break;
      default: // medium
        baseStyle.margin = SPACING.lg;
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});

export default Card;
