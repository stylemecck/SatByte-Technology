import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/apiClient'
import type { BlogDTO, OrderDTO, ProjectDTO, ServiceDTO } from '@/types/cms'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<OrderDTO[]>('checkout/orders')
      return data
    },
  })
}

export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('auth/clients')
      return data
    },
  })
}

export function useTicketsQuery() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('tickets')
      return data
    },
    refetchInterval: 3000, // Real-time refresh every 3s
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get<ProjectDTO[]>('projects')
      return data
    },
  })
}

export function useBlogsQuery() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get<BlogDTO[]>('blogs')
      return data
    },
  })
}

export function useBlogBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['blogs', 'slug', slug],
    queryFn: async () => {
      const { data } = await api.get<BlogDTO>(`blogs/slug/${encodeURIComponent(slug!)}`)
      return data
    },
    enabled: Boolean(slug),
  })
}

export function useServicesQuery() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<ServiceDTO[]>('services')
      return data
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`projects/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`blogs/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogs'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`services/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useJobsQuery() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('jobs')
      return data
    },
  })
}

export function useInternshipsQuery() {
  return useQuery({
    queryKey: ['internships'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('internships')
      return data
    },
  })
}

export function useCertificationsQuery() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('certifications')
      return data
    },
  })
}

export function useApplicationsQuery() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('jobs/admin/applications')
      return data
    },
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`jobs/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

export function useDeleteInternship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`internships/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['internships'] }),
  })
}

export function useDeleteCertification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`certifications/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  })
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`jobs/applications/${id}/status`, { status })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, projectStatus, progress }: { id: string; projectStatus: string; progress: number }) => {
      const { data } = await api.put(`checkout/orders/${id}/status`, { projectStatus, progress })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
