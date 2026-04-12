import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { PositioningSection } from '../components/landing/PositioningSection';
import { ResearchStripSection } from '../components/landing/ResearchStripSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { JourneySection } from '../components/landing/JourneySection';
import { OutcomesSection } from '../components/landing/OutcomesSection';
import { ObjectionSection } from '../components/landing/ObjectionSection';
import { ForParentsSection } from '../components/landing/ForParentsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { TrustNoteSection } from '../components/landing/TrustNoteSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { EmailCaptureSection } from '../components/landing/EmailCaptureSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <PositioningSection />
      <ResearchStripSection />
      <ClearMethodSection />
      <HowItWorksSection />
      <JourneySection />
      <OutcomesSection />
      <ObjectionSection />
      <ForParentsSection />
      <PricingSection />
      <TrustNoteSection />
      <FaqSection />
      <FinalCtaSection />
      <EmailCaptureSection />
      <LandingFooter />
    </div>
  );
}
