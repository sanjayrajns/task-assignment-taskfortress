import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { TaskCard, getCardVariant } from '../components/TaskCard';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';
import { Settings, Menu } from 'lucide-react-native';

export const AdminDashboardScreen = ({ navigation }: any) => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = [
    { label: 'Users Active', value: '15' },
    { label: 'Tasks Overdue', value: '3' },
    { label: 'Completed', value: '142' },
  ];

  return (
    <ScreenWrapper noPadding style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navRow}>
          <Menu color={theme.colors.textPrimary} size={24} />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>System{'\n'}Overview</Text>
          <Settings color={theme.colors.textSecondary} size={28} />
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Company-wide{'\n'}Critical task list</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TaskCard
              task={item}
              variant={getCardVariant(index)}
              onPress={() => navigation.navigate('TaskDetail', { task: item })}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.spacing.l, paddingTop: theme.spacing.xl },
  navRow: { marginBottom: theme.spacing.xl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.xl },
  title: { fontFamily: theme.typography.fontFamily.heading, fontSize: 40, lineHeight: 44, color: theme.colors.textPrimary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  statBox: { alignItems: 'center' },
  statValue: { fontFamily: theme.typography.fontFamily.heading, fontSize: 32, color: theme.colors.textPrimary, marginBottom: 4 },
  statLabel: { fontFamily: theme.typography.fontFamily.body, fontSize: theme.typography.size.caption, color: theme.colors.textSecondary, textAlign: 'center' },
  listHeader: { paddingHorizontal: theme.spacing.l, marginBottom: theme.spacing.m },
  listTitle: { fontFamily: theme.typography.fontFamily.body, fontSize: theme.typography.size.h4, color: theme.colors.textPrimary, lineHeight: 28 },
  listContainer: { paddingHorizontal: theme.spacing.l, paddingBottom: 100, gap: theme.spacing.m },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});