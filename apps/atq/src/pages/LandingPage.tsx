import { HeroSection } from '../components/landing/HeroSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { PricingSection } from '../components/landing/PricingSection';
import { ForParentsSection } from '../components/landing/ForParentsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { EmailCaptureSection } from '../components/landing/EmailCaptureSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* 1. gradient  */} <HeroSection />
      {/* 2. white     */} <ClearMethodSection />
      {/* 3. gradient  */} <HowItWorksSection />
      {/* 4. white     */} <PricingSection />
      {/* 5. gradient  */} <ForParentsSection />
      {/* 6. white     */} <FaqSection />
      {/* 7. gradient  */} <FinalCtaSection />
      {/* 8. gradient  */} <EmailCaptureSection />
      {/* 9. gradient  */} <LandingFooter />
    </div>
  );
}
