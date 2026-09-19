import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';
import { MarketItem, StarlineSlot } from '../../types';

interface AdminMarketsScreenProps {
  navigation: any;
}

export const AdminMarketsScreen: React.FC<AdminMarketsScreenProps> = ({
  navigation,
}) => {
  const {
    markets,
    starlineSlots,
    addMarket,
    updateMarket,
    deleteMarket,
    toggleMarketStatus,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'regular' | 'starline'>('regular');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMarket, setEditingMarket] = useState<MarketItem | null>(null);
  const [marketName, setMarketName] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [isOpenForBidding, setIsOpenForBidding] = useState(true);

  const openAddModal = () => {
    setEditingMarket(null);
    setMarketName('');
    setOpenTime('10:00 AM');
    setCloseTime('12:00 PM');
    setIsOpenForBidding(true);
    setModalVisible(true);
  };

  const openEditModal = (market: MarketItem) => {
    setEditingMarket(market);
    setMarketName(market.name);
    setOpenTime(market.openTime);
    setCloseTime(market.closeTime);
    setIsOpenForBidding(market.isOpen);
    setModalVisible(true);
  };

  const handleSaveMarket = () => {
    if (!marketName.trim() || !openTime.trim() || !closeTime.trim()) {
      Alert.alert('Validation Error', 'Please enter Market Name, Open Time, and Close Time.');
      return;
    }

    if (editingMarket) {
      updateMarket(editingMarket.id, {
        name: marketName.trim().toUpperCase(),
        openTime: openTime.trim(),
        closeTime: closeTime.trim(),
        isOpen: isOpenForBidding,
        statusText: isOpenForBidding ? 'Running for Open' : 'Closed for Today',
      });
      Alert.alert('Success', `Market ${marketName} updated successfully!`);
    } else {
      addMarket({
        name: marketName.trim().toUpperCase(),
        openTime: openTime.trim(),
        closeTime: closeTime.trim(),
        result: '***-**-***',
        isOpen: isOpenForBidding,
        isClosedForDay: false,
        statusText: isOpenForBidding ? 'Running for Open' : 'Closed for Today',
      });
      Alert.alert('Success', `New market ${marketName} added successfully!`);
    }

    setModalVisible(false);
  };

  const handleDelete = (market: MarketItem) => {
    Alert.alert(
      'Delete Market',
      `Are you sure you want to permanently delete "${market.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMarket(market.id),
        },
      ],
    );
  };

  const filteredMarkets = markets.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStarline = starlineSlots.filter((s) =>
    s.timeSlot.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderMarketItem = ({ item }: { item: MarketItem }) => (
    <View style={styles.marketCard}>
      <View style={styles.cardHeader}>
        <View style={styles.marketTitleRow}>
          <Text style={styles.marketName}>{item.name}</Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: item.isOpen ? Colors.successLight : Colors.errorLight },
            ]}>
            <Text
              style={[
                styles.statusPillText,
                { color: item.isOpen ? Colors.success : Colors.error },
              ]}>
              {item.isOpen ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
        </View>

        <View style={styles.actionIconsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}>
            <AppIcon name="edit" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: Colors.errorLight }]}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}>
            <AppIcon name="delete" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.timingRow}>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>OPEN TIME</Text>
            <Text style={styles.timingValue}>{item.openTime}</Text>
          </View>
          <View style={styles.timingDivider} />
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>CLOSE TIME</Text>
            <Text style={styles.timingValue}>{item.closeTime}</Text>
          </View>
          <View style={styles.timingDivider} />
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>CURRENT RESULT</Text>
            <Text style={styles.resultValue}>{item.result}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            { backgroundColor: item.isOpen ? '#ffebee' : '#e8f5e9' },
          ]}
          onPress={() => toggleMarketStatus(item.id)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.toggleBtnText,
              { color: item.isOpen ? Colors.error : Colors.success },
            ]}>
            {item.isOpen ? 'Set as Closed' : 'Set as Open'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declareBtn}
          onPress={() =>
            navigation.navigate('AdminDeclareResult', { marketId: item.id })
          }
          activeOpacity={0.7}>
          <AppIcon name="calculator" size={14} color={Colors.textLight} />
          <Text style={styles.declareBtnText}>Declare Result</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStarlineItem = ({ item }: { item: StarlineSlot }) => (
    <View style={styles.marketCard}>
      <View style={styles.cardHeader}>
        <View style={styles.marketTitleRow}>
          <Text style={styles.marketName}>STARLINE - {item.timeSlot}</Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: item.isOpen ? Colors.successLight : Colors.errorLight },
            ]}>
            <Text
              style={[
                styles.statusPillText,
                { color: item.isOpen ? Colors.success : Colors.error },
              ]}>
              {item.isOpen ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.timingRow}>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>OPEN TIME</Text>
            <Text style={styles.timingValue}>{item.openTime}</Text>
          </View>
          <View style={styles.timingDivider} />
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>CLOSE TIME</Text>
            <Text style={styles.timingValue}>{item.closeTime}</Text>
          </View>
          <View style={styles.timingDivider} />
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>RESULT</Text>
            <Text style={styles.resultValue}>{item.result}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.declareBtn}
          onPress={() =>
            navigation.navigate('AdminDeclareResult', {
              marketId: item.id,
              isStarline: true,
            })
          }
          activeOpacity={0.7}>
          <AppIcon name="calculator" size={14} color={Colors.textLight} />
          <Text style={styles.declareBtnText}>Declare Starline Result</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Market Management"
        subtitle="Manage regular markets & starline slots"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onUserAppPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'MainDrawer' }] })
        }
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'regular' && styles.tabItemActive]}
          onPress={() => setActiveTab('regular')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'regular' && styles.tabTextActive,
            ]}>
            Regular Markets ({markets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'starline' && styles.tabItemActive]}
          onPress={() => setActiveTab('starline')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'starline' && styles.tabTextActive,
            ]}>
            Starline Slots ({starlineSlots.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search & Add Bar */}
      <View style={styles.topControlRow}>
        <View style={styles.searchBox}>
          <AppIcon name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'regular'
                ? 'Search market name...'
                : 'Search slot time...'
            }
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

        {activeTab === 'regular' && (
          <TouchableOpacity
            style={styles.addMarketBtn}
            onPress={openAddModal}
            activeOpacity={0.8}>
            <AppIcon name="plus" size={16} color={Colors.textLight} />
            <Text style={styles.addMarketBtnText}>Add Market</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Market List */}
      {activeTab === 'regular' ? (
        <FlatList
          data={filteredMarkets}
          keyExtractor={(item) => item.id}
          renderItem={renderMarketItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredStarline}
          keyExtractor={(item) => item.id}
          renderItem={renderStarlineItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMarket ? 'Edit Market Details' : 'Add New Market'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}>
                <AppIcon name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>MARKET NAME</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. GOA DAY"
                placeholderTextColor={Colors.textMuted}
                value={marketName}
                onChangeText={setMarketName}
                autoCapitalize="characters"
              />

              <View style={styles.inputRow}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>OPEN TIME</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g. 10:00 AM"
                    placeholderTextColor={Colors.textMuted}
                    value={openTime}
                    onChangeText={setOpenTime}
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>CLOSE TIME</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g. 12:00 PM"
                    placeholderTextColor={Colors.textMuted}
                    value={closeTime}
                    onChangeText={setCloseTime}
                  />
                </View>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Open for Active Bidding</Text>
                <Switch
                  value={isOpenForBidding}
                  onValueChange={setIsOpenForBidding}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={isOpenForBidding ? Colors.primary : '#f4f3f4'}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveMarket}
                activeOpacity={0.8}>
                <Text style={styles.modalSaveBtnText}>
                  {editingMarket ? 'Update Market' : 'Save Market'}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
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
  addMarketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    gap: 4,
  },
  addMarketBtnText: {
    color: Colors.textLight,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  marketCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  marketName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.bold,
  },
  actionIconsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timingItem: {
    flex: 1,
    alignItems: 'center',
  },
  timingDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  timingLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  timingValue: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  resultValue: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.bold,
    color: '#e65100',
    letterSpacing: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
  },
  declareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  declareBtnText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceSubtle,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: 4,
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  switchLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textPrimary,
  },
  modalFooter: {
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
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
});
