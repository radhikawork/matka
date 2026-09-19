import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/colors';
import { AppIcon } from './AppIcon';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  iconName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  iconName,
  style,
  textStyle,
}) => {
  // Micro-interaction: Spring scale on press
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const getBackgroundColor = () => {
    if (disabled) return '#cbd5e1';
    switch (variant) {
      case 'secondary':
        return Colors.primaryLight;
      case 'accent':
        return Colors.accent;
      case 'danger':
        return Colors.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'primary':
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94a3b8';
    if (variant === 'outline' || variant === 'ghost') return Colors.primary;
    if (variant === 'accent') return '#1e293b';
    return Colors.textLight;
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return 38;
      case 'large':
        return 54;
      case 'medium':
      default:
        return 48;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}>
      <Animated.View
        style={[
          styles.button,
          variant !== 'ghost' && Shadows.md,
          {
            backgroundColor: getBackgroundColor(),
            height: getHeight(),
            borderColor:
              variant === 'outline'
                ? disabled
                  ? '#cbd5e1'
                  : Colors.primary
                : 'transparent',
            borderWidth: variant === 'outline' ? 1.5 : 0,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {iconName && (
              <AppIcon
                name={iconName}
                size={size === 'small' ? 16 : 20}
                color={getTextColor()}
                style={styles.iconMargin}
              />
            )}
            <Text
              style={[
                styles.buttonText,
                {
                  color: getTextColor(),
                  fontSize:
                    size === 'small'
                      ? Typography.fontSizes.sm
                      : size === 'large'
                      ? Typography.fontSizes.lg
                      : Typography.fontSizes.md,
                },
                textStyle,
              ]}>
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMargin: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
