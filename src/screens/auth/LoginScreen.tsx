import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';

interface LoginScreenProps {
  navigation: any;
}

// Micro-interaction: Keypad button with spring scale feedback
const KeypadButton: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
}> = ({ onPress, children }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.keypadKey,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Entrance animations
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(heroSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleLogin = () => {
    if (pin.length < 4) {
      setError('Please enter 4-digit M-Pin');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pin === '9999') {
        navigation.replace('AdminDashboard');
      } else if (pin === mockUser.mPin || pin === '1234') {
        navigation.replace('MainDrawer');
      } else {
        setError('Invalid M-Pin. Use 1234 (User) or 9999 (Admin)');
      }
    }, 600);
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'delete'],
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Brand Header */}
      <Animated.View
        style={[
          styles.topSection,
          {
            opacity: heroFade,
            transform: [{ translateY: heroSlide }],
          },
        ]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, Shadows.glow]}>
            <AppIcon name="dice" size={38} color={Colors.accent} />
          </View>
          <Text style={styles.brandTitle}>MATKA BRO</Text>
          <Text style={styles.brandSubtitle}>Fastest Live Results & Play App</Text>
        </View>
      </Animated.View>

      {/* PIN Card */}
      <Animated.View
        style={[
          styles.pinSection,
          {
            transform: [{ translateY: cardSlide }],
          },
        ]}>
        <Text style={styles.loginHeading}>Security Login</Text>
        <Text style={styles.loginSubheading}>
          Enter your 4-digit M-Pin to access your wallet & bids
        </Text>

        {/* PIN Indicators */}
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <View
                key={index}
                style={[
                  styles.pinDotBox,
                  isFilled ? styles.pinDotBoxFilled : null,
                  error ? styles.pinDotBoxError : null,
                ]}>
                {isFilled && <View style={styles.pinDotFill} />}
              </View>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Action Button */}
        <CustomButton
          title="LOGIN TO ACCOUNT"
          onPress={handleLogin}
          loading={loading}
          disabled={pin.length < 4}
          variant="primary"
          size="medium"
          style={styles.loginBtn}
        />

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          {keypadNumbers.map((row, rIdx) => (
            <View key={rIdx} style={styles.keypadRow}>
              {row.map((item, cIdx) => {
                if (item === 'clear') {
                  return (
                    <KeypadButton key={cIdx} onPress={() => setPin('')}>
                      <Text style={styles.keypadActionText}>CLEAR</Text>
                    </KeypadButton>
                  );
                }
                if (item === 'delete') {
                  return (
                    <KeypadButton key={cIdx} onPress={handleDelete}>
                      <AppIcon name="back" size={22} color={Colors.textPrimary} />
                    </KeypadButton>
                  );
                }
                return (
                  <KeypadButton key={cIdx} onPress={() => handleKeyPress(item)}>
                    <Text style={styles.keypadNumberText}>{item}</Text>
                  </KeypadButton>
                );
              })}
            </View>
          ))}
        </View>

        {/* Footer Support / Forgot / Admin */}
        <View style={styles.footerLinks}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Demo Helper', 'User PIN: 1234\nAdmin PIN: 9999')
            }>
            <Text style={styles.linkText}>Demo PINs</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>•</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminDashboard')}>
            <Text style={[styles.linkText, { color: Colors.accentDark }]}>
              Admin Portal
            </Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>•</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Need Help?',
                'WhatsApp support is available 24x7 at +91 7206406325'
              )
            }>
            <Text style={styles.linkText}>Support</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  topSection: {
    flex: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  brandTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 4,
    letterSpacing: 0.6,
    fontWeight: Typography.fontWeights.medium,
  },
  pinSection: {
    flex: 2.1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xxl || 28,
    borderTopRightRadius: BorderRadius.xxl || 28,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  loginHeading: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  loginSubheading: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  pinDotBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDotBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  pinDotBoxError: {
    borderColor: Colors.error,
  },
  pinDotFill: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primaryDark,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: 6,
    textAlign: 'center',
  },
  loginBtn: {
    width: '100%',
    marginVertical: 8,
  },
  keypadContainer: {
    width: '100%',
    marginVertical: 6,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  keypadKey: {
    width: 72,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keypadNumberText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  keypadActionText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  linkText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  linkDivider: {
    color: Colors.textMuted,
  },
});
