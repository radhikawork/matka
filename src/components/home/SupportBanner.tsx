import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/colors';
import { AppIcon } from '../common/AppIcon';

interface SupportBannerProps {
  phoneNumber?: string;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({
  phoneNumber = '+917206406325',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=Hello%20Matka%20Bro%20Support`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Contact Support', `Call or WhatsApp support at: ${phoneNumber}`);
        }
      })
      .catch(() => {
        Alert.alert('Contact Support', `Call or WhatsApp support at: ${phoneNumber}`);
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={handleWhatsApp}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.container,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={styles.iconCircle}>
          <AppIcon name="whatsapp" size={22} color={Colors.textLight} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headline}>24x7 Direct Support Desk</Text>
          <Text style={styles.phoneText}>{phoneNumber}</Text>
        </View>
        <View style={styles.chatChip}>
          <Text style={styles.chatText}>Chat Now</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  headline: {
    fontSize: Typography.fontSizes.xs,
    color: '#15803d',
    fontWeight: Typography.fontWeights.semibold,
  },
  phoneText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  chatChip: {
    backgroundColor: Colors.whatsappGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  chatText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
});
