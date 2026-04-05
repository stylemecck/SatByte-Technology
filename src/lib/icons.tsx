import {
  BarChart3,
  Briefcase,
  Camera,
  Cpu,
  Globe,
  LayoutDashboard,
  Layers,
  Megaphone,
  MessageSquare,
  Palette,
  Search,
  Server,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/** Maps string keys from `constants` to Lucide icons for dynamic rendering. */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Search,
  Megaphone,
  Briefcase,
  Layers,
  ShoppingBag,
  Palette,
  TrendingUp,
  BarChart3,
  Wrench,
  Server,
  Camera,
  Cpu,
  MessageSquare,
}

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? Globe
}
