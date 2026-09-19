export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  mPin: string;
  walletBalance: number;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  upiDetails?: {
    googlePay?: string;
    phonePe?: string;
    paytm?: string;
    upiId?: string;
  };
}

export interface MarketItem {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  result: string; // e.g. "123-6-456" or "***-**-***"
  isOpen: boolean;
  isClosedForDay: boolean;
  statusText: string;
}

export type GameType = 
  | 'single_digit'
  | 'jodi_digit'
  | 'single_panna'
  | 'double_panna'
  | 'triple_panna'
  | 'half_sangam'
  | 'full_sangam';

export interface GameTypeOption {
  id: GameType;
  title: string;
  payoutRate: string; // e.g. "10/100"
  iconName?: string;
}

export interface BidItem {
  id: string;
  marketId: string;
  marketName: string;
  gameType: GameType | string;
  gameTypeTitle: string;
  session: 'open' | 'close';
  digit: string;
  points: number;
  date: string;
  status: 'pending' | 'won' | 'lost';
  winAmount?: number;
}

export interface StarlineSlot {
  id: string;
  timeSlot: string; // e.g. "10:00 AM"
  openTime: string;
  closeTime: string;
  result: string;
  isOpen: boolean;
  statusText: string;
}

export interface TransactionItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bid_placed' | 'bid_won';
  title: string;
  description: string;
  amount: number;
  balanceAfter: number;
  date: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
  txNumber: string;
}

export interface GameRate {
  id: string;
  title: string;
  rate: string;
  description?: string;
}

// Admin Types
export interface AdminUserItem extends UserProfile {
  status: 'active' | 'blocked';
  joinedDate: string;
  totalBidsCount: number;
  totalWonAmount: number;
}

export interface FundRequestItem {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'PhonePe' | 'Google Pay' | 'Paytm';
  paymentDetails: string;
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  requestTime: string;
  remarks?: string;
}

export interface SystemNotice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  isActive: boolean;
  date: string;
}

export interface AppSettings {
  appName: string;
  maintenanceMode: boolean;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  supportPhone: string;
  upiId: string;
  marqueeNotice: string;
  isMarqueeActive: boolean;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalWalletBalance: number;
  todayBidsTotal: number;
  todayBidsCount: number;
  todayWinsTotal: number;
  todayProfit: number;
  pendingDepositsCount: number;
  pendingWithdrawalsCount: number;
  activeMarketsCount: number;
}
