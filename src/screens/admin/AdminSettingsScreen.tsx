import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';
import { GameRate } from '../../types';

interface AdminSettingsScreenProps {
  navigation: any;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({
  navigation,
}) => {
  const {
    regularRates,
    starlineRates,
    appSettings,
    notices,
    updateGameRate,
    updateAppSettings,
    addNotice,
    toggleNoticeStatus,
    deleteNotice,
  } = useAdmin();

  // App Settings local form
  const [minDeposit, setMinDeposit] = useState(appSettings.minDeposit.toString());
  const [maxDeposit, setMaxDeposit] = useState(appSettings.maxDeposit.toString());
  const [minWithdrawal, setMinWithdrawal] = useState(appSettings.minWithdrawal.toString());
  const [maxWithdrawal, setMaxWithdrawal] = useState(appSettings.maxWithdrawal.toString());
  const [supportPhone, setSupportPhone] = useState(appSettings.supportPhone);
  const [upiId, setUpiId] = useState(appSettings.upiId);
  const [marqueeNotice, setMarqueeNotice] = useState(appSettings.marqueeNotice);
  const [isMarqueeActive, setIsMarqueeActive] = useState(appSettings.isMarqueeActive);
  const [maintenanceMode, setMaintenanceMode] = useState(appSettings.maintenanceMode);

  // Edit Rate Modal
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [editingRate, setEditingRate] = useState<GameRate | null>(null);
  const [rateCategory, setRateCategory] = useState<'regular' | 'starline'>('regular');
  const [newRateValue, setNewRateValue] = useState('');

  // Add Notice Modal
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  const openEditRate = (rate: GameRate, cat: 'regular' | 'starline') => {
    setEditingRate(rate);
    setRateCategory(cat);
    setNewRateValue(rate.rate);
    setRateModalVisible(true);
  };

  const handleSaveRate = () => {
    if (!editingRate || !newRateValue.trim()) return;
    updateGameRate(rateCategory, editingRate.id, newRateValue.trim());
    Alert.alert('Success', `Game rate for ${editingRate.title} updated to ${newRateValue}!`);
    setRateModalVisible(false);
  };

  const handleSaveAppSettings = () => {
    updateAppSettings({
      minDeposit: parseInt(minDeposit, 10) || 500,
      maxDeposit: parseInt(maxDeposit, 10) || 50000,
      minWithdrawal: parseInt(minWithdrawal, 10) || 1000,
      maxWithdrawal: parseInt(maxWithdrawal, 10) || 100000,
      supportPhone: supportPhone.trim(),
      upiId: uppiTrimmed(upiId),
      marqueeNotice: marqueeNotice.trim(),
      isMarqueeActive,
      maintenanceMode,
    });

    Alert.alert('Settings Saved', 'App configurations have been updated successfully.');
  };

  const uppiTrimmed = (val: string) => val.trim();

  const handleCreateNotice = () => {
    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      Alert.alert('Error', 'Please enter both Title and Message for the notice.');
      return;
    }

    addNotice({
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      type: 'info',
      isActive: true,
    });

    Alert.alert('Notice Broadcasted', 'New notice published to all users!');
    setNoticeTitle('');
    setNoticeMessage('');
    setNoticeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Rates & App Settings"
        subtitle="Manage game rates, limits, and broadcast"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Section 1: Game Rates */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>REGULAR GAME RATES</Text>
          <View style={styles.ratesList}>
            {regularRates.map((gr) => (
              <TouchableOpacity
                key={gr.id}
                style={styles.rateRow}
                onPress={() => openEditRate(gr, 'regular')}
                activeOpacity={0.7}>
                <View style={styles.rateInfo}>
                  <Text style={styles.rateTitle}>{gr.title}</Text>
                  <Text style={styles.rateDesc}>{gr.description}</Text>
                </View>
                <View style={styles.rateBadge}>
                  <Text style={styles.rateBadgeText}>{gr.rate}</Text>
                  <AppIcon name="edit" size={12} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 2: Starline Game Rates */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>STARLINE GAME RATES</Text>
          <View style={styles.ratesList}>
            {starlineRates.map((gr) => (
              <TouchableOpacity
                key={gr.id}
                style={styles.rateRow}
                onPress={() => openEditRate(gr, 'starline')}
                activeOpacity={0.7}>
                <View style={styles.rateInfo}>
                  <Text style={styles.rateTitle}>{gr.title}</Text>
                  <Text style={styles.rateDesc}>{gr.description}</Text>
                </View>
                <View style={styles.rateBadge}>
                  <Text style={styles.rateBadgeText}>{gr.rate}</Text>
                  <AppIcon name="edit" size={12} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 3: App Controls & Limits */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>APP LIMITS & FINANCIAL CONTROLS</Text>
          <View style={styles.formContent}>
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.fieldLabel}>MIN DEPOSIT (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="number-pad"
                  value={minDeposit}
                  onChangeText={setMinDeposit}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.fieldLabel}>MAX DEPOSIT (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="number-pad"
                  value={maxDeposit}
                  onChangeText={setMaxDeposit}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.fieldLabel}>MIN WITHDRAWAL (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="number-pad"
                  value={minWithdrawal}
                  onChangeText={setMinWithdrawal}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.fieldLabel}>MAX WITHDRAWAL (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  keyboardType="number-pad"
                  value={maxWithdrawal}
                  onChangeText={setMaxWithdrawal}
                />
              </View>
            </View>

            <View style={styles.singleField}>
              <Text style={styles.fieldLabel}>RECEIVER UPI ID</Text>
              <TextInput
                style={styles.formInput}
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.singleField}>
              <Text style={styles.fieldLabel}>WHATSAPP CUSTOMER CARE</Text>
              <TextInput
                style={styles.formInput}
                value={supportPhone}
                onChangeText={setSupportPhone}
              />
            </View>

            <View style={styles.switchSettingRow}>
              <View>
                <Text style={styles.switchSettingLabel}>Maintenance Mode</Text>
                <Text style={styles.switchSettingSub}>
                  Temporarily stop new user bids
                </Text>
              </View>
              <Switch
                value={maintenanceMode}
                onValueChange={setMaintenanceMode}
                trackColor={{ false: Colors.border, true: Colors.errorLight }}
                thumbColor={maintenanceMode ? Colors.error : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Section 4: Live Broadcast & Notice Board */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>BROADCAST & NOTICE BOARD</Text>
            <TouchableOpacity
              style={styles.addNoticeBtn}
              onPress={() => setNoticeModalVisible(true)}
              activeOpacity={0.8}>
              <AppIcon name="plus" size={12} color={Colors.textLight} />
              <Text style={styles.addNoticeBtnText}>New Notice</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContent}>
            <View style={styles.singleField}>
              <Text style={styles.fieldLabel}>LIVE MARQUEE BANNER TEXT</Text>
              <TextInput
                style={[styles.formInput, { height: 60 }]}
                multiline
                value={marqueeNotice}
                onChangeText={setMarqueeNotice}
              />
            </View>

            <View style={styles.switchSettingRow}>
              <Text style={styles.switchSettingLabel}>Show Marquee Banner</Text>
              <Switch
                value={isMarqueeActive}
                onValueChange={setIsMarqueeActive}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={isMarqueeActive ? Colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Active Notices List */}
          <View style={styles.noticesList}>
            {notices.map((n) => (
              <View key={n.id} style={styles.noticeCard}>
                <View style={styles.noticeTop}>
                  <Text style={styles.noticeCardTitle}>{n.title}</Text>
                  <TouchableOpacity onPress={() => deleteNotice(n.id)}>
                    <AppIcon name="delete" size={14} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noticeCardMsg}>{n.message}</Text>
                <View style={styles.noticeFooter}>
                  <Text style={styles.noticeDate}>{n.date}</Text>
                  <TouchableOpacity onPress={() => toggleNoticeStatus(n.id)}>
                    <Text
                      style={[
                        styles.toggleNoticeText,
                        { color: n.isActive ? Colors.success : Colors.textMuted },
                      ]}>
                      {n.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Save Settings Button */}
        <TouchableOpacity
          style={styles.saveSettingsBtn}
          onPress={handleSaveAppSettings}
          activeOpacity={0.8}>
          <AppIcon name="check" size={18} color={Colors.textLight} />
          <Text style={styles.saveSettingsBtnText}>SAVE ALL SETTINGS</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Rate Modal */}
      <Modal
        visible={rateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit Rate: {editingRate?.title}
              </Text>
              <TouchableOpacity onPress={() => setRateModalVisible(false)}>
                <AppIcon name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>PAYOUT MULTIPLIER RATE</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 10 : 100"
                value={newRateValue}
                onChangeText={setNewRateValue}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRateModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveRate}>
                <Text style={styles.modalSaveBtnText}>Update Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Notice Modal */}
      <Modal
        visible={noticeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNoticeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish New Notice</Text>
              <TouchableOpacity onPress={() => setNoticeModalVisible(false)}>
                <AppIcon name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>NOTICE TITLE</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Festival Bonus Announcement"
                placeholderTextColor={Colors.textMuted}
                value={noticeTitle}
                onChangeText={setNoticeTitle}
              />

              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>
                NOTICE MESSAGE
              </Text>
              <TextInput
                style={[styles.formInput, { height: 80 }]}
                placeholder="Enter complete message for users..."
                placeholderTextColor={Colors.textMuted}
                multiline
                value={noticeMessage}
                onChangeText={setNoticeMessage}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setNoticeModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleCreateNotice}>
                <Text style={styles.modalSaveBtnText}>Publish Notice</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  addNoticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  addNoticeBtnText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
  },
  ratesList: {
    padding: 10,
    gap: 8,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rateInfo: {
    flex: 1,
  },
  rateTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  rateDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  rateBadgeText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  formContent: {
    padding: 14,
    gap: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formCol: {
    flex: 1,
  },
  singleField: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
  },
  switchSettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchSettingLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  switchSettingSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  noticesList: {
    padding: 14,
    paddingTop: 0,
    gap: 8,
  },
  noticeCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 10,
    borderRadius: 8,
  },
  noticeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeCardTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  noticeCardMsg: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginVertical: 4,
  },
  noticeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  noticeDate: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  toggleNoticeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
  },
  saveSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  saveSettingsBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
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
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceSubtle,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelBtnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.semibold,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSaveBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
});
