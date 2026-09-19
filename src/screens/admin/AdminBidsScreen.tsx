import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin, ExtendedBidItem } from '../../context/AdminContext';

interface AdminBidsScreenProps {
  navigation: any;
}

export const AdminBidsScreen: React.FC<AdminBidsScreenProps> = ({
  navigation,
}) => {
  const { bids, markets } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBids = bids.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (selectedMarketFilter !== 'all' && b.marketId !== selectedMarketFilter)
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesDigit = b.digit.includes(q);
      const matchesUser = b.userName.toLowerCase().includes(q);
      const matchesMarket = b.marketName.toLowerCase().includes(q);
      if (!matchesDigit && !matchesUser && !matchesMarket) return false;
    }

    return true;
  });

  const totalPoints = filteredBids.reduce((sum, b) => sum + b.points, 0);
  const totalPayout = filteredBids
    .filter((b) => b.status === 'won')
    .reduce((sum, b) => sum + (b.winAmount || 0), 0);

  const renderBidItem = ({ item }: { item: ExtendedBidItem }) => {
    const getStatusStyle = () => {
      switch (item.status) {
        case 'won':
          return { bg: Colors.successLight, text: Colors.success, label: 'WON' };
        case 'lost':
          return { bg: Colors.errorLight, text: Colors.error, label: 'LOST' };
        default:
          return { bg: Colors.warningLight, text: Colors.warning, label: 'PENDING' };
      }
    };

    const statusStyle = getStatusStyle();

    return (
      <View style={styles.bidCard}>
        <View style={styles.cardHeader}>
          <View style={styles.marketInfo}>
            <Text style={styles.marketName}>{item.marketName}</Text>
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionBadgeText}>
                {item.session.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>GAME TYPE</Text>
              <Text style={styles.detailVal}>{item.gameTypeTitle}</Text>
            </View>

            <View style={styles.detailColCenter}>
              <Text style={styles.detailLabel}>DIGIT / PANA</Text>
              <View style={styles.digitBox}>
                <Text style={styles.digitText}>{item.digit}</Text>
              </View>
            </View>

            <View style={styles.detailColRight}>
              <Text style={styles.detailLabel}>POINTS PLAYED</Text>
              <Text style={styles.pointsVal}>₹ {item.points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.userRow}>
            <AppIcon name="user" size={12} color={Colors.textSecondary} />
            <Text style={styles.userNameText}>
              {item.userName} ({item.userMobile})
            </Text>
          </View>

          {item.winAmount ? (
            <Text style={styles.winAmountText}>
              Won: ₹ {item.winAmount.toLocaleString()}
            </Text>
          ) : (
            <Text style={styles.dateText}>{item.date}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Live Bids Ledger"
        subtitle={`Total recorded bets: ${bids.length}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Summary Header */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Bets</Text>
          <Text style={styles.summaryVal}>{filteredBids.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Points</Text>
          <Text style={[styles.summaryVal, { color: Colors.primary }]}>
            ₹ {totalPoints.toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Paid Out</Text>
          <Text style={[styles.summaryVal, { color: Colors.error }]}>
            ₹ {totalPayout.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Status Filters */}
      <View style={styles.filterTabs}>
        {(['all', 'pending', 'won', 'lost'] as const).map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.filterTab, statusFilter === st && styles.filterTabActive]}
            onPress={() => setStatusFilter(st)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterTabText,
                statusFilter === st && styles.filterTabTextActive,
              ]}>
              {st.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Market Selector Scroll */}
      <View style={styles.marketFilterScroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}>
          <TouchableOpacity
            style={[
              styles.marketChip,
              selectedMarketFilter === 'all' && styles.marketChipActive,
            ]}
            onPress={() => setSelectedMarketFilter('all')}>
            <Text
              style={[
                styles.marketChipText,
                selectedMarketFilter === 'all' && styles.marketChipTextActive,
              ]}>
              All Markets
            </Text>
          </TouchableOpacity>

          {markets.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.marketChip,
                selectedMarketFilter === m.id && styles.marketChipActive,
              ]}
              onPress={() => setSelectedMarketFilter(m.id)}>
              <Text
                style={[
                  styles.marketChipText,
                  selectedMarketFilter === m.id && styles.marketChipTextActive,
                ]}>
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AppIcon name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search digit, user, or market..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon name="close" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Bids List */}
      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.id}
        renderItem={renderBidItem}
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
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textMuted,
  },
  summaryVal: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    padding: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: Colors.surfaceSubtle,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.textLight,
    fontWeight: Typography.fontWeights.bold,
  },
  marketFilterScroll: {
    paddingVertical: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  marketChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  marketChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  marketChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
  marketChipTextActive: {
    color: Colors.textLight,
    fontWeight: Typography.fontWeights.bold,
  },
  searchContainer: {
    padding: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    gap: 8,
  },
  bidCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  marketName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  sessionBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sessionBadgeText: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
  },
  cardBody: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailCol: {
    flex: 1,
  },
  detailColCenter: {
    alignItems: 'center',
    flex: 1,
  },
  detailColRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailVal: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  digitBox: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  digitText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: '#e65100',
  },
  pointsVal: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userNameText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
  },
  winAmountText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.success,
  },
  dateText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
