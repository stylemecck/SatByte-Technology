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
  Send
} from 'lucide-react'

import { api, getStoredToken, setAuthToken } from '@/lib/apiClient'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'

const fadeAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
} as const

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

function useMyOrdersQuery() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const stored = getStoredToken()
      if (stored) setAuthToken(stored)
      const { data } = await api.get('/checkout/my-orders')
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
      const { data } = await api.get('/tickets')
      return data as any[]
    },
    refetchInterval: 3000, // Real-time refresh every 3s
  })
}

export default function ClientDashboardPage() {
  const token = localStorage.getItem('satbyte_token')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'projects' | 'billing' | 'support' | 'settings'>('projects')
  const [newPassword, setNewPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg, setPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const [activeTicketParams, setActiveTicketParams] = useState({ subject: '', orderId: '', message: '' })
  const [replyMessage, setReplyMessage] = useState('')
  const { data, isPending, isError, refetch } = useMyOrdersQuery()
  const { data: ticketsItems, refetch: refetchTickets } = useTicketsQuery()

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const selectedTicket = ticketsItems?.find(t => t._id === selectedTicketId)

  // Force dark mode aesthetic on body
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => document.documentElement.classList.remove('dark') // Cleanup if needed, though most of site supports dark
  }, [])

  if (!token) {
    return <Navigate to="/client-login" replace />
  }

  const logout = () => {
    localStorage.removeItem('satbyte_token')
    navigate('/')
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
      await api.post('/auth/client-set-password', { password: newPassword })
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
      await api.post('/tickets', activeTicketParams)
      setActiveTicketParams({ subject: '', orderId: '', message: '' })
      refetchTickets()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket')
    }
  }

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage || !selectedTicketId) return
    
    try {
      await api.post(`/tickets/${selectedTicketId}/reply`, { message: replyMessage })
      setReplyMessage('')
      refetchTickets()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send reply')
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicketId || !confirm('Are you sure you want to resolve this ticket?')) return
    try {
      await api.put(`/tickets/${selectedTicketId}/close`)
      refetchTickets()
      setSelectedTicketId(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close ticket')
    }
  }

  const NAV_ITEMS = [
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-300 font-sans selection:bg-primary/30">
      <SEO title="Client Portal" description="Track your SatByte projects" path="/portal" />
      
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 lg:py-16 min-h-[85vh]">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">Client Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight">Your Dashboard</h1>
            <p className="mt-2 text-slate-400 text-lg">Manage deliverables, track billing, and get top-tier support.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <button 
              onClick={logout}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
            >
              <LogOut className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              Sign Out
            </button>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          className="flex space-x-2 border-b border-white/10 mb-10 overflow-x-auto hide-scrollbar pb-1"
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSelectedTicketId(null); }}
              className={`relative px-5 py-3 text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon className={`h-4 w-4 ${activeTab === id ? 'text-primary' : ''}`} />
              {label}
              {activeTab === id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent"
                  animate
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Shared Loading/Error States */}
        {isPending && (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 w-full animate-pulse rounded-[2rem] bg-white/5 border border-white/10" />
            ))}
          </div>
        )}
        
        {isError && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-red-400 font-semibold text-lg">Failed to sync data.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-full">
              Try Again
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isPending && !isError && (
            <motion.div key={activeTab} {...fadeAnim} className="w-full">
              
              {/* TAB: PROJECTS */}
              {activeTab === 'projects' && (
                data?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-24 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="h-16 w-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <FolderGit2 className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Projects</h3>
                    <p className="text-slate-400 max-w-sm mb-6">Looks like you don't have any ongoing projects. Head over to pricing to start a new engagement.</p>
                    <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                      Explore Services <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-8 lg:grid-cols-2">
                    {data?.map((order) => (
                      <motion.div key={order._id} variants={fadeAnim} className="group relative rounded-[2rem] border border-white/10 bg-[#0A111D]/80 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors duration-500 shadow-2xl">
                        
                        <div className="p-8 pb-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-3">
                                {order.status === 'paid' ? 'Active' : order.status}
                              </span>
                              <h3 className="font-heading text-2xl font-bold text-white mb-1">{order.planName}</h3>
                              <p className="text-sm font-mono text-slate-500">Ref: {order.emailReferenceId}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Status</span>
                              <span className="text-white font-medium">{order.projectStatus || 'Pending Assignment'}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-slate-400">Development Progress</span>
                              <span className="font-bold text-white">{order.progress || 0}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-[#1A2235] rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${order.progress || 0}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-blue-600 via-primary to-accent rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-white/20 w-1/3 blur-sm animate-[shimmer_2s_infinite]" />
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        <div className="px-8 py-6 border-t border-white/5 bg-black/20">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Project Deliverables
                          </h4>
                          
                          <div className="space-y-2.5 mb-6 max-h-[160px] overflow-y-auto hide-scrollbar">
                            {order.assets && order.assets.length > 0 ? (
                              order.assets.map((asset: any) => (
                                <div key={asset._id} className="group/asset flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                  <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                      <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                      <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-primary transition-colors truncate block">
                                        {asset.fileName}
                                      </a>
                                      <p className="text-xs text-slate-500 mt-0.5">{new Date(asset.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={async () => {
                                      if (!confirm('Delete this file permanently?')) return;
                                      try { await api.delete(`/checkout/orders/${order._id}/assets/${asset._id}`); refetch(); } 
                                      catch (e) { alert('Failed to delete file') }
                                    }}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover/asset:opacity-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                                <p className="text-sm text-slate-500">No assets uploaded yet.</p>
                              </div>
                            )}
                          </div>

                          {/* Upload */}
                          <div className="relative">
                            <input 
                              type="file" 
                              id={`file-upload-${order._id}`}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed disabled:opacity-0"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData(); formData.append('file', file);
                                const uploadInput = document.getElementById(`file-upload-${order._id}`) as HTMLInputElement;
                                if (uploadInput) uploadInput.disabled = true;
                                try {
                                  await api.post(`/checkout/orders/${order._id}/assets`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
                                  refetch();
                                } catch (err: any) { alert(err.response?.data?.message || 'Failed to upload'); } 
                                finally { if (uploadInput) { uploadInput.disabled = false; uploadInput.value = ''; } }
                              }}
                            />
                            <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-colors group-hover:border-primary/30">
                              <UploadCloud className="h-4 w-4 text-primary" />
                              Upload Asset <span className="text-xs text-slate-500 font-normal ml-1">(Max 15MB)</span>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </motion.div>
                )
              )}

              {/* TAB: BILLING */}
              {activeTab === 'billing' && (
                <div className="bg-[#0A111D]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white font-heading">Billing History</h3>
                    <p className="text-slate-400">View your past transactions and invoices.</p>
                  </div>
                  
                  {data?.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                      <CreditCard className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500">No billing records found.</p>
                    </div>
                  ) : (
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                      {data?.map((order) => (
                        <motion.div key={order._id} variants={fadeAnim} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-lg">{order.planName}</h4>
                              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-1">
                                <span>{order.emailReferenceId}</span>
                                <span>•</span>
                                <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right sm:text-right w-full sm:w-auto flex sm:block justify-between items-center sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 mt-2">
                            <span className="text-xl font-heading font-extrabold text-white block">
                              {order.amountPaid ? `₹${(order.amountPaid / 100).toLocaleString('en-IN')}` : '—'}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 sm:mt-1">
                              Paid
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB: SUPPORT */}
              {activeTab === 'support' && (
                <div className="h-[75vh] min-h-[600px] max-h-[800px] bg-[#0A111D]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                  
                  {/* Sidebar: Ticket List */}
                  <div className={`md:w-1/3 border-r border-white/10 flex flex-col ${selectedTicketId ? 'hidden md:flex' : 'flex w-full'}`}>
                    <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                      <h3 className="text-xl font-bold text-white font-heading">Support Inbox</h3>
                      <p className="text-sm text-slate-400">We usually reply within hours.</p>
                      <button 
                        onClick={() => setSelectedTicketId(null)}
                        className={`mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary font-semibold hover:border-primary/60 hover:bg-primary/5 transition-colors ${!selectedTicketId ? 'bg-primary/5 border-primary/50' : ''}`}
                      >
                        + New Ticket
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
                      {!ticketsItems?.length && (
                        <p className="text-center text-sm text-slate-500 py-10">No messages yet.</p>
                      )}
                      {ticketsItems?.map((ticket: any) => (
                        <button 
                          key={ticket._id}
                          onClick={() => setSelectedTicketId(ticket._id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            selectedTicketId === ticket._id 
                              ? 'bg-primary/10 border-primary/30 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]' 
                              : 'bg-transparent border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-white truncate pr-4 text-[15px]">{ticket.subject}</h4>
                            <span className={`shrink-0 h-2 w-2 rounded-full mt-1.5 ${
                              ticket.status === 'Open' ? 'bg-green-400' 
                              : ticket.status === 'Closed' ? 'bg-slate-600' 
                              : 'bg-yellow-400 animate-pulse'
                            }`} />
                          </div>
                          <p className="text-xs text-slate-500 truncate mb-2">{ticket.messages?.[ticket.messages.length - 1]?.content || 'Started ticket...'}</p>
                          <div className="flex items-center text-[11px] text-slate-600 font-mono">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(ticket.updatedAt).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Chat / Create Area */}
                  <div className={`flex-1 flex flex-col bg-[#050B14] ${!selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
                    {selectedTicket ? (
                      /* Chat View */
                      <>
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                          <div className="flex items-center gap-3">
                            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSelectedTicketId(null)}>
                              Back
                            </button>
                            <div>
                              <h3 className="font-bold text-lg text-white">{selectedTicket.subject}</h3>
                              <p className="text-xs text-slate-400 font-mono">ID: {selectedTicket._id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              selectedTicket.status === 'Open' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : selectedTicket.status === 'Closed' ? 'bg-slate-800 text-slate-400 border border-white/10'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {selectedTicket.status}
                            </span>
                            {selectedTicket.status !== 'Closed' && (
                              <button onClick={handleCloseTicket} className="text-xs font-semibold text-slate-400 hover:text-white border-b border-slate-600 hover:border-white pb-0.5 transition-colors">
                                Close
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                          {selectedTicket.messages.map((msg: any, idx: number) => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[11px] font-bold text-slate-500 mb-1.5 px-1 tracking-wider uppercase">
                                {msg.sender === 'client' ? 'You' : 'SatByte Team'} <span className="opacity-50 font-normal lowercase tracking-normal mx-1">at</span> {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg ${
                                msg.sender === 'client' 
                                  ? 'bg-primary text-white rounded-tr-sm shadow-primary/20' 
                                  : 'bg-[#121A2F] border border-white/5 text-slate-200 rounded-tl-sm'
                              }`}>
                                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {selectedTicket.status !== 'Closed' && (
                          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                            <form onSubmit={handleReplyTicket} className="relative flex items-end gap-2">
                              <textarea 
                                placeholder="Write a response..." 
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="w-full bg-[#121A2F] border border-white/10 text-white rounded-2xl pl-5 pr-14 py-4 min-h-[60px] max-h-[150px] focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none hide-scrollbar placeholder-slate-500"
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplyTicket(e); }}}
                              />
                              <button 
                                type="submit" 
                                disabled={!replyMessage.trim()} 
                                className="absolute right-3 bottom-3 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95"
                              >
                                <Send className="h-4 w-4 ml-0.5" />
                              </button>
                            </form>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Create Ticket View */
                      <div className="p-8 md:p-12 flex-1 flex items-center justify-center overflow-y-auto">
                        <div className="w-full max-w-lg">
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold font-heading text-white">Create a Support Ticket</h2>
                            <p className="text-slate-400 mt-2">Describe the bug, feature request, or assistance you need.</p>
                          </div>
                          
                          <form onSubmit={handleCreateTicket} className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Related Project</label>
                              <div className="relative">
                                <select 
                                  className="w-full appearance-none bg-[#121A2F] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary/50 focus:outline-none font-medium"
                                  value={activeTicketParams.orderId}
                                  onChange={(e) => setActiveTicketParams(p => ({...p, orderId: e.target.value}))}
                                >
                                  <option value="">General Support / Billing</option>
                                  {data?.map(o => <option key={o._id} value={o._id}>{o.planName}</option>)}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Short Subject</label>
                              <input 
                                className="w-full bg-[#121A2F] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:border-primary/50 focus:outline-none"
                                placeholder="E.g., Domain configuration issue"
                                value={activeTicketParams.subject}
                                onChange={(e) => setActiveTicketParams(p => ({...p, subject: e.target.value}))}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Message</label>
                              <textarea 
                                className="w-full bg-[#121A2F] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:border-primary/50 focus:outline-none min-h-[160px] resize-none"
                                placeholder="Provide as much context as possible..."
                                value={activeTicketParams.message}
                                onChange={(e) => setActiveTicketParams(p => ({...p, message: e.target.value}))}
                                required
                              />
                            </div>

                            <Button type="submit" className="w-full rounded-xl py-6 font-bold text-[15px] bg-gradient-to-r from-primary to-accent border-0 shadow-lg shadow-primary/20">
                              Submit Ticket
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div variants={fadeAnim} className="bg-[#0A111D]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                    <h3 className="text-2xl font-bold font-heading text-white mb-2">Set Password</h3>
                    <p className="text-slate-400 mb-8 max-w-sm">Skip the email OTPs next time you log in to your portal by setting a permanent password.</p>
                    
                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                        <input
                          type="password"
                          className="w-full bg-[#121A2F] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:border-primary/50 focus:outline-none"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      {passMsg && (
                        <div className={`p-4 rounded-xl text-sm font-semibold border ${
                          passMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {passMsg.text}
                        </div>
                      )}

                      <Button type="submit" disabled={passLoading} className="rounded-xl font-bold px-8 shadow-lg shadow-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 bg-white/5 text-white w-full sm:w-auto">
                        {passLoading ? 'Saving...' : 'Save Password'}
                      </Button>
                    </form>
                  </motion.div>

                  <motion.div variants={fadeAnim} className="h-fit bg-[#0A111D]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10">
                    <h3 className="text-xl font-bold font-heading text-white mb-6">Account Profile</h3>
                    
                    <div className="space-y-6">
                      <div className="pb-6 border-b border-white/5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Primary Email</label>
                        <div className="font-mono text-lg text-white">
                          {data?.[0]?.email || 'Loading...'}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Registration Status</label>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400 shadow-inner">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Authenticated Client
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
