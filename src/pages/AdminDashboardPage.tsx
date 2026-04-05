import * as Tabs from '@radix-ui/react-tabs'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/hooks/useCmsQueries'
import { api, clearToken } from '@/lib/apiClient'
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
        <Tabs.Root defaultValue="projects">
          <Tabs.List className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
            {(['projects', 'blogs', 'services'] as const).map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:bg-primary"
              >
                {tab === 'projects' ? 'Portfolio' : tab === 'blogs' ? 'Blog' : 'Services'}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

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
    readTime: string
  }>({ defaultValues: { readTime: '5 min read' } })

  const [editing, setEditing] = useState<BlogDTO | null>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  const createBlog = async (e: FormEvent) => {
    e.preventDefault()
    const values = getValues()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      alert('Choose a cover image')
      return
    }
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('content', values.content)
    fd.append('readTime', values.readTime)
    fd.append('image', file)
    await api.post('/blogs', fd)
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
      fd.append('content', editing.content)
      fd.append('readTime', editing.readTime)
      fd.append('image', img)
      await api.put(`/blogs/${editing._id}`, fd)
    } else {
      await api.put(`/blogs/${editing._id}`, {
        title: editing.title,
        content: editing.content,
        readTime: editing.readTime,
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
          <CardTitle>New blog post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createBlog} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea className="min-h-[160px]" {...register('content', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Read time label</Label>
              <Input {...register('readTime')} />
            </div>
            <div className="space-y-2">
              <Label>Cover image</Label>
              <Input ref={fileRef} type="file" accept="image/*" />
            </div>
            <Button type="submit">Publish</Button>
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
            <div key={b._id} className="flex gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <LazyImage
                src={b.imageUrl}
                alt={b.title}
                optimizeWidth={160}
                aspectClassName="h-20 w-28 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                {editing?._id === b._id ? (
                  <div className="space-y-2">
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                    <Textarea
                      className="min-h-[120px]"
                      value={editing.content}
                      onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    />
                    <Input
                      value={editing.readTime}
                      onChange={(e) => setEditing({ ...editing, readTime: e.target.value })}
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
                    <p className="font-medium dark:text-white">{b.title}</p>
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{b.excerpt}</p>
                    <div className="mt-2 flex gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(b)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
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
