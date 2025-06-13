import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  gradient?: string[];
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  gradient,
}) => {
  const { colors, design } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...design.shadows.sm,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = SPACING.md;
        baseStyle.paddingHorizontal = SPACING.lg;
        baseStyle.minHeight = 40;
        break;
      case 'large':
        baseStyle.paddingVertical = SPACING.lg;
        baseStyle.paddingHorizontal = SPACING['2xl'];
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = SPACING.lg;
        baseStyle.paddingHorizontal = SPACING.xl;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.surface.elevated;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border.primary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = colors.primary[500];
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.shadowOpacity = 0;
        baseStyle.elevation = 0;
        break;
      case 'gradient':
        // Gradient styling will be handled by LinearGradient component
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        baseStyle.backgroundColor = colors.primary[600];
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextWeight = () => {
    switch (size) {
      case 'small':
        return 'medium';
      case 'large':
        return 'semibold';
      default:
        return 'semibold';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return 'primary';
      case 'outline':
        return 'accent';
      case 'ghost':
        return 'accent';
      case 'gradient':
        return 'inverse';
      default: // primary
        return 'inverse';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'body2';
      case 'large':
        return 'subtitle1';
      default:
        return 'body1';
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'gradient' ? 'white' : colors.primary[500]}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            variant={getTextSize() as any}
            color={getTextColor() as any}
            weight={getTextWeight() as any}
            style={[textStyle, icon ? { marginLeft: SPACING.xs } : null]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={gradient || design.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyle(), { backgroundColor: 'transparent' }]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});

export default Button;
