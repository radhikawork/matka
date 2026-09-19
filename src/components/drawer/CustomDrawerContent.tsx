import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/colors';
import { mockUser } from '../../mocks/userData';
import { AppIcon } from '../common/AppIcon';

interface CustomDrawerContentProps {
  navigation: any;
}

export const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Download Matka Bro app for instant live results & game rates! https://matkabro.com',
      });
    } catch (error) {
      // ignore
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: 'Home',
      icon: 'home',
      onPress: () => navigation.navigate('MainTabs', { screen: 'HomeTab' }),
    },
    {
      title: 'Bid History',
      icon: 'history',
      onPress: () => navigation.navigate('BidHistory'),
    },
    {
      title: 'Win History',
      icon: 'trophy',
      onPress: () => navigation.navigate('WinHistory'),
    },
    {
      title: 'Passbook',
      icon: 'passbook',
      onPress: () => navigation.navigate('Passbook'),
    },
    {
      title: 'Game Rates',
      icon: 'chart',
      onPress: () => navigation.navigate('GameRates'),
    },
    {
      title: 'Notice Board',
      icon: 'bell',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: 'Starline Game',
      icon: 'star',
      onPress: () => navigation.navigate('StarlineHome'),
    },
    {
      title: 'Jackpot Game',
      icon: 'dice',
      onPress: () => navigation.navigate('JackpotHome'),
    },
    {
      title: 'How To Play',
      icon: 'info',
      onPress: () => navigation.navigate('HowToPlay'),
    },
    {
      title: 'Submit Idea',
      icon: 'idea',
      onPress: () => navigation.navigate('SubmitIdea'),
    },
    {
      title: 'Settings',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Admin Control Panel',
      icon: 'shield',
      onPress: () => navigation.navigate('AdminDashboard'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* User Header Profile */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <AppIcon name="user" size={32} color={Colors.primary} />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userMobile}>{mockUser.mobile}</Text>
          <View style={styles.balanceTag}>
            <Text style={styles.balanceText}>Wallet: ₹ {mockUser.walletBalance.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Menu Items */}
      <ScrollView
        style={styles.menuScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuScrollContent}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuRow}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
              <AppIcon name={item.icon} size={17} color={Colors.primary} />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <AppIcon name="play" size={11} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        {/* Share App */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={handleShare}
          activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.infoLight }]}>
            <AppIcon name="share" size={17} color={Colors.info} />
          </View>
          <Text style={styles.menuTitle}>Share Application</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: Colors.errorLight }]}>
            <AppIcon name="logout" size={17} color={Colors.error} />
          </View>
          <Text style={[styles.menuTitle, { color: Colors.error }]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0 • Matka Bro Official</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  profileHeader: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 50,
    paddingBottom: 22,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  profileDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
  },
  userMobile: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  balanceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  balanceText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.accent,
    fontWeight: Typography.fontWeights.bold,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingVertical: Spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  versionContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeights.medium,
  },
});
