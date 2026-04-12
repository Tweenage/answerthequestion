import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { PositioningSection } from '../components/landing/PositioningSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { PricingSection } from '../components/landing/PricingSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ObjectionSection } from '../components/landing/ObjectionSection';
import { ForParentsSection } from '../components/landing/ForParentsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { EmailCaptureSection } from '../components/landing/EmailCaptureSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* 1. gradient  */} <HeroSection />
      {/* 2. white     */} <ProblemSection />
      {/* 3. gradient  */} <PositioningSection />
      {/* 4. white     */} <ClearMethodSection />
      {/* 5. white     */} <PricingSection />
      {/* 6. gradient  */} <HowItWorksSection />
      {/* 7. white     */} <ObjectionSection />
      {/* 8. gradient  */} <ForParentsSection />
      {/* 9. white     */} <FaqSection />
      {/* 10. gradient */} <FinalCtaSection />
      {/* 11. gradient */} <EmailCaptureSection />
      {/* 12. gradient */} <LandingFooter />
    </div>
  );
}
