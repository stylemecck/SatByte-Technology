import { AboutPreview } from '@/components/home/AboutPreview'
import { ContactBanner } from '@/components/home/ContactBanner'
import { HeroSection } from '@/components/home/HeroSection'
import { PortfolioPreview } from '@/components/home/PortfolioPreview'
import { ServicesPreview } from '@/components/home/ServicesPreview'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { SEO } from '@/components/SEO'

export default function HomePage() {
  return (
    <>
      <SEO
        title="SatByte Technologies"
        description="Empowering businesses with smart IT solutions — websites, web apps, SEO, and digital marketing from Mahua, Vaishali, Bihar."
        path="/"
      />
      <HeroSection />
      <ServicesPreview />
      <AboutPreview />
      <WhyChooseUs />
      <PortfolioPreview />
      <TestimonialsSection />
      <ContactBanner />
    </>
  )
}
