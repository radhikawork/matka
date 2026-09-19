import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { StarlineSlot } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AppIcon } from '../common/AppIcon';

interface StarlineSlotCardProps {
  slot: StarlineSlot;
  onPlayPress: (slot: StarlineSlot) => void;
}

export const StarlineSlotCard: React.FC<StarlineSlotCardProps> = ({
  slot,
  onPlayPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!slot.isOpen) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    if (!slot.isOpen) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  return (
    <View style={[styles.card, Shadows.sm]}>
      <View style={styles.slotInfo}>
        <Text style={styles.timeSlot}>{slot.timeSlot}</Text>
        <StatusBadge
          status={slot.isOpen ? 'running' : 'closed'}
          label={slot.statusText}
        />
      </View>

      <View
        style={[
          styles.resultBadge,
          slot.isOpen ? styles.resultOpen : styles.resultClosed,
        ]}>
        <Text style={styles.resultText}>{slot.result}</Text>
      </View>

      <TouchableWithoutFeedback
        disabled={!slot.isOpen}
        onPress={() => onPlayPress(slot)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <Animated.View
          style={[
            styles.playBtn,
            {
              backgroundColor: slot.isOpen ? Colors.primary : '#e2e8f0',
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <AppIcon
            name="play"
            size={13}
            color={slot.isOpen ? Colors.textLight : Colors.textMuted}
          />
          <Text
            style={[
              styles.playBtnText,
              { color: slot.isOpen ? Colors.textLight : Colors.textMuted },
            ]}>
            {slot.isOpen ? 'Play' : 'Closed'}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotInfo: {
    flex: 1.2,
  },
  timeSlot: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  resultBadge: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
  },
  resultOpen: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primaryMutedDark,
  },
  resultClosed: {
    backgroundColor: '#f8fafc',
    borderColor: Colors.border,
  },
  resultText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  playBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
});
