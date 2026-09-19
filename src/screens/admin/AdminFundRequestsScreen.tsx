import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';
import { FundRequestItem, TransactionItem } from '../../types';

interface AdminFundRequestsScreenProps {
  navigation: any;
}

export const AdminFundRequestsScreen: React.FC<AdminFundRequestsScreenProps> = ({
  navigation,
}) => {
  const {
    fundRequests,
    transactions,
    approveFundRequest,
    rejectFundRequest,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'transactions'>('deposits');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const depositRequests = fundRequests.filter(
    (r) => r.type === 'deposit' && (statusFilter === 'all' || r.status === statusFilter),
  );

  const withdrawalRequests = fundRequests.filter(
    (r) => r.type === 'withdrawal' && (statusFilter === 'all' || r.status === statusFilter),
  );

  const pendingDepositsCount = fundRequests.filter(
    (r) => r.type === 'deposit' && r.status === 'pending',
  ).length;

  const pendingWithdrawalsCount = fundRequests.filter(
    (r) => r.type === 'withdrawal' && r.status === 'pending',
  ).length;

  const handleApproveDeposit = (item: FundRequestItem) => {
    Alert.alert(
      'Approve Deposit',
      `Confirm credit of ₹${item.amount.toLocaleString()} to ${item.userName}'s wallet?\n\nRef: ${item.referenceNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Credit',
          style: 'default',
          onPress: () => {
            approveFundRequest(item.id);
            Alert.alert('Success', `₹${item.amount} credited to ${item.userName}`);
          },
        },
      ],
    );
  };

  const handleRejectDeposit = (item: FundRequestItem) => {
    Alert.alert(
      'Reject Deposit',
      `Are you sure you want to reject this deposit request from ${item.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject Request',
          style: 'destructive',
          onPress: () => {
            rejectFundRequest(item.id, 'Deposit reference verification failed');
            Alert.alert('Deposit Rejected', 'Request has been marked as rejected.');
          },
        },
      ],
    );
  };

  const handleApproveWithdrawal = (item: FundRequestItem) => {
    Alert.alert(
      'Process & Approve Withdrawal',
      `Have you transferred ₹${item.amount.toLocaleString()} to:\n\n${item.paymentDetails}\n\nHolder: ${item.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Transferred',
          style: 'default',
          onPress: () => {
            approveFundRequest(item.id);
            Alert.alert(
              'Withdrawal Completed',
              `Withdrawal marked as successfully transferred.`,
            );
          },
        },
      ],
    );
  };

  const handleRejectWithdrawal = (item: FundRequestItem) => {
    Alert.alert(
      'Reject & Refund Withdrawal',
      `Are you sure you want to reject this withdrawal? ₹${item.amount.toLocaleString()} will be refunded back to ${item.userName}'s wallet immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject & Refund',
          style: 'destructive',
          onPress: () => {
            rejectFundRequest(item.id, 'Incorrect bank/UPI details');
            Alert.alert(
              'Withdrawal Rejected',
              `Request rejected and ₹${item.amount} refunded to user wallet.`,
            );
          },
        },
      ],
    );
  };

  const renderDepositCard = ({ item }: { item: FundRequestItem }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userLeft}>
          <View style={[styles.avatarCircle, { backgroundColor: Colors.successLight }]}>
            <AppIcon name="plus" size={14} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userSub}>{item.userMobile}</Text>
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={[styles.amountText, { color: Colors.success }]}>
            + ₹ {item.amount.toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  item.status === 'approved'
                    ? Colors.successLight
                    : item.status === 'rejected'
                    ? Colors.errorLight
                    : Colors.warningLight,
              },
            ]}>
            <Text
              style={[
                styles.statusPillText,
                {
                  color:
                    item.status === 'approved'
                      ? Colors.success
                      : item.status === 'rejected'
                      ? Colors.error
                      : Colors.warning,
                },
              ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>
          Method: <Text style={styles.boldText}>{item.paymentMethod}</Text>
        </Text>
        <Text style={styles.detailText}>
          Reference/UTR: <Text style={styles.boldText}>{item.referenceNumber}</Text>
        </Text>
        <Text style={styles.timeText}>
          Requested: {item.requestDate} at {item.requestTime}
        </Text>
        {item.remarks ? (
          <Text style={styles.remarksText}>Note: {item.remarks}</Text>
        ) : null}
      </View>

      {item.status === 'pending' && (
        <View style={styles.cardActionRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleRejectDeposit(item)}
            activeOpacity={0.8}>
            <AppIcon name="close" size={14} color={Colors.error} />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleApproveDeposit(item)}
            activeOpacity={0.8}>
            <AppIcon name="check" size={14} color={Colors.textLight} />
            <Text style={styles.approveBtnText}>Approve & Credit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderWithdrawalCard = ({ item }: { item: FundRequestItem }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userLeft}>
          <View style={[styles.avatarCircle, { backgroundColor: Colors.errorLight }]}>
            <AppIcon name="minus" size={14} color={Colors.error} />
          </View>
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userSub}>{item.userMobile}</Text>
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={[styles.amountText, { color: Colors.error }]}>
            - ₹ {item.amount.toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  item.status === 'approved'
                    ? Colors.successLight
                    : item.status === 'rejected'
                    ? Colors.errorLight
                    : Colors.warningLight,
              },
            ]}>
            <Text
              style={[
                styles.statusPillText,
                {
                  color:
                    item.status === 'approved'
                      ? Colors.success
                      : item.status === 'rejected'
                      ? Colors.error
                      : Colors.warning,
                },
              ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>
          Transfer Via: <Text style={styles.boldText}>{item.paymentMethod}</Text>
        </Text>
        <Text style={styles.detailText}>
          A/C or UPI: <Text style={styles.boldText}>{item.paymentDetails}</Text>
        </Text>
        <Text style={styles.timeText}>
          Requested: {item.requestDate} at {item.requestTime}
        </Text>
        {item.remarks ? (
          <Text style={styles.remarksText}>Note: {item.remarks}</Text>
        ) : null}
      </View>

      {item.status === 'pending' && (
        <View style={styles.cardActionRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleRejectWithdrawal(item)}
            activeOpacity={0.8}>
            <AppIcon name="close" size={14} color={Colors.error} />
            <Text style={styles.rejectBtnText}>Reject & Refund</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleApproveWithdrawal(item)}
            activeOpacity={0.8}>
            <AppIcon name="check" size={14} color={Colors.textLight} />
            <Text style={styles.approveBtnText}>Approve & Mark Paid</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderTransactionCard = ({ item }: { item: TransactionItem }) => (
    <View style={styles.txCard}>
      <View style={styles.txTopRow}>
        <View>
          <Text style={styles.txTitle}>{item.title}</Text>
          <Text style={styles.txDescription}>{item.description}</Text>
        </View>
        <Text
          style={[
            styles.txAmount,
            { color: item.amount >= 0 ? Colors.success : Colors.error },
          ]}>
          {item.amount >= 0 ? `+ ₹${item.amount}` : `- ₹${Math.abs(item.amount)}`}
        </Text>
      </View>
      <View style={styles.txBottomRow}>
        <Text style={styles.txMeta}>Ref: {item.txNumber}</Text>
        <Text style={styles.txMeta}>
          {item.date} {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Fund Requests"
        subtitle="Manage deposits, withdrawals & ledger"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Main Tabs */}
      <View style={styles.mainTabs}>
        <TouchableOpacity
          style={[styles.mainTab, activeTab === 'deposits' && styles.mainTabActive]}
          onPress={() => setActiveTab('deposits')}
          activeOpacity={0.7}>
          <View style={styles.tabBadgeRow}>
            <Text
              style={[
                styles.mainTabText,
                activeTab === 'deposits' && styles.mainTabTextActive,
              ]}>
              Deposits
            </Text>
            {pendingDepositsCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{pendingDepositsCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === 'withdrawals' && styles.mainTabActive,
          ]}
          onPress={() => setActiveTab('withdrawals')}
          activeOpacity={0.7}>
          <View style={styles.tabBadgeRow}>
            <Text
              style={[
                styles.mainTabText,
                activeTab === 'withdrawals' && styles.mainTabTextActive,
              ]}>
              Withdrawals
            </Text>
            {pendingWithdrawalsCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{pendingWithdrawalsCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === 'transactions' && styles.mainTabActive,
          ]}
          onPress={() => setActiveTab('transactions')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.mainTabText,
              activeTab === 'transactions' && styles.mainTabTextActive,
            ]}>
            Ledger ({transactions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sub-status filters for Requests */}
      {activeTab !== 'transactions' && (
        <View style={styles.subFilterBar}>
          {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.subFilterChip,
                statusFilter === st && styles.subFilterChipActive,
              ]}
              onPress={() => setStatusFilter(st)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.subFilterText,
                  statusFilter === st && styles.subFilterTextActive,
                ]}>
                {st.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lists */}
      {activeTab === 'deposits' && (
        <FlatList
          data={depositRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderDepositCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {statusFilter} deposit requests.</Text>
            </View>
          }
        />
      )}

      {activeTab === 'withdrawals' && (
        <FlatList
          data={withdrawalRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderWithdrawalCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {statusFilter} withdrawal requests.
              </Text>
            </View>
          }
        />
      )}

      {activeTab === 'transactions' && (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  mainTabActive: {
    borderBottomColor: Colors.primary,
  },
  tabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainTabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textSecondary,
  },
  mainTabTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  badgeCount: {
    backgroundColor: Colors.error,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeCountText: {
    color: Colors.textLight,
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
  },
  subFilterBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    padding: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  subFilterChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subFilterChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  subFilterText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  subFilterTextActive: {
    color: Colors.textLight,
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
    gap: 10,
  },
  requestCard: {
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
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  userSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
  },
  cardDetails: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
    gap: 2,
  },
  detailText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  remarksText: {
    fontSize: 10,
    color: Colors.error,
    fontStyle: 'italic',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  rejectBtnText: {
    color: Colors.error,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  approveBtnText: {
    color: Colors.textLight,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  txCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  txDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  txAmount: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  txBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  txMeta: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSizes.sm,
  },
});
