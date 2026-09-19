import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Icon symbol mappings for reliable cross-platform rendering
const iconMap: Record<string, string> = {
  menu: '☰',
  bell: '🔔',
  wallet: '₹',
  home: '🏠',
  bids: '📋',
  passbook: '💳',
  settings: '⚙️',
  back: '←',
  close: '✕',
  play: '▶',
  plus: '+',
  minus: '−',
  history: '📜',
  trophy: '🏆',
  star: '⭐',
  bank: '🏦',
  upi: '📱',
  phonepe: '🅿️',
  gpay: '🅖',
  paytm: ' Paytm ',
  whatsapp: '💬',
  info: 'ℹ️',
  idea: '💡',
  share: '↗',
  logout: '🚪',
  check: '✓',
  dice: '🎲',
  chart: '📊',
  lock: '🔒',
  refresh: '🔄',
  delete: '🗑️',
  help: '❓',
  user: '👤',
  users: '👥',
  edit: '✏️',
  search: '🔍',
  filter: '⚡',
  shield: '🛡️',
  broadcast: '📢',
  money: '💰',
  arrowRight: '➔',
  calendar: '📅',
  time: '⏰',
  calculator: '🔢',
  alert: '⚠️',
  dots: '⋮',
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = Colors.textLight,
  style,
}) => {
  const symbol = iconMap[name] || '•';

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>
        {symbol}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'center',
  },
});
