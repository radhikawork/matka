import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';

interface AddFundScreenProps {
  navigation: any;
}

export const AddFundScreen: React.FC<AddFundScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('500');
  const [selectedMethod, setSelectedMethod] = useState<string>('gpay');
  const [loading, setLoading] = useState<boolean>(false);

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  const handlePresetSelect = (val: number) => {
    setAmount(val.toString());
  };

  const handleProceed = () => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num < 100) {
      Alert.alert('Invalid Amount', 'Minimum deposit amount is ₹100.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful',
        `₹${num} has been added to your wallet successfully via ${selectedMethod.toUpperCase()}!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }, 900);
  };

  const paymentMethods = [
    { id: 'gpay', name: 'Google Pay UPI', icon: 'gpay', subtitle: 'Instant 1-Click Payment' },
    { id: 'phonepe', name: 'PhonePe UPI', icon: 'phonepe', subtitle: 'Instant 1-Click Payment' },
    { id: 'paytm', name: 'Paytm UPI / Wallet', icon: 'paytm', subtitle: 'Instant 1-Click Payment' },
    { id: 'upi', name: 'Other UPI Apps', icon: 'upi', subtitle: 'BHIM, CRED, Amazon Pay' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Add Cash"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => {}}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Current Balance Card */}
        <View style={[styles.balanceHeaderCard, Shadows.md]}>
          <Text style={styles.balanceLabel}>Current Wallet Balance</Text>
          <Text style={styles.balanceValue}>₹ {mockUser.walletBalance.toLocaleString('en-IN')}</Text>
        </View>

        {/* Amount Input */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionHeading}>ENTER DEPOSIT AMOUNT (₹)</Text>
          <CustomInput
            placeholder="Enter amount (Min ₹100)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            prefix="₹ "
            iconName="wallet"
          />

          {/* Preset Buttons */}
          <Text style={styles.presetLabel}>Quick Select Amount:</Text>
          <View style={styles.presetsRow}>
            {presetAmounts.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.presetChip,
                  amount === val.toString() ? styles.presetChipActive : null,
                ]}
                onPress={() => handlePresetSelect(val)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.presetChipText,
                    amount === val.toString() ? styles.presetChipTextActive : null,
                  ]}>
                  + ₹{val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionHeading}>SELECT PAYMENT METHOD</Text>
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  isSelected ? styles.methodRowSelected : null,
                ]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}>
                <View
                  style={[
                    styles.methodIcon,
                    isSelected ? { backgroundColor: Colors.primary } : null,
                  ]}>
                  <AppIcon
                    name={method.icon}
                    size={20}
                    color={isSelected ? Colors.textLight : Colors.primaryDark}
                  />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    isSelected ? styles.radioCircleActive : null,
                  ]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Security Note */}
        <View style={styles.noteBox}>
          <AppIcon name="lock" size={16} color={Colors.primary} />
          <Text style={styles.noteText}>
            100% Safe & Secure UPI Payments with Instant Wallet Credit.
          </Text>
        </View>

        {/* Submit Action */}
        <CustomButton
          title={`PROCEED TO PAY ₹ ${amount || '0'}`}
          onPress={handleProceed}
          loading={loading}
          variant="primary"
          size="large"
          style={styles.payBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  balanceHeaderCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  balanceLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: Typography.fontWeights.semibold,
  },
  balanceValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeading: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.6,
  },
  presetLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  presetChipTextActive: {
    color: Colors.primaryDark,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    marginBottom: 8,
  },
  methodRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  methodSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primaryMutedDark,
  },
  noteText: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryDark,
    lineHeight: 18,
    fontWeight: Typography.fontWeights.medium,
  },
  payBtn: {
    width: '100%',
  },
});
