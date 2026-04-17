import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Moon, Sun, X, Rocket, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'


import { useTheme } from '@/contexts/ThemeContext'
import { SITE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { getStoredToken } from '@/lib/apiClient'

const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: 'https://career.satbyte.in', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  // Update login status based on stored token
  useEffect(() => {
    setIsLoggedIn(!!getStoredToken())
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Detect scroll for subtle shadow/border adjustments
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pointer-events-none transition-all duration-300">
      <header className={cn(
        "pointer-events-auto flex items-center justify-between w-full max-w-5xl h-14 rounded-full border px-4 sm:px-6 transition-all duration-500",
        scrolled 
          ? "bg-background/70 backdrop-blur-xl border-border shadow-sm dark:shadow-black/50" 
          : "bg-background/40 backdrop-blur-md border-transparent shadow-none"
      )}>
        
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="font-heading text-[15px] font-bold tracking-tighter text-foreground">
            {/* SatByte Technologies */}
              {SITE.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center h-full">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'relative h-full flex items-center px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active-desktop" 
                      className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-foreground mx-4 rounded-t-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dashboard / Login Link (Desktop) */}
          {isLoggedIn ? (
            <Link 
              to="/portal" 
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
          ) : (
            <Link 
              to="/client-login" 
              className="hidden md:flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          )}

          <div className="hidden md:block w-px h-4 bg-border mx-1" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 gap-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* Mobile Menu Trigger */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button 
                className="md:hidden flex flex-col justify-center items-center h-9 w-9 gap-[4px] rounded-full text-foreground hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open menu"
              >
                <motion.span 
                  animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} 
                  className="w-4 h-[2px] bg-current rounded-full block origin-center transition-all"
                />
                <motion.span 
                  animate={{ opacity: open ? 0 : 1 }} 
                  className="w-4 h-[2px] bg-current rounded-full block transition-opacity"
                />
                <motion.span 
                  animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} 
                  className="w-4 h-[2px] bg-current rounded-full block origin-center transition-all"
                />
              </button>
            </Dialog.Trigger>
            
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity" />
              <Dialog.Content className="fixed top-4 inset-x-4 z-[70] flex flex-col rounded-3xl border border-border bg-background p-6 shadow-2xl outline-none origin-top transition-transform transform">
                <Dialog.Title className="sr-only">Mobile Menu</Dialog.Title>
                
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-2 text-foreground font-bold font-heading">
                      <Rocket className="h-4 w-4" /> Menu
                   </div>
                   <Dialog.Close asChild>
                     <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground transition-transform active:scale-90">
                       <X className="h-4 w-4" />
                     </button>
                   </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-2">
                  {PRIMARY_LINKS.map(({ href, label }) => (
                    <NavLink
                      key={href}
                      to={href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-colors',
                          isActive 
                            ? 'bg-secondary text-foreground' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  <div className="h-px bg-border my-2" />
                  {isLoggedIn ? (
                    <Link
                      to="/portal"
                      className="flex items-center justify-center w-full px-4 py-4 mt-2 text-sm font-bold bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/client-login"
                      className="flex items-center justify-center w-full px-4 py-3 mt-2 text-sm font-bold bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Client Sign In
                    </Link>
                  )}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

        </div>
      </header>
    </div>
  )
}

