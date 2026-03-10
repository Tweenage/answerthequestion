import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Hook that listens to Supabase auth state changes and syncs with the auth store.
 * Should be mounted once at the top level (e.g. in App).
 */
export function useSupabaseAuth() {
  const setParentSession = useAuthStore(s => s.setParentSession);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setParentSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setParentSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setParentSession]);
}

/**
 * Hook for components that need to redirect on auth state changes.
 * Use in pages like ParentAuthPage to redirect when already logged in.
 */
export function useRequireNoAuth() {
  const navigate = useNavigate();
  const parentSession = useAuthStore(s => s.parentSession);

  useEffect(() => {
    if (parentSession) {
      navigate('/select-child', { replace: true });
    }
  }, [parentSession, navigate]);
}
