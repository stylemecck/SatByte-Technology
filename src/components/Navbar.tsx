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

const linkClass =
  'relative text-sm font-medium text-slate-600 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-primary hover:after:scale-x-100 dark:text-slate-300 dark:after:bg-accent dark:hover:text-accent'

const activeClass = 'text-primary dark:text-accent'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#020617]/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/30 transition-[transform,box-shadow] duration-300 group-hover:shadow-xl group-hover:shadow-primary/40">
            SB
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight text-secondary dark:text-white">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/'}
              className={({ isActive }) =>
                cn(linkClass, isActive && activeClass, isActive && 'after:scale-x-100', 'text-[15px]')
              }
            >
              {label}
            </NavLink>
          ))}
          
          <div className="group relative">
            <button className="flex items-center gap-1 text-[15px] font-medium text-slate-600 transition-colors hover:text-primary focus:outline-none dark:text-slate-300 dark:hover:text-accent pb-4 -mb-4">
              More
              <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="w-52 rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0f172a]/95">
                {MORE_LINKS.map(({ href, label, icon: Icon }) => (
                  <NavLink
                    key={href}
                    to={href}
                    className={({ isActive }) =>
                      cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none',
                        isActive
                          ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-accent'
                      )
                    }
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) => cn(linkClass, isActive && activeClass, isActive && 'after:scale-x-100', "text-[15px]")}
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -40, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 40, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-300" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,320px)] flex-col border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
                <Dialog.Title className="sr-only">Main navigation</Dialog.Title>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-heading font-semibold text-secondary dark:text-white">Menu</span>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-4 overflow-y-auto pb-6">
                  {NAV_CATEGORIES.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pt-2">
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
                            <Icon className="h-4 w-4 opacity-70" />
                            {label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
                    <Button asChild className="w-full justify-center">
                      <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full justify-center hidden">
                      <Link to="/admin/login" onClick={() => setOpen(false)}>Admin Access</Link>
                    </Button>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Button variant="ghost" size="sm" className="hidden text-xs lg:inline-flex" asChild>
            <Link to="/admin/login">Admin</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/contact">Get Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
