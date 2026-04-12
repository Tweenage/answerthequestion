import { HeroSection } from '../components/landing/HeroSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { ProblemSection } from '../components/landing/ProblemSection';
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
      {/* 2. white     */} <ClearMethodSection />
      {/* 3. gradient  */} <ProblemSection />
      {/* 4. white     */} <PricingSection />
      {/* 5. gradient  */} <HowItWorksSection />
      {/* 6. white     */} <ObjectionSection />
      {/* 7. gradient  */} <ForParentsSection />
      {/* 8. white     */} <FaqSection />
      {/* 9. gradient  */} <FinalCtaSection />
      {/* 10. gradient */} <EmailCaptureSection />
      {/* 11. gradient */} <LandingFooter />
    </div>
  );
}
