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

interface BankDetailsScreenProps {
  navigation: any;
}

export const BankDetailsScreen: React.FC<BankDetailsScreenProps> = ({
  navigation,
}) => {
  const [holderName, setHolderName] = useState<string>(
    mockUser.bankDetails?.accountHolderName || '',
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    mockUser.bankDetails?.accountNumber || '',
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>(
    mockUser.bankDetails?.accountNumber || '',
  );
  const [ifscCode, setIfscCode] = useState<string>(
    mockUser.bankDetails?.ifscCode || '',
  );
  const [bankName, setBankName] = useState<string>(
    mockUser.bankDetails?.bankName || '',
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = () => {
    if (!holderName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      Alert.alert('Validation Error', 'Please fill in all mandatory fields.');
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      Alert.alert(
        'Validation Error',
        'Account Number and Confirm Account Number do not match.',
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Bank details saved successfully!', [
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
        title="Bank Details"
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
            <Text style={styles.cardTitle}>ACCOUNT INFORMATION</Text>
            <Text style={styles.cardSubtitle}>
              Please verify your bank details carefully for automatic withdrawal payouts.
            </Text>

            <CustomInput
              label="Account Holder Name *"
              placeholder="e.g. Radhika Sharma"
              value={holderName}
              onChangeText={setHolderName}
              iconName="user"
            />

            <CustomInput
              label="Account Number *"
              placeholder="Enter bank account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
              iconName="bank"
              secureTextEntry={false}
            />

            <CustomInput
              label="Confirm Account Number *"
              placeholder="Re-enter bank account number"
              value={confirmAccountNumber}
              onChangeText={setConfirmAccountNumber}
              keyboardType="number-pad"
              iconName="bank"
            />

            <CustomInput
              label="IFSC Code *"
              placeholder="e.g. SBIN0001234"
              value={ifscCode}
              onChangeText={(text) => setIfscCode(text.toUpperCase())}
              autoCapitalize="characters"
              iconName="info"
            />

            <CustomInput
              label="Bank Name"
              placeholder="e.g. State Bank of India"
              value={bankName}
              onChangeText={setBankName}
              iconName="bank"
            />

            <CustomButton
              title="SAVE BANK DETAILS"
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
