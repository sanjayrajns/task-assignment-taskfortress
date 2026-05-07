import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { TaskCard, getCardVariant } from '../components/TaskCard';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';

const MOCK_DAYS = [
  { day: 'Sun', date: '12' },
  { day: 'Mon', date: '13' },
  { day: 'Tue', date: '14' },
  { day: 'Wed', date: '15' },
  { day: 'Thu', date: '16', active: true },
  { day: 'Fri', date: '17' },
  { day: 'Sat', date: '18' },
];

export const TaskListScreen = ({ navigation }: any) => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ScreenWrapper noPadding style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage{'\n'}your tasks ✏️</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
          {MOCK_DAYS.map((d, i) => (
            <View key={i} style={[styles.dayItem, d.active && styles.dayItemActive]}>
              <Text style={[styles.dayText, d.active && styles.dayTextActive]}>{d.day}</Text>
              <Text style={[styles.dateText, d.active && styles.dateTextActive]}>{d.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={theme.colors.textPrimary} /></View>
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
  wrapper: {
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.m,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.h1,
    lineHeight: 48,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  calendarStrip: {
    gap: theme.spacing.m,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: 24,
  },
  dayItemActive: {
    backgroundColor: theme.colors.textPrimary,
  },
  dayText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dayTextActive: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.bodyLarge,
    color: theme.colors.textPrimary,
  },
  dateTextActive: {
    color: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: 100,
    gap: theme.spacing.m,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});