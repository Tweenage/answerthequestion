import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { useAuthStore } from './stores/useAuthStore';
import { useProgressStore } from './stores/useProgressStore';
import { useSpellingProgressStore } from './stores/useSpellingProgressStore';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { MotionConfig } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SyncToast } from './components/SyncToast';

// Eagerly loaded (auth + landing)
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ChildPickerPage } from './pages/ChildPickerPage';

// Lazy loaded — ATQ main pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })));
const BadgesPage = lazy(() => import('./pages/BadgesPage').then(m => ({ default: m.BadgesPage })));
const VisualisationPage = lazy(() => import('./pages/VisualisationPage').then(m => ({ default: m.VisualisationPage })));
const TechniquesPage = lazy(() => import('./pages/TipsPage').then(m => ({ default: m.TipsPage })));
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage').then(m => ({ default: m.DailyChallengePage })));
const MockExamPage = lazy(() => import('./pages/MockExamPage').then(m => ({ default: m.MockExamPage })));
const MistakeReviewPage = lazy(() => import('./pages/MistakeReviewPage').then(m => ({ default: m.MistakeReviewPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));
const UpgradePage = lazy(() => import('./pages/UpgradePage').then(m => ({ default: m.UpgradePage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const CertificatePage = lazy(() => import('./pages/CertificatePage').then(m => ({ default: m.CertificatePage })));
const ResearchPage = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Lazy loaded — Spelling Bee pages
const StudyPage = lazy(() => import('./pages/StudyPage').then(m => ({ default: m.StudyPage })));
const SessionCompletePage = lazy(() => import('./pages/SessionCompletePage').then(m => ({ default: m.SessionCompletePage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const TestPage = lazy(() => import('./pages/TestPage'));
const DrillPage = lazy(() => import('./pages/DrillPage'));
const BingoPage = lazy(() => import('./pages/BingoPage'));
const PlacementPage = lazy(() => import('./pages/PlacementPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <span className="text-5xl animate-bounce inline-block">🦉</span>
        <p className="text-white/80 font-display text-base font-bold mt-3">Getting ready...</p>
      </div>
    </div>
  );
}

/**
 * Landing page guard: redirects logged-in users to the dashboard.
 */
function PublicLandingRoute({ children }: { children: React.ReactNode }) {
  const parentSession = useAuthStore(s => s.parentSession);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children_ = useAuthStore(s => s.children);

  if (parentSession && currentChildId && children_.find(c => c.id === currentChildId)) {
    return <Navigate to="/home" replace />;
  }
  if (parentSession) {
    return <Navigate to="/select-child" replace />;
  }
  return <>{children}</>;
}

/**
 * Requires a Supabase parent session. Redirects to /login if not logged in.
 * Shows a loading spinner while the initial session is being restored.
 */
function ParentProtectedRoute({ children }: { children: React.ReactNode }) {
  const authReady = useAuthStore(s => s.authReady);
  const parentSession = useAuthStore(s => s.parentSession);
  if (!authReady) return <PageLoader />;
  if (!parentSession) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * Requires a child profile to be selected. Redirects to /select-child if not.
 */
function ChildProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children_ = useAuthStore(s => s.children);
  if (!currentChildId || !children_.find(c => c.id === currentChildId)) {
    return <Navigate to="/select-child" replace />;
  }
  return <>{children}</>;
}

/**
 * Syncs progress from Supabase when a child is selected.
 */
function ProgressSync({ children }: { children: React.ReactNode }) {
  const currentChildId = useAuthStore(s => s.currentChildId);
  const fetchProgress = useProgressStore(s => s.fetchProgressFromSupabase);
  const fetchBadges = useProgressStore(s => s.fetchBadgesFromSupabase);
  const fetchSpelling = useSpellingProgressStore(s => s.fetchFromSupabase);

  useEffect(() => {
    if (currentChildId) {
      fetchProgress(currentChildId);
      fetchBadges(currentChildId);
      fetchSpelling(currentChildId);
    }
  }, [currentChildId, fetchProgress, fetchBadges, fetchSpelling]);

  return <>{children}</>;
}

function App() {
  // Initialise Supabase auth listener
  useSupabaseAuth();

  return (
    <MotionConfig reducedMotion="user">
    <ErrorBoundary>
      <BrowserRouter>
        <SyncToast />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLandingRoute><LandingPage /></PublicLandingRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refunds" element={<RefundPolicyPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Parent-only routes */}
            <Route
              path="/select-child"
              element={
                <ParentProtectedRoute>
                  <ChildPickerPage />
                </ParentProtectedRoute>
              }
            />

            {/* Fully protected routes (parent + child selected) */}
            <Route
              element={
                <ParentProtectedRoute>
                  <ChildProtectedRoute>
                    <ProgressSync>
                      <AppShell />
                    </ProgressSync>
                  </ChildProtectedRoute>
                </ParentProtectedRoute>
              }
            >
              {/* ATQ main routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/badges" element={<BadgesPage />} />
              <Route path="/visualise" element={<VisualisationPage />} />
              <Route path="/techniques" element={<TechniquesPage />} />
              <Route path="/tips" element={<Navigate to="/techniques" replace />} />
              <Route path="/daily-challenge" element={<DailyChallengePage />} />
              <Route path="/mock-exam" element={<MockExamPage />} />
              <Route path="/review-mistakes" element={<MistakeReviewPage />} />
              <Route path="/parent-dashboard" element={<DashboardPage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/certificate" element={<CertificatePage />} />

              {/* Spelling Bee routes */}
              <Route path="/study" element={<StudyPage />} />
              <Route path="/session-complete" element={<SessionCompletePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/drill" element={<DrillPage />} />
              <Route path="/bingo" element={<BingoPage />} />
              <Route path="/placement" element={<PlacementPage />} />
            </Route>

            {/* Fallback */}
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
