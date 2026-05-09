import { Helmet } from 'react-helmet-async'
import { SITE } from '@/lib/constants'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Helmet>
        <title>Terms of Service | {SITE.name}</title>
      </Helmet>
      
      <h1 className="text-4xl font-extrabold text-foreground mb-8 tracking-tight">
        Terms of Service
      </h1>
      
      <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the services provided by {SITE.name}, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          {SITE.name} provides software development, website design, and SEO services. We reserve the right to modify or discontinue, temporarily or permanently, the services with or without notice.
        </p>

        <h2>3. Payment Terms</h2>
        <p>
          Payments for services are outlined in our pricing plans or custom proposals. Late payments may result in the suspension of services or project delivery delays.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          Unless otherwise stated in a custom contract, clients retain the intellectual property rights to the final delivered code and assets upon full payment. {SITE.name} retains the right to display the project in our portfolio unless a Non-Disclosure Agreement (NDA) is signed.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          {SITE.name} shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at {SITE.email}.
        </p>
      </div>
    </div>
  )
}
