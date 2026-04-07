import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { useAuthStore, useSupabaseAuth, ErrorBoundary, SyncToast, AppBrandProvider } from '@atq/shared';
import type { AppBrand } from '@atq/shared';
import { useProgressStore } from './stores/useProgressStore';
import { MotionConfig } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';

// Shared pages (eagerly loaded)
import { LoginPage, SignupPage, ChildPickerPage } from '@atq/shared';
import { ProfessorHoot } from '@atq/shared/components/mascot/ProfessorHoot';

const ATQ_BRAND: AppBrand = {
  name: 'AnswerTheQuestion!',
  tagline: '11+ Exam Technique Trainer',
  mascot: <ProfessorHoot mood="happy" size="xl" animate showSpeechBubble={false} />,
  buttonGradient: 'from-purple-600 to-fuchsia-600',
  buttonGradientHover: 'hover:from-purple-700 hover:to-fuchsia-700',
  headingColor: 'text-purple-800',
  accentColor: 'text-purple-600',
  accentHoverColor: 'hover:text-purple-800',
  checkboxColor: 'border-purple-300 text-purple-600 focus:ring-purple-400 accent-purple-600',
  focusRing: 'focus:ring-purple-300 focus:border-purple-300',
};

// ATQ pages (eagerly loaded)
import { LandingPage } from './pages/LandingPage';
import { CheckoutPage } from './pages/CheckoutPage';

// ATQ pages (lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })));
const BadgesPage = lazy(() => import('./pages/BadgesPage').then(m => ({ default: m.BadgesPage })));
const VisualisationPage = lazy(() => import('./pages/VisualisationPage').then(m => ({ default: m.VisualisationPage })));
const TechniquesPage = lazy(() => import('./pages/TipsPage').then(m => ({ default: m.TipsPage })));
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage').then(m => ({ default: m.DailyChallengePage })));
const MockExamPage = lazy(() => import('./pages/MockExamPage').then(m => ({ default: m.MockExamPage })));
const MistakeReviewPage = lazy(() => import('./pages/MistakeReviewPage').then(m => ({ default: m.MistakeReviewPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UpgradePage = lazy(() => import('./pages/UpgradePage').then(m => ({ default: m.UpgradePage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const CertificatePage = lazy(() => import('./pages/CertificatePage').then(m => ({ default: m.CertificatePage })));
const ResearchPage = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })));
const ContactPage = lazy(() => import('@atq/shared/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('@atq/shared/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('@atq/shared/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const RefundPolicyPage = lazy(() => import('@atq/shared/pages/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

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

function ProgressSync({ children }: { children: React.ReactNode }) {
  const currentChildId = useAuthStore(s => s.currentChildId);
  const fetchProgress = useProgressStore(s => s.fetchProgressFromSupabase);
  const fetchBadges = useProgressStore(s => s.fetchBadgesFromSupabase);

  useEffect(() => {
    if (currentChildId) {
      fetchProgress(currentChildId);
      fetchBadges(currentChildId);
    }
  }, [currentChildId, fetchProgress, fetchBadges]);

  return <>{children}</>;
}

function App() {
  useSupabaseAuth();

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <AppBrandProvider brand={ATQ_BRAND}>
        <BrowserRouter>
          <SyncToast />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
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

              {/* Parent-only */}
              <Route path="/select-child" element={<ParentProtectedRoute><ChildPickerPage /></ParentProtectedRoute>} />

              {/* Fully protected */}
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
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </AppBrandProvider>
        <Analytics />
      </ErrorBoundary>
    </MotionConfig>
  );
}

export default App;
