import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { BalanceCard } from '../../components/common/BalanceCard';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';
import { useDrawer } from '../../context/DrawerContext';

interface FundsHomeScreenProps {
  navigation: any;
}

const FundActionTile: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}> = ({ title, subtitle, icon, color, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.gridCard,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          <AppIcon name={icon} size={22} color={Colors.textLight} />
        </View>
        <Text style={styles.gridTitle}>{title}</Text>
        <Text style={styles.gridSubtitle}>{subtitle}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const FundsHomeScreen: React.FC<FundsHomeScreenProps> = ({ navigation }) => {
  const { openDrawer } = useDrawer();
  const fundTiles = [
    {
      title: 'Add Cash',
      subtitle: 'Instant Auto Deposit',
      icon: 'plus',
      color: Colors.primary,
      onPress: () => navigation.navigate('AddFund'),
    },
    {
      title: 'Withdraw',
      subtitle: 'Transfer to Bank / UPI',
      icon: 'minus',
      color: '#c2185b',
      onPress: () => navigation.navigate('WithdrawFund'),
    },
    {
      title: 'Bank Details',
      subtitle: 'Manage Bank Accounts',
      icon: 'bank',
      color: '#0369a1',
      onPress: () => navigation.navigate('BankDetails'),
    },
    {
      title: 'UPI Details',
      subtitle: 'GPay, PhonePe, Paytm',
      icon: 'upi',
      color: '#c2410c',
      onPress: () => navigation.navigate('UpiDetails'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Funds & Wallet"
        walletBalance={mockUser.walletBalance}
        onMenuPress={openDrawer}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Balance Hero Card */}
        <BalanceCard
          balance={mockUser.walletBalance}
          onAddPress={() => navigation.navigate('AddFund')}
          onWithdrawPress={() => navigation.navigate('WithdrawFund')}
          onHistoryPress={() => navigation.navigate('Passbook')}
        />

        {/* Action Grid Tiles */}
        <Text style={styles.sectionHeader}>FUNDS MANAGEMENT</Text>
        <View style={styles.grid}>
          {fundTiles.map((tile, index) => (
            <FundActionTile
              key={index}
              title={tile.title}
              subtitle={tile.subtitle}
              icon={tile.icon}
              color={tile.color}
              onPress={tile.onPress}
            />
          ))}
        </View>

        {/* Passbook Banner */}
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Passbook')}>
          <View style={[styles.passbookBanner, Shadows.sm]}>
            <View style={styles.passbookIcon}>
              <AppIcon name="passbook" size={22} color={Colors.primary} />
            </View>
            <View style={styles.passbookText}>
              <Text style={styles.passbookTitle}>Transaction Passbook</Text>
              <Text style={styles.passbookSubtitle}>
                View deposit, withdrawal & winning history
              </Text>
            </View>
            <AppIcon name="play" size={14} color={Colors.primary} />
          </View>
        </TouchableWithoutFeedback>
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
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
  },
  gridCard: {
    width: '46%',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    margin: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 135,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    elevation: 2,
  },
  gridTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  gridSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  passbookBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passbookIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  passbookText: {
    flex: 1,
  },
  passbookTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  passbookSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
