import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { jackpotGameRates } from '../../mocks/gameRatesData';
import { mockUser } from '../../mocks/userData';
import { AppIcon } from '../../components/common/AppIcon';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MarketItem } from '../../types';

interface JackpotHomeScreenProps {
  navigation: any;
}

const jackpotMarkets = [
  { id: 'jp_1', name: 'JACKPOT 11:30 AM', time: '11:30 AM', result: '47', status: 'Closed' },
  { id: 'jp_2', name: 'JACKPOT 01:30 PM', time: '01:30 PM', result: '89', status: 'Closed' },
  { id: 'jp_3', name: 'JACKPOT 03:30 PM', time: '03:30 PM', result: '**', status: 'Running' },
  { id: 'jp_4', name: 'JACKPOT 05:30 PM', time: '05:30 PM', result: '**', status: 'Running' },
  { id: 'jp_5', name: 'JACKPOT 07:30 PM', time: '07:30 PM', result: '**', status: 'Running' },
  { id: 'jp_6', name: 'JACKPOT 09:30 PM', time: '09:30 PM', result: '**', status: 'Closed' },
];

const JackpotMarketCard: React.FC<{
  item: typeof jackpotMarkets[0];
  onPress: (item: typeof jackpotMarkets[0]) => void;
}> = ({ item, onPress }) => {
  const isRunning = item.status === 'Running';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isRunning) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    if (!isRunning) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  return (
    <View style={[styles.marketCard, Shadows.sm]}>
      <View style={{ flex: 1.3 }}>
        <Text style={styles.marketName}>{item.name}</Text>
        <Text style={styles.marketTime}>Draw Time: {item.time}</Text>
        <StatusBadge
          status={isRunning ? 'running' : 'closed'}
          label={item.status}
          style={{ marginTop: 4 }}
        />
      </View>

      <View
        style={[
          styles.resultBox,
          isRunning ? styles.resultBoxRunning : styles.resultBoxClosed,
        ]}>
        <Text style={styles.resultDigits}>{item.result}</Text>
      </View>

      <TouchableWithoutFeedback
        disabled={!isRunning}
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <Animated.View
          style={[
            styles.playBtn,
            {
              backgroundColor: isRunning ? Colors.primary : '#e2e8f0',
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <AppIcon
            name="play"
            size={12}
            color={isRunning ? Colors.textLight : Colors.textMuted}
          />
          <Text
            style={[
              styles.playBtnText,
              { color: isRunning ? Colors.textLight : Colors.textMuted },
            ]}>
            {isRunning ? 'Play' : 'Closed'}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const JackpotHomeScreen: React.FC<JackpotHomeScreenProps> = ({
  navigation,
}) => {
  const handlePlayJackpot = (marketItem: typeof jackpotMarkets[0]) => {
    const marketObj: MarketItem = {
      id: marketItem.id,
      name: marketItem.name,
      openTime: marketItem.time,
      closeTime: marketItem.time,
      result: `***-${marketItem.result}-***`,
      isOpen: marketItem.status === 'Running',
      isClosedForDay: marketItem.status === 'Closed',
      statusText: marketItem.status,
    };

    navigation.navigate('GameMarketDetails', { market: marketObj });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Main Jackpot"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <FlatList
        data={jackpotMarkets}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerBox}>
            <View style={[styles.jackpotBanner, Shadows.md]}>
              <View style={styles.trophyCircle}>
                <AppIcon name="trophy" size={32} color={Colors.accent} />
              </View>
              <Text style={styles.jackpotTitle}>MAIN JACKPOT</Text>
              <Text style={styles.jackpotDesc}>High Payout Jackpot Markets with Instant Result</Text>

              <View style={styles.ratesContainer}>
                {jackpotGameRates.map((rate, i) => (
                  <View key={i} style={styles.rateChip}>
                    <Text style={styles.rateChipText}>
                      {rate.title}: {rate.rate}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>TODAY'S JACKPOT MARKETS</Text>
          </View>
        }
        renderItem={({ item }) => (
          <JackpotMarketCard item={item} onPress={handlePlayJackpot} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  headerBox: {
    paddingTop: Spacing.xs,
  },
  jackpotBanner: {
    backgroundColor: '#880e4f',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  trophyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  jackpotTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 1,
  },
  jackpotDesc: {
    fontSize: Typography.fontSizes.xs,
    color: '#fce7f3',
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  ratesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
  },
  rateChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rateChipText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    letterSpacing: 0.8,
  },
  marketCard: {
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
  marketName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  marketTime: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  resultBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginHorizontal: Spacing.sm,
  },
  resultBoxRunning: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primaryMutedDark,
  },
  resultBoxClosed: {
    backgroundColor: '#f8fafc',
    borderColor: Colors.border,
  },
  resultDigits: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  playBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
});
