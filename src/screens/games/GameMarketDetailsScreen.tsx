import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { GameTypeGridItem } from '../../components/games/GameTypeGridItem';
import { gameTypeOptions } from '../../mocks/marketsData';
import { mockUser } from '../../mocks/userData';
import { GameTypeOption, MarketItem } from '../../types';
import { AppIcon } from '../../components/common/AppIcon';

interface GameMarketDetailsScreenProps {
  route: {
    params: {
      market: MarketItem;
    };
  };
  navigation: any;
}

export const GameMarketDetailsScreen: React.FC<GameMarketDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { market } = route.params;

  const handleGameTypeSelect = (item: GameTypeOption) => {
    navigation.navigate('PlaceBid', {
      market,
      gameType: item.id,
      gameTypeTitle: item.title,
      payoutRate: item.payoutRate,
    });
  };

  const renderHeader = () => (
    <View style={[styles.marketBanner, Shadows.md]}>
      <View style={styles.bannerBadge}>
        <AppIcon name="chart" size={14} color={Colors.accent} />
        <Text style={styles.bannerBadgeText}>SELECT GAME TYPE</Text>
      </View>
      <Text style={styles.marketTitle}>{market.name}</Text>
      <View style={styles.timingsRow}>
        <View style={styles.timeItem}>
          <Text style={styles.timingLabel}>Open Time</Text>
          <Text style={styles.timingValue}>{market.openTime}</Text>
        </View>
        <View style={styles.timeDivider} />
        <View style={styles.timeItem}>
          <Text style={styles.timingLabel}>Close Time</Text>
          <Text style={styles.timingValue}>{market.closeTime}</Text>
        </View>
      </View>
      <View style={styles.resultPill}>
        <Text style={styles.resultLabel}>LIVE RESULT: </Text>
        <Text style={styles.resultText}>{market.result}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={market.name}
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <FlatList
        data={gameTypeOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameTypeGridItem item={item} onPress={handleGameTypeSelect} />
        )}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  marketBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
    marginBottom: Spacing.sm,
  },
  bannerBadgeText: {
    fontSize: Typography.fontSizes.xxs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  marketTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  timingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: 16,
  },
  timeItem: {
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.primaryMutedDark,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeights.semibold,
  },
  timingValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
    marginTop: 2,
  },
  timeDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  resultLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textLight,
    fontWeight: Typography.fontWeights.semibold,
  },
  resultText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
});
