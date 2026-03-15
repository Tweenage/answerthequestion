import { HeroSection } from '../components/landing/HeroSection';
import { StorySection } from '../components/landing/StorySection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { JourneySection } from '../components/landing/JourneySection';
import { CalmSection } from '../components/landing/CalmSection';
import { PricingSection } from '../components/landing/PricingSection';
import { GuaranteeSection } from '../components/landing/GuaranteeSection';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { StickyCtaBar } from '../components/landing/StickyCtaBar';

export function LandingPage() {
  return (
    <div className="min-h-screen pb-20">
      <HeroSection />
      <StorySection />
      <ProblemSection />
      <ClearMethodSection />
      <JourneySection />
      <CalmSection />
      <PricingSection />
      <GuaranteeSection />
      <SocialProofSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
      <StickyCtaBar />
    </div>
  );
}
