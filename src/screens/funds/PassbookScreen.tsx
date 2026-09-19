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
import { AppIcon } from '../../components/common/AppIcon';
import { mockTransactions } from '../../mocks/transactionsData';
import { mockUser } from '../../mocks/userData';
import { TransactionItem } from '../../types';

interface PassbookScreenProps {
  navigation: any;
}

export const PassbookScreen: React.FC<PassbookScreenProps> = ({ navigation }) => {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bid'>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return tx.type === 'deposit';
    if (filter === 'withdrawal') return tx.type === 'withdrawal';
    if (filter === 'bid') return tx.type === 'bid_placed' || tx.type === 'bid_won';
    return true;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => {
    const isCredit = item.amount > 0;
    return (
      <View style={[styles.txCard, Shadows.sm]}>
        <View style={styles.leftCol}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isCredit ? Colors.successLight : Colors.errorLight,
              },
            ]}>
            <AppIcon
              name={isCredit ? 'plus' : 'minus'}
              size={15}
              color={isCredit ? Colors.successDark : Colors.errorDark}
            />
          </View>
          <View style={styles.txDetails}>
            <Text style={styles.txTitle}>{item.title}</Text>
            <Text style={styles.txDesc} numberOfLines={1}>
              {item.description}
            </Text>
            <Text style={styles.txId}>Ref: {item.txNumber}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text
            style={[
              styles.amountText,
              { color: isCredit ? Colors.successDark : Colors.errorDark },
            ]}>
            {isCredit ? '+' : '-'}₹{Math.abs(item.amount).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.timeText}>
            {item.date} • {item.time}
          </Text>
          <StatusBadge status={item.status} style={styles.statusBadge} />
        </View>
      </View>
    );
  };

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'deposit', label: 'Deposits' },
    { key: 'withdrawal', label: 'Withdrawals' },
    { key: 'bid', label: 'Bids / Wins' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Passbook & History"
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
              styles.filterTab,
              filter === tab.key ? styles.filterTabActive : null,
            ]}
            onPress={() => setFilter(tab.key as any)}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterTabText,
                filter === tab.key ? styles.filterTabTextActive : null,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListEmptyComponent={
          <EmptyState
            icon="passbook"
            title="No Transactions Found"
            description="You don't have any transaction records in this category."
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
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.textLight,
  },
  txCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  txDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  txId: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.heavy,
  },
  timeText: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-end',
  },
});
