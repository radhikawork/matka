import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/colors';
import { AppIcon } from '../common/AppIcon';

export interface AddedBidItem {
  id: string;
  digit: string;
  points: number;
  session: 'open' | 'close';
}

interface BidTableProps {
  bids: AddedBidItem[];
  onDeleteBid: (id: string) => void;
}

export const BidTable: React.FC<BidTableProps> = ({ bids, onDeleteBid }) => {
  const totalPoints = bids.reduce((sum, item) => sum + item.points, 0);

  if (bids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bids added yet. Enter number and points above.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Digits</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Points</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Session</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Action</Text>
      </View>

      {/* Table Rows */}
      {bids.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.row,
            index % 2 === 1 ? styles.altRow : null,
          ]}>
          <Text style={[styles.cell, { flex: 1.5, fontWeight: Typography.fontWeights.bold }]}>
            {item.digit}
          </Text>
          <Text style={[styles.cell, { flex: 1.5, color: Colors.primaryDark, fontWeight: Typography.fontWeights.heavy }]}>
            ₹ {item.points}
          </Text>
          <Text style={[styles.cell, { flex: 1.5, textTransform: 'capitalize' }]}>
            {item.session}
          </Text>
          <TouchableOpacity
            style={[styles.actionCell, { flex: 1, alignItems: 'center' }]}
            onPress={() => onDeleteBid(item.id)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <View style={styles.deleteBtnBg}>
              <AppIcon name="delete" size={14} color={Colors.error} />
            </View>
          </TouchableOpacity>
        </View>
      ))}

      {/* Total Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.totalLabel}>Total Bids: {bids.length}</Text>
        <Text style={styles.totalValue}>Total Points: ₹ {totalPoints.toLocaleString('en-IN')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
  emptyContainer: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderDark,
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  headerCell: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  altRow: {
    backgroundColor: '#f8fafc',
  },
  cell: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  actionCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryMuted,
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryMutedDark,
  },
  totalLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  totalValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.primaryDark,
  },
});
