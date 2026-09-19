import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/colors';
import { AppIcon } from './AppIcon';

interface BalanceCardProps {
  balance: number;
  onAddPress?: () => void;
  onWithdrawPress?: () => void;
  onHistoryPress?: () => void;
}

const ScaleActionButton: React.FC<{
  title: string;
  icon: string;
  iconColor: string;
  textColor: string;
  backgroundColor: string;
  onPress?: () => void;
}> = ({ title, icon, iconColor, textColor, backgroundColor, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.actionBtn,
          { backgroundColor, transform: [{ scale: scaleAnim }] },
        ]}>
        <AppIcon name={icon} size={15} color={iconColor} />
        <Text style={[styles.actionBtnText, { color: textColor }]}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  onAddPress,
  onWithdrawPress,
  onHistoryPress,
}) => {
  return (
    <View style={[styles.card, Shadows.lg]}>
      {/* Decorative background glow circle */}
      <View style={styles.decorCircle} />

      <View style={styles.topRow}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.secureDot} />
            <Text style={styles.label}>Available Balance</Text>
          </View>
          <Text style={styles.amount}>₹ {balance.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.iconCircle}>
          <AppIcon name="wallet" size={26} color={Colors.accent} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        {onAddPress && (
          <ScaleActionButton
            title="Add Cash"
            icon="plus"
            iconColor={Colors.textLight}
            textColor={Colors.textLight}
            backgroundColor={Colors.primaryLight}
            onPress={onAddPress}
          />
        )}

        {onWithdrawPress && (
          <ScaleActionButton
            title="Withdraw"
            icon="minus"
            iconColor={Colors.primaryDark}
            textColor={Colors.primaryDark}
            backgroundColor={Colors.textLight}
            onPress={onWithdrawPress}
          />
        )}

        {onHistoryPress && (
          <ScaleActionButton
            title="Passbook"
            icon="passbook"
            iconColor={Colors.textLight}
            textColor={Colors.textLight}
            backgroundColor="rgba(255, 255, 255, 0.18)"
            onPress={onHistoryPress}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  secureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  label: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: Typography.fontWeights.semibold,
  },
  amount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    marginVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  actionBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
  },
});
