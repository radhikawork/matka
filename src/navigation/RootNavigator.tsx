import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { DrawerProvider } from '../context/DrawerContext';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { GameMarketDetailsScreen } from '../screens/games/GameMarketDetailsScreen';
import { PlaceBidScreen } from '../screens/games/PlaceBidScreen';
import { StarlineHomeScreen } from '../screens/games/StarlineHomeScreen';
import { JackpotHomeScreen } from '../screens/games/JackpotHomeScreen';
import { AddFundScreen } from '../screens/funds/AddFundScreen';
import { WithdrawFundScreen } from '../screens/funds/WithdrawFundScreen';
import { BankDetailsScreen } from '../screens/funds/BankDetailsScreen';
import { UpiDetailsScreen } from '../screens/funds/UpiDetailsScreen';
import { PassbookScreen } from '../screens/funds/PassbookScreen';
import { BidHistoryScreen } from '../screens/history/BidHistoryScreen';
import { WinHistoryScreen } from '../screens/history/WinHistoryScreen';
import { GameRatesScreen } from '../screens/utility/GameRatesScreen';
import { HowToPlayScreen } from '../screens/utility/HowToPlayScreen';
import { SubmitIdeaScreen } from '../screens/utility/SubmitIdeaScreen';
import { SettingsScreen } from '../screens/utility/SettingsScreen';
import { NotificationsScreen } from '../screens/utility/NotificationsScreen';

// Admin Screens & Context
import { AdminProvider } from '../context/AdminContext';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminMarketsScreen } from '../screens/admin/AdminMarketsScreen';
import { AdminDeclareResultScreen } from '../screens/admin/AdminDeclareResultScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminBidsScreen } from '../screens/admin/AdminBidsScreen';
import { AdminFundRequestsScreen } from '../screens/admin/AdminFundRequestsScreen';
import { AdminSettingsScreen } from '../screens/admin/AdminSettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  return (
    <NavigationContainer ref={navigationRef}>
      <AdminProvider>
        <DrawerProvider navigationRef={navigationRef}>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainDrawer" component={BottomTabNavigator} />
            <Stack.Screen
              name="GameMarketDetails"
              component={GameMarketDetailsScreen}
            />
            <Stack.Screen name="PlaceBid" component={PlaceBidScreen} />
            <Stack.Screen name="StarlineHome" component={StarlineHomeScreen} />
            <Stack.Screen name="JackpotHome" component={JackpotHomeScreen} />
            <Stack.Screen name="AddFund" component={AddFundScreen} />
            <Stack.Screen name="WithdrawFund" component={WithdrawFundScreen} />
            <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
            <Stack.Screen name="UpiDetails" component={UpiDetailsScreen} />
            <Stack.Screen name="Passbook" component={PassbookScreen} />
            <Stack.Screen name="BidHistory" component={BidHistoryScreen} />
            <Stack.Screen name="WinHistory" component={WinHistoryScreen} />
            <Stack.Screen name="GameRates" component={GameRatesScreen} />
            <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
            <Stack.Screen name="SubmitIdea" component={SubmitIdeaScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            {/* Admin Screens */}
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
            />
            <Stack.Screen
              name="AdminMarkets"
              component={AdminMarketsScreen}
            />
            <Stack.Screen
              name="AdminDeclareResult"
              component={AdminDeclareResultScreen}
            />
            <Stack.Screen
              name="AdminUsers"
              component={AdminUsersScreen}
            />
            <Stack.Screen
              name="AdminBids"
              component={AdminBidsScreen}
            />
            <Stack.Screen
              name="AdminFundRequests"
              component={AdminFundRequestsScreen}
            />
            <Stack.Screen
              name="AdminSettings"
              component={AdminSettingsScreen}
            />
          </Stack.Navigator>
        </DrawerProvider>
      </AdminProvider>
    </NavigationContainer>
  );
};
