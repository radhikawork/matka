import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';

interface AdminDashboardScreenProps {
  navigation: any;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const {
    stats,
    markets,
    fundRequests,
    appSettings,
    refreshStats,
    toggleMarketStatus,
  } = useAdmin();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refreshStats();
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleSwitchToUserApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDrawer' }],
    });
  };

  const handleQuickDeclare = (market: any) => {
    navigation.navigate('AdminDeclareResult', { marketId: market.id });
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Admin Control Center"
        subtitle="Live Operations & Financials"
        onUserAppPress={handleSwitchToUserApp}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryDark]}
            tintColor={Colors.primaryDark}
          />
        }>
        {/* Notice Banner if active */}
        {appSettings.isMarqueeActive && appSettings.marqueeNotice ? (
          <View style={[styles.noticeBanner, Shadows.sm]}>
            <AppIcon name="broadcast" size={16} color={Colors.primaryDark} />
            <Text style={styles.noticeText} numberOfLines={2}>
              {appSettings.marqueeNotice}
            </Text>
          </View>
        ) : null}

        {/* Pending Alerts Bar */}
        {(stats.pendingDepositsCount > 0 ||
          stats.pendingWithdrawalsCount > 0) && (
          <TouchableOpacity
            style={[styles.alertBar, Shadows.sm]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AdminFundRequests')}>
            <View style={styles.alertLeft}>
              <AppIcon name="alert" size={16} color={Colors.error} />
              <Text style={styles.alertText}>
                {stats.pendingDepositsCount} Deposits &{' '}
                {stats.pendingWithdrawalsCount} Withdrawals Pending Approval!
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.error} />
          </TouchableOpacity>
        )}

        {/* Section: KPI Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S FINANCIAL OVERVIEW</Text>
          <TouchableOpacity onPress={refreshStats}>
            <Text style={styles.refreshLink}>Sync Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <AdminStatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="Registered players"
            iconName="users"
            iconBgColor={Colors.primaryMuted}
            iconColor={Colors.primary}
            onPress={() => navigation.navigate('AdminUsers')}
          />
          <AdminStatCard
            title="User Balances"
            value={`₹ ${stats.totalWalletBalance.toLocaleString('en-IN')}`}
            subtitle="Total in wallets"
            iconName="wallet"
            iconBgColor={Colors.infoLight}
            iconColor={Colors.info}
            onPress={() => navigation.navigate('AdminUsers')}
          />
          <AdminStatCard
            title="Today's Bids"
            value={`₹ ${stats.todayBidsTotal.toLocaleString('en-IN')}`}
            subtitle={`${stats.todayBidsCount} total bets placed`}
            iconName="bids"
            iconBgColor="#f3e5f5"
            iconColor="#7b1fa2"
            onPress={() => navigation.navigate('AdminBids')}
          />
          <AdminStatCard
            title="Total Payouts"
            value={`₹ ${stats.todayWinsTotal.toLocaleString('en-IN')}`}
            subtitle="Total won by users"
            iconName="trophy"
            iconBgColor={Colors.warningLight}
            iconColor={Colors.warning}
            onPress={() => navigation.navigate('AdminBids')}
          />
          <AdminStatCard
            title="Net Margin / P&L"
            value={`₹ ${stats.todayProfit.toLocaleString('en-IN')}`}
            subtitle={stats.todayProfit >= 0 ? 'Admin In Profit' : 'High Payout Day'}
            iconName="money"
            iconBgColor={stats.todayProfit >= 0 ? Colors.successLight : Colors.errorLight}
            iconColor={stats.todayProfit >= 0 ? Colors.successDark : Colors.errorDark}
            badgeText={stats.todayProfit >= 0 ? 'PROFIT' : 'LOSS'}
            badgeType={stats.todayProfit >= 0 ? 'success' : 'error'}
          />
          <AdminStatCard
            title="Active Markets"
            value={`${stats.activeMarketsCount} / ${markets.length}`}
            subtitle="Currently Open"
            iconName="dice"
            iconBgColor={Colors.primaryMuted}
            iconColor={Colors.primaryDark}
            onPress={() => navigation.navigate('AdminMarkets')}
          />
        </View>

        {/* Section: Quick Actions Hub */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUICK MANAGEMENT HUB</Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#dc2626' }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminDeclareResult')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fee2e2' }]}>
              <AppIcon name="calculator" size={20} color="#dc2626" />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Declare Results</Text>
              <Text style={styles.actionSubtitle}>
                Declare Open/Close Pana & Settle Winnings
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: Colors.primary }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminMarkets')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: Colors.primaryMuted }]}>
              <AppIcon name="time" size={20} color={Colors.primary} />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Markets & Slots</Text>
              <Text style={styles.actionSubtitle}>
                Add, Edit Timings & Toggle Active Status
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#0284c7' }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminFundRequests')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#e0f2fe' }]}>
              <AppIcon name="bank" size={20} color="#0284c7" />
            </View>
            <View style={styles.actionDetails}>
              <View style={styles.actionTitleRow}>
                <Text style={styles.actionTitle}>Fund Requests</Text>
                {stats.pendingDepositsCount + stats.pendingWithdrawalsCount > 0 && (
                  <View style={styles.badgeCount}>
                    <Text style={styles.badgeCountText}>
                      {stats.pendingDepositsCount + stats.pendingWithdrawalsCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionSubtitle}>
                Approve Deposits & Process Withdrawals
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#d97706' }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminUsers')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fef3c7' }]}>
              <AppIcon name="user" size={20} color="#d97706" />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>User Directory</Text>
              <Text style={styles.actionSubtitle}>
                Manage Wallets, Block/Unblock, View Details
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#7c3aed' }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminBids')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#f3e8ff' }]}>
              <AppIcon name="bids" size={20} color="#7c3aed" />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Live Bids Ledger</Text>
              <Text style={styles.actionSubtitle}>
                Monitor placed bets, game types & numbers
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#475569' }, Shadows.sm]}
            onPress={() => navigation.navigate('AdminSettings')}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#f1f5f9' }]}>
              <AppIcon name="settings" size={20} color="#475569" />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Rates & Broadcast</Text>
              <Text style={styles.actionSubtitle}>
                Edit Game Rates, Notices & Limits
              </Text>
            </View>
            <AppIcon name="play" size={12} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: Live Markets Snapshot */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LIVE MARKETS SNAPSHOT</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AdminMarkets')}>
            <Text style={styles.seeAllLink}>View All ({markets.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.marketsSnapshotContainer}>
          {markets.slice(0, 5).map((market) => (
            <View key={market.id} style={[styles.marketRowCard, Shadows.sm]}>
              <View style={styles.marketInfoLeft}>
                <View style={styles.marketNameRow}>
                  <Text style={styles.marketName}>{market.name}</Text>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: market.isOpen ? Colors.success : Colors.error },
                    ]}
                  />
                </View>
                <Text style={styles.marketTimings}>
                  Open: {market.openTime} | Close: {market.closeTime}
                </Text>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultText}>{market.result}</Text>
                </View>
              </View>

              <View style={styles.marketActionsRight}>
                <TouchableOpacity
                  style={styles.declareBtn}
                  onPress={() => handleQuickDeclare(market)}
                  activeOpacity={0.7}>
                  <Text style={styles.declareBtnText}>Declare</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    { backgroundColor: market.isOpen ? '#fee2e2' : '#dcfce7' },
                  ]}
                  onPress={() => toggleMarketStatus(market.id)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: market.isOpen ? Colors.errorDark : Colors.successDark },
                    ]}>
                    {market.isOpen ? 'Close' : 'Open'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    padding: 11,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#fde047',
    marginBottom: Spacing.sm,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    color: '#854d0e',
    fontWeight: Typography.fontWeights.medium,
  },
  alertBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  alertText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.errorDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  refreshLink: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  seeAllLink: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  actionGrid: {
    gap: 8,
  },
  actionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionDetails: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  badgeCount: {
    backgroundColor: Colors.error,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  badgeCountText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: Typography.fontWeights.heavy,
  },
  actionSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  marketsSnapshotContainer: {
    gap: 8,
  },
  marketRowCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  marketInfoLeft: {
    flex: 1,
  },
  marketNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  marketName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  marketTimings: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  resultBadge: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  resultText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: '#b45309',
    letterSpacing: 1,
  },
  marketActionsRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: 8,
  },
  declareBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  declareBtnText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  toggleBtnText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
  },
});
