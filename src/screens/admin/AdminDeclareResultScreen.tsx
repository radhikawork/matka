import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Typography } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AppIcon } from '../../components/common/AppIcon';
import { useAdmin } from '../../context/AdminContext';
import { MarketItem } from '../../types';

interface AdminDeclareResultScreenProps {
  route: any;
  navigation: any;
}

export const AdminDeclareResultScreen: React.FC<AdminDeclareResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { markets, starlineSlots, bids, declareMarketResult, declareStarlineResult } =
    useAdmin();

  const initialMarketId = route?.params?.marketId;
  const isStarlineParam = route?.params?.isStarline || false;

  const [gameMode, setGameMode] = useState<'regular' | 'starline'>(
    isStarlineParam ? 'starline' : 'regular',
  );
  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    initialMarketId || (markets.length > 0 ? markets[0].id : ''),
  );
  const [session, setSession] = useState<'open' | 'close'>('open');
  const [pana, setPana] = useState('');
  const [singleDigit, setSingleDigit] = useState('');

  // Auto calculate single digit when 3-digit pana is entered
  const handlePanaChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 3);
    setPana(cleaned);

    if (cleaned.length === 3) {
      const sum =
        parseInt(cleaned[0], 10) +
        parseInt(cleaned[1], 10) +
        parseInt(cleaned[2], 10);
      const digit = (sum % 10).toString();
      setSingleDigit(digit);
    }
  };

  const selectedMarket =
    gameMode === 'regular'
      ? markets.find((m) => m.id === selectedMarketId)
      : starlineSlots.find((s) => s.id === selectedMarketId);

  // Compute live winning preview
  const calculatePreview = () => {
    if (!pana || !singleDigit || !selectedMarketId) {
      return { count: 0, totalPayout: 0, totalBidsPoints: 0 };
    }

    let count = 0;
    let totalPayout = 0;
    let totalBidsPoints = 0;

    const marketBids = bids.filter(
      (b) => b.marketId === selectedMarketId && b.status === 'pending',
    );

    marketBids.forEach((bid) => {
      totalBidsPoints += bid.points;
      let isWin = false;
      let multiplier = 0;

      if (gameMode === 'regular') {
        if (bid.session === session || session === 'close') {
          if (bid.gameType === 'single_digit' && bid.digit === singleDigit) {
            isWin = true;
            multiplier = 10;
          } else if (
            (bid.gameType === 'single_panna' ||
              bid.gameType === 'double_panna' ||
              bid.gameType === 'triple_panna') &&
            bid.digit === pana
          ) {
            isWin = true;
            multiplier =
              bid.gameType === 'single_panna'
                ? 150
                : bid.gameType === 'double_panna'
                ? 300
                : 1000;
          }
        }
      } else {
        // Starline
        if (bid.gameType === 'single_digit' && bid.digit === singleDigit) {
          isWin = true;
          multiplier = 10;
        } else if (bid.digit === pana) {
          isWin = true;
          multiplier = 150;
        }
      }

      if (isWin) {
        count++;
        totalPayout += bid.points * multiplier;
      }
    });

    return { count, totalPayout, totalBidsPoints };
  };

  const preview = calculatePreview();

  const handleDeclare = () => {
    if (pana.length !== 3) {
      Alert.alert('Validation Error', 'Please enter a valid 3-digit Pana (e.g. 128).');
      return;
    }
    if (!singleDigit) {
      Alert.alert('Validation Error', 'Please enter or calculate Single Digit.');
      return;
    }

    const marketName =
      gameMode === 'regular'
        ? (selectedMarket as MarketItem)?.name
        : `STARLINE ${(selectedMarket as any)?.timeSlot}`;

    Alert.alert(
      'Confirm Result Declaration',
      `Are you sure you want to declare:\n\nMarket: ${marketName}\nSession: ${session.toUpperCase()}\nPana: ${pana}\nSingle Digit: ${singleDigit}\n\nWinning Bids: ${
        preview.count
      }\nTotal Payout: ₹${preview.totalPayout.toLocaleString()}\n\nThis will immediately settle bids and credit winning user wallets!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Declare & Distribute',
          style: 'destructive',
          onPress: () => {
            if (gameMode === 'regular') {
              const res = declareMarketResult(
                selectedMarketId,
                session,
                pana,
                singleDigit,
              );
              Alert.alert(
                'Result Declared Successfully!',
                `Market ${marketName} ${session.toUpperCase()} declared.\n\nWinners: ${
                  res.winnersCount
                }\nTotal Paid Out: ₹${res.totalPayout.toLocaleString()}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }],
              );
            } else {
              const res = declareStarlineResult(
                selectedMarketId,
                pana,
                singleDigit,
              );
              Alert.alert(
                'Starline Result Declared!',
                `Starline result declared: ${pana}-${singleDigit}\n\nWinners: ${
                  res.winnersCount
                }\nTotal Paid Out: ₹${res.totalPayout.toLocaleString()}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }],
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Declare Results"
        subtitle="Automatic winner settlement & payout"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Game Mode Selector */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              gameMode === 'regular' && styles.modeTabActive,
            ]}
            onPress={() => {
              setGameMode('regular');
              if (markets.length > 0) setSelectedMarketId(markets[0].id);
            }}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modeTabText,
                gameMode === 'regular' && styles.modeTabTextActive,
              ]}>
              Regular Markets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTab,
              gameMode === 'starline' && styles.modeTabActive,
            ]}
            onPress={() => {
              setGameMode('starline');
              if (starlineSlots.length > 0)
                setSelectedMarketId(starlineSlots[0].id);
            }}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modeTabText,
                gameMode === 'starline' && styles.modeTabTextActive,
              ]}>
              Starline Slots
            </Text>
          </TouchableOpacity>
        </View>

        {/* Market Selection Scroll */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. SELECT MARKET</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.marketScrollContent}>
            {gameMode === 'regular'
              ? markets.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.marketPill,
                      selectedMarketId === m.id && styles.marketPillSelected,
                    ]}
                    onPress={() => setSelectedMarketId(m.id)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.marketPillText,
                        selectedMarketId === m.id && styles.marketPillTextSelected,
                      ]}>
                      {m.name}
                    </Text>
                    <Text
                      style={[
                        styles.marketPillSub,
                        selectedMarketId === m.id && styles.marketPillSubSelected,
                      ]}>
                      {m.result}
                    </Text>
                  </TouchableOpacity>
                ))
              : starlineSlots.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.marketPill,
                      selectedMarketId === s.id && styles.marketPillSelected,
                    ]}
                    onPress={() => setSelectedMarketId(s.id)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.marketPillText,
                        selectedMarketId === s.id && styles.marketPillTextSelected,
                      ]}>
                      {s.timeSlot}
                    </Text>
                    <Text
                      style={[
                        styles.marketPillSub,
                        selectedMarketId === s.id && styles.marketPillSubSelected,
                      ]}>
                      {s.result}
                    </Text>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* Session Selection (for Regular Markets) */}
        {gameMode === 'regular' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>2. SELECT SESSION</Text>
            <View style={styles.sessionRow}>
              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === 'open' && styles.sessionBtnActive,
                ]}
                onPress={() => setSession('open')}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.sessionBtnText,
                    session === 'open' && styles.sessionBtnTextActive,
                  ]}>
                  OPEN SESSION
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sessionBtn,
                  session === 'close' && styles.sessionBtnActive,
                ]}
                onPress={() => setSession('close')}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.sessionBtnText,
                    session === 'close' && styles.sessionBtnTextActive,
                  ]}>
                  CLOSE SESSION
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input Result Numbers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {gameMode === 'regular' ? '3. ENTER RESULT NUMBERS' : '2. ENTER NUMBERS'}
          </Text>

          <View style={styles.numbersInputRow}>
            <View style={styles.numberInputBox}>
              <Text style={styles.inputLabel}>PANA (3 DIGITS)</Text>
              <TextInput
                style={styles.bigNumberInput}
                placeholder="128"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                maxLength={3}
                value={pana}
                onChangeText={handlePanaChange}
              />
            </View>

            <View style={styles.mathSign}>
              <Text style={styles.mathSignText}>➔</Text>
            </View>

            <View style={styles.numberInputBox}>
              <Text style={styles.inputLabel}>SINGLE DIGIT</Text>
              <TextInput
                style={styles.bigNumberInput}
                placeholder="1"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                maxLength={1}
                value={singleDigit}
                onChangeText={(text) =>
                  setSingleDigit(text.replace(/[^0-9]/g, '').slice(0, 1))
                }
              />
            </View>
          </View>

          {pana.length === 3 && (
            <View style={styles.calculationHint}>
              <Text style={styles.calculationHintText}>
                Sum: {pana[0]} + {pana[1]} + {pana[2]} ={' '}
                {parseInt(pana[0], 10) +
                  parseInt(pana[1], 10) +
                  parseInt(pana[2], 10)}{' '}
                ➔ Last Digit = {singleDigit}
              </Text>
            </View>
          )}
        </View>

        {/* Live Winner Preview Box */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <AppIcon name="chart" size={16} color={Colors.primaryDark} />
            <Text style={styles.previewTitle}>AUTOMATIC WINNER SETTLEMENT PREVIEW</Text>
          </View>

          <View style={styles.previewGrid}>
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>Winning Bids</Text>
              <Text style={styles.previewItemVal}>{preview.count}</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>Total Payout</Text>
              <Text style={[styles.previewItemVal, { color: Colors.error }]}>
                ₹ {preview.totalPayout.toLocaleString()}
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>Collection</Text>
              <Text style={[styles.previewItemVal, { color: Colors.success }]}>
                ₹ {preview.totalBidsPoints.toLocaleString()}
              </Text>
            </View>
          </View>

          <Text style={styles.previewNote}>
            Upon clicking Declare, the system will mark all corresponding user bids as
            'Won', calculate win multipliers, and automatically credit user wallet
            balances with transaction receipts.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.submitDeclareBtn,
            (!pana || !singleDigit) && styles.submitDeclareBtnDisabled,
          ]}
          onPress={handleDeclare}
          disabled={!pana || !singleDigit}
          activeOpacity={0.8}>
          <AppIcon name="check" size={20} color={Colors.textLight} />
          <Text style={styles.submitDeclareBtnText}>
            DECLARE & SETTLE WINNINGS
          </Text>
        </TouchableOpacity>
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
    padding: 14,
    paddingBottom: 40,
    gap: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
  },
  modeTabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: Colors.textLight,
    fontWeight: Typography.fontWeights.bold,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  marketScrollContent: {
    gap: 8,
  },
  marketPill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  marketPillSelected: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  marketPillText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  marketPillTextSelected: {
    color: Colors.textLight,
  },
  marketPillSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  marketPillSubSelected: {
    color: Colors.accent,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sessionBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sessionBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  sessionBtnTextActive: {
    color: Colors.textLight,
  },
  numbersInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  numberInputBox: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  bigNumberInput: {
    width: 100,
    height: 56,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    fontSize: 24,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  mathSign: {
    paddingTop: 16,
  },
  mathSignText: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  calculationHint: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  calculationHintText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: Typography.fontWeights.medium,
  },
  previewCard: {
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.bold,
    color: '#e65100',
    letterSpacing: 0.5,
  },
  previewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  previewItem: {
    alignItems: 'center',
    flex: 1,
  },
  previewItemLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  previewItemVal: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  previewNote: {
    fontSize: 10,
    color: '#8d6e63',
    lineHeight: 14,
  },
  submitDeclareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    elevation: 3,
  },
  submitDeclareBtnDisabled: {
    backgroundColor: '#e0e0e0',
    elevation: 0,
  },
  submitDeclareBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
});
