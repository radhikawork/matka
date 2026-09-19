import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { GameTypeOption } from '../../types';
import { AppIcon } from '../common/AppIcon';

interface GameTypeGridItemProps {
  item: GameTypeOption;
  onPress: (item: GameTypeOption) => void;
}

export const GameTypeGridItem: React.FC<GameTypeGridItemProps> = ({
  item,
  onPress,
}) => {
  // Micro-interaction: Spring scale on press
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
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.container,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={styles.iconCircle}>
          <AppIcon
            name={item.iconName || 'dice'}
            size={26}
            color={Colors.textLight}
          />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.rateBadge}>
          <Text style={styles.rateText}>{item.payoutRate}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: Colors.border,
    minHeight: 145,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    elevation: 3,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  rateBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryMutedDark,
  },
  rateText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
  },
});
