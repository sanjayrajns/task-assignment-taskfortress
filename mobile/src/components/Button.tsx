import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const getBackgroundStyle = () => {
    if (disabled) return styles.disabledBg;
    switch (variant) {
      case 'primary': return styles.primaryBg;
      case 'secondary': return styles.secondaryBg;
      case 'outline': return styles.outlineBg;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.disabledText;
    switch (variant) {
      case 'primary': return styles.primaryText;
      case 'secondary': return styles.secondaryText;
      case 'outline': return styles.outlineText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getBackgroundStyle(), style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? theme.colors.surface : theme.colors.primary} 
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.layout.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.bodyLarge,
    fontWeight: theme.typography.weight.semibold,
  },
  primaryBg: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.surface,
  },
  secondaryBg: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  disabledBg: {
    backgroundColor: theme.colors.border,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
});
