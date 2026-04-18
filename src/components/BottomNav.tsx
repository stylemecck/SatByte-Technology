import { motion } from 'framer-motion'
import { Home, Briefcase, Layers, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/portfolio', label: 'Portfolio', icon: Layers },
  { href: '/portal', label: 'Account', icon: User },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[100] md:hidden bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
          
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute -inset-2 bg-secondary/50 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight leading-none">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
