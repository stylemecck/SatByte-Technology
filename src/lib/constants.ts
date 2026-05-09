/** Site-wide business and navigation data for SatByte Technologies. */

export const SITE = {
  name: 'SatByte Technologies',
  tagline: 'Empowering Businesses with Smart IT Solutions',
  owner: 'Satyam Kumar',
  location: 'Sarmastpur Jhitkahi Shamil, Mahua, Vaishali, Bihar, India',
  phone: 'On request available',
  phoneDigits: '',
  email: 'info@satbyte.in',
  whatsappUrl: 'https://wa.me/919199499081',
  ownerImage: 'https://res.cloudinary.com/dpddfcu8u/image/upload/q_auto/f_auto/v1776454436/IMG_20260410_082411_bafruh.png',
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
  { href: 'https://career.satbyte.in', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
] as const

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' as const },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' as const },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' as const },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' as const },
] as const

export const HOME_SERVICES = [
  {
    title: 'Custom SaaS Platforms',
    description: 'End-to-end product engineering for high-growth software companies.',
    icon: 'Layers',
  },
  {
    title: 'Scalable Web Applications',
    description: 'React & Node.js architectures built to handle enterprise traffic.',
    icon: 'LayoutDashboard',
  },
  {
    title: 'High-Performance E-commerce',
    description: 'Conversion-optimized digital storefronts and bespoke checkout flows.',
    icon: 'ShoppingCart',
  },
  {
    title: 'Enterprise Cloud Architecture',
    description: 'Secure, scalable AWS/Vercel deployments and API integrations.',
    icon: 'Server',
  },
  {
    title: 'UI/UX Systems Design',
    description: 'Figma-to-code design systems that enforce brand consistency at scale.',
    icon: 'Palette',
  },
  {
    title: 'Technical SEO & Performance',
    description: 'Core Web Vitals optimization and programmatic SEO infrastructure.',
    icon: 'TrendingUp',
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

export const HOME_PORTFOLIO = [
  {
    title: 'Enterprise FinTech Dashboard',
    description: 'A high-performance analytics platform handling millions of daily transactions with sub-second latency.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'B2B Procurement Portal',
    description: 'Streamlined vendor management and automated purchase order flows for a Fortune 500 logistics firm.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tech: ['React', 'Node.js', 'GraphQL', 'AWS'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'AI Customer Success Platform',
    description: 'Integrated LLM-driven chat support system reducing average ticket resolution time by 40%.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee57d5?w=800&q=80',
    tech: ['Vite', 'OpenAI API', 'Framer Motion'],
    demoUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Global E-Commerce Storefront',
    description: 'A headless commerce implementation focusing on mobile-first conversion and sub-100ms load times.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tech: ['Next.js', 'Stripe', 'Sanity CMS'],
    demoUrl: '#',
    githubUrl: '#',
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
