import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Layers, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  MoreVertical,
  X,
  PlusCircle,
  TrendingUp,
  DollarSign,
  TrendingDown
} from 'lucide-react'
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useBlogsQuery,
  useDeleteBlog,
  useDeleteProject,
  useDeleteService,
  useProjectsQuery,
  useServicesQuery,
  useOrdersQuery,
  useClientsQuery,
  useTicketsQuery,
  useUpdateOrderStatus,
} from '@/hooks/useCmsQueries'
import { api, clearToken } from '@/lib/apiClient'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { LazyImage } from '@/components/LazyImage'

const categories = ['Web', 'E-commerce', 'Software', 'Other'] as const

type TabId = 'analytics' | 'orders' | 'clients' | 'tickets' | 'projects' | 'blogs' | 'services'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabId>('analytics')
  const [sidebarOpen] = useState(true)

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => document.documentElement.classList.remove('dark')
  }, [])

  const logout = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  const NAV_ITEMS = [
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'tickets', label: 'Support', icon: MessageSquare },
    { id: 'projects', label: 'Portfolio', icon: Briefcase },
    { id: 'blogs', label: 'Blog', icon: FileText },
    { id: 'services', label: 'Services', icon: Layers },
  ] as const

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 transition-colors duration-500 selection:bg-primary/30">
      
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#050B14]/80 backdrop-blur-2xl border-r border-white/10 transition-transform duration-500 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/20">
                S
              </div>
              <h1 className="font-heading text-xl font-extrabold text-white tracking-tight">SatByte RMS</h1>
            </div>
            
            <nav className="space-y-1.5">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-[15px] ${
                    activeTab === id 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${activeTab === id ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  {label}
                  {activeTab === id && (
                    <motion.div layoutId="sidebarActive" className="ml-auto w-1 h-4 bg-white/50 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-white/5">
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 font-semibold hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-20 bg-[#020617]/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input 
                placeholder="Global search..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors w-64"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-3 hidden lg:block">
                <p className="text-xs font-bold text-white">Administrator</p>
                <p className="text-[10px] text-slate-500">Root Access</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 pb-16 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'analytics' && <AnalyticsPanel />}
              {activeTab === 'orders' && <OrdersPanel />}
              {activeTab === 'clients' && <ClientsPanel />}
              {activeTab === 'tickets' && <TicketsPanel />}
              {activeTab === 'projects' && <ProjectsPanel onChanged={() => qc.invalidateQueries({ queryKey: ['projects'] })} />}
              {activeTab === 'blogs' && <BlogsPanel onChanged={() => qc.invalidateQueries({ queryKey: ['blogs'] })} />}
              {activeTab === 'services' && <ServicesPanel onChanged={() => qc.invalidateQueries({ queryKey: ['services'] })} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function AnalyticsPanel() {
  const { data } = useOrdersQuery()
  const { data: clients } = useClientsQuery()
  const { data: tickets } = useTicketsQuery()

  const stats = [
    { label: 'Total Revenue', value: `₹${((data || []).reduce((acc, o) => acc + (o.amountPaid || 0), 0) / 100).toLocaleString()}`, icon: DollarSign, trend: '+12.5%', trendUp: true, color: 'text-green-400' },
    { label: 'Active Projects', value: (data || []).length, icon: Briefcase, trend: '+3', trendUp: true, color: 'text-blue-400' },
    { label: 'Total Clients', value: (clients || []).length, icon: Users, trend: '+8', trendUp: true, color: 'text-purple-400' },
    { label: 'Unresolved Tickets', value: (tickets || []).filter(t => t.status !== 'Closed').length, icon: MessageSquare, trend: '-2', trendUp: false, color: 'text-orange-400' },
  ]

  const chartData = (data || []).reduce((acc: any[], order) => {
    const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const existing = acc.find(v => v.name === date)
    if (existing) {
      existing.revenue += (order.amountPaid || 0) / 100
    } else {
      acc.push({ name: date, revenue: (order.amountPaid || 0) / 100 })
    }
    return acc
  }, []).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime()).slice(-10)

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${s.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {s.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.trend}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{s.label}</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 tracking-tight">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="p-8 rounded-[2rem] bg-[#0A111D]/80 border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Revenue Growth</h3>
            <p className="text-sm text-slate-500">Daily earnings tracking over the last 10 transactions.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">Export CSV</Button>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
              <XAxis dataKey="name" fontSize={12} stroke="#475569" tickLine={false} axisLine={false} />
              <YAxis fontSize={12} stroke="#475569" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function OrdersPanel() {
  const { data, isPending, refetch } = useOrdersQuery()
  const updateStatus = useUpdateOrderStatus()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editProgress, setEditProgress] = useState(0)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const handleEdit = (order: any) => {
    setEditingId(order._id)
    setEditStatus(order.projectStatus || 'Pending')
    setEditProgress(order.progress || 0)
  }

  const handleSave = (id: string) => {
    updateStatus.mutate({ id, projectStatus: editStatus, progress: editProgress })
    setEditingId(null)
  }

  const uploadAsset = async (orderId: string, file: File) => {
    setUploadingId(orderId)
    const fd = new FormData()
    fd.append('file', file)
    try {
      await api.post(`/checkout/orders/${orderId}/assets`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      refetch()
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to upload') } 
    finally { setUploadingId(null) }
  }

  const deleteAsset = async (orderId: string, assetId: string) => {
    if (!confirm('Delete this file?')) return;
    try { await api.delete(`/checkout/orders/${orderId}/assets/${assetId}`); refetch() } 
    catch (e: any) { alert('Failed to delete asset') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Order Management</h2>
          <p className="text-slate-500">Track and manage project deliverables for your clients.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5"><ArrowUpRight className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {isPending ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 w-full animate-pulse rounded-[2rem] bg-white/5 border border-white/10" />)
        ) : !data?.length ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[2rem]">
            <p className="text-slate-500">No projects found.</p>
          </div>
        ) : (
          data.map((order) => (
            <div key={order._id} className="group relative rounded-[2.5rem] bg-[#0A111D]/80 border border-white/5 transition-all overflow-hidden flex flex-col xl:flex-row">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{order.emailReferenceId}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{order.planName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total Paid</span>
                    <span className="text-xl font-extrabold text-white">₹{((order.amountPaid || 0) / 100).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Client Detail</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">
                        {order.customerName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-bold">{order.customerName || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">{order.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex justify-between">
                      Project Status <span>{order.progress || 0}%</span>
                    </h4>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${order.progress || 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 font-medium italic">"{order.projectStatus || 'Pending assignment'}"</p>
                  </div>
                </div>
              </div>

              {/* Action Sidebar on Card */}
              <div className="xl:w-80 bg-white/[0.02] border-t xl:border-t-0 xl:border-l border-white/5 p-8 flex flex-col gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Deliverables</h4>
                  <div className="space-y-2 mb-4">
                   {order.assets?.slice(0, 3).map((asset: any) => (
                      <div key={asset._id} className="flex justify-between items-center group/file bg-white/5 p-2 px-3 rounded-lg border border-transparent hover:border-white/10 text-xs">
                        <a href={asset.fileUrl} target="_blank" className="font-medium text-slate-300 hover:text-primary truncate max-w-[150px]">{asset.fileName}</a>
                        <button onClick={() => deleteAsset(order._id, asset._id)} className="opacity-0 group-hover/file:opacity-100 text-red-500 hover:scale-110 transition-all"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                    {!order.assets?.length && <p className="text-[11px] text-slate-600 italic">No files shared.</p>}
                  </div>
                  <div className="relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && uploadAsset(order._id, e.target.files[0])} />
                    <Button variant="outline" className="w-full text-xs h-9 rounded-xl border-white/10 bg-transparent hover:bg-white/5" disabled={uploadingId === order._id}>
                      <Plus className="h-3 w-3 mr-2" /> {uploadingId === order._id ? 'Uploading...' : 'Quick Upload'}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {editingId === order._id ? (
                    <div className="space-y-3">
                      <Input placeholder="Message..." className="h-9 text-xs" value={editStatus} onChange={e => setEditStatus(e.target.value)} />
                      <div className="flex gap-2">
                         <Input type="number" className="h-9 text-xs w-20" value={editProgress} onChange={e => setEditProgress(Number(e.target.value))} />
                         <Button size="sm" className="flex-1" onClick={() => handleSave(order._id)}>Save</Button>
                         <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => handleEdit(order)} variant="secondary" className="w-full rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary/90 border-0 shadow-lg shadow-primary/20">
                      Edit Execution Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ClientsPanel() {
  const { data, isPending } = useClientsQuery()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Clients Portal</h2>
          <p className="text-slate-500">Manage registered accounts and verification status.</p>
        </div>
      </div>

      <div className="bg-[#0A111D]/80 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Joined At</th>
                <th className="px-8 py-5">Verification</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isPending ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={4} className="px-8 py-6 h-16 animate-pulse bg-white/[0.02]" /></tr>)
              ) : data?.map((client) => (
                <tr key={client._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-primary">
                      {client.email?.[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-white pr-4">{client.email}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">
                    {new Date(client.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${client.hasPassword ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {client.hasPassword ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {client.hasPassword ? 'Password Verified' : 'OTP Active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-600 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TicketsPanel() {
  const { data: ticketsItems, isPending, refetch } = useTicketsQuery()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage || !selectedTicket) return
    try {
      await api.post(`/tickets/${selectedTicket._id}/reply`, { message: replyMessage })
      setReplyMessage('')
      refetch()
      setSelectedTicket((prev: any) => ({
        ...prev, 
        status: 'Admin Replied', 
        messages: [...prev.messages, { sender: 'admin', content: replyMessage, createdAt: new Date() }]
      }))
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to reply') }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicket || !confirm('Close this ticket?')) return
    try { await api.put(`/tickets/${selectedTicket._id}/close`); refetch(); setSelectedTicket(null); } 
    catch (err: any) { alert(err.response?.data?.message || 'Failed to close') }
  }

  return (
    <div className="h-[75vh] flex flex-col md:flex-row bg-[#0A111D]/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className={`md:w-96 border-r border-white/10 flex flex-col ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-bold text-white font-heading mb-1">Support Queue</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Inquiries</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
          {isPending ? <p className="text-center p-8 animate-pulse text-slate-600">Syncing...</p> : 
            ticketsItems?.map(ticket => (
              <button 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-5 rounded-[1.5rem] transition-all border ${selectedTicket?._id === ticket._id ? 'bg-primary/10 border-primary/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-[15px] truncate pr-4">{ticket.subject}</h4>
                  <span className={`h-2 w-2 rounded-full mt-1.5 ${ticket.status === 'Open' ? 'bg-green-500' : 'bg-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-500 truncate mb-3">{ticket.email}</p>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  <span className={`px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'text-green-500 bg-green-500/5' : 'text-slate-500 bg-slate-500/5'}`}>{ticket.status}</span>
                  <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))
          }
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-[#050B14] ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
        {selectedTicket ? (
          <>
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 rounded-lg bg-white/5" onClick={() => setSelectedTicket(null)}><ChevronRight className="h-4 w-4 rotate-180" /></button>
                <div>
                  <h3 className="font-extrabold text-xl text-white tracking-tight">{selectedTicket.subject}</h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{selectedTicket.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl" onClick={handleCloseTicket}>Close Ticket</Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar">
              {selectedTicket.messages.map((msg: any, i: number) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">{msg.sender === 'admin' ? 'Support Desk' : 'Client'}</p>
                  <div className={`max-w-[80%] p-4 px-6 rounded-[1.5rem] shadow-xl ${msg.sender === 'admin' ? 'bg-primary text-white rounded-tr-sm' : 'bg-[#121A2F] text-slate-200 border border-white/5 rounded-tl-sm'}`}>
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <form onSubmit={handleReplyTicket} className="flex gap-4">
                <Input 
                  placeholder="Type a professional response..." 
                  className="rounded-full h-12 bg-[#121A2F] border-white/10" 
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                />
                <Button type="submit" disabled={!replyMessage.trim()} className="rounded-full px-8 bg-primary">Send Message</Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
            <MessageSquare className="h-20 w-20 mb-6 text-slate-700" />
            <h3 className="text-2xl font-bold text-white">Select a ticket to interact</h3>
            <p className="max-w-xs mt-2">Pick an open support request from the queue to start discussing.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsPanel({ onChanged }: { onChanged: () => void }) {
  const { data } = useProjectsQuery()
  const del = useDeleteProject()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{ title: string; description: string; technologies: string; category: (typeof categories)[number] }>({
    defaultValues: { category: 'Web', title: '', description: '', technologies: '' },
  })

  const createProject = async (e: FormEvent) => {
    e.preventDefault()
    const values = getValues()
    const file = fileRef.current?.files?.[0]
    if (!file) return alert('Choose image')
    const fd = new FormData(); fd.append('title', values.title); fd.append('description', values.description);
    fd.append('technologies', JSON.stringify(values.technologies.split(',').map(t=>t.trim())));
    fd.append('category', values.category); fd.append('image', file);
    await api.post('/projects', fd); reset(); if(fileRef.current) fileRef.current.value=''; onChanged();
  }

  return (
    <div className="space-y-10">
      <div className="bg-[#0A111D]/80 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-8 font-heading">Publish to Portfolio</h3>
        <form onSubmit={createProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <Label>Project Title</Label>
            <Input {...register('title')} className="rounded-xl h-12 bg-white/5 border-white/10" />
          </div>
          <div className="space-y-4 md:col-span-2">
            <Label>Summary</Label>
            <Textarea {...register('description')} className="rounded-2xl min-h-[100px] bg-white/5 border-white/10" />
          </div>
          <div className="space-y-4">
            <Label>Tags</Label>
            <Input {...register('technologies')} placeholder="React, Node.js..." className="rounded-xl h-12 bg-white/5 border-white/10" />
          </div>
          <div className="space-y-4">
            <Label>Category</Label>
            <select {...register('category')} className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none">
              {categories.map(c => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 p-10 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
            <PlusCircle className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">Choose a high-quality cover image for this showcase</p>
            <Input type="file" ref={fileRef} className="max-w-[300px] mx-auto bg-transparent border-0" />
          </div>
          <Button type="submit" className="md:col-span-2 h-14 rounded-2xl bg-primary text-white font-bold text-lg">Add Project to Site</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.map(p => (
           <div key={p._id} className="group relative bg-[#0A111D]/80 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-white/20 transition-all duration-500">
             <div className="relative h-48 overflow-hidden">
                <LazyImage src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A111D] to-transparent opacity-60" />
             </div>
             <div className="p-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">{p.category}</span>
                <h4 className="text-xl font-bold text-white mb-3">{p.title}</h4>
                <div className="flex gap-2 mb-6">
                  {p.technologies.slice(0, 3).map(t => <span key={t} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold">{t}</span>)}
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button variant="outline" className="flex-1 rounded-xl border-white/10 h-10 text-xs"><Edit3 className="h-3 w-3 mr-2" /> Edit</Button>
                  <Button variant="outline" className="flex-1 rounded-xl border-red-500/20 h-10 text-xs text-red-400 hover:bg-red-500/10" onClick={() => { if(confirm('Delete?')) del.mutate(p._id, {onSuccess: onChanged}) }}><Trash2 className="h-3 w-3 mr-2" /> Delete</Button>
                </div>
             </div>
           </div>
        ))}
      </div>
    </div>
  )
}

function BlogsPanel({ onChanged }: { onChanged: () => void }) {
  const { data } = useBlogsQuery()
  const del = useDeleteBlog()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{ title: string; excerpt: string; readTime: string; author: string; category: string }>()
  const [contentHtml, setContentHtml] = useState('')

  const createBlog = async (e: FormEvent) => {
    e.preventDefault(); const v = getValues(); const img = fileRef.current?.files?.[0];
    if(!img || !contentHtml) return alert('Missing info');
    const fd = new FormData(); fd.append('title', v.title); fd.append('content', contentHtml); fd.append('excerpt', v.excerpt);
    fd.append('readTime', v.readTime); fd.append('author', v.author); fd.append('category', v.category); fd.append('image', img);
    await api.post('/blogs', fd); reset(); setContentHtml(''); onChanged();
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-10">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white font-heading px-4">Latest Posts</h2>
        <div className="space-y-6">
          {data?.map(b => (
            <div key={b._id} className="flex flex-col md:flex-row gap-6 p-6 rounded-[2.5rem] bg-[#0A111D]/80 border border-white/5 hover:border-white/15 transition-all">
              <div className="h-44 w-full md:w-64 rounded-3xl overflow-hidden shrink-0">
                <LazyImage src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex gap-4 items-center mb-3">
                  <span className="text-xs font-bold text-primary uppercase">{b.category}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-500">{b.author}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 leading-tight">{b.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 pr-10">{b.excerpt || 'View this article on the blog page...'}</p>
                <div className="mt-auto flex gap-3">
                  <button className="text-xs font-bold text-white border-b border-white pb-0.5 hover:text-primary hover:border-primary transition-colors">Edit Article</button>
                  <button onClick={() => { if(confirm('Del?')) del.mutate(b._id, {onSuccess: onChanged}) }} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors pl-4">Delete Permanently</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-8 rounded-[2.5rem] bg-[#0A111D]/80 border border-white/10 sticky top-28">
          <h3 className="text-xl font-bold text-white mb-6">Write New Post</h3>
          <form onSubmit={createBlog} className="space-y-4">
            <Input {...register('title')} placeholder="Catchy Headline" className="bg-white/5 rounded-xl border-white/10" />
            <div className="grid grid-cols-2 gap-4">
               <Input {...register('readTime')} placeholder="5 min read" className="bg-white/5 rounded-xl border-white/10" />
               <Input {...register('category')} placeholder="Category" className="bg-white/5 rounded-xl border-white/10" />
            </div>
            <Input {...register('excerpt')} placeholder="Brief summary..." className="bg-white/5 rounded-xl border-white/10" />
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <RichTextEditor value={contentHtml} onChange={setContentHtml} />
            </div>
            <div className="py-2">
              <Label className="text-[10px] text-slate-500 uppercase font-bold pl-1">Thumbnail Image</Label>
              <Input type="file" ref={fileRef} className="mt-2 bg-transparent border-0" />
            </div>
            <Button type="submit" className="w-full rounded-xl py-6 bg-primary font-bold">Post to CMS</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ServicesPanel({ onChanged }: { onChanged: () => void }) {
  const { data } = useServicesQuery()
  const del = useDeleteService()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{ title: string; description: string; iconKey: string }>()

  const createService = async (e: FormEvent) => {
    e.preventDefault(); const v = getValues(); const img = fileRef.current?.files?.[0];
    if(!img) return alert('Choose icon');
    const fd = new FormData(); fd.append('title', v.title); fd.append('description', v.description);
    fd.append('iconKey', v.iconKey || 'Globe'); fd.append('image', img);
    await api.post('/services', fd); reset(); onChanged();
  }

  return (
    <div className="space-y-10">
      <div className="bg-[#0A111D]/80 border border-white/10 p-10 rounded-[2.5rem]">
        <h3 className="text-xl font-bold text-white mb-6">Manage Services</h3>
        <form onSubmit={createService} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4"><Label>Title</Label><Input {...register('title')} className="rounded-xl h-12 bg-white/5 border-white/10" /></div>
          <div className="space-y-4"><Label>Icon Mapping</Label><Input {...register('iconKey')} placeholder="Globe, Search, etc" className="rounded-xl h-12 bg-white/5 border-white/10" /></div>
          <div className="space-y-4 md:col-span-2"><Label>Description</Label><Textarea {...register('description')} className="rounded-2xl bg-white/5 border-white/10" /></div>
          <div className="md:col-span-2 flex items-center gap-6 p-6 border border-white/5 rounded-2xl bg-white/[0.02]">
            <Label className="shrink-0 font-bold">Icon PNG/SVG</Label>
            <Input type="file" ref={fileRef} className="bg-transparent border-0" />
          </div>
          <Button type="submit" className="md:col-span-2 h-12 rounded-xl bg-primary">Add Service</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map(s => (
          <div key={s._id} className="p-6 rounded-[2rem] bg-[#0A111D]/80 border border-white/5 group relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/5 group-hover:border-primary/30 transition-colors">
                  <LazyImage src={s.iconUrl} alt={s.title} className="w-full h-full object-contain" />
                </div>
                <button onClick={() => { if(confirm('Del?')) del.mutate(s._id, {onSuccess: onChanged}) }} className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
             </div>
             <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
             <p className="text-sm text-slate-500 line-clamp-2">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

