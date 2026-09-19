import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { StarlineSlotCard } from '../../components/games/StarlineSlotCard';
import { mockStarlineSlots } from '../../mocks/starlineData';
import { mockUser } from '../../mocks/userData';
import { starlineGameRates } from '../../mocks/gameRatesData';
import { StarlineSlot, MarketItem } from '../../types';

interface StarlineHomeScreenProps {
  navigation: any;
}

export const StarlineHomeScreen: React.FC<StarlineHomeScreenProps> = ({
  navigation,
}) => {
  const [slots] = useState<StarlineSlot[]>(mockStarlineSlots);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handlePlaySlot = (slot: StarlineSlot) => {
    const marketObj: MarketItem = {
      id: slot.id,
      name: `STARLINE ${slot.timeSlot}`,
      openTime: slot.openTime,
      closeTime: slot.closeTime,
      result: slot.result,
      isOpen: slot.isOpen,
      isClosedForDay: !slot.isOpen,
      statusText: slot.statusText,
    };

    navigation.navigate('GameMarketDetails', { market: marketObj });
  };

  const renderHeader = () => (
    <View style={styles.headerBox}>
      {/* Banner */}
      <View style={[styles.bannerCard, Shadows.md]}>
        <Text style={styles.bannerTitle}>⭐ STARLINE LIVE GAME</Text>
        <Text style={styles.bannerSubtitle}>Hourly betting slots with instant results</Text>
        <View style={styles.ratesRow}>
          {starlineGameRates.slice(0, 2).map((item, idx) => (
            <View key={idx} style={styles.rateTag}>
              <Text style={styles.rateTagText}>
                {item.title}: {item.rate}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionLabel}>HOURLY TIME SLOTS</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Starline Game"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StarlineSlotCard slot={item} onPlayPress={handlePlaySlot} />
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
  headerBox: {
    paddingTop: Spacing.xs,
  },
  bannerCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 4,
    fontWeight: Typography.fontWeights.medium,
  },
  ratesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  rateTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  rateTagText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    letterSpacing: 0.8,
  },
});
