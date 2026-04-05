import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { useAuthStore, useSupabaseAuth, ErrorBoundary, SyncToast } from '@atq/shared';
import { useSpellingProgressStore } from './stores/useSpellingProgressStore';
import { MotionConfig } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';

// Shared pages (eagerly loaded)
import { LoginPage, SignupPage, ChildPickerPage } from '@atq/shared';

// Spelling pages (eagerly loaded)
import { LandingPage } from './pages/LandingPage';

// Spelling pages (lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const StudyPage = lazy(() => import('./pages/StudyPage').then(m => ({ default: m.StudyPage })));
const SessionCompletePage = lazy(() => import('./pages/SessionCompletePage').then(m => ({ default: m.SessionCompletePage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const TestPage = lazy(() => import('./pages/TestPage'));
const DrillPage = lazy(() => import('./pages/DrillPage'));
const BingoPage = lazy(() => import('./pages/BingoPage'));
const PlacementPage = lazy(() => import('./pages/PlacementPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const UpgradePage = lazy(() => import('./pages/UpgradePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PrivacyPolicyPage = lazy(() => import('@atq/shared/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('@atq/shared/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const RefundPolicyPage = lazy(() => import('@atq/shared/pages/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <span className="text-5xl animate-bounce inline-block">🐝</span>
        <p className="text-white/80 font-display text-base font-bold mt-3">Getting ready...</p>
      </div>
    </div>
  );
}

function PublicLandingRoute({ children }: { children: React.ReactNode }) {
  const parentSession = useAuthStore(s => s.parentSession);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children_ = useAuthStore(s => s.children);
  if (parentSession && currentChildId && children_.find(c => c.id === currentChildId)) {
    return <Navigate to="/home" replace />;
  }
  if (parentSession) return <Navigate to="/select-child" replace />;
  return <>{children}</>;
}

function ParentProtectedRoute({ children }: { children: React.ReactNode }) {
  const authReady = useAuthStore(s => s.authReady);
  const parentSession = useAuthStore(s => s.parentSession);
  if (!authReady) return <PageLoader />;
  if (!parentSession) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children_ = useAuthStore(s => s.children);
  if (!currentChildId || !children_.find(c => c.id === currentChildId)) {
    return <Navigate to="/select-child" replace />;
  }
  return <>{children}</>;
}

function SpellingSync({ children }: { children: React.ReactNode }) {
  const currentChildId = useAuthStore(s => s.currentChildId);
  const fetchFromSupabase = useSpellingProgressStore(s => s.fetchFromSupabase);

  useEffect(() => {
    if (currentChildId) {
      fetchFromSupabase(currentChildId);
    }
  }, [currentChildId, fetchFromSupabase]);

  return <>{children}</>;
}

function App() {
  useSupabaseAuth();

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <SyncToast />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<PublicLandingRoute><LandingPage /></PublicLandingRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refunds" element={<RefundPolicyPage />} />

              {/* Parent-only */}
              <Route path="/select-child" element={<ParentProtectedRoute><ChildPickerPage /></ParentProtectedRoute>} />

              {/* Fully protected */}
              <Route
                element={
                  <ParentProtectedRoute>
                    <ChildProtectedRoute>
                      <SpellingSync>
                        <AppShell />
                      </SpellingSync>
                    </ChildProtectedRoute>
                  </ParentProtectedRoute>
                }
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/drill" element={<DrillPage />} />
                <Route path="/bingo" element={<BingoPage />} />
                <Route path="/placement" element={<PlacementPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/session-complete" element={<SessionCompletePage />} />
                <Route path="/upgrade" element={<UpgradePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Analytics />
      </ErrorBoundary>
    </MotionConfig>
  );
}

export default App;
