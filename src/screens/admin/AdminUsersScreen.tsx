import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';
import { AdminUserItem } from '../../types';

interface AdminUsersScreenProps {
  navigation: any;
}

export const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({
  navigation,
}) => {
  const { users, adjustUserBalance, toggleUserStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Balance Adjust Modal
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (statusFilter === 'all') return true;
    return u.status === statusFilter;
  });

  const openUserDetails = (user: AdminUserItem) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const openBalanceModal = (type: 'credit' | 'debit') => {
    setAdjustType(type);
    setAdjustAmount('');
    setAdjustReason('');
    setBalanceModalVisible(true);
  };

  const handleAdjustBalance = () => {
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (!selectedUser) return;

    adjustUserBalance(
      selectedUser.id,
      amt,
      adjustType,
      adjustReason || `Manual ${adjustType} by admin`,
    );

    Alert.alert(
      'Success',
      `₹${amt} successfully ${
        adjustType === 'credit' ? 'credited to' : 'debited from'
      } ${selectedUser.name}'s wallet!`,
    );

    setBalanceModalVisible(false);

    // Update selectedUser local state
    setSelectedUser((prev) =>
      prev
        ? {
            ...prev,
            walletBalance:
              adjustType === 'credit'
                ? prev.walletBalance + amt
                : Math.max(0, prev.walletBalance - amt),
          }
        : null,
    );
  };

  const handleToggleBlock = () => {
    if (!selectedUser) return;

    const actionText = selectedUser.status === 'active' ? 'Block' : 'Unblock';
    Alert.alert(
      `${actionText} User`,
      `Are you sure you want to ${actionText.toLowerCase()} ${selectedUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText,
          style: selectedUser.status === 'active' ? 'destructive' : 'default',
          onPress: () => {
            toggleUserStatus(selectedUser.id);
            setSelectedUser((prev) =>
              prev
                ? {
                    ...prev,
                    status: prev.status === 'active' ? 'blocked' : 'active',
                  }
                : null,
            );
          },
        },
      ],
    );
  };

  const renderUserCard = ({ item }: { item: AdminUserItem }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => openUserDetails(item)}
      activeOpacity={0.7}>
      <View style={styles.cardTopRow}>
        <View style={styles.userAvatar}>
          <AppIcon name="user" size={20} color={Colors.primary} />
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'active'
                      ? Colors.successLight
                      : Colors.errorLight,
                },
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === 'active' ? Colors.success : Colors.error,
                  },
                ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.userMobile}>{item.mobile}</Text>
        </View>

        <View style={styles.walletBox}>
          <Text style={styles.walletLabel}>WALLET</Text>
          <Text style={styles.walletAmount}>
            ₹ {item.walletBalance.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottomRow}>
        <Text style={styles.metaText}>Joined: {item.joinedDate}</Text>
        <Text style={styles.metaText}>
          Bets: {item.totalBidsCount} | Won: ₹{item.totalWonAmount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="User Management"
        subtitle={`Total registered users: ${users.length}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, statusFilter === 'all' && styles.filterTabActive]}
          onPress={() => setStatusFilter('all')}>
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'all' && styles.filterTabTextActive,
            ]}>
            All ({users.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === 'active' && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter('active')}>
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'active' && styles.filterTabTextActive,
            ]}>
            Active ({users.filter((u) => u.status === 'active').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            statusFilter === 'blocked' && styles.filterTabActive,
          ]}
          onPress={() => setStatusFilter('blocked')}>
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'blocked' && styles.filterTabTextActive,
            ]}>
            Blocked ({users.filter((u) => u.status === 'blocked').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AppIcon name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, mobile, or ID..."
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

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* User Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.userModalCard}>
            {selectedUser && (
              <>
                <View style={styles.userModalHeader}>
                  <View>
                    <Text style={styles.userModalTitle}>{selectedUser.name}</Text>
                    <Text style={styles.userModalSub}>{selectedUser.mobile}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseBtn}>
                    <AppIcon name="close" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.userModalBody}
                  showsVerticalScrollIndicator={false}>
                  {/* Balance Card */}
                  <View style={styles.detailBalanceCard}>
                    <View>
                      <Text style={styles.detailBalanceLabel}>
                        CURRENT WALLET BALANCE
                      </Text>
                      <Text style={styles.detailBalanceAmount}>
                        ₹ {selectedUser.walletBalance.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.balanceActionsRow}>
                      <TouchableOpacity
                        style={styles.creditBtn}
                        onPress={() => openBalanceModal('credit')}
                        activeOpacity={0.8}>
                        <AppIcon name="plus" size={14} color={Colors.textLight} />
                        <Text style={styles.btnText}>Credit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.debitBtn}
                        onPress={() => openBalanceModal('debit')}
                        activeOpacity={0.8}>
                        <AppIcon name="minus" size={14} color={Colors.textLight} />
                        <Text style={styles.btnText}>Debit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Bank & UPI Info */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionHeaderTitle}>
                      PAYMENT & BANK DETAILS
                    </Text>

                    {selectedUser.bankDetails ? (
                      <View style={styles.infoBox}>
                        <Text style={styles.infoRowTitle}>
                          Bank: {selectedUser.bankDetails.bankName}
                        </Text>
                        <Text style={styles.infoRowSub}>
                          A/C: {selectedUser.bankDetails.accountNumber}
                        </Text>
                        <Text style={styles.infoRowSub}>
                          IFSC: {selectedUser.bankDetails.ifscCode}
                        </Text>
                        <Text style={styles.infoRowSub}>
                          Holder: {selectedUser.bankDetails.accountHolderName}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.emptyNote}>
                        No bank details added yet.
                      </Text>
                    )}

                    {selectedUser.upiDetails ? (
                      <View style={[styles.infoBox, { marginTop: 8 }]}>
                        <Text style={styles.infoRowTitle}>UPI Information</Text>
                        {selectedUser.upiDetails.upiId && (
                          <Text style={styles.infoRowSub}>
                            UPI ID: {selectedUser.upiDetails.upiId}
                          </Text>
                        )}
                        {selectedUser.upiDetails.phonePe && (
                          <Text style={styles.infoRowSub}>
                            PhonePe: {selectedUser.upiDetails.phonePe}
                          </Text>
                        )}
                        {selectedUser.upiDetails.googlePay && (
                          <Text style={styles.infoRowSub}>
                            Google Pay: {selectedUser.upiDetails.googlePay}
                          </Text>
                        )}
                      </View>
                    ) : null}
                  </View>

                  {/* Account Security & Actions */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionHeaderTitle}>ACCOUNT STATUS</Text>

                    <TouchableOpacity
                      style={[
                        styles.blockActionBtn,
                        {
                          backgroundColor:
                            selectedUser.status === 'active'
                              ? '#ffebee'
                              : '#e8f5e9',
                        },
                      ]}
                      onPress={handleToggleBlock}
                      activeOpacity={0.8}>
                      <AppIcon
                        name={selectedUser.status === 'active' ? 'lock' : 'check'}
                        size={16}
                        color={
                          selectedUser.status === 'active'
                            ? Colors.error
                            : Colors.success
                        }
                      />
                      <Text
                        style={[
                          styles.blockActionBtnText,
                          {
                            color:
                              selectedUser.status === 'active'
                                ? Colors.error
                                : Colors.success,
                          },
                        ]}>
                        {selectedUser.status === 'active'
                          ? 'Block User Account'
                          : 'Unblock User Account'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Credit / Debit Modal */}
      <Modal
        visible={balanceModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBalanceModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.adjustModalCard}>
            <View style={styles.adjustModalHeader}>
              <Text style={styles.adjustModalTitle}>
                {adjustType === 'credit'
                  ? 'Credit Wallet Balance'
                  : 'Debit Wallet Balance'}
              </Text>
              <TouchableOpacity onPress={() => setBalanceModalVisible(false)}>
                <AppIcon name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.adjustModalBody}>
              <Text style={styles.inputLabel}>AMOUNT (₹)</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. 500"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                value={adjustAmount}
                onChangeText={setAdjustAmount}
              />

              <Text style={styles.inputLabel}>REASON / REMARK</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. Bonus, Manual Recharge, Correction"
                placeholderTextColor={Colors.textMuted}
                value={adjustReason}
                onChangeText={setAdjustReason}
              />
            </View>

            <View style={styles.adjustModalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setBalanceModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  {
                    backgroundColor:
                      adjustType === 'credit' ? Colors.success : Colors.error,
                  },
                ]}
                onPress={handleAdjustBalance}>
                <Text style={styles.modalConfirmBtnText}>
                  {adjustType === 'credit' ? 'Confirm Credit' : 'Confirm Debit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  searchContainer: {
    padding: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  userCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
  },
  userMobile: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  walletBox: {
    alignItems: 'flex-end',
  },
  walletLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textMuted,
  },
  walletAmount: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  userModalCard: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  userModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  userModalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  userModalSub: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  userModalBody: {
    padding: 16,
  },
  detailBalanceCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailBalanceLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryMutedDark,
  },
  detailBalanceAmount: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.accent,
    marginTop: 2,
  },
  balanceActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  creditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  debitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  btnText: {
    color: Colors.textLight,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRowTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoRowSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyNote: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  blockActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  blockActionBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  adjustModalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    margin: 20,
    overflow: 'hidden',
  },
  adjustModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  adjustModalTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  adjustModalBody: {
    padding: 16,
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  inputField: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  adjustModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  modalConfirmBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirmBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
});
