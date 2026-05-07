import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { theme } from '../theme/theme';
import { User, Settings, Users, FileText } from 'lucide-react-native'; // Assuming Lucide icons

export const LandingScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to{'\n'}TaskFortress</Text>
        <Text style={styles.subtitle}>
          Your mission-critical workspace for progress.
        </Text>

        <Text style={styles.sectionHeader}>Choose your roles</Text>

        <View style={styles.gridContainer}>
          {/* Top Row: Main Roles */}
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: theme.colors.successAccent }]}
              onPress={() => navigation.navigate('Login', { mode: 'user' })}
              activeOpacity={0.8}
            >
              <User color="#000" size={28} style={styles.icon} />
              <Text style={[styles.roleText, { color: '#000' }]}>Standard User</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: theme.colors.lightAccent }]}
              onPress={() => navigation.navigate('Login', { mode: 'admin' })}
              activeOpacity={0.8}
            >
              <Users color="#000" size={28} style={styles.icon} />
              <Text style={[styles.roleText, { color: '#000' }]}>System Admin</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Row: Secondary Actions */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryCard} activeOpacity={0.8}>
              <FileText color={theme.colors.textPrimary} size={24} style={styles.icon} />
              <Text style={styles.secondaryText}>Members</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryCard} activeOpacity={0.8}>
              <Settings color={theme.colors.textPrimary} size={24} style={styles.icon} />
              <Text style={styles.secondaryText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.h1,
    color: theme.colors.textPrimary,
    lineHeight: 48,
    marginBottom: theme.spacing.m,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.bodyLarge,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
    lineHeight: 24,
  },
  sectionHeader: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.bodyLarge,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  gridContainer: {
    gap: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  roleCard: {
    flex: 1,
    height: 140,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.m,
    justifyContent: 'space-between',
  },
  secondaryCard: {
    flex: 1,
    height: 120,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.m,
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: theme.spacing.xs,
  },
  roleText: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.size.bodyLarge,
  },
  secondaryText: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.bodyLarge,
    color: theme.colors.textSecondary,
  },
});