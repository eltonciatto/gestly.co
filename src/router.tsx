import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/lib/auth/context';

// Landing pages
import LandingPage from '@/pages/landing';
import AboutPage from '@/pages/about';
import BlogPage from '@/pages/blog';
import BlogArticle from '@/pages/blog/article';
import CareersPage from '@/pages/careers';
import ContactPage from '@/pages/contact';
import FAQPage from '@/pages/faq';
import FeaturesPage from '@/pages/features';
import IntegrationsPage from '@/pages/integrations';
import PricingPage from '@/pages/pricing';
import PrivacyPage from '@/pages/privacy';
import TermsPage from '@/pages/terms';

// Auth pages
import AuthLayout from '@/components/layouts/AuthLayout';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import RegisterConfirm from '@/pages/auth/registerconfirm';

// Dashboard pages
import Dashboard from '@/pages/dashboard';

// Support pages
import SupportChat from '@/pages/support/chat';
import KnowledgeBase from '@/pages/support/knowledge-base';
import Tutorials from '@/pages/support/tutorials';

// Create Query Client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  }
});

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/confirm" element={<RegisterConfirm />} />
              </Route>

              {/* Dashboard routes */}
              <Route path="/dashboard/*" element={<Dashboard />} />

              {/* Support routes */}
              <Route path="/support">
                <Route path="chat" element={<SupportChat />} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="tutorials" element={<Tutorials />} />
              </Route>

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
              <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}