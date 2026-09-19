import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { EmptyState } from '../../components/common/EmptyState';
import { AppIcon } from '../../components/common/AppIcon';
import { mockBids } from '../../mocks/bidsData';
import { mockUser } from '../../mocks/userData';
import { BidItem } from '../../types';

interface WinHistoryScreenProps {
  navigation: any;
}

export const WinHistoryScreen: React.FC<WinHistoryScreenProps> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const winningBids = mockBids.filter((bid) => bid.status === 'won');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const totalWonAmount = winningBids.reduce(
    (sum, item) => sum + (item.winAmount || 0),
    0,
  );

  const renderItem = ({ item }: { item: BidItem }) => (
    <View style={[styles.winCard, Shadows.sm]}>
      <View style={styles.topRow}>
        <View style={styles.trophyWrapper}>
          <AppIcon name="trophy" size={20} color={Colors.accent} />
        </View>
        <View style={styles.titleInfo}>
          <Text style={styles.marketName}>{item.marketName}</Text>
          <Text style={styles.gameType}>{item.gameTypeTitle}</Text>
        </View>
        <View style={styles.winBadge}>
          <Text style={styles.winAmountText}>+₹{item.winAmount?.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <Text style={styles.infoText}>
          Digit: <Text style={styles.boldText}>{item.digit}</Text>
        </Text>
        <Text style={styles.infoText}>
          Points: <Text style={styles.boldText}>₹{item.points}</Text>
        </Text>
        <Text style={styles.infoText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Win History"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <FlatList
        data={winningBids}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={[styles.heroHeader, Shadows.md]}>
            <View style={styles.trophyCircle}>
              <AppIcon name="trophy" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.heroTitle}>TOTAL WINNINGS</Text>
            <Text style={styles.heroAmount}>₹ {totalWonAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.heroSubtitle}>
              Total {winningBids.length} Winning Bids Credited Instantly
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="trophy"
            title="No Winnings Yet"
            description="Play live games now to win exciting instant payouts!"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
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
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroHeader: {
    backgroundColor: '#14532d',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  trophyCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: Typography.fontSizes.xs,
    color: '#86efac',
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
  },
  heroAmount: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textLight,
    marginTop: 4,
    fontWeight: Typography.fontWeights.medium,
  },
  winCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  titleInfo: {
    flex: 1,
  },
  marketName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  gameType: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  winBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  winAmountText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.successDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
});
