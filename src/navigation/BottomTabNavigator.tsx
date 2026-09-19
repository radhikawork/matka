import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Typography } from '../constants/colors';
import { BottomTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { MyBidsScreen } from '../screens/history/MyBidsScreen';
import { FundsHomeScreen } from '../screens/funds/FundsHomeScreen';
import { SettingsScreen } from '../screens/utility/SettingsScreen';
import { AppIcon } from '../components/common/AppIcon';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AppIcon name="home" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyBidsTab"
        component={MyBidsScreen}
        options={{
          tabBarLabel: 'My Bids',
          tabBarIcon: ({ color }) => (
            <AppIcon name="bids" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FundsTab"
        component={FundsHomeScreen}
        options={{
          tabBarLabel: 'Funds',
          tabBarIcon: ({ color }) => (
            <AppIcon name="wallet" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <AppIcon name="settings" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
  },
});
