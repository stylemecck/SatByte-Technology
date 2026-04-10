/** Site-wide business and navigation data for SatByte Technologies. */

export const SITE = {
  name: 'SatByte Technologies',
  tagline: 'Empowering Businesses with Smart IT Solutions',
  owner: 'Satyam Kumar',
  location: 'Mahua, Vaishali, Bihar, India',
  phone: '+91 9199499081',
  phoneDigits: '919199499081',
  email: 'info@satbyte.in',
  whatsappUrl: 'https://wa.me/919199499081',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/blog', label: 'Blog' },
  { href: '/quote', label: 'Estimator' },
  { href: '/client-login', label: 'Client Login' },
  { href: '/contact', label: 'Contact' },
] as const

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' as const },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' as const },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' as const },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' as const },
] as const

/** Six services shown on the home preview. */
export const HOME_SERVICES = [
  {
    title: 'Website Development',
    description: 'Fast, responsive sites that convert visitors into customers.',
    icon: 'Globe',
  },
  {
    title: 'Web Application Development',
    description: 'Custom dashboards, portals, and business tools on the web.',
    icon: 'LayoutDashboard',
  },
  {
    title: 'E-commerce Development',
    description: 'Secure online stores with smooth checkout experiences.',
    icon: 'ShoppingCart',
  },
  {
    title: 'SEO Services',
    description: 'Technical SEO and content strategy to grow organic traffic.',
    icon: 'Search',
  },
  {
    title: 'Digital Marketing',
    description: 'Campaigns that build brand presence and measurable ROI.',
    icon: 'Megaphone',
  },
  {
    title: 'IT Consultancy',
    description: 'Architecture, stack choices, and roadmap you can trust.',
    icon: 'Briefcase',
  },
] as const

/** Full services listing (services page). */
export const ALL_SERVICES = [
  {
    title: 'Website Development',
    description:
      'Corporate sites, landing pages, and blogs built with modern stacks and performance in mind.',
    icon: 'Globe',
  },
  {
    title: 'Web App Development',
    description: 'Scalable web applications with authentication, APIs, and real-time features.',
    icon: 'Layers',
  },
  {
    title: 'E-commerce Development',
    description: 'Product catalogs, payments, inventory hooks, and conversion-focused UX.',
    icon: 'ShoppingBag',
  },
  {
    title: 'UI/UX Design',
    description: 'Wireframes, prototypes, and polished interfaces aligned with your brand.',
    icon: 'Palette',
  },
  {
    title: 'SEO Optimization',
    description: 'On-page structure, speed, schema, and ongoing optimization.',
    icon: 'TrendingUp',
  },
  {
    title: 'Digital Marketing',
    description: 'Social, content, and paid strategies tailored to your audience.',
    icon: 'BarChart3',
  },
  {
    title: 'Website Maintenance',
    description: 'Updates, backups, monitoring, and quick fixes when you need them.',
    icon: 'Wrench',
  },
  {
    title: 'Domain & Hosting',
    description: 'Domain setup, DNS, SSL, and reliable hosting recommendations.',
    icon: 'Server',
  },
  {
    title: 'CCTV Installation',
    description: 'Planning, installation, and configuration for home and business security.',
    icon: 'Camera',
  },
  {
    title: 'Computer Repair',
    description: 'Diagnostics, upgrades, OS issues, and hardware troubleshooting.',
    icon: 'Cpu',
  },
  {
    title: 'IT Consultancy',
    description: 'Vendor-neutral advice on tools, security, and digital transformation.',
    icon: 'MessageSquare',
  },
] as const

/** Home portfolio slider (4 samples). */
export const HOME_PORTFOLIO = [
  {
    title: 'School Website',
    description: 'Informative portal for parents, students, and admissions.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  },
  {
    title: 'E-commerce Store',
    description: 'Product discovery, cart, and checkout tuned for mobile buyers.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  },
  {
    title: 'Business Portfolio',
    description: 'Elegant showcase for services, case studies, and lead capture.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    title: 'Billing Software',
    description: 'Invoicing, GST-ready reports, and client management in one place.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
] as const

/** Portfolio page projects with filters. */
export const PORTFOLIO_PROJECTS = [
  {
    id: '1',
    title: 'School Management System',
    description: 'Attendance, fees, and parent communication in a unified admin panel.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    category: 'Software',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
  },
  {
    id: '2',
    title: 'College Website',
    description: 'Modern admissions site with departments, events, and downloadable forms.',
    tech: ['Next.js', 'Tailwind CSS', 'CMS'],
    category: 'Web',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80',
  },
  {
    id: '3',
    title: 'E-commerce Platform',
    description: 'Multi-category storefront with payment gateway and order tracking.',
    tech: ['React', 'Stripe', 'REST API'],
    category: 'E-commerce',
    image:
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=900&q=80',
  },
  {
    id: '4',
    title: 'Business Website',
    description: 'Lead-focused site with service pages, testimonials, and contact flows.',
    tech: ['Vite', 'TypeScript', 'Framer Motion'],
    category: 'Web',
    image:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=900&q=80',
  },
  {
    id: '5',
    title: 'Billing Software',
    description: 'Desktop-friendly billing with PDF invoices and ledger exports.',
    tech: ['Electron', 'SQLite', 'React'],
    category: 'Software',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
  },
] as const

/** Stable keys for Stripe checkout (`/api/checkout/create-session`). */
export type PricingPlanId = 'basic' | 'standard' | 'premium'

export const PRICING_PLANS: readonly {
  id: PricingPlanId
  name: string
  price: string
  description: string
  features: readonly string[]
  recommended: boolean
}[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '₹4,999',
    description: 'Great for startups getting online with essentials.',
    features: ['5-page website', 'Responsive layout', 'Contact form', 'Basic SEO setup', '1 revision round'],
    recommended: false,
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: '₹9,999',
    description: 'Most chosen for growing businesses that need more depth.',
    features: [
      'Up to 12 pages',
      'CMS / easy updates',
      'Performance tuning',
      'On-page SEO',
      'Analytics setup',
      '2 revision rounds',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '₹19,999',
    description: 'Full-featured builds with integrations and priority support.',
    features: [
      'Custom components',
      'Third-party integrations',
      'Advanced animations',
      'Technical SEO audit',
      'Priority support 30 days',
      '3 revision rounds',
    ],
    recommended: false,
  },
] as const

export const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Principal, Local School',
    quote:
      'SatByte delivered a clean school site on time. Parents finally find notices and forms without calling the office.',
  },
  {
    name: 'Priya Singh',
    role: 'Boutique Owner',
    quote:
      'Our online store looks premium and loads fast on phones. Sales inquiries doubled within the first month.',
  },
  {
    name: 'Amit Verma',
    role: 'CA Firm Partner',
    quote:
      'Professional, transparent, and strong on detail. The billing workflow they built saves hours every week.',
  },
  {
    name: 'Neha Kumari',
    role: 'Marketing Lead',
    quote:
      'SEO and landing pages were structured properly from day one. We saw steady growth in qualified leads.',
  },
  {
    name: 'Vikash Patel',
    role: 'Startup Founder',
    quote:
      'Clear communication and modern tech choices. SatByte felt like an extension of our team.',
  },
] as const

export const BLOG_POSTS = [
  {
    slug: 'why-every-business-needs-a-website',
    title: 'Why Every Business Needs a Website',
    excerpt: 'Credibility, discovery, and conversions — how a site supports every channel you run.',
    date: 'Mar 12, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'benefits-of-seo',
    title: 'Benefits of SEO',
    excerpt: 'Compound traffic, lower acquisition cost, and insights from real search intent.',
    date: 'Mar 5, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'digital-marketing-trends',
    title: 'Digital Marketing Trends',
    excerpt: 'Short video, automation, and privacy-first measurement shaping 2026 campaigns.',
    date: 'Feb 22, 2026',
    readTime: '7 min read',
  },
] as const
