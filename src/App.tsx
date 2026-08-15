import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider as MainAuthProvider } from './lib/auth';
import { AuthProvider as VendorAuthProvider } from './context/AuthContext';
import { DataProvider as VendorDataProvider } from './context/DataContext';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';

// Core Application Pages
const VendorsPage = lazy(() => import('./pages/VendorsPage'));
const VendorDetailPage = lazy(() => import('./pages/VendorDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));

// Integrated Vendor Dashboard
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));

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
    <MainAuthProvider>
      <VendorAuthProvider>
        <VendorDataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main Client & Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/vendors/:slug" element={<VendorDetailPage />} />
                <Route path="/book/:slug" element={<BookingPage />} />
                <Route path="/confirmation/:ref" element={<ConfirmationPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/category/:category" element={<CategoryDetailPage />} />

                {/* Complete Integrated Vendor Dashboard */}
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/vendor" element={<Navigate to="/vendor-dashboard" replace />} />
                <Route path="/vendor-portal" element={<Navigate to="/vendor-dashboard" replace />} />

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </VendorDataProvider>
      </VendorAuthProvider>
    </MainAuthProvider>
  );
}
