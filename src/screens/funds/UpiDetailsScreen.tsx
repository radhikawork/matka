import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { mockUser } from '../../mocks/userData';

interface UpiDetailsScreenProps {
  navigation: any;
}

export const UpiDetailsScreen: React.FC<UpiDetailsScreenProps> = ({
  navigation,
}) => {
  const [googlePay, setGooglePay] = useState<string>(
    mockUser.upiDetails?.googlePay || '',
  );
  const [phonePe, setPhonePe] = useState<string>(
    mockUser.upiDetails?.phonePe || '',
  );
  const [paytm, setPaytm] = useState<string>(
    mockUser.upiDetails?.paytm || '',
  );
  const [upiId, setUpiId] = useState<string>(
    mockUser.upiDetails?.upiId || '',
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = () => {
    if (!googlePay.trim() && !phonePe.trim() && !paytm.trim() && !upiId.trim()) {
      Alert.alert('Validation Error', 'Please provide at least one UPI payout method.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'UPI details saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Header
        title="UPI Details"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.card, Shadows.sm]}>
            <Text style={styles.cardTitle}>UPI & WALLET IDS</Text>
            <Text style={styles.cardSubtitle}>
              Link your active UPI numbers for instant withdrawal payouts.
            </Text>

            <CustomInput
              label="Google Pay Number"
              placeholder="e.g. 9876543210"
              value={googlePay}
              onChangeText={setGooglePay}
              keyboardType="number-pad"
              maxLength={10}
              iconName="gpay"
            />

            <CustomInput
              label="PhonePe Number"
              placeholder="e.g. 9876543210"
              value={phonePe}
              onChangeText={setPhonePe}
              keyboardType="number-pad"
              maxLength={10}
              iconName="phonepe"
            />

            <CustomInput
              label="Paytm Number"
              placeholder="e.g. 9876543210"
              value={paytm}
              onChangeText={setPaytm}
              keyboardType="number-pad"
              maxLength={10}
              iconName="paytm"
            />

            <CustomInput
              label="VPA / UPI ID (Optional)"
              placeholder="e.g. user@okhdfcbank"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              iconName="upi"
            />

            <CustomButton
              title="SAVE UPI DETAILS"
              onPress={handleSave}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.saveBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
