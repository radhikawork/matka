import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { AppIcon } from '../common/AppIcon';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  iconBgColor?: string;
  iconColor?: string;
  accentColor?: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
  onPress?: () => void;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  iconBgColor = Colors.primaryMuted,
  iconColor = Colors.primary,
  badgeText,
  badgeType = 'info',
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const getBadgeColors = () => {
    switch (badgeType) {
      case 'success':
        return { bg: Colors.successLight, text: Colors.successDark };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.warningDark };
      case 'error':
        return { bg: Colors.errorLight, text: Colors.errorDark };
      default:
        return { bg: Colors.infoLight, text: Colors.infoDark };
    }
  };

  const badgeColors = getBadgeColors();

  const cardBody = (
    <Animated.View
      style={[
        styles.card,
        Shadows.sm,
        onPress ? { transform: [{ scale: scaleAnim }] } : null,
      ]}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <AppIcon name={iconName} size={18} color={iconColor} />
        </View>
        {badgeText ? (
          <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColors.text }]}>
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={styles.touchableWrapper}>{cardBody}</View>
      </TouchableWithoutFeedback>
    );
  }

  return <View style={styles.touchableWrapper}>{cardBody}</View>;
};

const styles = StyleSheet.create({
  touchableWrapper: {
    flex: 1,
    minWidth: '46%',
    margin: 5,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.heavy,
  },
  value: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    marginVertical: 2,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: Typography.fontSizes.xxs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
});
