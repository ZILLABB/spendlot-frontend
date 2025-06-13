import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { createTextStyle } from '../../utils/fonts';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent' | 'success' | 'warning' | 'error';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  weight,
  align = 'left',
  transform = 'none',
  style,
  children,
  ...props
}) => {
  const { colors, typography } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return createTextStyle(
          typography.fontSize['5xl'],
          weight || typography.fontWeight.bold,
          typography.fontSize['5xl'] * typography.lineHeight.tight,
          typography.letterSpacing.tight
        );
      case 'h2':
        return createTextStyle(
          typography.fontSize['4xl'],
          weight || typography.fontWeight.bold,
          typography.fontSize['4xl'] * typography.lineHeight.tight,
          typography.letterSpacing.tight
        );
      case 'h3':
        return createTextStyle(
          typography.fontSize['3xl'],
          weight || typography.fontWeight.semibold,
          typography.fontSize['3xl'] * typography.lineHeight.snug,
          typography.letterSpacing.normal
        );
      case 'h4':
        return createTextStyle(
          typography.fontSize['2xl'],
          weight || typography.fontWeight.semibold,
          typography.fontSize['2xl'] * typography.lineHeight.snug,
          typography.letterSpacing.normal
        );
      case 'h5':
        return createTextStyle(
          typography.fontSize.xl,
          weight || typography.fontWeight.medium,
          typography.fontSize.xl * typography.lineHeight.normal,
          typography.letterSpacing.normal
        );
      case 'h6':
        return createTextStyle(
          typography.fontSize.lg,
          weight || typography.fontWeight.medium,
          typography.fontSize.lg * typography.lineHeight.normal,
          typography.letterSpacing.normal
        );
      case 'subtitle1':
        return createTextStyle(
          typography.fontSize.lg,
          weight || typography.fontWeight.normal,
          typography.fontSize.lg * typography.lineHeight.relaxed,
          typography.letterSpacing.normal
        );
      case 'subtitle2':
        return createTextStyle(
          typography.fontSize.base,
          weight || typography.fontWeight.medium,
          typography.fontSize.base * typography.lineHeight.normal,
          typography.letterSpacing.normal
        );
      case 'body1':
        return createTextStyle(
          typography.fontSize.base,
          weight || typography.fontWeight.normal,
          typography.fontSize.base * typography.lineHeight.relaxed,
          typography.letterSpacing.normal
        );
      case 'body2':
        return createTextStyle(
          typography.fontSize.sm,
          weight || typography.fontWeight.normal,
          typography.fontSize.sm * typography.lineHeight.normal,
          typography.letterSpacing.normal
        );
      case 'caption':
        return createTextStyle(
          typography.fontSize.xs,
          weight || typography.fontWeight.normal,
          typography.fontSize.xs * typography.lineHeight.normal,
          typography.letterSpacing.wide
        );
      case 'overline':
        return createTextStyle(
          typography.fontSize.xs,
          weight || typography.fontWeight.medium,
          typography.fontSize.xs * typography.lineHeight.normal,
          typography.letterSpacing.wider
        );
      default:
        return createTextStyle(
          typography.fontSize.base,
          weight || typography.fontWeight.normal,
          typography.fontSize.base * typography.lineHeight.normal,
          typography.letterSpacing.normal
        );
    }
  };

  const getColorStyle = (): { color: string } => {
    switch (color) {
      case 'primary':
        return { color: colors.text.primary };
      case 'secondary':
        return { color: colors.text.secondary };
      case 'tertiary':
        return { color: colors.text.tertiary };
      case 'inverse':
        return { color: colors.text.inverse };
      case 'accent':
        return { color: colors.text.accent };
      case 'success':
        return { color: colors.success[600] };
      case 'warning':
        return { color: colors.warning[600] };
      case 'error':
        return { color: colors.error[600] };
      default:
        return { color: colors.text.primary };
    }
  };

  const textStyle: TextStyle = {
    ...getVariantStyle(),
    ...getColorStyle(),
    textAlign: align,
    textTransform: transform,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
