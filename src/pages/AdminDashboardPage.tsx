import * as Tabs from '@radix-ui/react-tabs'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import type { BlogDTO, ProjectDTO, ServiceDTO } from '@/types/cms'

const categories = ['Web', 'E-commerce', 'Software', 'Other'] as const

/** CMS dashboard: manage portfolio, blog, and service images (Cloudinary + MongoDB). */
export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const logout = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617]">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="font-heading text-lg font-semibold text-secondary dark:text-white">Admin CMS</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button variant="secondary" size="sm" type="button" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Tabs.Root defaultValue="analytics">
          <Tabs.List className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
            {(['analytics', 'orders', 'clients', 'tickets', 'projects', 'blogs', 'services'] as const).map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:bg-primary capitalize"
              >
                {tab === 'projects' ? 'Portfolio' : tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="analytics">
            <AnalyticsPanel />
          </Tabs.Content>
          <Tabs.Content value="orders">
            <OrdersPanel />
          </Tabs.Content>
          <Tabs.Content value="clients">
            <ClientsPanel />
          </Tabs.Content>
          <Tabs.Content value="tickets">
            <TicketsPanel />
          </Tabs.Content>
          <Tabs.Content value="projects">
            <ProjectsPanel
              onChanged={() => qc.invalidateQueries({ queryKey: ['projects'] })}
            />
          </Tabs.Content>
          <Tabs.Content value="blogs">
            <BlogsPanel onChanged={() => qc.invalidateQueries({ queryKey: ['blogs'] })} />
          </Tabs.Content>
          <Tabs.Content value="services">
            <ServicesPanel onChanged={() => qc.invalidateQueries({ queryKey: ['services'] })} />
          </Tabs.Content>
        </Tabs.Root>
      </main>
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
      await api.post(`/checkout/orders/${orderId}/assets`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      refetch()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to upload')
    } finally {
      setUploadingId(null)
    }
  }

  const deleteAsset = async (orderId: string, assetId: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await api.delete(`/checkout/orders/${orderId}/assets/${assetId}`)
      refetch()
    } catch (e: any) {
      alert('Failed to delete asset')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders & Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-slate-500">Loading orders…</p>
        ) : !data?.length ? (
          <p className="text-sm text-slate-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {data.map((order) => (
              <div key={order._id} className="border border-slate-200 dark:border-white/10 rounded-xl p-6 bg-white dark:bg-white/5">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white mb-1">{order.planName}</h3>
                    <div className="text-sm text-slate-500 mb-1">
                      <span className="font-medium">Customer:</span> {order.customerName || 'N/A'} ({order.email})
                    </div>
                    <div className="text-sm text-slate-500">
                      <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-accent/20 dark:text-accent">
                      {order.amountPaid ? `₹${(order.amountPaid / 100).toLocaleString('en-IN')}` : 'Free'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/10">
                  {/* Status Editor */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-200">Project Status</h4>
                    {editingId === order._id ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Status Message</Label>
                          <Input
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="h-9 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Progress (%)</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editProgress}
                              onChange={(e) => setEditProgress(Number(e.target.value))}
                              className="h-9 w-24"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => handleSave(order._id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{order.projectStatus || 'Pending'}</span>
                          <span>{order.progress || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-[#0f172a]">
                          <div className="h-full bg-primary" style={{ width: `${order.progress || 0}%` }}></div>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => handleEdit(order)}>Edit Details</Button>
                      </div>
                    )}
                  </div>

                  {/* Assets Editor */}
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-200 mb-4">Project Assets</h4>
                    <div className="space-y-2 mb-4">
                      {!order.assets || order.assets.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No files uploaded.</p>
                      ) : (
                        order.assets.map((asset: any) => (
                          <div key={asset._id} className="flex items-center justify-between p-2 rounded border border-slate-200 dark:border-white/10 text-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate" title={asset.fileName}>{asset.fileName}</a>
                            </div>
                            <button onClick={() => deleteAsset(order._id, asset._id)} className="text-red-500 hover:text-red-700 ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="file" 
                        disabled={uploadingId === order._id}
                        className="text-xs"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadAsset(order._id, e.target.files[0])
                            e.target.value = ''
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ClientsPanel() {
  const { data, isPending } = useClientsQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Clients</CardTitle>
        <CardDescription>All user accounts with active access.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-slate-500">Loading clients…</p>
        ) : !data?.length ? (
          <p className="text-sm text-slate-500">No clients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {data.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-secondary dark:text-white">
                      {client.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {client.hasPassword ? 'Password Set' : 'OTP Only'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
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
        status: 'Waiting on Client', 
        messages: [...prev.messages, { sender: 'admin', content: replyMessage, createdAt: new Date() }]
      }))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send reply')
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicket || !confirm('Close this ticket?')) return
    try {
      await api.put(`/tickets/${selectedTicket._id}/close`)
      refetch()
      setSelectedTicket(null)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close ticket')
    }
  }

  if (selectedTicket) {
    return (
      <Card className="border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 flex flex-row items-center justify-between pb-4">
          <div>
            <Button variant="ghost" className="mb-2 -ml-3 h-8 text-slate-500" onClick={() => setSelectedTicket(null)}>
              ← Back to All Tickets
            </Button>
            <CardTitle className="text-xl">
              {selectedTicket.subject}
            </CardTitle>
            <p className="text-sm font-mono text-slate-500 mt-1">Client: {selectedTicket.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              selectedTicket.status === 'Open' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              : selectedTicket.status === 'Closed' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {selectedTicket.status}
            </span>
            {selectedTicket.status !== 'Closed' && (
              <Button variant="outline" size="sm" onClick={handleCloseTicket}>
                Close Ticket
              </Button>
            )}
          </div>
        </CardHeader>
        <div className="flex-1 bg-slate-50/50 dark:bg-[#0b1120] p-6 space-y-6 overflow-y-auto max-h-[500px]">
          {selectedTicket.messages.map((msg: any, idx: number) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-slate-400 mb-1 px-1">
                {msg.sender === 'admin' ? 'You' : msg.sender} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.sender === 'admin' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-white/10 dark:text-slate-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedTicket.status !== 'Closed' && (
          <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-white/10">
            <form onSubmit={handleReplyTicket} className="flex gap-3">
              <Input 
                placeholder="Type your reply to the client..." 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 rounded-full"
              />
              <Button type="submit" disabled={!replyMessage.trim()} className="rounded-full px-6">Reply</Button>
            </form>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Support Tickets</CardTitle>
        <CardDescription>Manage incoming client queries and support requests.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-slate-500">Loading tickets…</p>
        ) : !ticketsItems?.length ? (
          <p className="text-sm text-slate-500">No support tickets found.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
            {ticketsItems.map((ticket: any) => (
              <div 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer bg-white dark:bg-transparent"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-2 w-2 rounded-full ${ticket.status === 'Open' ? 'bg-red-500' : ticket.status === 'Closed' ? 'bg-slate-300' : 'bg-yellow-500'}`} />
                    <h4 className="font-semibold text-slate-900 dark:text-white">{ticket.subject}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 ml-4">
                    <span>{ticket.email}</span>
                    <span>•</span>
                    <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    ticket.status === 'Open' ? 'bg-red-100 text-red-800'
                    : ticket.status === 'Closed' ? 'bg-slate-100 text-slate-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProjectsPanel({ onChanged }: { onChanged: () => void }) {
  const { data, isPending } = useProjectsQuery()
  const del = useDeleteProject()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{
    title: string
    description: string
    technologies: string
    category: (typeof categories)[number]
  }>({
    defaultValues: { category: 'Web', title: '', description: '', technologies: '' },
  })

  const [editing, setEditing] = useState<ProjectDTO | null>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  const createProject = async (e: FormEvent) => {
    e.preventDefault()
    const values = getValues()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      alert('Choose a project image')
      return
    }
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('description', values.description)
    fd.append(
      'technologies',
      JSON.stringify(
        values.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    )
    fd.append('category', values.category)
    fd.append('image', file)
    await api.post('/projects', fd)
    reset()
    if (fileRef.current) fileRef.current.value = ''
    onChanged()
  }

  const saveEdit = async () => {
    if (!editing) return
    const techs = editing.technologies
    const payload = {
      title: editing.title,
      description: editing.description,
      technologies: techs,
      category: editing.category,
    }
    const img = editFileRef.current?.files?.[0]
    if (img) {
      const fd = new FormData()
      fd.append('title', payload.title)
      fd.append('description', payload.description)
      fd.append('technologies', JSON.stringify(payload.technologies))
      fd.append('category', payload.category)
      fd.append('image', img)
      await api.put(`/projects/${editing._id}`, fd)
    } else {
      await api.put(`/projects/${editing._id}`, payload)
    }
    setEditing(null)
    if (editFileRef.current) editFileRef.current.value = ''
    onChanged()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createProject} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register('description', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input {...register('technologies')} placeholder="React, Node.js" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 dark:border-white/10 dark:bg-white/5"
                {...register('category')}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Image</Label>
              <Input ref={fileRef} type="file" accept="image/*" />
            </div>
            <Button type="submit">Upload to Cloudinary & save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending ? <p className="text-sm text-slate-500">Loading…</p> : null}
          {data?.map((p) => (
            <div
              key={p._id}
              className="flex flex-col gap-4 border-b border-slate-200 pb-4 last:border-0 dark:border-white/10 sm:flex-row"
            >
              <LazyImage
                src={p.imageUrl}
                alt={p.title}
                optimizeWidth={200}
                aspectClassName="h-24 w-40 shrink-0 rounded-lg"
                className="object-cover"
              />
              <div className="min-w-0 flex-1">
                {editing?._id === p._id ? (
                  <div className="space-y-2">
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    />
                    <Input
                      value={editing.technologies.join(', ')}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                    />
                    <select
                      className="flex h-10 w-full rounded-lg border px-2 dark:bg-slate-900"
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Input ref={editFileRef} type="file" accept="image/*" />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-secondary dark:text-white">{p.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{p.description}</p>
                    <p className="text-xs text-slate-500">{p.category}</p>
                    <div className="mt-2 flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(p)}>
                        Edit / replace image
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1 bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          if (confirm('Delete project and Cloudinary image?')) del.mutate(p._id, { onSuccess: onChanged })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {!isPending && !data?.length ? <p className="text-sm text-slate-500">No projects yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function BlogsPanel({ onChanged }: { onChanged: () => void }) {
  const { data, isPending } = useBlogsQuery()
  const del = useDeleteBlog()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{
    title: string
    content: string
    excerpt: string
    readTime: string
    author: string
    category: string
  }>({
    defaultValues: { title: '', content: '', excerpt: '', readTime: '5 min read', author: 'SatByte Team', category: 'Technology' },
  })

  const [editing, setEditing] = useState<BlogDTO | null>(null)
  const [contentHtml, setContentHtml] = useState('')
  const [editContentHtml, setEditContentHtml] = useState('')
  const editFileRef = useRef<HTMLInputElement>(null)

  const createBlog = async (e: FormEvent) => {
    e.preventDefault()
    const values = getValues()
    const payloadContent = contentHtml
    if (!payloadContent) {
      alert('Content is required')
      return
    }
    const file = fileRef.current?.files?.[0]
    if (!file) {
      alert('Choose a blog featured image')
      return
    }
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('content', payloadContent)
    fd.append('excerpt', values.excerpt)
    fd.append('readTime', values.readTime)
    fd.append('author', values.author)
    fd.append('category', values.category)
    fd.append('image', file)
    await api.post('/blogs', fd)
    reset()
    setContentHtml('')
    if (fileRef.current) fileRef.current.value = ''
    onChanged()
  }

  const saveEdit = async () => {
    if (!editing) return
    const values = getValues()
    const payloadContent = editContentHtml || values.content
    const payload = {
      ...editing,
      title: editing.title, // Actually we are tracking these in the editing state object below
      content: payloadContent,
      excerpt: editing.excerpt,
      readTime: editing.readTime,
      author: editing.author || 'SatByte Team',
      category: editing.category || 'Technology',
    }
    const img = editFileRef.current?.files?.[0]
    if (img) {
      const fd = new FormData()
      fd.append('title', payload.title)
      fd.append('content', payload.content)
      fd.append('excerpt', payload.excerpt)
      fd.append('readTime', payload.readTime)
      fd.append('author', payload.author)
      fd.append('category', payload.category)
      fd.append('image', img)
      await api.put(`/blogs/${editing._id}`, fd)
    } else {
      await api.put(`/blogs/${editing._id}`, {
        title: payload.title,
        content: payload.content,
        excerpt: payload.excerpt,
        readTime: payload.readTime,
        author: payload.author,
        category: payload.category,
      })
    }
    setEditing(null)
    setEditContentHtml('')
    if (editFileRef.current) editFileRef.current.value = ''
    onChanged()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New blog post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createBlog} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input {...register('author', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...register('category', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Read Time</Label>
              <Input {...register('readTime')} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Input {...register('excerpt')} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Blog Content (Rich Text)</Label>
              <RichTextEditor value={contentHtml} onChange={setContentHtml} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Cover image</Label>
              <Input ref={fileRef} type="file" accept="image/*" />
            </div>
            <Button type="submit" className="sm:col-span-2">Publish</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending ? <p className="text-sm text-slate-500">Loading…</p> : null}
          {data?.map((b) => (
            <div key={b._id} className="flex flex-col sm:flex-row gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <LazyImage
                src={b.imageUrl}
                alt={b.title}
                optimizeWidth={160}
                aspectClassName="h-32 w-full sm:w-40 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                {editing?._id === b._id ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Title"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Author"
                        value={editing.author || ''}
                        onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                      />
                      <Input
                        placeholder="Category"
                        value={editing.category || ''}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Excerpt"
                        value={editing.excerpt || ''}
                        onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                      />
                      <Input
                        placeholder="Read Time"
                        value={editing.readTime || ''}
                        onChange={(e) => setEditing({ ...editing, readTime: e.target.value })}
                      />
                    </div>
                    <RichTextEditor value={editContentHtml} onChange={setEditContentHtml} />
                    <Input ref={editFileRef} type="file" accept="image/*" />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg dark:text-white">{b.title}</h3>
                    <p className="text-xs text-primary dark:text-accent font-medium mb-1">
                      {b.category || 'Technology'} • {b.author || 'SatByte Team'}
                    </p>
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400 mb-3">{b.excerpt || b.content.replace(/<[^>]+>/g, '')}</p>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => {
                        setEditing(b)
                        setEditContentHtml(b.content)
                      }}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          if (confirm('Delete post and image?')) del.mutate(b._id, { onSuccess: onChanged })
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {!isPending && !data?.length ? <p className="text-sm text-slate-500">No posts yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function ServicesPanel({ onChanged }: { onChanged: () => void }) {
  const { data, isPending } = useServicesQuery()
  const del = useDeleteService()
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, getValues, reset } = useForm<{
    title: string
    description: string
    iconKey: string
  }>({ defaultValues: { iconKey: 'Globe' } })

  const [editing, setEditing] = useState<ServiceDTO | null>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  const createService = async (e: FormEvent) => {
    e.preventDefault()
    const values = getValues()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      alert('Choose an icon image')
      return
    }
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('description', values.description)
    fd.append('iconKey', values.iconKey || 'Globe')
    fd.append('image', file)
    await api.post('/services', fd)
    reset()
    if (fileRef.current) fileRef.current.value = ''
    onChanged()
  }

  const saveEdit = async () => {
    if (!editing) return
    const img = editFileRef.current?.files?.[0]
    if (img) {
      const fd = new FormData()
      fd.append('title', editing.title)
      fd.append('description', editing.description)
      fd.append('iconKey', editing.iconKey)
      fd.append('image', img)
      await api.put(`/services/${editing._id}`, fd)
    } else {
      await api.put(`/services/${editing._id}`, {
        title: editing.title,
        description: editing.description,
        iconKey: editing.iconKey,
      })
    }
    setEditing(null)
    if (editFileRef.current) editFileRef.current.value = ''
    onChanged()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createService} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register('description', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Lucide fallback key (optional)</Label>
              <Input {...register('iconKey')} />
            </div>
            <div className="space-y-2">
              <Label>Icon image</Label>
              <Input ref={fileRef} type="file" accept="image/*" />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending ? <p className="text-sm text-slate-500">Loading…</p> : null}
          {data?.map((s) => (
            <div key={s._id} className="flex gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <LazyImage
                src={s.iconUrl}
                alt={s.title}
                optimizeWidth={96}
                responsive={false}
                aspectClassName="h-14 w-14 shrink-0 rounded-lg"
                className="object-contain"
              />
              <div className="min-w-0 flex-1">
                {editing?._id === s._id ? (
                  <div className="space-y-2">
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    />
                    <Input
                      value={editing.iconKey}
                      onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
                    />
                    <Input ref={editFileRef} type="file" accept="image/*" />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium dark:text-white">{s.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                    <div className="mt-2 flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(s)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          if (confirm('Delete service and icon?')) del.mutate(s._id, { onSuccess: onChanged })
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {!isPending && !data?.length ? <p className="text-sm text-slate-500">No services yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsPanel() {
  const { data, isPending } = useOrdersQuery()

  const chartData = (data || []).reduce((acc: any[], order) => {
    const plan = order.planName || 'Unknown'
    const existing = acc.find((val) => val.name === plan)
    if (existing) {
      existing.count += 1
      existing.revenue += (order.amountPaid || 0) / 100
    } else {
      acc.push({ name: plan, count: 1, revenue: (order.amountPaid || 0) / 100 })
    }
    return acc
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Plan</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-slate-500">Loading analytics…</p>
        ) : (
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
                <Bar yAxisId="right" dataKey="count" fill="#82ca9d" name="Orders Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

