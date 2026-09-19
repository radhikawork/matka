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

interface WithdrawFundScreenProps {
  navigation: any;
}

export const WithdrawFundScreen: React.FC<WithdrawFundScreenProps> = ({
  navigation,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'bank' | 'upi'>('bank');
  const [loading, setLoading] = useState<boolean>(false);

  const handleWithdraw = () => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num < 500) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹500.');
      return;
    }

    if (num > mockUser.walletBalance) {
      Alert.alert(
        'Insufficient Balance',
        `Your current wallet balance is ₹${mockUser.walletBalance}. You cannot withdraw more than available balance.`,
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Withdrawal Request Placed',
        `Your request to withdraw ₹${num} via ${
          method === 'bank' ? 'Bank Transfer' : 'UPI'
        } has been submitted. Funds will be credited to your account within 15-30 minutes.`,
        [
          {
            text: 'View Passbook',
            onPress: () => navigation.navigate('Passbook'),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }, 900);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Withdraw Cash"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Balance Box */}
        <View style={[styles.balanceBox, Shadows.md]}>
          <Text style={styles.balanceLabel}>Available Withdrawal Balance</Text>
          <Text style={styles.balanceValue}>₹ {mockUser.walletBalance.toLocaleString('en-IN')}</Text>
        </View>

        {/* Withdrawal Rules Card */}
        <View style={styles.rulesCard}>
          <View style={styles.ruleRow}>
            <AppIcon name="info" size={15} color={Colors.primaryDark} />
            <Text style={styles.ruleText}>
              Minimum Withdrawal: <Text style={styles.boldText}>₹500</Text>
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <AppIcon name="info" size={15} color={Colors.primaryDark} />
            <Text style={styles.ruleText}>
              Withdrawal Timings: <Text style={styles.boldText}>10:00 AM to 08:00 PM</Text>
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <AppIcon name="info" size={15} color={Colors.primaryDark} />
            <Text style={styles.ruleText}>
              Processing Time: <Text style={styles.boldText}>Instant to 30 mins</Text>
            </Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.cardHeading}>ENTER WITHDRAWAL AMOUNT</Text>
          <CustomInput
            placeholder="Min ₹500"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            prefix="₹ "
            iconName="wallet"
          />
        </View>

        {/* Destination Method */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.cardHeading}>SELECT TRANSFER DESTINATION</Text>

          {/* Bank Option */}
          <TouchableOpacity
            style={[
              styles.destCard,
              method === 'bank' ? styles.destCardSelected : null,
            ]}
            onPress={() => setMethod('bank')}
            activeOpacity={0.8}>
            <View style={styles.destIconCircle}>
              <AppIcon name="bank" size={20} color={Colors.primary} />
            </View>
            <View style={styles.destInfo}>
              <Text style={styles.destTitle}>Bank Transfer</Text>
              <Text style={styles.destSubtitle}>
                {mockUser.bankDetails?.bankName} (•••
                {mockUser.bankDetails?.accountNumber.slice(-4)})
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('BankDetails')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* UPI Option */}
          <TouchableOpacity
            style={[
              styles.destCard,
              method === 'upi' ? styles.destCardSelected : null,
            ]}
            onPress={() => setMethod('upi')}
            activeOpacity={0.8}>
            <View style={styles.destIconCircle}>
              <AppIcon name="upi" size={20} color={Colors.primary} />
            </View>
            <View style={styles.destInfo}>
              <Text style={styles.destTitle}>UPI Transfer</Text>
              <Text style={styles.destSubtitle}>
                {mockUser.upiDetails?.upiId || mockUser.mobile}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('UpiDetails')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Submit Action */}
        <CustomButton
          title="WITHDRAW CASH NOW"
          onPress={handleWithdraw}
          loading={loading}
          variant="primary"
          size="large"
          style={styles.withdrawBtn}
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
  balanceBox: {
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
  rulesCard: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primaryMutedDark,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
  },
  boldText: {
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeading: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.6,
  },
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  destCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  destIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  destInfo: {
    flex: 1,
  },
  destTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  destSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editLink: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
    padding: 4,
  },
  withdrawBtn: {
    marginTop: 6,
  },
});
