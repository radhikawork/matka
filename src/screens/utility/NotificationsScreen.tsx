import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';

interface NotificationsScreenProps {
  navigation: any;
}

const mockNotifications = [
  {
    id: 'n_1',
    title: '🏆 Kalyan Morning Result Declared!',
    message: 'Winning result for Kalyan Morning is 348-56-123. Check your bid history for payouts.',
    time: '10 mins ago',
    read: false,
  },
  {
    id: 'n_2',
    title: '⭐ Starline 12:00 PM Slot Open',
    message: 'Starline hourly slot for 12:00 PM is now live. Place your single & panna bids now!',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'n_3',
    title: '💰 Wallet Deposit Credited',
    message: '₹2,000 has been credited to your wallet via Google Pay UPI.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 'n_4',
    title: '📢 Notice: Sunday Special Jackpot',
    message: 'Special Sunday Jackpot with 10 : 950 win ratio starts at 11:30 AM.',
    time: '1 day ago',
    read: true,
  },
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Notice Board"
        showBack={true}
        showNotification={false}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
      />

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              Shadows.sm,
              !item.read ? styles.unreadCard : null,
            ]}>
            <View style={styles.iconCircle}>
              <AppIcon name="bell" size={17} color={Colors.primary} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
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
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unreadCard: {
    borderColor: Colors.primaryMutedDark,
    backgroundColor: '#f0fdfa',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  message: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  time: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: Typography.fontWeights.medium,
  },
});
