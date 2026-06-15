export interface User {
  uid: string;
  email: string;
  displayName: string;
  initials: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  gigsCompleted: number;
  gigsPosted: number;
  reputation: number;
  ratingSum: number;
  ratingCount: number;
  streak: number;
  lastBonusDate: string | null;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  pin: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bonus' | 'gig_earned' | 'gig_paid' | 'referral' | 'signup';
  amount: number;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  description: string;
  timestamp: number;
  transferCode?: string;
}

export interface TransferCode {
  id: string;
  code: string;
  amount: number;
  fromUid: string;
  fromName: string;
  status: 'pending' | 'claimed' | 'expired';
  createdAt: number;
  claimedBy?: string;
  claimedAt?: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'needed' | 'offered';
  reward: number;
  postedBy: string;
  postedByName: string;
  claimedBy: string | null;
  claimedByName: string | null;
  status: 'open' | 'claimed' | 'completed' | 'rated';
  rating: number | null;
  ratingComment: string | null;
  createdAt: number;
  completedAt: number | null;
}

export type TabId = 'home' | 'gigs' | 'activity' | 'profile';

export type ModalType = 'send' | 'receive' | 'gig-form' | 'gig-detail' | 'rating' | 'daily-bonus' | null;

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
