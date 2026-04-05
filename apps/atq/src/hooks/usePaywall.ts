import { useCurrentUser } from '@atq/shared';
import { useProgressStore } from '../stores/useProgressStore';

/**
 * Hook to determine whether the current user needs to pay.
 * All content requires payment — there is no free tier.
 * (There is a 7-day no-questions-asked refund guarantee, but that's handled via Stripe.)
 */
export function usePaywall() {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);
  const progress = currentUser ? getProgress(currentUser.id) : null;

  // hasPaid comes from Supabase-fetched child profile, persisted via Zustand store
  // Do NOT use localStorage fallback — it can be tampered with
  const isPaid = currentUser?.hasPaid === true;
  const currentWeek = progress?.currentWeek ?? 1;
  const needsPayment = !isPaid;

  return { isPaid, needsPayment, currentWeek };
}
