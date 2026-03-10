import { useAuthStore } from '../stores/useAuthStore';

/**
 * Reactively selects the current child user from the auth store.
 *
 * The raw `currentUser` property in the store is a function (getter),
 * which means `useAuthStore(s => s.currentUser)()` returns a stable
 * reference and doesn't trigger re-renders when `children` or
 * `currentChildId` changes. This hook computes the derived value
 * inline in the selector so Zustand detects changes properly.
 */
export function useCurrentUser() {
  return useAuthStore(s =>
    s.children.find(u => u.id === s.currentChildId) ?? null
  );
}
