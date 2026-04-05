import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

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
          supabase.functions.invoke('claim-payment').catch(() => {
            // Non-critical — ChildPickerPage will also try on child creation
          });
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
