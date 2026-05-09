import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Rocket, LogOut, LayoutDashboard, User } from 'lucide-react'
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
    <div className="fixed top-0 inset-x-0 z-[100] flex justify-center pt-6 px-6 pointer-events-none">
      <header className={cn(
        "pointer-events-auto flex items-center justify-between w-full max-w-7xl h-16 rounded-[2rem] border px-6 transition-all duration-500",
        scrolled 
          ? "glass border-white/5 shadow-2xl" 
          : "bg-transparent border-transparent"
      )}>
        
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform hover:scale-[1.02] outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
            <Rocket className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-black tracking-tighter text-white leading-none uppercase">
              SatByte
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-blue">
              Career Orbit
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'relative px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all',
                  isActive 
                    ? 'text-white bg-white/5' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
             {isLoggedIn ? (
               <>
                 <Link 
                   to="/dashboard" 
                   className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.05] transition-all"
                 >
                   <LayoutDashboard className="h-4 w-4" /> Hub
                 </Link>
                 <Link 
                   to="/profile" 
                   className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                 >
                   <User className="h-5 w-5" />
                 </Link>
                 <button 
                   onClick={handleLogout}
                   className="h-10 w-10 flex items-center justify-center rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                 >
                   <LogOut className="h-4 w-4" />
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" className="text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest px-4">Sign In</Link>
                 <Link to="/register" className="h-11 px-6 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-xl shadow-white/5">Activate Identity</Link>
               </>
             )}
          </div>

          <div className="hidden lg:block w-px h-6 bg-white/5 mx-2" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-10 w-10 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center h-10 w-10 gap-1.5 rounded-xl text-white hover:bg-white/5 transition-all outline-none relative z-[70]"
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }} className="w-5 h-[2px] bg-current rounded-full block" />
            <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="w-5 h-[2px] bg-current rounded-full block" />
            <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }} className="w-5 h-[2px] bg-current rounded-full block" />
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
                  className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl lg:hidden"
                />
                
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="fixed top-24 inset-x-6 z-[65] flex flex-col rounded-[2.5rem] border border-white/5 bg-[#0A0F14] p-8 shadow-2xl origin-top lg:hidden"
                >
                  <nav className="flex flex-col gap-4">
                    {NAV_LINKS.map(({ href, label }) => (
                      <NavLink
                        key={href}
                        to={href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center px-6 py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all',
                            isActive ? 'bg-brand-blue text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                    <div className="h-px bg-white/5 my-4" />
                    {isLoggedIn ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Link to="/dashboard" className="flex items-center justify-center px-6 py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest">Dashboard</Link>
                        <Link to="/profile" className="flex items-center justify-center px-6 py-5 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest border border-white/10">Profile</Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <Link to="/login" className="flex items-center justify-center w-full py-5 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest">Sign In</Link>
                        <Link to="/register" className="flex items-center justify-center w-full py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest">Create Profile</Link>
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
