// hooks/useSaveOnboarding.ts
import { useAuth } from '@/contexts/AuthContext';
import { saveOnboardingData } from '@/lib/firestore';
import { deriveProfile } from '@/lib/profileDerivation';
import { deriveStrategyFrame, StrategyIntent } from '@/lib/strategyFraming';

export function useSaveOnboarding() {
  const { user } = useAuth();

  const saveToFirestore = async (answers: Record<string, any>, correction: string | null, summary: string | null,  activeIntent: StrategyIntent) => {
    if (!user) {
      throw new Error('User must be logged in to save onboarding');
    }
    
    // Derive profile and strategy (same logic as Step 7)
    const profile = deriveProfile(answers);
    const strategyFrame = deriveStrategyFrame(profile);

    // Save to Firestore
    await saveOnboardingData(user.uid, {
      onboardingAnswers: answers,
      onboardingCorrection: correction,
      onboardingSummary: summary,
      derivedProfile: profile,
      recommendedIntent: strategyFrame.intent,
      activeIntent, // User's actual choice (may differ)
    });
  };

  return { saveToFirestore, user };
}