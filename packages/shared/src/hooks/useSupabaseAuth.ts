import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Verifies that the cached currentChildId still exists in Supabase for this parent.
 * If the child has been deleted (e.g. purged from the DB), clears the stale
 * persisted Zustand state so route guards redirect back to /select-child.
 *
 * Safe to call on every auth change — it's a no-op if no child is cached.
 */
async function reconcileCurrentChild(parentId: string) {
  const { currentChildId } = useAuthStore.getState();
  if (!currentChildId) return;

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('id')
      .eq('id', currentChildId)
      .eq('parent_id', parentId)
      .maybeSingle();

    // PGRST116 = no rows; data === null also means the child is gone.
    if (error && error.code !== 'PGRST116') return; // transient error, leave state alone
    if (!data) {
      // Stale cache — the child no longer exists in the DB. Clear it.
      useAuthStore.setState({ children: [], currentChildId: null });
    }
  } catch {
    // Network/offline — don't clobber cached state on transient failures.
  }
}

/**
 * Hook that listens to Supabase auth state changes and syncs with the auth store.
 * Should be mounted once at the top level (e.g. in App).
 */
export function useSupabaseAuth() {
  const setParentSession = useAuthStore(s => s.setParentSession);
  const setPasswordRecovery = useAuthStore(s => s.setPasswordRecovery);

  useEffect(() => {
    // Detect password recovery from URL hash BEFORE getSession resolves.
    // Without this, the session loads first and useRequireNoAuth redirects
    // the user away from the login page before they can set a new password.
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setPasswordRecovery(true);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setParentSession(session);
      // Reconcile cached child against DB truth on every app load.
      if (session) {
        reconcileCurrentChild(session.user.id);
      }
    }).catch((err) => {
      console.warn('Failed to get initial session:', err);
      setParentSession(null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Flag password recovery so useRequireNoAuth doesn't redirect
        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
        }
        setParentSession(session);

        // On sign-in/sign-up, try to claim any guest checkout payments.
        // This is a background, non-blocking call — if it fails or finds
        // nothing, it's silently ignored. It provides a safety net in case
        // the claim-payment call in ChildPickerPage runs before the Stripe
        // webhook has set the payment status to 'completed'.
        if (event === 'SIGNED_IN' && session) {
          // Try both ATQ and Spelling claim functions — each is a no-op
          // if the corresponding payment table has no unclaimed payments.
          supabase.functions.invoke('claim-payment').catch(() => {});
          supabase.functions.invoke('claim-spelling-payment').catch(() => {});
          // Reconcile cached child against DB truth on fresh sign-in.
          reconcileCurrentChild(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setParentSession, setPasswordRecovery]);
}

/**
 * Hook for components that need to redirect on auth state changes.
 * Use in pages like LoginPage / SignupPage to redirect when already logged in.
 */
export function useRequireNoAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentSession = useAuthStore(s => s.parentSession);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const isPasswordRecovery = useAuthStore(s => s.isPasswordRecovery);

  useEffect(() => {
    // Don't redirect during password recovery — the user needs to stay on the
    // login page to set a new password even though Supabase gives them a session.
    if (parentSession && !isPasswordRecovery) {
      // Respect ?redirect= param (e.g. /checkout) so users return after auth
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        navigate(redirect, { replace: true });
      } else {
        navigate(currentChildId ? '/home' : '/select-child', { replace: true });
      }
    }
  }, [parentSession, currentChildId, isPasswordRecovery, navigate, searchParams]);
}
