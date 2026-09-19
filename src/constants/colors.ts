export const Colors = {
  // Brand Palette
  primary: '#00695c',
  primaryDark: '#004d40',
  primaryLight: '#00897b',
  primaryMuted: '#e0f2f1',
  primaryMutedDark: '#80cbc4',
  accent: '#ffb300',
  accentDark: '#f57f17',
  accentLight: '#fff8e1',
  
  // Backgrounds & Surfaces
  background: '#f4f6f8',
  cardBg: '#ffffff',
  surface: '#ffffff',
  surfaceSubtle: '#f8fafc',
  surfaceElevated: '#ffffff',
  
  // Text Colors
  textPrimary: '#1a1a1a',
  textSecondary: '#5a626a',
  textMuted: '#94a3b8',
  textLight: '#ffffff',
  
  // Status Colors
  success: '#16a34a',
  successLight: '#dcfce7',
  successDark: '#15803d',
  warning: '#ea580c',
  warningLight: '#ffedd5',
  warningDark: '#c2410c',
  error: '#dc2626',
  errorLight: '#fee2e2',
  errorDark: '#b91c1c',
  info: '#0284c7',
  infoLight: '#e0f2fe',
  infoDark: '#0369a1',
  
  // Borders & Dividers
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  
  // Specific & Festive UI Tokens
  whatsappGreen: '#25D366',
  whatsappGreenDark: '#128C7E',
  gold: '#d4af37',
  goldLight: '#fef08a',
  goldDark: '#a16207',
  drawerOverlay: 'rgba(0, 0, 0, 0.55)',
  shadow: '#0f172a',
  inputBg: '#f8fafc',
  inputFocusBg: '#ffffff',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Typography = {
  fontSizes: {
    xxs: 10,
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 34,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.3,
    relaxed: 1.5,
  },
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};
