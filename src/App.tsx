import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDatabase } from '@/lib/db/context';
import { LoadingScreen } from '@/components/ui/loading';

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
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import RegisterConfirm from '@/pages/auth/registerconfirm';

// Dashboard pages
import Dashboard from '@/pages/dashboard';

function App() {
  const { isLoading, user } = useDatabase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
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

        {/* Auth routes - redirect to dashboard if logged in */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/register/confirm" 
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterConfirm />} 
        />

        {/* Protected dashboard routes - redirect to login if not authenticated */}
        <Route 
          path="/dashboard/*" 
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;