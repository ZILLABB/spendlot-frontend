import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';
import { createTextStyle } from '../../utils/fonts';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors, typography, design } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderWidth: 2,
      borderRadius: BORDER_RADIUS.lg,
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: multiline ? SPACING.lg : SPACING.lg,
      minHeight: multiline ? numberOfLines * 24 + 48 : 52,
      backgroundColor: disabled ? colors.background.secondary : colors.surface.primary,
    };

    // Border color based on state
    if (error) {
      baseStyle.borderColor = colors.border.error;
    } else if (isFocused) {
      baseStyle.borderColor = colors.border.focus;
      Object.assign(baseStyle, design.shadows.sm);
    } else {
      baseStyle.borderColor = colors.border.primary;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      ...createTextStyle(
        typography.fontSize.base,
        typography.fontWeight.normal,
        typography.fontSize.base * typography.lineHeight.normal
      ),
      color: disabled ? colors.text.tertiary : colors.text.primary,
      paddingVertical: 0, // Remove default padding
      textAlignVertical: multiline ? 'top' : 'center',
    };
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text
          variant="body2"
          weight="medium"
          color={error ? "error" : "secondary"}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text
          variant="caption"
          color="error"
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.md,
  },
  iconContainer: {
    marginHorizontal: SPACING.md,
  },
  errorText: {
    marginTop: SPACING.md,
  },
});

export default Input;
