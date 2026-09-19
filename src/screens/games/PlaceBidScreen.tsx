import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { BidTable, AddedBidItem } from '../../components/games/BidTable';
import { mockUser } from '../../mocks/userData';
import { GameType, MarketItem } from '../../types';
import { AppIcon } from '../../components/common/AppIcon';

interface PlaceBidScreenProps {
  route: {
    params: {
      market: MarketItem;
      gameType: GameType;
      gameTypeTitle: string;
      payoutRate: string;
    };
  };
  navigation: any;
}

const QuickAmountChip: React.FC<{
  amount: number;
  isSelected: boolean;
  onPress: (val: number) => void;
}> = ({ amount, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
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
      onPress={() => onPress(amount)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.quickChip,
          isSelected ? styles.quickChipSelected : null,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <Text
          style={[
            styles.quickChipText,
            isSelected ? styles.quickChipTextSelected : null,
          ]}>
          +₹{amount}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const PlaceBidScreen: React.FC<PlaceBidScreenProps> = ({
  route,
  navigation,
}) => {
  const { market, gameType, gameTypeTitle, payoutRate } = route.params;

  const [session, setSession] = useState<'open' | 'close'>('open');
  const [digit, setDigit] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [addedBids, setAddedBids] = useState<AddedBidItem[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const getDigitPlaceholder = () => {
    switch (gameType) {
      case 'single_digit':
        return 'Enter single digit (0-9)';
      case 'jodi_digit':
        return 'Enter 2-digit Jodi (00-99)';
      case 'single_panna':
      case 'double_panna':
      case 'triple_panna':
        return 'Enter 3-digit Panna (e.g. 123)';
      case 'half_sangam':
      case 'full_sangam':
        return 'Enter Sangam digits';
      default:
        return 'Enter digits';
    }
  };

  const getMaxDigitLength = () => {
    switch (gameType) {
      case 'single_digit':
        return 1;
      case 'jodi_digit':
        return 2;
      case 'single_panna':
      case 'double_panna':
      case 'triple_panna':
        return 3;
      default:
        return 6;
    }
  };

  const handleQuickAmount = (val: number) => {
    const current = parseInt(points || '0', 10);
    setPoints((current + val).toString());
  };

  const handleAddBid = () => {
    if (!digit.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid digit/number.');
      return;
    }

    const pointsNum = parseInt(points, 10);
    if (isNaN(pointsNum) || pointsNum < 10) {
      Alert.alert('Validation Error', 'Minimum bid amount is ₹10.');
      return;
    }

    const newBid: AddedBidItem = {
      id: Date.now().toString(),
      digit: digit.trim(),
      points: pointsNum,
      session,
    };

    setAddedBids((prev) => [...prev, newBid]);
    setDigit('');
    setPoints('');
  };

  const handleDeleteBid = (id: string) => {
    setAddedBids((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitBids = () => {
    if (addedBids.length === 0) {
      Alert.alert('No Bids', 'Please add at least one bid to submit.');
      return;
    }

    const totalRequired = addedBids.reduce((sum, item) => sum + item.points, 0);
    if (totalRequired > mockUser.walletBalance) {
      Alert.alert(
        'Insufficient Balance',
        `You need ₹${totalRequired} but your wallet has ₹${mockUser.walletBalance}. Please add funds to place this bid.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Funds',
            onPress: () => navigation.navigate('AddFund'),
          },
        ],
      );
      return;
    }

    Alert.alert(
      'Confirm Bids',
      `Are you sure you want to place ${addedBids.length} bids for total ₹${totalRequired}?`,
      [
        { text: 'Review', style: 'cancel' },
        {
          text: 'Confirm & Place',
          onPress: () => {
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              setAddedBids([]);
              Alert.alert(
                'Success!',
                'Your bids have been placed successfully!',
                [
                  {
                    text: 'View My Bids',
                    onPress: () => navigation.navigate('BidHistory'),
                  },
                  {
                    text: 'Back to Home',
                    onPress: () => navigation.navigate('MainTabs', { screen: 'HomeTab' }),
                  },
                ],
              );
            }, 700);
          },
        },
      ],
    );
  };

  const totalPoints = addedBids.reduce((sum, item) => sum + item.points, 0);

  return (
    <View style={styles.container}>
      <Header
        title={`${market.name} - ${gameTypeTitle}`}
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
          {/* Market & Rate Info Card */}
          <View style={[styles.infoCard, Shadows.md]}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Game Type</Text>
              <Text style={styles.infoValue}>{gameTypeTitle}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Win Payout Rate</Text>
              <Text style={[styles.infoValue, { color: Colors.accent }]}>
                {payoutRate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wallet Balance</Text>
              <Text style={[styles.infoValue, { color: Colors.primaryMutedDark }]}>
                ₹ {mockUser.walletBalance.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Session Selector (Open vs Close) */}
          <View style={[styles.sessionCard, Shadows.sm]}>
            <Text style={styles.cardSectionTitle}>Select Session</Text>
            <View style={styles.sessionToggleRow}>
              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === 'open' ? styles.sessionBtnActive : null,
                ]}
                onPress={() => setSession('open')}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.sessionBtnText,
                    session === 'open' ? styles.sessionBtnTextActive : null,
                  ]}>
                  OPEN SESSION
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === 'close' ? styles.sessionBtnActive : null,
                ]}
                onPress={() => setSession('close')}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.sessionBtnText,
                    session === 'close' ? styles.sessionBtnTextActive : null,
                  ]}>
                  CLOSE SESSION
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Controls */}
          <View style={[styles.inputCard, Shadows.sm]}>
            <Text style={styles.cardSectionTitle}>Enter Bid Details</Text>

            <CustomInput
              label="Digit / Number"
              placeholder={getDigitPlaceholder()}
              value={digit}
              onChangeText={setDigit}
              keyboardType="number-pad"
              maxLength={getMaxDigitLength()}
              iconName="dice"
            />

            <CustomInput
              label="Points (₹)"
              placeholder="Minimum ₹10"
              value={points}
              onChangeText={setPoints}
              keyboardType="number-pad"
              prefix="₹ "
              iconName="wallet"
            />

            {/* Quick Amount Selector Chips */}
            <View style={styles.quickChipRow}>
              {[10, 50, 100, 500, 1000].map((val) => (
                <QuickAmountChip
                  key={val}
                  amount={val}
                  isSelected={points === val.toString()}
                  onPress={handleQuickAmount}
                />
              ))}
            </View>

            <CustomButton
              title="ADD TO BIDS LIST"
              onPress={handleAddBid}
              variant="secondary"
              size="medium"
              iconName="plus"
              style={styles.addBtn}
            />
          </View>

          {/* Added Bids Table */}
          <View style={styles.tableSection}>
            <Text style={styles.cardSectionTitle}>Added Bids Review</Text>
            <BidTable bids={addedBids} onDeleteBid={handleDeleteBid} />
          </View>

          {/* Submit Action */}
          {addedBids.length > 0 && (
            <CustomButton
              title={`SUBMIT ${addedBids.length} BIDS (₹ ${totalPoints.toLocaleString('en-IN')})`}
              onPress={handleSubmitBids}
              loading={submitting}
              variant="accent"
              size="large"
              style={styles.submitBtn}
            />
          )}
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
  infoCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primaryMutedDark,
    fontWeight: Typography.fontWeights.medium,
  },
  infoValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
  },
  sessionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardSectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  sessionToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sessionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
  },
  sessionBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  sessionBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  sessionBtnTextActive: {
    color: Colors.primaryDark,
  },
  inputCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipSelected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  quickChipText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  quickChipTextSelected: {
    color: Colors.primaryDark,
  },
  addBtn: {
    marginTop: 2,
  },
  tableSection: {
    marginVertical: 4,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
