import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Folder, Plus, MessageCircle, User } from 'lucide-react-native';
import { theme } from '../theme/theme';

export const BottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = () => {
          const color = isFocused ? theme.colors.textPrimary : theme.colors.textSecondary;
          const size = 24;

          switch (route.name) {
            case 'Home':
              return <Home color={color} size={size} />;
            case 'Projects':
              return <Folder color={color} size={size} />;
            case 'CreateTask':
              return (
                <View style={styles.fab}>
                  <Plus color={theme.colors.background} size={32} />
                </View>
              );
            case 'Messages':
              return <MessageCircle color={color} size={size} />;
            case 'Profile':
              return <User color={color} size={size} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            {renderIcon()}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.textPrimary, // White circle
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32, // Lift it up
    ...theme.layout.shadow,
  },
});
