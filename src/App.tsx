import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { RequireAdmin } from '@/components/admin/RequireAdmin'
import { ScrollToTopOnNav } from '@/components/ScrollToTopOnNav'
import { MainLayout } from '@/layouts/MainLayout'
import { NativeAppLayout } from '@/layouts/NativeAppLayout'
import { isNativeApp } from '@/lib/platform'


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
const QuotePage = lazy(() => import('@/pages/QuotePage'))
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const ClientLoginPage = lazy(() => import('@/pages/ClientLoginPage'))
const ClientDashboardPage = lazy(() => import('@/pages/ClientDashboardPage'))
const MobileMenuPage = lazy(() => import('@/pages/MobileMenuPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'))


/** Top-level routes; marketing pages use `MainLayout`; admin is separate. */
export default function App() {
  const AppLayout = isNativeApp() ? NativeAppLayout : MainLayout

  return (
    <>
      <ScrollToTopOnNav />
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
      <Route element={<AppLayout />}>
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
        <Route path="quote" element={<QuotePage />} />
        <Route path="menu" element={<MobileMenuPage />} />
        <Route path="client-login" element={<ClientLoginPage />} />
        <Route path="portal" element={<ClientDashboardPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
      </Route>
    </Routes>
    </>
  )
}
