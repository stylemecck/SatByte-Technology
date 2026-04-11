/** Global constants for the Career & Learning Portal. */

export const SITE = {
  name: 'SatByte Careers',
  parentName: 'SatByte Technologies',
  tagline: 'Join Satbyte — Build Your Future With Us',
  subtitle: 'Explore Careers, Internships, and Certifications',
  location: 'Mahua, Vaishali, Bihar, India',
  email: 'careers@satbyte.in',
  mainSiteUrl: 'https://services.satbyte.in',
  apiUrl: 'https://satbyte-technology.onrender.com/api',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/careers', label: 'Jobs' },
  { href: '/internships', label: 'Internships' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/dashboard', label: 'Dashboard' },
] as const
