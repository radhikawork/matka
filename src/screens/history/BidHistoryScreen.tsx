import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { mockBids } from '../../mocks/bidsData';
import { mockUser } from '../../mocks/userData';
import { BidItem } from '../../types';

interface BidHistoryScreenProps {
  navigation: any;
}

export const BidHistoryScreen: React.FC<BidHistoryScreenProps> = ({
  navigation,
}) => {
  const [filter, setFilter] = useState<'all' | 'won' | 'pending' | 'lost'>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const filteredBids = mockBids.filter((bid) => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const renderBidItem = ({ item }: { item: BidItem }) => (
    <View style={[styles.bidCard, Shadows.sm]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.marketTitle}>{item.marketName}</Text>
          <Text style={styles.gameTypeSubtitle}>
            {item.gameTypeTitle} ({item.session.toUpperCase()})
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Chosen Digit</Text>
          <Text style={styles.detailValue}>{item.digit}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Bid Points</Text>
          <Text style={[styles.detailValue, { color: Colors.primaryDark }]}>
            ₹ {item.points}
          </Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>
            {item.status === 'won' ? 'Win Amount' : 'Date'}
          </Text>
          <Text
            style={[
              styles.detailValue,
              item.status === 'won' ? { color: Colors.successDark } : null,
            ]}>
            {item.status === 'won' ? `+₹${item.winAmount}` : item.date}
          </Text>
        </View>
      </View>
    </View>
  );

  const filterTabs = [
    { key: 'all', label: 'All Bids' },
    { key: 'won', label: 'Won' },
    { key: 'pending', label: 'Pending' },
    { key: 'lost', label: 'Lost' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Bid History"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              filter === tab.key ? styles.tabActive : null,
            ]}
            onPress={() => setFilter(tab.key as any)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.tabText,
                filter === tab.key ? styles.tabTextActive : null,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.id}
        renderItem={renderBidItem}
        ListEmptyComponent={
          <EmptyState
            icon="bids"
            title="No Bids Found"
            description="You haven't placed any bids matching the selected filter."
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
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textLight,
  },
  bidCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  marketTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  gameTypeSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  detailBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeights.semibold,
  },
  detailValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
});
