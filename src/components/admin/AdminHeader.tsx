import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { AppIcon } from '../common/AppIcon';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onUserAppPress?: () => void;
  rightAction?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  onUserAppPress,
  rightAction,
}) => {
  return (
    <View style={[styles.header, Shadows.md]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.iconButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppIcon name="back" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          ) : (
            <View style={styles.adminBadge}>
              <AppIcon name="shield" size={15} color={Colors.accent} />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rightSection}>
          {rightAction}
          {onUserAppPress ? (
            <TouchableOpacity
              style={styles.switchButton}
              onPress={onUserAppPress}
              activeOpacity={0.8}>
              <AppIcon name="home" size={13} color={Colors.primaryDark} />
              <Text style={styles.switchButtonText}>User App</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryDark,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    padding: 8,
    marginRight: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.full,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 0, 0.18)',
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    gap: 4,
  },
  adminBadgeText: {
    color: Colors.accent,
    fontWeight: Typography.fontWeights.heavy,
    fontSize: Typography.fontSizes.xxs,
    letterSpacing: 0.8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  switchButtonText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
});
