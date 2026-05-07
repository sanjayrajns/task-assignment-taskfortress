import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { ChevronLeft, Pencil, Trash2, CheckCircle2, Clock } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#81C784',
  MEDIUM: '#FFB74D',
  HIGH: '#E57373',
};

const CATEGORY_ICONS: Record<string, string> = {
  DESIGN: '🎨',
  DEVELOPMENT: '💻',
  TESTING: '🧪',
  MARKETING: '📣',
  OPERATIONS: '⚙️',
  OTHER: '📁',
};

export const TaskDetailScreen = ({ route, navigation }: any) => {
  const { task } = route.params;
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
  const { user } = useAuthStore();
  const { updateTaskStatus, deleteTask } = useTaskStore();
  const isAdmin = user?.role === 'ADMIN';

  const handleMarkDone = async () => {
    try {
      await updateTaskStatus(task.id, TaskStatus.COMPLETED);
      Alert.alert('Success', 'Task marked as done!');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              navigation.goBack();
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to delete task.');
            }
          },
        },
      ]
    );
  };

  const assigneeName = typeof task.assignedTo === 'object' ? task.assignedTo.name : 'Unknown';
  const assigneeInitials = assigneeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;
  const categoryIcon = CATEGORY_ICONS[task.category] || '📁';

  const formattedDue = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <View style={styles.container}>
      {/* Top Accent Area */}
      <View style={styles.topArea}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.actions}>
            {isAdmin && (
              <>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('EditTask', { task })}
                >
                  <Pencil size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
                  <Trash2 size={18} color="#FFF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{assigneeInitials}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Assigned to</Text>
              <Text style={styles.metaValue}>{assigneeName}</Text>
            </View>
          </View>

          <View style={styles.metaBadge}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <View>
              <Text style={styles.metaLabel}>Priority</Text>
              <Text style={styles.metaValue}>{task.priority || 'MEDIUM'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Dark Sheet */}
      <View style={styles.bottomArea}>
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tab, activeTab === 'overview' && styles.tabActive]} onPress={() => setActiveTab('overview')}>
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'activity' && styles.tabActive]} onPress={() => setActiveTab('activity')}>
            <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>Details</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'overview' ? (
            <>
              <Text style={styles.description}>{task.description || 'No description provided.'}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Subtasks</Text>
                <TouchableOpacity style={styles.subtaskItem}>
                  <CheckCircle2 size={20} color={theme.colors.lightAccent} />
                  <Text style={styles.subtaskText}>Create a content plan for March</Text>
                </TouchableOpacity>
              </View>

              {task.status !== TaskStatus.COMPLETED && (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: theme.colors.successAccent }]}
                  onPress={handleMarkDone}
                >
                  <CheckCircle2 size={20} color="#000" />
                  <Text style={styles.btnText}>Mark as Done</Text>
                </TouchableOpacity>
              )}

              {task.status === TaskStatus.COMPLETED && (
                <View style={styles.completedBanner}>
                  <CheckCircle2 size={20} color="#81C784" />
                  <Text style={styles.completedText}>This task is completed</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Details tab - shows all metadata */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <View style={styles.detailValueRow}>
                  <Text style={{ fontSize: 16 }}>{categoryIcon}</Text>
                  <Text style={styles.detailValue}>{task.category || 'Other'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Priority</Text>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
                  <Text style={styles.priorityBadgeText}>{task.priority || 'MEDIUM'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={[styles.statusBadge, task.status === 'COMPLETED' && styles.statusCompleted]}>
                  {task.status === 'COMPLETED' ? <CheckCircle2 size={14} color="#000" /> : <Clock size={14} color="#000" />}
                  <Text style={styles.statusBadgeText}>{task.status}</Text>
                </View>
              </View>

              {formattedDue && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValueMono}>{formattedDue}</Text>
                </View>
              )}

              {task.tags && task.tags.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tags</Text>
                  <View style={styles.tagsRow}>
                    {task.tags.map((tag: string) => (
                      <View key={tag} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValueMono}>
                  {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  topArea: { paddingTop: 60, paddingHorizontal: theme.spacing.l, paddingBottom: 60 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  actions: { flexDirection: 'row', gap: theme.spacing.s },
  actionBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: { backgroundColor: '#E57373' },
  title: { fontFamily: theme.typography.fontFamily.heading, fontSize: 28, color: '#000', marginBottom: theme.spacing.l, lineHeight: 34 },
  metaRow: { flexDirection: 'row', gap: theme.spacing.xl },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: theme.typography.fontFamily.heading, fontSize: 13, color: '#000' },
  priorityDot: { width: 12, height: 12, borderRadius: 6 },
  metaLabel: { fontFamily: theme.typography.fontFamily.body, fontSize: 10, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontFamily: theme.typography.fontFamily.heading, fontSize: 13, color: '#000' },
  bottomArea: { flex: 1, backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, padding: theme.spacing.l },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginBottom: theme.spacing.l },
  tab: { flex: 1, paddingVertical: theme.spacing.m, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: theme.colors.textPrimary },
  tabText: { fontFamily: theme.typography.fontFamily.body, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.textPrimary, fontWeight: '600' },
  scrollContent: { paddingBottom: 60 },
  description: { fontFamily: theme.typography.fontFamily.body, fontSize: 15, color: theme.colors.textSecondary, lineHeight: 24, marginBottom: theme.spacing.xl },
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: 11, color: theme.colors.textSecondary, marginBottom: theme.spacing.m, textTransform: 'uppercase', letterSpacing: 1 },
  subtaskItem: { flexDirection: 'row', backgroundColor: theme.colors.surfaceLight, padding: 16, borderRadius: 16, gap: 12, marginBottom: 8 },
  subtaskText: { fontFamily: theme.typography.fontFamily.body, color: theme.colors.textPrimary },
  primaryBtn: { borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 16, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  btnText: { color: '#000', fontFamily: theme.typography.fontFamily.heading, fontSize: 16 },
  completedBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(129,199,132,0.1)', padding: 16, borderRadius: 16, marginTop: 16 },
  completedText: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 14, color: '#81C784' },
  // Details tab styles
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  detailLabel: { fontFamily: theme.typography.fontFamily.body, fontSize: 13, color: theme.colors.textSecondary },
  detailValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailValue: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 14, color: theme.colors.textPrimary },
  detailValueMono: { fontFamily: theme.typography.fontFamily.mono, fontSize: 13, color: theme.colors.textPrimary },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  priorityBadgeText: { fontFamily: theme.typography.fontFamily.heading, fontSize: 11, color: '#000', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusCompleted: { backgroundColor: '#81C784' },
  statusBadgeText: { fontFamily: theme.typography.fontFamily.heading, fontSize: 11, color: '#000', textTransform: 'uppercase' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { backgroundColor: theme.colors.surfaceLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagChipText: { fontFamily: theme.typography.fontFamily.body, fontSize: 12, color: theme.colors.textPrimary },
});