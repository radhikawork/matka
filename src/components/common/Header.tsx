import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/colors';
import { AppIcon } from './AppIcon';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showWallet?: boolean;
  showNotification?: boolean;
  walletBalance?: number;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onWalletPress?: () => void;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Matka Bro',
  showBack = false,
  showMenu = true,
  showWallet = true,
  showNotification = true,
  walletBalance = 2450,
  onBackPress,
  onMenuPress,
  onWalletPress,
  onNotificationPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, Shadows.md]}>
        {/* Left Section */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AppIcon name="back" size={22} color={Colors.textLight} />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AppIcon name="menu" size={22} color={Colors.textLight} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightContainer}>
          {showWallet && (
            <TouchableOpacity
              onPress={onWalletPress}
              style={styles.walletBadge}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}>
              <View style={styles.walletIconCircle}>
                <AppIcon name="wallet" size={13} color={Colors.primaryDark} />
              </View>
              <Text style={styles.walletText}>₹ {walletBalance.toLocaleString('en-IN')}</Text>
            </TouchableOpacity>
          )}

          {showNotification && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AppIcon name="bell" size={19} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primary,
  },
  container: {
    height: 58,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginRight: 8,
  },
  placeholder: {
    width: 6,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    letterSpacing: 0.6,
    marginLeft: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  walletIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  walletText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
    letterSpacing: 0.3,
  },
});
