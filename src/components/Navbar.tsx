import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Moon, Sun, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'


import { cn } from '@/lib/utils'
import { getStoredToken } from '@/lib/apiClient'
import { Logo } from './Logo'

const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: 'https://career.satbyte.in', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/download', label: 'Get App' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken())
  }, [location.pathname])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn(
      "fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 border-b",
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-border" 
        : "bg-background/0 border-transparent"
    )}>
      <header className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <Logo theme="auto" speed="fast" pauseOnHover trailBlocks={5}  />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center h-full gap-1 lg:gap-2">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'relative h-8 px-3 flex items-center text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
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
                      className="absolute inset-0 bg-secondary/50 rounded-md z-0"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Dashboard / Login Link (Desktop) */}
          {isLoggedIn ? (
            <Link 
              to="/portal" 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <Link 
              to="/client-login" 
              className="hidden md:flex items-center px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}

          <div className="hidden md:block w-px h-4 bg-border" />



          {/* Mobile Menu Trigger */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button 
                className="md:hidden flex flex-col justify-center items-center h-9 w-9 gap-[4px] rounded-md text-foreground hover:bg-secondary/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <Dialog.Content className="fixed top-4 inset-x-4 z-[70] flex flex-col rounded-2xl border border-border bg-background p-6 shadow-2xl outline-none origin-top transition-transform transform">
                <Dialog.Title className="sr-only">Mobile Menu</Dialog.Title>
                
                <div className="flex items-center justify-between mb-8">
                   <Link to="/" className="flex items-center">
                      <Logo theme="auto" speed="fast" pauseOnHover trailBlocks={5}  />
                   </Link>
                   <Dialog.Close asChild>
                     <button className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors active:scale-95">
                       <X className="h-4 w-4" />
                     </button>
                   </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-1">
                  {PRIMARY_LINKS.map(({ href, label }) => (
                    <NavLink
                      key={href}
                      to={href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors',
                          isActive 
                            ? 'bg-secondary text-foreground' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  <div className="h-px bg-border my-3" />
                  {isLoggedIn ? (
                    <Link
                      to="/portal"
                      className="flex items-center justify-center w-full px-4 py-3 mt-2 text-sm font-semibold bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/client-login"
                      className="flex items-center justify-center w-full px-4 py-3 mt-2 text-sm font-semibold bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
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

