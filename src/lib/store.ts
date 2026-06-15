import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Transaction, TransferCode, Gig, TabId, ModalType, Toast } from '@/types';
import { generateId, generateTransferCode, generateReferralCode, getInitials, getTodayString } from './utils';
import { soundEngine } from './soundEngine';
import { createFirebasePIN, claimFirebasePIN } from './firebasePins';

interface GigDetailPayload {
  gig: Gig;
}

interface RatingPayload {
  gig: Gig;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  authScreen: 'onboarding' | 'login' | 'signup';

  // Navigation
  activeTab: TabId;
  activeModal: ModalType;
  modalData: GigDetailPayload | RatingPayload | null;

  // Data
  transactions: Transaction[];
  transferCodes: TransferCode[];
  gigs: Gig[];
  allUsers: User[];

  // UI
  toasts: Toast[];
  coinAnimationActive: boolean;
  isLoading: boolean;

  // Auth actions
  signup: (email: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthScreen: (screen: 'onboarding' | 'login' | 'signup') => void;
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  
  // ADD THIS MISSING ACTION:
  setCurrentUser: (user: User | null) => void;

  // Navigation actions
  setActiveTab: (tab: TabId) => void;
  openModal: (modal: ModalType, data?: GigDetailPayload | RatingPayload) => void;
  closeModal: () => void;

  // Transaction actions (UPDATED for Firebase cross-device)
  createTransferCode: (amount: number) => Promise<{ code: string } | null>;
  claimTransferCode: (code: string) => Promise<boolean>;

  // Gig actions
  postGig: (title: string, description: string, category: string, type: 'needed' | 'offered', reward: number) => boolean;
  claimGig: (gigId: string) => boolean;
  completeGig: (gigId: string) => boolean;
  rateGig: (gigId: string, rating: number, comment: string) => boolean;

  // Bonus actions
  claimDailyBonus: () => { amount: number; streak: number } | null;

  // UI actions
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  triggerCoinAnimation: () => void;
}

const SIGNUP_BONUS = 50;
const REFERRAL_BONUS = 25;
const DAILY_BONUS_BASE = 5;
const STREAK_MULTIPLIER = 1;

const SEED_USERS: User[] = [
  {
    uid: 'seed-1', email: 'alex@campus.edu', displayName: 'Alex Rivera', initials: 'AR',
    balance: 230, totalEarned: 380, totalSpent: 150, gigsCompleted: 8, gigsPosted: 3,
    reputation: 4.7, ratingSum: 47, ratingCount: 10, streak: 5, lastBonusDate: getTodayString(),
    referralCode: 'ALEX23', referredBy: null, referralCount: 2, pin: '1234', createdAt: Date.now() - 86400000 * 14,
  },
  {
    uid: 'seed-2', email: 'jordan@campus.edu', displayName: 'Jordan Chen', initials: 'JC',
    balance: 175, totalEarned: 290, totalSpent: 115, gigsCompleted: 5, gigsPosted: 6,
    reputation: 4.5, ratingSum: 36, ratingCount: 8, streak: 3, lastBonusDate: getTodayString(),
    referralCode: 'JORD56', referredBy: null, referralCount: 1, pin: '1234', createdAt: Date.now() - 86400000 * 10,
  },
  {
    uid: 'seed-3', email: 'maya@campus.edu', displayName: 'Maya Patel', initials: 'MP',
    balance: 310, totalEarned: 450, totalSpent: 140, gigsCompleted: 12, gigsPosted: 4,
    reputation: 4.9, ratingSum: 49, ratingCount: 10, streak: 7, lastBonusDate: getTodayString(),
    referralCode: 'MAYA78', referredBy: null, referralCount: 3, pin: '1234', createdAt: Date.now() - 86400000 * 21,
  },
];

const SEED_GIGS: Gig[] = [];

function createSeedTransactions(): Transaction[] {
  return [
    {
      id: 'tx-seed-1', type: 'received', amount: 30, fromUid: 'seed-1', fromName: 'Alex Rivera',
      toUid: 'seed-2', toName: 'Jordan Chen', description: 'Tutoring session payment',
      timestamp: Date.now() - 3600000 * 3,
    },
    {
      id: 'tx-seed-2', type: 'gig_earned', amount: 25, fromUid: 'seed-3', fromName: 'Maya Patel',
      toUid: 'seed-2', toName: 'Jordan Chen', description: 'Flyer design completed',
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: 'tx-seed-3', type: 'bonus', amount: 10, fromUid: 'system', fromName: 'Bitzen',
      toUid: 'seed-1', toName: 'Alex Rivera', description: 'Daily login bonus - Day 5',
      timestamp: Date.now() - 3600000 * 6,
    },
  ];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      authScreen: 'onboarding',
      activeTab: 'home',
      activeModal: null,
      modalData: null,
      transactions: createSeedTransactions(),
      transferCodes: [],
      gigs: SEED_GIGS,
      allUsers: SEED_USERS,
      toasts: [],
      coinAnimationActive: false,
      isLoading: false,

      // ========== ADD THIS MISSING ACTION ==========
      setCurrentUser: (user) => {
        set({ 
          currentUser: user, 
          isAuthenticated: !!user 
        });
        if (user) {
          localStorage.setItem('bitzen_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('bitzen_user');
        }
      },
      // ============================================

      // Auth actions (update these to work with Firebase)
      signup: async (email, _password, name, referralCode) => {
        // This is now handled by SignupForm with Firebase
        // Keep for fallback but return false
        get().addToast('Please use the signup form with Firebase', 'error');
        return false;
      },

      login: async (email, _password) => {
        // This is now handled by LoginForm with Firebase
        get().addToast('Please use the login form with Firebase', 'error');
        return false;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authScreen: 'onboarding',
          activeTab: 'home',
          activeModal: null,
        });
        localStorage.removeItem('bitzen_user');
      },

      setAuthScreen: (screen) => set({ authScreen: screen }),
      
      setPin: (pin) => {
        const { currentUser, allUsers } = get();
        if (!currentUser) return;
        const updated = { ...currentUser, pin };
        set({
          currentUser: updated,
          allUsers: allUsers.map(u => u.uid === currentUser.uid ? updated : u),
        });
      },

      verifyPin: (pin) => {
        const { currentUser } = get();
        return currentUser?.pin === pin;
      },

      // Navigation
      setActiveTab: (tab) => {
        soundEngine.click();
        set({ activeTab: tab });
      },

      openModal: (modal, data) => set({ activeModal: modal, modalData: data || null }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Transfer codes with Firebase cross-device support
      createTransferCode: async (amount: number) => {
        const currentUser = get().currentUser;
        if (!currentUser || currentUser.balance < amount || amount <= 0) {
          get().addToast('Insufficient balance', 'error');
          soundEngine.error();
          return null;
        }

        const code = await createFirebasePIN(amount, currentUser.uid);
        
        if (!code) {
          get().addToast('Failed to generate code. Check your internet connection.', 'error');
          return null;
        }

        const updatedUser = {
          ...currentUser,
          balance: currentUser.balance - amount,
          totalSpent: currentUser.totalSpent + amount,
        };

        const transferCodeObj: TransferCode = {
          id: generateId(),
          code: code,
          amount,
          fromUid: currentUser.uid,
          fromName: currentUser.displayName,
          status: 'pending',
          createdAt: Date.now(),
        };

        set({
          currentUser: updatedUser,
          allUsers: get().allUsers.map(u => u.uid === currentUser.uid ? updatedUser : u),
          transferCodes: [transferCodeObj, ...get().transferCodes],
        });

        soundEngine.send();
        get().triggerCoinAnimation();
        get().addToast(`Code generated! Share with your friend.`, 'success');
        return { code };
      },

      claimTransferCode: async (inputCode: string) => {
        const currentUser = get().currentUser;
        if (!currentUser) {
          get().addToast('Please log in first', 'error');
          return false;
        }

        const existingLocalCode = get().transferCodes.find(c => c.code === inputCode && c.fromUid === currentUser.uid);
        if (existingLocalCode) {
          get().addToast('Cannot claim your own code', 'error');
          soundEngine.error();
          return false;
        }

        const result = await claimFirebasePIN(inputCode, currentUser.uid);
        
        if (!result.success) {
          get().addToast(result.message || 'Invalid or expired code', 'error');
          soundEngine.error();
          return false;
        }

        const updatedUser = {
          ...currentUser,
          balance: currentUser.balance + (result.amount || 0),
          totalEarned: currentUser.totalEarned + (result.amount || 0),
        };

        const receiveTx: Transaction = {
          id: generateId(),
          type: 'received',
          amount: result.amount || 0,
          fromUid: result.senderId || 'unknown',
          fromName: 'Friend',
          toUid: currentUser.uid,
          toName: currentUser.displayName,
          description: `Transfer received`,
          timestamp: Date.now(),
          transferCode: inputCode,
        };

        const updatedTransferCodes = get().transferCodes.map(c => 
          c.code === inputCode ? { ...c, status: 'claimed' as const, claimedBy: currentUser.uid, claimedAt: Date.now() } : c
        );

        set({
          currentUser: updatedUser,
          allUsers: get().allUsers.map(u => u.uid === currentUser.uid ? updatedUser : u),
          transactions: [receiveTx, ...get().transactions],
          transferCodes: updatedTransferCodes,
        });

        soundEngine.receive();
        get().triggerCoinAnimation();
        get().addToast(`Received ${result.amount} coins!`, 'success');
        return true;
      },

      // Gigs (keep as is)
      postGig: (title, description, category, type, reward) => {
        const { currentUser, gigs } = get();
        if (!currentUser) return false;

        if (type === 'needed' && currentUser.balance < reward) {
          get().addToast('Insufficient balance for gig reward', 'error');
          return false;
        }

        const gig: Gig = {
          id: generateId(),
          title,
          description,
          category,
          type,
          reward,
          postedBy: currentUser.uid,
          postedByName: currentUser.displayName,
          claimedBy: null,
          claimedByName: null,
          status: 'open',
          rating: null,
          ratingComment: null,
          createdAt: Date.now(),
          completedAt: null,
        };

        const updatedUser = { ...currentUser, gigsPosted: currentUser.gigsPosted + 1 };
        set({
          gigs: [gig, ...gigs],
          currentUser: updatedUser,
          allUsers: get().allUsers.map(u => u.uid === currentUser.uid ? updatedUser : u),
        });

        soundEngine.click();
        get().addToast('Gig posted successfully!', 'success');
        return true;
      },

      claimGig: (gigId) => {
        const { currentUser, gigs } = get();
        if (!currentUser) return false;

        const gigIdx = gigs.findIndex(g => g.id === gigId);
        if (gigIdx === -1) return false;

        const gig = gigs[gigIdx];
        if (gig.postedBy === currentUser.uid) {
          get().addToast('Cannot claim your own gig', 'error');
          return false;
        }
        if (gig.status !== 'open') {
          get().addToast('This gig is no longer available', 'error');
          return false;
        }

        const updatedGig = {
          ...gig,
          claimedBy: currentUser.uid,
          claimedByName: currentUser.displayName,
          status: 'claimed' as const,
        };

        const updatedGigs = [...gigs];
        updatedGigs[gigIdx] = updatedGig;

        set({ gigs: updatedGigs });
        soundEngine.click();
        get().addToast(`You claimed "${gig.title}"`, 'success');
        return true;
      },

      completeGig: (gigId) => {
        const { currentUser, gigs, allUsers, transactions } = get();
        if (!currentUser) return false;

        const gigIdx = gigs.findIndex(g => g.id === gigId);
        if (gigIdx === -1) return false;

        const gig = gigs[gigIdx];
        if (gig.status !== 'claimed') return false;

        const completedGig = { ...gig, status: 'completed' as const, completedAt: Date.now() };
        const updatedGigs = [...gigs];
        updatedGigs[gigIdx] = completedGig;

        const worker = gig.type === 'needed' ? gig.claimedBy! : gig.postedBy;
        const payer = gig.type === 'needed' ? gig.postedBy : gig.claimedBy!;

        const workerUser = allUsers.find(u => u.uid === worker);
        const payerUser = allUsers.find(u => u.uid === payer);

        if (!workerUser || !payerUser) return false;

        const updatedWorker = {
          ...workerUser,
          balance: workerUser.balance + gig.reward,
          totalEarned: workerUser.totalEarned + gig.reward,
          gigsCompleted: workerUser.gigsCompleted + 1,
        };

        const updatedPayer = {
          ...payerUser,
          balance: payerUser.balance - gig.reward,
          totalSpent: payerUser.totalSpent + gig.reward,
        };

        const tx: Transaction = {
          id: generateId(),
          type: 'gig_earned',
          amount: gig.reward,
          fromUid: payer,
          fromName: payerUser.displayName,
          toUid: worker,
          toName: workerUser.displayName,
          description: `Gig completed: ${gig.title}`,
          timestamp: Date.now(),
        };

        let updatedCurrentUser = currentUser;
        if (currentUser.uid === worker) updatedCurrentUser = updatedWorker;
        else if (currentUser.uid === payer) updatedCurrentUser = updatedPayer;

        set({
          gigs: updatedGigs,
          currentUser: updatedCurrentUser,
          allUsers: allUsers.map(u => {
            if (u.uid === worker) return updatedWorker;
            if (u.uid === payer) return updatedPayer;
            return u;
          }),
          transactions: [tx, ...transactions],
        });

        soundEngine.receive();
        get().triggerCoinAnimation();
        get().addToast(`Gig completed! ${gig.reward} coins transferred`, 'success');
        return true;
      },

      rateGig: (gigId, rating, comment) => {
        const { gigs, allUsers } = get();
        const gigIdx = gigs.findIndex(g => g.id === gigId);
        if (gigIdx === -1) return false;

        const gig = gigs[gigIdx];
        const ratedGig = { ...gig, status: 'rated' as const, rating, ratingComment: comment };
        const updatedGigs = [...gigs];
        updatedGigs[gigIdx] = ratedGig;

        const workerUid = gig.type === 'needed' ? gig.claimedBy! : gig.postedBy;
        const worker = allUsers.find(u => u.uid === workerUid);
        if (worker) {
          const newSum = worker.ratingSum + rating;
          const newCount = worker.ratingCount + 1;
          const updatedWorker = {
            ...worker,
            ratingSum: newSum,
            ratingCount: newCount,
            reputation: Math.round((newSum / newCount) * 10) / 10,
          };
          set({
            gigs: updatedGigs,
            allUsers: allUsers.map(u => u.uid === workerUid ? updatedWorker : u),
          });
        } else {
          set({ gigs: updatedGigs });
        }

        soundEngine.click();
        get().addToast('Rating submitted', 'success');
        return true;
      },

      // Daily bonus
      claimDailyBonus: () => {
        const { currentUser, allUsers, transactions } = get();
        if (!currentUser) return null;

        const today = getTodayString();
        if (currentUser.lastBonusDate === today) {
          get().addToast('Already claimed today', 'info');
          return null;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = currentUser.lastBonusDate === yesterdayStr ? currentUser.streak + 1 : 1;
        const bonusAmount = DAILY_BONUS_BASE + (newStreak - 1) * STREAK_MULTIPLIER;

        const updatedUser = {
          ...currentUser,
          balance: currentUser.balance + bonusAmount,
          totalEarned: currentUser.totalEarned + bonusAmount,
          streak: newStreak,
          lastBonusDate: today,
        };

        const tx: Transaction = {
          id: generateId(),
          type: 'bonus',
          amount: bonusAmount,
          fromUid: 'system',
          fromName: 'Bitzen',
          toUid: currentUser.uid,
          toName: currentUser.displayName,
          description: `Daily bonus - Day ${newStreak}`,
          timestamp: Date.now(),
        };

        set({
          currentUser: updatedUser,
          allUsers: allUsers.map(u => u.uid === currentUser.uid ? updatedUser : u),
          transactions: [tx, ...transactions],
        });

        soundEngine.bonus();
        get().triggerCoinAnimation();
        return { amount: bonusAmount, streak: newStreak };
      },

      // UI
      addToast: (message, type = 'info') => {
        const id = generateId();
        const toast: Toast = { id, message, type };
        set(state => ({ toasts: [...state.toasts, toast] }));
        soundEngine.toast();
        setTimeout(() => {
          set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
        }, 3000);
      },

      removeToast: (id) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
      },

      triggerCoinAnimation: () => {
        set({ coinAnimationActive: true });
        setTimeout(() => set({ coinAnimationActive: false }), 1500);
      },
    }),
    {
      name: 'bitzen-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        transactions: state.transactions,
        transferCodes: state.transferCodes,
        gigs: state.gigs,
        allUsers: state.allUsers,
      }),
    }
  )
);
