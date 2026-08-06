import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';

// Lazy-loaded routes for code splitting & optimal bundle size
const VendorsPage = lazy(() => import('./pages/VendorsPage'));
const VendorDetailPage = lazy(() => import('./pages/VendorDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
        <p className="text-sage-700 font-bold text-sm tracking-wide">Loading Festivo...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/:slug" element={<VendorDetailPage />} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/confirmation/:ref" element={<ConfirmationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/category/:category" element={<CategoryDetailPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
