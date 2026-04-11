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
        title="SatByte Technologies | Smart IT Solutions"
        description="Empowering businesses with smart IT solutions — websites, web apps, SEO, and digital marketing from Mahua, Vaishali, Bihar."
        path="/"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SatByte Technologies",
            "url": "https://satbyte.in",
            "logo": "https://satbyte.in/logo.png",
            "sameAs": [
              "https://linkedin.com/company/satbyte",
              "https://twitter.com/satbyte",
              "https://instagram.com/satbyte"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SatByte Technologies",
            "image": "https://satbyte.in/office-preview.jpg",
            "@id": "https://satbyte.in",
            "url": "https://satbyte.in",
            "telephone": "+91-9199499081",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Mahua",
              "addressLocality": "Vaishali",
              "addressRegion": "Bihar",
              "postalCode": "844122",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 25.8294,
              "longitude": 85.3945
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            }
          }
        ]}
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
