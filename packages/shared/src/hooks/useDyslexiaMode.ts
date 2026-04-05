import { useCallback } from 'react';
import { useDyslexiaStore } from '../stores/useDyslexiaStore';
import { useCurrentUser } from './useCurrentUser';

/**
 * Convenience hook that returns dyslexia mode state and toggle
 * scoped to the current child profile.
 */
export function useDyslexiaMode() {
  const currentUser = useCurrentUser();
  const childId = currentUser?.id ?? '';
  const enabled = useDyslexiaStore(s => s.enabledByChild[childId] ?? false);
  const toggleRaw = useDyslexiaStore(s => s.toggleDyslexiaMode);

  const toggle = useCallback(() => {
    if (childId) toggleRaw(childId);
  }, [childId, toggleRaw]);

  return { dyslexiaMode: enabled, toggleDyslexiaMode: toggle };
}
