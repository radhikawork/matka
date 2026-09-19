import { GameRate } from '../types';

export const regularGameRates: GameRate[] = [
  { id: 'gr_1', title: 'Single Digit', rate: '10 : 100', description: 'Win ₹100 on every ₹10 bid' },
  { id: 'gr_2', title: 'Jodi Digit', rate: '10 : 1000', description: 'Win ₹1,000 on every ₹10 bid' },
  { id: 'gr_3', title: 'Single Panna', rate: '10 : 1500', description: 'Win ₹1,500 on every ₹10 bid' },
  { id: 'gr_4', title: 'Double Panna', rate: '10 : 3000', description: 'Win ₹3,000 on every ₹10 bid' },
  { id: 'gr_5', title: 'Triple Panna', rate: '10 : 10000', description: 'Win ₹10,000 on every ₹10 bid' },
  { id: 'gr_6', title: 'Half Sangam', rate: '10 : 10000', description: 'Win ₹10,000 on every ₹10 bid' },
  { id: 'gr_7', title: 'Full Sangam', rate: '10 : 100000', description: 'Win ₹1,00,000 on every ₹10 bid' },
];

export const starlineGameRates: GameRate[] = [
  { id: 'st_r1', title: 'Single Digit', rate: '10 : 100', description: 'Win ₹100 on every ₹10 bid' },
  { id: 'st_r2', title: 'Single Panna', rate: '10 : 1500', description: 'Win ₹1,500 on every ₹10 bid' },
  { id: 'st_r3', title: 'Double Panna', rate: '10 : 3000', description: 'Win ₹3,000 on every ₹10 bid' },
  { id: 'st_r4', title: 'Triple Panna', rate: '10 : 10000', description: 'Win ₹10,000 on every ₹10 bid' },
];

export const jackpotGameRates: GameRate[] = [
  { id: 'jp_r1', title: 'Single Digit', rate: '10 : 95', description: 'Win ₹95 on every ₹10 bid' },
  { id: 'jp_r2', title: 'Jodi Digit', rate: '10 : 950', description: 'Win ₹950 on every ₹10 bid' },
];
