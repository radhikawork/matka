import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { MarketItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AppIcon } from '../common/AppIcon';

interface MarketCardProps {
  market: MarketItem;
  onPress: (market: MarketItem) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onPress }) => {
  // Micro-interaction: Spring scale on card press
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(market)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.card,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        {/* Header Info */}
        <View style={styles.headerRow}>
          <Text style={styles.marketName} numberOfLines={1}>
            {market.name}
          </Text>
          <StatusBadge
            status={market.isOpen ? 'running' : 'closed'}
            label={market.statusText}
          />
        </View>

        {/* Main Result & Timings Row */}
        <View style={styles.bodyRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Open Time</Text>
            <Text style={styles.timeValue}>{market.openTime}</Text>
          </View>

          {/* Center Result Digits */}
          <View
            style={[
              styles.resultContainer,
              market.isOpen ? styles.resultContainerOpen : styles.resultContainerClosed,
            ]}>
            <Text style={styles.resultText}>{market.result}</Text>
          </View>

          <View style={[styles.timeBlock, { alignItems: 'flex-end' }]}>
            <Text style={styles.timeLabel}>Close Time</Text>
            <Text style={styles.timeValue}>{market.closeTime}</Text>
          </View>
        </View>

        {/* Play Action Footer */}
        <View style={styles.footerRow}>
          <View
            style={[
              styles.playNowWrapper,
              {
                backgroundColor: market.isOpen ? Colors.primaryMuted : '#f1f5f9',
              },
            ]}>
            <View
              style={[
                styles.playCircle,
                {
                  backgroundColor: market.isOpen ? Colors.primary : Colors.borderDark,
                },
              ]}>
              <AppIcon
                name="play"
                size={11}
                color={market.isOpen ? Colors.textLight : Colors.textMuted}
              />
            </View>
            <Text
              style={[
                styles.playText,
                {
                  color: market.isOpen ? Colors.primary : Colors.textMuted,
                },
              ]}>
              {market.isOpen ? 'Play Game Now' : 'Market Closed For Today'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  marketName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
    flex: 1,
    marginRight: Spacing.sm,
    letterSpacing: 0.2,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: 2,
    letterSpacing: 0.4,
  },
  timeValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  resultContainer: {
    flex: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  resultContainerOpen: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primaryMutedDark,
  },
  resultContainerClosed: {
    backgroundColor: '#f8fafc',
    borderColor: Colors.border,
  },
  resultText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
    letterSpacing: 1.2,
  },
  footerRow: {
    marginTop: Spacing.sm,
  },
  playNowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
  },
  playCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
});
