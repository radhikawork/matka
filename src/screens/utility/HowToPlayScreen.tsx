import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { mockUser } from '../../mocks/userData';
import { AppIcon } from '../../components/common/AppIcon';

interface HowToPlayScreenProps {
  navigation: any;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  navigation,
}) => {
  const rules = [
    {
      title: '1. Single Digit (0 to 9)',
      desc: 'Pick any single number between 0 and 9. If the open or close single ank matches your number, you win 10 : 100.',
    },
    {
      title: '2. Jodi Digit (00 to 99)',
      desc: 'Pick any pair combination between 00 and 99. If both open and close single digits match your pair, you win 10 : 1000.',
    },
    {
      title: '3. Single Panna / Patti',
      desc: 'A 3-digit combination where all three digits are distinct (e.g., 123, 456, 789). Payout is 10 : 1500.',
    },
    {
      title: '4. Double Panna / Patti',
      desc: 'A 3-digit combination where two digits are identical (e.g., 112, 334, 778). Payout is 10 : 3000.',
    },
    {
      title: '5. Triple Panna / Patti',
      desc: 'A 3-digit combination where all three digits are identical (e.g., 111, 222, 999). Payout is 10 : 10000.',
    },
    {
      title: '6. Half Sangam',
      desc: 'Open Panna with Close Ank or Open Ank with Close Panna. Payout is 10 : 10000.',
    },
    {
      title: '7. Full Sangam',
      desc: 'Open Panna with Close Panna exact match. Payout is 10 : 100000.',
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="How To Play"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBanner, Shadows.md]}>
          <AppIcon name="info" size={28} color={Colors.accent} />
          <Text style={styles.heroTitle}>GAME RULES & INSTRUCTIONS</Text>
          <Text style={styles.heroSubtitle}>
            Read the rules below carefully to understand how to play each game format.
          </Text>
        </View>

        {rules.map((rule, idx) => (
          <View key={idx} style={[styles.ruleCard, Shadows.sm]}>
            <Text style={styles.ruleTitle}>{rule.title}</Text>
            <Text style={styles.ruleDesc}>{rule.desc}</Text>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip:</Text>
          <Text style={styles.tipText}>
            Always check the market open and close timings before placing your bids to ensure your bets are processed for the current draw.
          </Text>
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
  heroBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryMutedDark,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: Typography.fontWeights.medium,
  },
  ruleCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ruleTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  tipCard: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.primaryMutedDark,
  },
  tipTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  tipText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
