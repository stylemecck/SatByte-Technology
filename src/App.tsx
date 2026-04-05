import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { RequireAdmin } from '@/components/admin/RequireAdmin'
import { MainLayout } from '@/layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'))
const PricingPage = lazy(() => import('@/pages/PricingPage'))
const PricingSuccessPage = lazy(() => import('@/pages/PricingSuccessPage'))
const PricingCanceledPage = lazy(() => import('@/pages/PricingCanceledPage'))
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))

/** Top-level routes; marketing pages use `MainLayout`; admin is separate. */
export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        }
      />
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="pricing/success" element={<PricingSuccessPage />} />
        <Route path="pricing/canceled" element={<PricingCanceledPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
