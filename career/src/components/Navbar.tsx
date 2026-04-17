import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, X, Rocket, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useTheme } from '../contexts/ThemeContext'
import { NAV_LINKS } from '../lib/constants'
import { getStoredToken, clearToken } from '../lib/apiClient'
import { cn } from '../utils/cn'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken())
  }, [location])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    clearToken()
    setIsLoggedIn(false)
    window.location.reload()
  }

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
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
              SatByte
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-brand-blue sm:block">
              Careers
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'relative h-full flex items-center px-4 text-[13px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md uppercase tracking-wider',
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
                      layoutId="nav-active-career" 
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
          {isLoggedIn ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4 mr-2">
              <Link to="/login" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Sign In</Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-foreground text-background text-xs font-black uppercase tracking-[0.1em] hover:opacity-90 transition-opacity">Apply Now</Link>
            </div>
          )}

          <div className="hidden lg:block w-px h-4 bg-border mx-1" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center h-9 w-9 gap-[4px] rounded-full text-foreground hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring relative z-[70]"
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }} className="w-4 h-[2px] bg-current rounded-full block origin-center" />
            <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="w-4 h-[2px] bg-current rounded-full block" />
            <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }} className="w-4 h-[2px] bg-current rounded-full block origin-center" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm lg:hidden"
                />
                
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="fixed top-4 inset-x-4 z-[65] flex flex-col rounded-3xl border border-border bg-background p-6 shadow-2xl outline-none origin-top lg:hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-2 text-foreground font-bold font-heading">
                      <Rocket className="h-4 w-4" /> SatByte Careers
                   </div>
                     <button 
                        onClick={() => setIsOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {NAV_LINKS.map(({ href, label }) => (
                      <NavLink
                        key={href}
                        to={href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center px-4 py-3 text-lg font-bold rounded-xl transition-colors',
                            isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                    <div className="h-px bg-border my-2" />
                    {isLoggedIn ? (
                      <Link to="/dashboard" className="flex items-center justify-center w-full px-4 py-4 rounded-xl bg-foreground text-background font-black text-sm uppercase tracking-widest">User Dashboard</Link>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link to="/login" className="flex items-center justify-center w-full py-4 rounded-xl bg-secondary text-foreground font-bold">Sign In</Link>
                        <Link to="/register" className="flex items-center justify-center w-full py-4 rounded-xl bg-foreground text-background font-black text-sm uppercase tracking-widest">Apply Now</Link>
                      </div>
                    )}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>
    </div>
  )
}

