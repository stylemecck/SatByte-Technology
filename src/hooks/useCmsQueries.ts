import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/apiClient'
import type { BlogDTO, OrderDTO, ProjectDTO, ServiceDTO } from '@/types/cms'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<OrderDTO[]>('/checkout/orders')
      return data
    },
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<ProjectDTO[]>('/projects')
      return data
    },
  })
}

export function useBlogsQuery() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get<BlogDTO[]>('/blogs')
      return data
    },
  })
}

export function useBlogBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['blogs', 'slug', slug],
    queryFn: async () => {
      const { data } = await api.get<BlogDTO>(`/blogs/slug/${encodeURIComponent(slug!)}`)
      return data
    },
    enabled: Boolean(slug),
  })
}

export function useServicesQuery() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<ServiceDTO[]>('/services')
      return data
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogs'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}
