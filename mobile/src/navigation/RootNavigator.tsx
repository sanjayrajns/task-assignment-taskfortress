import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';
import { theme } from '../theme/theme';

// Screens
import { LandingScreen } from '../screens/LandingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { CreateTaskScreen } from '../screens/CreateTaskScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditTaskScreen } from '../screens/EditTaskScreen';
import { BottomTabBar } from '../components/BottomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for unimplemented tabs
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title} Coming Soon</Text>
  </View>
);

const stackOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.textPrimary,
  headerTitleStyle: {
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weight.semibold as any,
    fontSize: theme.typography.size.bodyLarge,
  },
  headerBackTitleVisible: false,
};

// --- USER TABS ---
const UserTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={TaskListScreen} />
    <Tab.Screen name="Projects" children={() => <PlaceholderScreen title="Projects" />} />
    <Tab.Screen name="Messages" children={() => <PlaceholderScreen title="Messages" />} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// --- ADMIN TABS ---
const AdminTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={AdminDashboardScreen} />
    <Tab.Screen name="Projects" children={() => <PlaceholderScreen title="All Projects" />} />
    <Tab.Screen name="CreateTask" component={CreateTaskScreen} />
    <Tab.Screen name="Messages" children={() => <PlaceholderScreen title="Admin Chat" />} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// --- ROOT STACK ---
export const RootNavigator = () => {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackOptions}>
        {!user ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="RootTabs" 
              component={user.role === Role.ADMIN ? AdminTabs : UserTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="TaskDetail" 
              component={TaskDetailScreen} 
              options={{ title: 'Task Details', presentation: 'modal', headerShown: false }} 
            />
            <Stack.Screen 
              name="EditTask" 
              component={EditTaskScreen} 
              options={{ title: 'Edit Task', presentation: 'modal', headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.size.bodyLarge,
  },
});
