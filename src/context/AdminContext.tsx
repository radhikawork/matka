import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MarketItem,
  StarlineSlot,
  BidItem,
  TransactionItem,
  GameRate,
  AdminUserItem,
  FundRequestItem,
  SystemNotice,
  AppSettings,
  AdminDashboardStats,
} from '../types';
import { mockMarkets } from '../mocks/marketsData';
import { mockStarlineSlots } from '../mocks/starlineData';
import { mockBids } from '../mocks/bidsData';
import { regularGameRates, starlineGameRates, jackpotGameRates } from '../mocks/gameRatesData';
import { mockTransactions } from '../mocks/transactionsData';
import { mockUser } from '../mocks/userData';

export interface ExtendedBidItem extends BidItem {
  userId: string;
  userName: string;
  userMobile: string;
  payoutMultiplier?: number;
}

interface AdminContextType {
  markets: MarketItem[];
  starlineSlots: StarlineSlot[];
  users: AdminUserItem[];
  bids: ExtendedBidItem[];
  transactions: TransactionItem[];
  fundRequests: FundRequestItem[];
  regularRates: GameRate[];
  starlineRates: GameRate[];
  jackpotRates: GameRate[];
  notices: SystemNotice[];
  appSettings: AppSettings;
  stats: AdminDashboardStats;

  // Market actions
  addMarket: (market: Omit<MarketItem, 'id'>) => void;
  updateMarket: (id: string, updates: Partial<MarketItem>) => void;
  deleteMarket: (id: string) => void;
  toggleMarketStatus: (id: string) => void;

  // Result Declaration
  declareMarketResult: (
    marketId: string,
    session: 'open' | 'close',
    pana: string,
    singleDigit: string,
  ) => { winnersCount: number; totalPayout: number };
  declareStarlineResult: (
    slotId: string,
    pana: string,
    singleDigit: string,
  ) => { winnersCount: number; totalPayout: number };

  // User actions
  adjustUserBalance: (
    userId: string,
    amount: number,
    type: 'credit' | 'debit',
    reason: string,
  ) => void;
  toggleUserStatus: (userId: string) => void;

  // Fund Request actions
  approveFundRequest: (requestId: string) => void;
  rejectFundRequest: (requestId: string, reason?: string) => void;
  createDepositRequest: (amount: number, method: string, refNo: string) => void;
  createWithdrawalRequest: (amount: number, method: string, details: string) => boolean;

  // Rates & Settings
  updateGameRate: (
    category: 'regular' | 'starline' | 'jackpot',
    id: string,
    newRate: string,
  ) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  addNotice: (notice: Omit<SystemNotice, 'id' | 'date'>) => void;
  toggleNoticeStatus: (id: string) => void;
  deleteNotice: (id: string) => void;
  
  // Refresh stats
  refreshStats: () => void;
}

const initialUsers: AdminUserItem[] = [
  {
    ...mockUser,
    status: 'active',
    joinedDate: '10 Aug 2026',
    totalBidsCount: 24,
    totalWonAmount: 11500,
  },
  {
    id: 'usr_1002',
    name: 'Amit Kumar',
    mobile: '+919876543210',
    mPin: '1122',
    walletBalance: 5200,
    status: 'active',
    joinedDate: '15 Aug 2026',
    totalBidsCount: 42,
    totalWonAmount: 28000,
    bankDetails: {
      accountHolderName: 'Amit Kumar',
      accountNumber: '4029182390192',
      ifscCode: 'HDFC0001829',
      bankName: 'HDFC Bank',
    },
    upiDetails: {
      upiId: 'amitkumar@okhdfcbank',
      phonePe: '9876543210',
    },
  },
  {
    id: 'usr_1003',
    name: 'Vikram Singh',
    mobile: '+919812345678',
    mPin: '3344',
    walletBalance: 850,
    status: 'active',
    joinedDate: '01 Sep 2026',
    totalBidsCount: 15,
    totalWonAmount: 3200,
    bankDetails: {
      accountHolderName: 'Vikram Singh',
      accountNumber: '5010029384910',
      ifscCode: 'ICIC0000542',
      bankName: 'ICICI Bank',
    },
    upiDetails: {
      upiId: 'vikram.singh@icici',
      googlePay: '9812345678',
    },
  },
  {
    id: 'usr_1004',
    name: 'Suresh Verma',
    mobile: '+919765432109',
    mPin: '5566',
    walletBalance: 120,
    status: 'blocked',
    joinedDate: '12 Jul 2026',
    totalBidsCount: 68,
    totalWonAmount: 15400,
  },
  {
    id: 'usr_1005',
    name: 'Rahul Jain',
    mobile: '+919988776655',
    mPin: '7788',
    walletBalance: 14200,
    status: 'active',
    joinedDate: '05 Sep 2026',
    totalBidsCount: 55,
    totalWonAmount: 64000,
    bankDetails: {
      accountHolderName: 'Rahul Jain',
      accountNumber: '1092837465019',
      ifscCode: 'PUNB0182900',
      bankName: 'Punjab National Bank',
    },
    upiDetails: {
      upiId: 'rahuljain@paytm',
      paytm: '9988776655',
    },
  },
];

const initialFundRequests: FundRequestItem[] = [
  {
    id: 'req_101',
    userId: 'usr_1001',
    userName: 'Radhika Sharma',
    userMobile: '+919992244311',
    type: 'deposit',
    amount: 1500,
    paymentMethod: 'Google Pay',
    paymentDetails: 'UPI Ref: 489201938201',
    referenceNumber: 'UPI489201938201',
    status: 'pending',
    requestDate: '19 Sep 2026',
    requestTime: '01:45 PM',
  },
  {
    id: 'req_102',
    userId: 'usr_1002',
    userName: 'Amit Kumar',
    userMobile: '+919876543210',
    type: 'withdrawal',
    amount: 2500,
    paymentMethod: 'Bank Transfer',
    paymentDetails: 'HDFC Bank - A/C 4029182390192 (IFSC: HDFC0001829)',
    referenceNumber: 'WTH89201923',
    status: 'pending',
    requestDate: '19 Sep 2026',
    requestTime: '12:30 PM',
  },
  {
    id: 'req_103',
    userId: 'usr_1005',
    userName: 'Rahul Jain',
    userMobile: '+919988776655',
    type: 'withdrawal',
    amount: 5000,
    paymentMethod: 'UPI',
    paymentDetails: 'rahuljain@paytm',
    referenceNumber: 'WTH78923019',
    status: 'pending',
    requestDate: '19 Sep 2026',
    requestTime: '11:15 AM',
  },
  {
    id: 'req_104',
    userId: 'usr_1003',
    userName: 'Vikram Singh',
    userMobile: '+919812345678',
    type: 'deposit',
    amount: 2000,
    paymentMethod: 'PhonePe',
    paymentDetails: 'UPI Ref: 678912345678',
    referenceNumber: 'UPI678912345678',
    status: 'approved',
    requestDate: '18 Sep 2026',
    requestTime: '05:20 PM',
  },
  {
    id: 'req_105',
    userId: 'usr_1004',
    userName: 'Suresh Verma',
    userMobile: '+919765432109',
    type: 'withdrawal',
    amount: 1000,
    paymentMethod: 'UPI',
    paymentDetails: 'suresh@upi',
    referenceNumber: 'WTH54673829',
    status: 'rejected',
    requestDate: '17 Sep 2026',
    requestTime: '02:00 PM',
    remarks: 'Incorrect UPI ID provided',
  },
];

const initialExtendedBids: ExtendedBidItem[] = mockBids.map((bid, index) => {
  const user = initialUsers[index % initialUsers.length];
  return {
    ...bid,
    userId: user.id,
    userName: user.name,
    userMobile: user.mobile,
  };
});

const initialNotices: SystemNotice[] = [
  {
    id: 'not_1',
    title: 'Festival Bonanza Offer! 🎉',
    message: 'Get 5% extra cash bonus on all UPI deposits above ₹2,000 today!',
    type: 'info',
    isActive: true,
    date: '19 Sep 2026',
  },
  {
    id: 'not_2',
    title: 'Kalyan Night Time Revised',
    message: 'Kalyan Night closing time has been extended to 11:30 PM for tonight.',
    type: 'warning',
    isActive: true,
    date: '18 Sep 2026',
  },
  {
    id: 'not_3',
    title: 'Bank Withdrawal Notice',
    message: 'Bank withdrawal requests are processed between 10:00 AM to 08:00 PM daily.',
    type: 'info',
    isActive: true,
    date: '15 Sep 2026',
  },
];

const initialAppSettings: AppSettings = {
  appName: 'Matka Bro Admin',
  maintenanceMode: false,
  minDeposit: 500,
  maxDeposit: 50000,
  minWithdrawal: 1000,
  maxWithdrawal: 100000,
  supportPhone: '+917206406325',
  upiId: 'matkabro@upi',
  marqueeNotice: '⚡ Matka Bro: Fastest Live Results, Instant Automatic Winning Settlement & 24x7 Customer Support! ⚡',
  isMarqueeActive: true,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<MarketItem[]>(mockMarkets);
  const [starlineSlots, setStarlineSlots] = useState<StarlineSlot[]>(mockStarlineSlots);
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [bids, setBids] = useState<ExtendedBidItem[]>(initialExtendedBids);
  const [transactions, setTransactions] = useState<TransactionItem[]>(mockTransactions);
  const [fundRequests, setFundRequests] = useState<FundRequestItem[]>(initialFundRequests);
  const [regularRates, setRegularRates] = useState<GameRate[]>(regularGameRates);
  const [starlineRates, setStarlineRates] = useState<GameRate[]>(starlineGameRates);
  const [jackpotRates, setJackpotRates] = useState<GameRate[]>(jackpotGameRates);
  const [notices, setNotices] = useState<SystemNotice[]>(initialNotices);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);

  // Computed Stats
  const calculateStats = (): AdminDashboardStats => {
    const totalUsers = users.length;
    const totalWalletBalance = users.reduce((acc, u) => acc + u.walletBalance, 0);
    const todayBidsTotal = bids.reduce((acc, b) => acc + b.points, 0);
    const todayBidsCount = bids.length;
    const todayWinsTotal = bids
      .filter((b) => b.status === 'won')
      .reduce((acc, b) => acc + (b.winAmount || 0), 0);
    const todayProfit = todayBidsTotal - todayWinsTotal;
    const pendingDepositsCount = fundRequests.filter(
      (r) => r.type === 'deposit' && r.status === 'pending',
    ).length;
    const pendingWithdrawalsCount = fundRequests.filter(
      (r) => r.type === 'withdrawal' && r.status === 'pending',
    ).length;
    const activeMarketsCount = markets.filter((m) => m.isOpen).length;

    return {
      totalUsers,
      totalWalletBalance,
      todayBidsTotal,
      todayBidsCount,
      todayWinsTotal,
      todayProfit,
      pendingDepositsCount,
      pendingWithdrawalsCount,
      activeMarketsCount,
    };
  };

  const [stats, setStats] = useState<AdminDashboardStats>(calculateStats);

  useEffect(() => {
    setStats(calculateStats());
  }, [users, bids, fundRequests, markets]);

  const refreshStats = () => {
    setStats(calculateStats());
  };

  // Markets Management
  const addMarket = (newMarketData: Omit<MarketItem, 'id'>) => {
    const newId = `mkt_${Date.now()}`;
    const newMarket: MarketItem = {
      ...newMarketData,
      id: newId,
    };
    setMarkets((prev) => [newMarket, ...prev]);
  };

  const updateMarket = (id: string, updates: Partial<MarketItem>) => {
    setMarkets((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  };

  const deleteMarket = (id: string) => {
    setMarkets((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMarketStatus = (id: string) => {
    setMarkets((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextOpen = !m.isOpen;
          return {
            ...m,
            isOpen: nextOpen,
            statusText: nextOpen ? 'Running for Open' : 'Closed for Today',
          };
        }
        return m;
      }),
    );
  };

  // Result Declaration & Auto Winner Settlement
  const declareMarketResult = (
    marketId: string,
    session: 'open' | 'close',
    pana: string,
    singleDigit: string,
  ) => {
    const targetMarket = markets.find((m) => m.id === marketId);
    if (!targetMarket) return { winnersCount: 0, totalPayout: 0 };

    // Format new result string
    // e.g. "348-56-123" or "***-**-***"
    let currentResultParts = targetMarket.result.split('-');
    if (currentResultParts.length < 3) {
      currentResultParts = ['***', '**', '***'];
    }

    let updatedResult = '';
    if (session === 'open') {
      const openPana = pana.padEnd(3, '*');
      const openDigit = singleDigit || '*';
      const closeDigit = currentResultParts[1]?.length === 2 ? currentResultParts[1][1] : '*';
      const jodi = `${openDigit}${closeDigit}`;
      const closePana = currentResultParts[2] || '***';
      updatedResult = `${openPana}-${jodi}-${closePana}`;
    } else {
      const openPana = currentResultParts[0] || '***';
      const openDigit = currentResultParts[1]?.length === 2 ? currentResultParts[1][0] : '*';
      const closeDigit = singleDigit || '*';
      const jodi = `${openDigit}${closeDigit}`;
      const closePana = pana.padEnd(3, '*');
      updatedResult = `${openPana}-${jodi}-${closePana}`;
    }

    // Update Market
    updateMarket(marketId, {
      result: updatedResult,
      statusText: session === 'open' ? 'Running for Close' : 'Closed for Today',
      isOpen: session === 'open',
      isClosedForDay: session === 'close',
    });

    // Settle Bids for this market and session
    let winnersCount = 0;
    let totalPayout = 0;
    const winningUserAmounts: Record<string, number> = {};

    setBids((prevBids) =>
      prevBids.map((bid) => {
        if (bid.marketId === marketId && bid.status === 'pending') {
          let isWin = false;
          let winMultiplier = 0;

          if (bid.session === session || session === 'close') {
            if (bid.gameType === 'single_digit' && bid.digit === singleDigit) {
              isWin = true;
              winMultiplier = 10; // 10:100 -> 10x
            } else if (
              (bid.gameType === 'single_panna' ||
                bid.gameType === 'double_panna' ||
                bid.gameType === 'triple_panna') &&
              bid.digit === pana
            ) {
              isWin = true;
              winMultiplier =
                bid.gameType === 'single_panna'
                  ? 150
                  : bid.gameType === 'double_panna'
                  ? 300
                  : 1000;
            } else if (bid.gameType === 'jodi_digit' && session === 'close') {
              const fullJodi = updatedResult.split('-')[1];
              if (bid.digit === fullJodi) {
                isWin = true;
                winMultiplier = 100; // 10:1000 -> 100x
              }
            }
          }

          if (isWin) {
            const winAmount = bid.points * winMultiplier;
            winnersCount++;
            totalPayout += winAmount;
            winningUserAmounts[bid.userId] =
              (winningUserAmounts[bid.userId] || 0) + winAmount;

            return {
              ...bid,
              status: 'won',
              winAmount,
            };
          } else if (bid.session === session || session === 'close') {
            return {
              ...bid,
              status: 'lost',
            };
          }
        }
        return bid;
      }),
    );

    // Credit Winnings to User Wallets
    if (Object.keys(winningUserAmounts).length > 0) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (winningUserAmounts[u.id]) {
            return {
              ...u,
              walletBalance: u.walletBalance + winningUserAmounts[u.id],
              totalWonAmount: u.totalWonAmount + winningUserAmounts[u.id],
            };
          }
          return u;
        }),
      );

      // Add Winning Transaction
      Object.entries(winningUserAmounts).forEach(([uId, amount]) => {
        const u = users.find((x) => x.id === uId);
        const newTx: TransactionItem = {
          id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          type: 'bid_won',
          title: `Won: ${targetMarket.name}`,
          description: `Automatic winning payout settled for ${session.toUpperCase()}`,
          amount,
          balanceAfter: (u?.walletBalance || 0) + amount,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'success',
          txNumber: `WIN${Date.now()}`,
        };
        setTransactions((prev) => [newTx, ...prev]);
      });
    }

    return { winnersCount, totalPayout };
  };

  // Declare Starline Result
  const declareStarlineResult = (
    slotId: string,
    pana: string,
    singleDigit: string,
  ) => {
    const formattedResult = `${pana}-${singleDigit}`;
    setStarlineSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              result: formattedResult,
              isOpen: false,
              statusText: 'Closed',
            }
          : s,
      ),
    );

    let winnersCount = 0;
    let totalPayout = 0;
    const winningUserAmounts: Record<string, number> = {};

    setBids((prev) =>
      prev.map((bid) => {
        if (bid.marketId === slotId && bid.status === 'pending') {
          let isWin = false;
          let multiplier = 0;
          if (bid.gameType === 'single_digit' && bid.digit === singleDigit) {
            isWin = true;
            multiplier = 10;
          } else if (bid.digit === pana) {
            isWin = true;
            multiplier = 150;
          }

          if (isWin) {
            const winAmount = bid.points * multiplier;
            winnersCount++;
            totalPayout += winAmount;
            winningUserAmounts[bid.userId] =
              (winningUserAmounts[bid.userId] || 0) + winAmount;
            return { ...bid, status: 'won', winAmount };
          } else {
            return { ...bid, status: 'lost' };
          }
        }
        return bid;
      }),
    );

    // Credit Starline winners
    if (Object.keys(winningUserAmounts).length > 0) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (winningUserAmounts[u.id]) {
            return {
              ...u,
              walletBalance: u.walletBalance + winningUserAmounts[u.id],
              totalWonAmount: u.totalWonAmount + winningUserAmounts[u.id],
            };
          }
          return u;
        }),
      );
    }

    return { winnersCount, totalPayout };
  };

  // User Management
  const adjustUserBalance = (
    userId: string,
    amount: number,
    type: 'credit' | 'debit',
    reason: string,
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          const newBal =
            type === 'credit'
              ? u.walletBalance + amount
              : Math.max(0, u.walletBalance - amount);
          return { ...u, walletBalance: newBal };
        }
        return u;
      }),
    );

    const userObj = users.find((u) => u.id === userId);
    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: type === 'credit' ? 'deposit' : 'withdrawal',
      title: type === 'credit' ? 'Admin Wallet Credit' : 'Admin Wallet Debit',
      description: reason || 'Manual balance adjustment by Admin',
      amount: type === 'credit' ? amount : -amount,
      balanceAfter:
        type === 'credit'
          ? (userObj?.walletBalance || 0) + amount
          : Math.max(0, (userObj?.walletBalance || 0) - amount),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'success',
      txNumber: `ADM${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
          : u,
      ),
    );
  };

  // Fund Requests (Deposit & Withdrawal Approval/Rejection)
  const approveFundRequest = (requestId: string) => {
    const request = fundRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    setFundRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r)),
    );

    if (request.type === 'deposit') {
      // Credit to User Wallet
      adjustUserBalance(
        request.userId,
        request.amount,
        'credit',
        `Deposit approved (${request.paymentMethod} - Ref: ${request.referenceNumber})`,
      );
    } else if (request.type === 'withdrawal') {
      // Record transaction
      const targetUser = users.find((u) => u.id === request.userId);
      const newTx: TransactionItem = {
        id: `tx_${Date.now()}`,
        type: 'withdrawal',
        title: 'Withdrawal Processed',
        description: `Transferred via ${request.paymentMethod} (${request.paymentDetails})`,
        amount: -request.amount,
        balanceAfter: targetUser?.walletBalance || 0,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        txNumber: request.referenceNumber || `WTH${Date.now()}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const rejectFundRequest = (requestId: string, reason?: string) => {
    const request = fundRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    setFundRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected', remarks: reason || 'Rejected by Admin' }
          : r,
      ),
    );

    if (request.type === 'withdrawal') {
      // Refund back to user's wallet
      adjustUserBalance(
        request.userId,
        request.amount,
        'credit',
        `Withdrawal Rejected Refund: ${reason || 'Failed to process payout'}`,
      );
    }
  };

  const createDepositRequest = (amount: number, method: string, refNo: string) => {
    const newReq: FundRequestItem = {
      id: `req_${Date.now()}`,
      userId: mockUser.id,
      userName: mockUser.name,
      userMobile: mockUser.mobile,
      type: 'deposit',
      amount,
      paymentMethod: (method as any) || 'UPI',
      paymentDetails: `Ref: ${refNo}`,
      referenceNumber: refNo || `DEP${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      requestTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setFundRequests((prev) => [newReq, ...prev]);
  };

  const createWithdrawalRequest = (amount: number, method: string, details: string): boolean => {
    const targetUser = users.find((u) => u.id === mockUser.id);
    if (!targetUser || targetUser.walletBalance < amount) {
      return false;
    }

    // Deduct immediately on placing withdrawal request
    adjustUserBalance(
      mockUser.id,
      amount,
      'debit',
      `Withdrawal Requested (${method} - ${details})`,
    );

    const newReq: FundRequestItem = {
      id: `req_${Date.now()}`,
      userId: mockUser.id,
      userName: mockUser.name,
      userMobile: mockUser.mobile,
      type: 'withdrawal',
      amount,
      paymentMethod: (method as any) || 'Bank Transfer',
      paymentDetails: details,
      referenceNumber: `WTH${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      requestTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setFundRequests((prev) => [newReq, ...prev]);
    return true;
  };

  // Rates & Settings
  const updateGameRate = (
    category: 'regular' | 'starline' | 'jackpot',
    id: string,
    newRate: string,
  ) => {
    if (category === 'regular') {
      setRegularRates((prev) =>
        prev.map((r) => (r.id === id ? { ...r, rate: newRate } : r)),
      );
    } else if (category === 'starline') {
      setStarlineRates((prev) =>
        prev.map((r) => (r.id === id ? { ...r, rate: newRate } : r)),
      );
    } else {
      setJackpotRates((prev) =>
        prev.map((r) => (r.id === id ? { ...r, rate: newRate } : r)),
      );
    }
  };

  const updateAppSettings = (updates: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...updates }));
  };

  const addNotice = (newNoticeData: Omit<SystemNotice, 'id' | 'date'>) => {
    const newNotice: SystemNotice = {
      ...newNoticeData,
      id: `not_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const toggleNoticeStatus = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n)),
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        markets,
        starlineSlots,
        users,
        bids,
        transactions,
        fundRequests,
        regularRates,
        starlineRates,
        jackpotRates,
        notices,
        appSettings,
        stats,
        addMarket,
        updateMarket,
        deleteMarket,
        toggleMarketStatus,
        declareMarketResult,
        declareStarlineResult,
        adjustUserBalance,
        toggleUserStatus,
        approveFundRequest,
        rejectFundRequest,
        createDepositRequest,
        createWithdrawalRequest,
        updateGameRate,
        updateAppSettings,
        addNotice,
        toggleNoticeStatus,
        deleteNotice,
        refreshStats,
      }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
