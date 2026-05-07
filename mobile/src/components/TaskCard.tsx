import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Clock3, ArrowRight } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  variant?: 'accent' | 'dark' | 'purple';
  onPress?: () => void;
}

const STATUS_CONFIG = {
  [TaskStatus.PENDING]: {
    label: 'In Progress',
    color: '#F5C518',
    bg: '#F5C51815',
    Icon: Clock3,
  },
  [TaskStatus.COMPLETED]: {
    label: 'Done',
    color: theme.colors.successAccent,
    bg: '#81C78420',
    Icon: CheckCircle2,
  },
};

const CARD_VARIANTS = {
  accent: {
    bg: '#A0D8FF18',
    border: '#A0D8FF35',
    titleColor: theme.colors.textPrimary,
    dot: theme.colors.primary,
  },
  dark: {
    bg: theme.colors.surface,
    border: theme.colors.border,
    titleColor: theme.colors.textPrimary,
    dot: theme.colors.lightAccent,
  },
  purple: {
    bg: '#C799FF15',
    border: '#C799FF35',
    titleColor: theme.colors.textPrimary,
    dot: theme.colors.lightAccent,
  },
};

const VARIANT_ORDER: Array<'accent' | 'dark' | 'purple'> = ['accent', 'dark', 'purple'];

export const TaskCard: React.FC<TaskCardProps> = ({ task, variant, onPress }) => {
  const statusCfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG[TaskStatus.PENDING];
  const cardVariant = variant ?? 'dark';
  const cardStyle = CARD_VARIANTS[cardVariant];
  const StatusIcon = statusCfg.Icon;

  const initials = task.assignedTo?.name
    ? task.assignedTo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardStyle.bg, borderColor: cardStyle.border }]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      {/* Top row: status badge + date */}
      <View style={styles.topRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <StatusIcon size={11} color={statusCfg.color} />
          <Text style={[styles.statusText, { color: statusCfg.color }]}>
            {statusCfg.label}
          </Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: cardStyle.titleColor }]} numberOfLines={2}>
        {task.title}
      </Text>

      {/* Description */}
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: cardStyle.border }]} />

      {/* Footer: assignee + arrow */}
      <View style={styles.footer}>
        <View style={styles.assigneeRow}>
          {/* Avatar chip */}
          <View style={[styles.avatar, { backgroundColor: cardStyle.dot + '30' }]}>
            <Text style={[styles.avatarText, { color: cardStyle.dot }]}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.assigneeLabel}>Assigned to</Text>
            <Text style={[styles.assigneeName, { color: cardStyle.dot }]}>
              {task.assignedTo?.name ?? 'Unassigned'}
            </Text>
          </View>
        </View>

        {/* Arrow action */}
        <View style={[styles.arrowBtn, { backgroundColor: cardStyle.dot + '20' }]}>
          <ArrowRight size={16} color={cardStyle.dot} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Export helper for TaskListScreen to cycle through variants
export const getCardVariant = (index: number) => VARIANT_ORDER[index % VARIANT_ORDER.length];

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: theme.spacing.l,
    borderWidth: 1,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.size.caption,
    color: theme.colors.textSecondary,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: theme.spacing.s,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.body,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.m,
  },
  divider: {
    height: 1,
    marginBottom: theme.spacing.m,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: 12,
  },
  assigneeLabel: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: 10,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  assigneeName: {
    fontFamily: theme.typography.fontFamily.bodyMedium,
    fontSize: 13,
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

