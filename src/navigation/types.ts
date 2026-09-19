import { MarketItem, GameType } from '../types';

export type RootStackParamList = {
  Login: undefined;
  MainDrawer: undefined;
  GameMarketDetails: { market: MarketItem };
  PlaceBid: { 
    market: MarketItem;
    gameType: GameType;
    gameTypeTitle: string;
    payoutRate: string;
  };
  StarlineHome: undefined;
  JackpotHome: undefined;
  AddFund: undefined;
  WithdrawFund: undefined;
  BankDetails: undefined;
  UpiDetails: undefined;
  Passbook: undefined;
  BidHistory: undefined;
  WinHistory: undefined;
  GameRates: undefined;
  HowToPlay: undefined;
  SubmitIdea: undefined;
  Settings: undefined;
  Notifications: undefined;
  // Admin Routes
  AdminDashboard: undefined;
  AdminMarkets: undefined;
  AdminDeclareResult: { marketId?: string; isStarline?: boolean } | undefined;
  AdminUsers: undefined;
  AdminBids: undefined;
  AdminFundRequests: undefined;
  AdminSettings: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  MyBidsDrawer: undefined;
  PassbookDrawer: undefined;
  WinHistoryDrawer: undefined;
  BidHistoryDrawer: undefined;
  GameRatesDrawer: undefined;
  HowToPlayDrawer: undefined;
  SubmitIdeaDrawer: undefined;
  SettingsDrawer: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  MyBidsTab: undefined;
  FundsTab: undefined;
  SettingsTab: undefined;
};
