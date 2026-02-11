// lib/firestore.ts
import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { StrategyIntent } from './strategyFraming';

// User profile data structure
export interface UserProfile {
  email: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  onboardingCompletedAt?: Timestamp;
  
  // Onboarding data
  onboardingAnswers?: Record<string, any>;
  derivedProfile?: Record<string, any>;
  recommendedIntent?: StrategyIntent;
  activeIntent?: StrategyIntent; // User may switch from recommended
  
  // Investment tracking (Phase 3)
  walletAddress?: string;
  hasInvested?: boolean;
  investments?: Array<{
    fundIntent: StrategyIntent;
    dhedgePoolAddress: string;
    investedAt: Timestamp;
    initialAmount?: number;
  }>;
}

/**
 * Create a new user profile in Firestore when they sign up
 */
export async function createUserProfile(userId: string, email: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    email,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return userSnap.data() as UserProfile;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    lastLoginAt: serverTimestamp(),
  });
}

/**
 * Save onboarding data (answers, derived profile, recommendation)
 */
export async function saveOnboardingData(
  userId: string,
  data: {
    onboardingAnswers: Record<string, any>;
    onboardingCorrection: string | null;
    onboardingSummary: string | null;
    derivedProfile: Record<string, any>;
    recommendedIntent: StrategyIntent;
    activeIntent: StrategyIntent;
  }
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    onboardingAnswers: data.onboardingAnswers,
    onboardingCorrection: data.onboardingCorrection,
    onboardingSummary: data.onboardingSummary,
    derivedProfile: data.derivedProfile,
    recommendedIntent: data.recommendedIntent,
    activeIntent: data.activeIntent,
    onboardingCompletedAt: serverTimestamp(),
  });
}

/**
 * Switch active fund (user chose different fund from comparison)
 */
export async function switchActiveFund(
  userId: string,
  newIntent: StrategyIntent
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    activeIntent: newIntent,
  });
}

/**
 * Save wallet address (for gas funding / investment tracking)
 */
export async function saveWalletAddress(
  userId: string,
  walletAddress: string
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    walletAddress,
  });
}