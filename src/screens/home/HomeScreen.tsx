import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { MarketCard } from '../../components/home/MarketCard';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { SupportBanner } from '../../components/home/SupportBanner';
import { mockUser } from '../../mocks/userData';
import { MarketItem } from '../../types';
import { useDrawer } from '../../context/DrawerContext';
import { useAdmin } from '../../context/AdminContext';
import { AppIcon } from '../../components/common/AppIcon';

interface HomeScreenProps {
  navigation: any;
}

// Micro-interaction: Animated list item container
const AnimatedMarketItem: React.FC<{
  item: MarketItem;
  index: number;
  onPress: (market: MarketItem) => void;
}> = ({ item, index, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: Math.min(index * 60, 400),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 350,
        delay: Math.min(index * 60, 400),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
      }}>
      <MarketCard market={item} onPress={onPress} />
    </Animated.View>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { openDrawer } = useDrawer();
  const { markets, appSettings, users } = useAdmin();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const currentUser = users.find((u) => u.id === mockUser.id) || mockUser;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const handleMarketPress = (market: MarketItem) => {
    if (market.isOpen) {
      navigation.navigate('GameMarketDetails', { market });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Quick Actions Row */}
      <View style={styles.quickActionsRow}>
        <QuickActionCard
          title="MAIN JACKPOT"
          subtitle="Win Instant ₹950"
          iconName="trophy"
          accentColor="#dc2626"
          onPress={() => navigation.navigate('JackpotHome')}
        />
        <View style={{ width: 10 }} />
        <QuickActionCard
          title="STARLINE"
          subtitle="Hourly Live Slots"
          iconName="star"
          accentColor={Colors.accentDark}
          onPress={() => navigation.navigate('StarlineHome')}
        />
      </View>

      {/* Marquee Notice from Admin */}
      {appSettings.isMarqueeActive && appSettings.marqueeNotice ? (
        <View style={[styles.marqueeBanner, Shadows.sm]}>
          <View style={styles.marqueeIconCircle}>
            <AppIcon name="bell" size={12} color="#854d0e" />
          </View>
          <Text style={styles.marqueeText} numberOfLines={2}>
            {appSettings.marqueeNotice}
          </Text>
        </View>
      ) : null}

      {/* WhatsApp Support Banner */}
      <SupportBanner phoneNumber={appSettings.supportPhone} />

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.liveIndicatorDot} />
          <Text style={styles.sectionTitle}>LIVE MARKETS</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Auto Refreshes</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Matka Bro"
        walletBalance={currentUser.walletBalance}
        onMenuPress={openDrawer}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <FlatList
        data={markets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedMarketItem
            item={item}
            index={index}
            onPress={handleMarketPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
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
    paddingBottom: Spacing.xxl,
  },
  headerContainer: {
    paddingTop: Spacing.sm,
  },
  marqueeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#fde047',
    gap: 8,
  },
  marqueeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marqueeText: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    color: '#854d0e',
    fontWeight: Typography.fontWeights.semibold,
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeights.medium,
  },
});
