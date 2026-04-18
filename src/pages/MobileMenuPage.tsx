import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Info, 
  CreditCard, 
  Gem, 
  Star, 
  BookOpen, 
  Mail, 
  FileText,
  ChevronRight
} from 'lucide-react'

const MENU_GROUPS = [
  {
    title: "Agency",
    items: [
      { label: "About SatByte", href: "/about", icon: Info },
      { label: "Pricing & Plans", href: "/pricing", icon: CreditCard },
      { label: "Portfolio", href: "/portfolio", icon: Gem },
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "Client Testimonials", href: "/testimonials", icon: Star },
      { label: "Our Blog", href: "/blog", icon: BookOpen },
    ]
  },
  {
    title: "Support",
    items: [
      { label: "Contact Us", href: "/contact", icon: Mail },
      { label: "Request a Quote", href: "/quote", icon: FileText },
    ]
  }
]

export default function MobileMenuPage() {
  return (
    <div className="p-6">
      <div className="space-y-8">
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] active:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                        <item.icon className="h-5 w-5 text-white/70" />
                      </div>
                      <span className="font-medium text-[15px]">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/20" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Footer info in menu */}
        <div className="pt-8 pb-12 text-center">
          <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
            SatByte Technology V2.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
