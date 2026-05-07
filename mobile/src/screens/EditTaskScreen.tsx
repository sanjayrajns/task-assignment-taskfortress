import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';
import { useTaskStore } from '../store/taskStore';
import { userService } from '../services/userService';
import { User, Task, TaskPriority, TaskCategory } from '../types';
import { User as UserIcon, Check, Calendar, Tag, X } from 'lucide-react-native';

const PRIORITIES: TaskPriority[] = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH];
const CATEGORIES: TaskCategory[] = [
  TaskCategory.DESIGN, TaskCategory.DEVELOPMENT, TaskCategory.TESTING,
  TaskCategory.MARKETING, TaskCategory.OPERATIONS, TaskCategory.OTHER,
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: '#81C784',
  MEDIUM: '#FFB74D',
  HIGH: '#E57373',
};

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  DESIGN: '🎨',
  DEVELOPMENT: '💻',
  TESTING: '🧪',
  MARKETING: '📣',
  OPERATIONS: '⚙️',
  OTHER: '📁',
};

export const EditTaskScreen = ({ route, navigation }: any) => {
  const task: Task = route.params.task;
  const { updateTask } = useTaskStore();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority || TaskPriority.MEDIUM);
  const [category, setCategory] = useState<TaskCategory>(task.category || TaskCategory.OTHER);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    typeof task.assignedTo === 'object' ? task.assignedTo.id : task.assignedTo
  );
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetched = await userService.getUsers();
        setUsers(fetched);
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch users');
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 10 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }

    let isoDueDate: string | null = null;
    if (dueDate.trim()) {
      const d = new Date(dueDate.trim());
      if (isNaN(d.getTime())) {
        Alert.alert('Validation', 'Invalid date format. Please use YYYY-MM-DD.');
        return;
      }
      isoDueDate = d.toISOString();
    }

    setLoading(true);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        assignedTo: selectedUserId,
        priority,
        category,
        dueDate: isoDueDate,
        tags,
      });
      Alert.alert('Success', 'Task updated!');
      navigation.goBack();
    } catch (e: any) {
      const errorMsg = e.message || 'Failed to update task.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerCancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Task</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={theme.colors.primary} />
            : <Text style={styles.headerDone}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={theme.colors.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholderTextColor={theme.colors.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assign to</Text>
          {usersLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ alignSelf: 'flex-start' }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {users.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={[styles.userChip, selectedUserId === u.id && styles.userChipActive]}
                  onPress={() => setSelectedUserId(u.id)}
                >
                  <View style={[styles.userAvatar, selectedUserId === u.id && styles.userAvatarActive]}>
                    {selectedUserId === u.id ? <Check size={14} color="#000" /> : <UserIcon size={14} color={theme.colors.textSecondary} />}
                  </View>
                  <Text style={[styles.chipText, selectedUserId === u.id && styles.chipTextActive]}>{u.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.pillRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.pill, priority === p && { backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] }]}
              >
                <Text style={[styles.pillText, priority === p && styles.pillTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.categoryChip, category === c && styles.categoryChipActive]}
              >
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[c]}</Text>
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c.charAt(0) + c.slice(1).toLowerCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.dateRow}>
            <Calendar size={18} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputRow}>
            <Tag size={16} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              placeholderTextColor={theme.colors.textSecondary}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addTag} style={styles.tagAddBtn}>
              <Text style={styles.tagAddText}>Add</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsList}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}><X size={12} color="#000" /></TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.l, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.m },
  headerTitle: { fontFamily: theme.typography.fontFamily.heading, fontSize: 18, color: theme.colors.textPrimary },
  headerCancel: { fontFamily: theme.typography.fontFamily.body, fontSize: 16, color: theme.colors.textSecondary },
  headerDone: { fontFamily: theme.typography.fontFamily.heading, fontSize: 16, color: theme.colors.primary },
  scrollContent: { paddingHorizontal: theme.spacing.l, paddingBottom: 120, gap: theme.spacing.l, paddingTop: theme.spacing.m },
  inputGroup: { gap: 8 },
  label: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: 11, color: theme.colors.textSecondary, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: theme.colors.surfaceLight, borderRadius: 16, padding: 16, color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamily.body, fontSize: 15, borderWidth: 1, borderColor: theme.colors.border },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  chipRow: { gap: 10, paddingRight: 20 },
  userChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, borderWidth: 1, borderColor: theme.colors.border },
  userChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  userAvatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  userAvatarActive: { backgroundColor: 'rgba(0,0,0,0.12)' },
  chipText: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 13, color: theme.colors.textSecondary },
  chipTextActive: { color: '#000' },
  pillRow: { flexDirection: 'row', gap: theme.spacing.s },
  pill: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', backgroundColor: theme.colors.surfaceLight },
  pillText: { fontFamily: theme.typography.fontFamily.heading, fontSize: 13, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  pillTextActive: { color: '#000' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.surfaceLight, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, borderWidth: 1, borderColor: theme.colors.border },
  categoryChipActive: { backgroundColor: theme.colors.lightAccent, borderColor: theme.colors.lightAccent },
  categoryIcon: { fontSize: 14 },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceLight, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 12 },
  dateInput: { flex: 1, paddingVertical: 16, fontFamily: theme.typography.fontFamily.mono, fontSize: 15, color: theme.colors.textPrimary },
  tagInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceLight, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 10 },
  tagInput: { flex: 1, paddingVertical: 14, fontFamily: theme.typography.fontFamily.body, fontSize: 14, color: theme.colors.textPrimary },
  tagAddBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  tagAddText: { fontFamily: theme.typography.fontFamily.heading, fontSize: 12, color: '#000' },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tagBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  tagBadgeText: { fontFamily: theme.typography.fontFamily.bodyMedium, fontSize: 12, color: '#000' },
});
