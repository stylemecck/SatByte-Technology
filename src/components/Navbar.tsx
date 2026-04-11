import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X, Info, Star, FileText, Laptop, Briefcase, Tag, Calculator, Lock, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/utils'
const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

const MORE_LINKS = [
  { href: '/quote', label: 'Estimator', icon: Calculator },
  { href: '/client-login', label: 'Client Login', icon: Lock },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/testimonials', label: 'Testimonials', icon: Star },
  { href: '/blog', label: 'Blog', icon: FileText },
]

const NAV_CATEGORIES = [
  {
    name: 'Company',
    links: [
      { href: '/about', label: 'About Us', icon: Info },
      { href: '/testimonials', label: 'Testimonials', icon: Star },
      { href: '/blog', label: 'Blog', icon: FileText },
    ],
  },
  {
    name: 'Work',
    links: PRIMARY_LINKS.map(link => ({ ...link, icon: link.label === 'Services' ? Laptop : link.label === 'Portfolio' ? Briefcase : Tag })),
  },
  {
    name: 'Portal',
    links: [
      { href: '/quote', label: 'Estimator', icon: Calculator },
      { href: '/client-login', label: 'Client Login', icon: Lock },
    ],
  },
]



export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex h-14 items-center gap-4 rounded-full border border-slate-200/60 bg-white/75 px-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-[#0f172a]/75 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white shadow-lg shadow-primary/30 transition-all duration-300 group-hover:shadow-primary/40">
            SB
          </div>
          <span className="hidden font-heading text-sm font-semibold tracking-tight text-secondary dark:text-white sm:block">
            {SITE.name}
          </span>
        </Link>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden lg:block" />

        <nav className="hidden items-center gap-1 lg:flex relative">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
              className={({ isActive }) =>
                cn(
                  'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none',
                  isActive ? 'text-primary dark:text-accent' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {hoveredLink === href && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 z-0 rounded-full bg-slate-100 dark:bg-white/5"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 z-0 rounded-full bg-primary/10 dark:bg-accent/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          
          <div className="relative group">
            <button 
              onMouseEnter={() => setHoveredLink('more')}
              onMouseLeave={() => setHoveredLink(null)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-white"
            >
              <span className="relative z-10">More</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0f172a]/95">
                {MORE_LINKS.map(({ href, label, icon: Icon }) => (
                  <NavLink
                    key={href}
                    to={href}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-accent'
                      )
                    }
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 transition-colors group-hover:bg-primary/10 dark:group-hover:bg-accent/10">
                      <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    </div>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -40, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 40, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-300" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,320px)] flex-col border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
                <Dialog.Title className="sr-only">Main navigation</Dialog.Title>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-heading font-semibold text-secondary dark:text-white">Menu</span>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-4 overflow-y-auto pb-6">
                  {NAV_CATEGORIES.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-3 pt-2">
                        {category.name}
                      </h4>
                      <div className="flex flex-col gap-1">
                        {category.links.map(({ href, label, icon: Icon }) => (
                          <NavLink
                            key={href}
                            to={href}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 active:scale-[0.99]',
                                isActive
                                  ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5',
                              )
                            }
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
                              <Icon className="h-4 w-4 opacity-70" />
                            </div>
                            {label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
                    <Button asChild className="w-full justify-center rounded-xl h-11">
                      <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
                    </Button>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Button asChild className="hidden sm:inline-flex rounded-full h-9 px-5 text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
            <Link to="/contact">Get Quote</Link>
          </Button>
        </div>
      </header>
    </div>
  )
}
