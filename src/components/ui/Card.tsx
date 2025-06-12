import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  onPress,
  ...touchableProps
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: 'white',
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyle.shadowColor = COLORS.gray[900];
        baseStyle.shadowOffset = {
          width: 0,
          height: 2,
        };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 8;
        baseStyle.elevation = 4; // Android shadow
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = COLORS.gray[200];
        break;
      default: // default
        baseStyle.shadowColor = COLORS.gray[900];
        baseStyle.shadowOffset = {
          width: 0,
          height: 1,
        };
        baseStyle.shadowOpacity = 0.05;
        baseStyle.shadowRadius = 4;
        baseStyle.elevation = 2; // Android shadow
    }

    // Padding styles
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = SPACING.sm;
        break;
      case 'large':
        baseStyle.padding = SPACING.xl;
        break;
      default: // medium
        baseStyle.padding = SPACING.md;
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
