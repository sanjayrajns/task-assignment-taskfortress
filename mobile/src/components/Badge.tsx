import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { TaskStatus } from '../types';

interface BadgeProps {
  status: TaskStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const isPending = status === TaskStatus.PENDING;
  
  return (
    <View style={[
      styles.container, 
      isPending ? styles.pendingBg : styles.completedBg
    ]}>
      <Text style={[
        styles.text,
        isPending ? styles.pendingText : styles.completedText
      ]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: 100, // Pill shape
  },
  text: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.caption,
    fontWeight: theme.typography.weight.bold,
    textTransform: 'uppercase',
  },
  pendingBg: {
    backgroundColor: theme.colors.pending + '20', // 20% opacity
  },
  pendingText: {
    color: theme.colors.pending,
  },
  completedBg: {
    backgroundColor: theme.colors.completed + '20', // 20% opacity
  },
  completedText: {
    color: theme.colors.completed,
  },
});
