import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';
import { useDrawer } from '../../context/DrawerContext';

interface MyBidsScreenProps {
  navigation: any;
}

const BidCategoryCard: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}> = ({ title, subtitle, icon, color, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
          styles.card,
          Shadows.sm,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          <AppIcon name={icon} size={22} color={Colors.textLight} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.arrowCircle}>
          <AppIcon name="play" size={12} color={Colors.primary} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const MyBidsScreen: React.FC<MyBidsScreenProps> = ({ navigation }) => {
  const { openDrawer } = useDrawer();
  const bidCategories = [
    {
      title: 'Main Market Bids',
      subtitle: 'Regular Bazar & Matka Bids',
      icon: 'bids',
      color: Colors.primary,
      onPress: () => navigation.navigate('BidHistory'),
    },
    {
      title: 'Starline Bids',
      subtitle: 'Hourly Starline Play History',
      icon: 'star',
      color: Colors.accentDark,
      onPress: () => navigation.navigate('BidHistory'),
    },
    {
      title: 'Main Jackpot Bids',
      subtitle: 'Jackpot Game Play History',
      icon: 'dice',
      color: '#c2185b',
      onPress: () => navigation.navigate('BidHistory'),
    },
    {
      title: 'Win History',
      subtitle: 'Winning Bids & Instant Payouts',
      icon: 'trophy',
      color: '#15803d',
      onPress: () => navigation.navigate('WinHistory'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="My Bids"
        walletBalance={mockUser.walletBalance}
        onMenuPress={openDrawer}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, Shadows.md]}>
          <Text style={styles.bannerTitle}>TRACK YOUR BIDS & RESULTS</Text>
          <Text style={styles.bannerSubtitle}>
            Select a game category to inspect your placed bets, live outcomes & winning results.
          </Text>
        </View>

        <View style={styles.cardsList}>
          {bidCategories.map((cat, index) => (
            <BidCategoryCard
              key={index}
              title={cat.title}
              subtitle={cat.subtitle}
              icon={cat.icon}
              color={cat.color}
              onPress={cat.onPress}
            />
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
    paddingBottom: Spacing.xxl,
  },
  banner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    marginTop: 4,
    lineHeight: 18,
    fontWeight: Typography.fontWeights.medium,
  },
  cardsList: {
    gap: 10,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
