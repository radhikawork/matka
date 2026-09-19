import { UserProfile } from '../types';

export const mockUser: UserProfile = {
  id: 'usr_1001',
  name: 'Radhika Sharma',
  mobile: '+919992244311',
  mPin: '1234',
  walletBalance: 2450,
  bankDetails: {
    accountHolderName: 'Radhika Sharma',
    accountNumber: '91999224431189',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
  },
  upiDetails: {
    googlePay: '9992244311',
    phonePe: '9992244311',
    paytm: '9992244311',
    upiId: 'radhika@upi',
  },
};
