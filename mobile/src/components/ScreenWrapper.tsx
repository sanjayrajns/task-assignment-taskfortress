import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style, 
  noPadding = false 
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.safeArea, 
      { paddingTop: insets.top },
    ]}>
      <View style={[styles.container, !noPadding && styles.padding, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: theme.spacing.l,
  },
});
