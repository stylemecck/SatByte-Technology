import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, ChevronRight } from 'lucide-react'
import { NAV_LINKS } from '../lib/constants'
import { getStoredToken, clearToken } from '../lib/apiClient'
import { cn } from '../utils/cn'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken())
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    clearToken()
    setIsLoggedIn(false)
    window.location.reload()
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8',
        scrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'py-6 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-secondary tracking-tight leading-none text-xl">
              SatByte
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">
              Careers
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-[15px] font-bold transition-colors hover:text-primary',
                location.pathname === link.href ? 'text-primary' : 'text-slate-600'
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-slate-200 mx-2" />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-secondary font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                <User size={16} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-secondary font-bold text-sm hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-white font-bold text-sm shadow-xl shadow-secondary/20 hover:bg-primary hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Register <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-secondary hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg font-bold transition-colors',
                    location.pathname === link.href ? 'text-primary' : 'text-slate-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-full bg-slate-100 my-2" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-lg font-bold text-secondary"
                  >
                    <User size={20} /> My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-lg font-bold text-red-500"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg"
                  >
                    Get Started <ChevronRight size={20} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
