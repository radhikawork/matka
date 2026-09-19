import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Colors, Typography, BorderRadius } from '../../constants/colors';

interface StatusBadgeProps {
  status: 'running' | 'closed' | 'won' | 'lost' | 'pending' | 'success' | 'failed' | string;
  label?: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  style,
}) => {
  const normalized = status.toLowerCase();
  const isOpen = normalized === 'running' || normalized === 'open';

  // Micro-interaction: Pulsing glow/dot for active/open status
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOpen) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.35,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOpen]);

  const getColors = () => {
    switch (normalized) {
      case 'running':
      case 'open':
      case 'won':
      case 'success':
        return {
          bg: Colors.successLight,
          text: Colors.successDark,
          border: '#86efac',
          dot: Colors.success,
        };
      case 'closed':
      case 'lost':
      case 'failed':
        return {
          bg: Colors.errorLight,
          text: Colors.errorDark,
          border: '#fca5a5',
          dot: Colors.error,
        };
      case 'pending':
      case 'waiting':
        return {
          bg: Colors.warningLight,
          text: Colors.warningDark,
          border: '#fed7aa',
          dot: Colors.warning,
        };
      default:
        return {
          bg: Colors.infoLight,
          text: Colors.infoDark,
          border: '#bae6fd',
          dot: Colors.info,
        };
    }
  };

  const colorScheme = getColors();
  const displayLabel = label || status.toUpperCase();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colorScheme.bg,
          borderColor: colorScheme.border,
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: colorScheme.dot,
            opacity: isOpen ? pulseAnim : 1,
            transform: isOpen ? [{ scale: pulseAnim }] : [],
          },
        ]}
      />
      <Text style={[styles.text, { color: colorScheme.text }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
});
