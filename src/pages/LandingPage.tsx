import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { StorySection } from '../components/landing/StorySection';
import { ForParentsSection } from '../components/landing/ForParentsSection';
import { GapSection } from '../components/landing/GapSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { ScreenshotsSection } from '../components/landing/ScreenshotsSection';
import { JourneySection } from '../components/landing/JourneySection';
import { PricingSection } from '../components/landing/PricingSection';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <StorySection />
      <ForParentsSection />
      <GapSection />
      <ClearMethodSection />
      <ScreenshotsSection />
      <JourneySection />
      <PricingSection />
      <SocialProofSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  );
}
