// Lib
export { supabase } from './lib/supabase';

// Stores
export { useAuthStore } from './stores/useAuthStore';
export { useSettingsStore } from './stores/useSettingsStore';
export { useDyslexiaStore } from './stores/useDyslexiaStore';

// Hooks
export { useSupabaseAuth, useRequireNoAuth } from './hooks/useSupabaseAuth';
export { useCurrentUser } from './hooks/useCurrentUser';
export { useDyslexiaMode } from './hooks/useDyslexiaMode';
export { useSoundEffects } from './hooks/useSoundEffects';
export type { SoundEffect } from './hooks/useSoundEffects';
export { useTimer } from './hooks/useTimer';

// Types
export type { User, AvatarConfig } from './types/user';
export {
  AVATAR_CHARACTERS,
  AVATAR_COLOURS,
  AVATAR_BACKGROUNDS,
  CHARACTER_EMOJIS,
  CHARACTER_LABELS,
} from './types/user';

// Components
export { ErrorBoundary } from './components/ErrorBoundary';
export { SyncToast, showSyncToast } from './components/SyncToast';
export { FeedbackButton } from './components/FeedbackButton';
export { SoundToggle } from './components/settings/SoundToggle';
export { ConfettiExplosion } from './components/celebrations/ConfettiExplosion';
export { MascotMessage, getMascotTip } from './components/celebrations/MascotMessage';
export { XpPopup } from './components/celebrations/XpPopup';

// Pages
export { LoginPage } from './pages/LoginPage';
export { SignupPage } from './pages/SignupPage';
export { ChildPickerPage } from './pages/ChildPickerPage';
export { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
export { TermsPage } from './pages/TermsPage';
export { RefundPolicyPage } from './pages/RefundPolicyPage';
export { ContactPage } from './pages/ContactPage';
