import HeroSection from './HeroSection'
import DemosSection from './DemosSection'
import WhyCdtSection from './WhyCdtSection'
import CapabilitiesSection from './CapabilitiesSection'
import DocsHeroSection from './DocsHeroSection'
import FaqSection from './FaqSection'

interface HomeBodyProps {
  assetsUrl: string
}

export function HomeBody({ assetsUrl }: HomeBodyProps) {
  return (
    <>
      <HeroSection assetsUrl={assetsUrl} />
      <DemosSection assetsUrl={assetsUrl} />
      <WhyCdtSection />
      <CapabilitiesSection />
      <DocsHeroSection />
      <FaqSection />
    </>
  )
}
