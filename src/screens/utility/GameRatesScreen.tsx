import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import {
  regularGameRates,
  starlineGameRates,
  jackpotGameRates,
} from '../../mocks/gameRatesData';
import { mockUser } from '../../mocks/userData';
import { GameRate } from '../../types';

interface GameRatesScreenProps {
  navigation: any;
}

export const GameRatesScreen: React.FC<GameRatesScreenProps> = ({
  navigation,
}) => {
  const renderRateSection = (title: string, rates: GameRate[]) => (
    <View style={[styles.sectionCard, Shadows.sm]}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 2 }]}>GAME TYPE</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>
          WIN RATIO
        </Text>
      </View>
      {rates.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.rateRow,
            index % 2 === 1 ? styles.altRow : null,
          ]}>
          <View style={{ flex: 2 }}>
            <Text style={styles.gameTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.gameDesc}>{item.description}</Text>
            )}
          </View>
          <View style={styles.rateBadge}>
            <Text style={styles.rateValue}>{item.rate}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Game Rates"
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
        {/* Top Info Banner */}
        <View style={[styles.infoBanner, Shadows.md]}>
          <Text style={styles.bannerHeading}>HIGHEST MARKET WIN RATES</Text>
          <Text style={styles.bannerSubtitle}>
            Enjoy 100% transparent and best-in-market payout ratios on all games.
          </Text>
        </View>

        {renderRateSection('Regular Market Game Rates', regularGameRates)}
        {renderRateSection('Starline Game Win Rates', starlineGameRates)}
        {renderRateSection('Main Jackpot Game Win Rates', jackpotGameRates)}
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
  infoBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerHeading: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.medium,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeaderTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  headerCell: {
    fontSize: Typography.fontSizes.xxs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  altRow: {
    backgroundColor: '#f8fafc',
  },
  gameTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  gameDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rateBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryMutedDark,
  },
  rateValue: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
  },
});
