import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider as MainAuthProvider } from './lib/auth';
import { AuthProvider as VendorAuthProvider } from './context/AuthContext';
import { DataProvider as VendorDataProvider } from './context/DataContext';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import { VendorPortalLayout } from './components/dashboard/VendorPortalLayout';

// Core routes
const VendorsPage = lazy(() => import('./pages/VendorsPage'));
const VendorDetailPage = lazy(() => import('./pages/VendorDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));

// Vendor Portal Sub-pages
const VendorDashboardPage = lazy(() => import('./pages/dashboard-page'));
const VerifyDocumentsPage = lazy(() => import('./pages/verify-documents-page'));
const BookingsPage = lazy(() => import('./pages/bookings-page'));
const CalendarPage = lazy(() => import('./pages/calendar-page'));
const MessagesPage = lazy(() => import('./pages/messages-page'));
const PortfolioPage = lazy(() => import('./pages/portfolio-page'));
const PackagesPage = lazy(() => import('./pages/packages-page'));
const ReviewsPage = lazy(() => import('./pages/reviews-page'));
const EarningsPage = lazy(() => import('./pages/earnings-page'));
const AnalyticsPage = lazy(() => import('./pages/analytics-page'));
const DealsPage = lazy(() => import('./pages/deals-page'));
const SettingsPage = lazy(() => import('./pages/settings-page'));
const SupportPage = lazy(() => import('./pages/support-page'));

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

                {/* Complete Vendor Dashboard Portal Routes */}
                <Route path="/vendor-dashboard" element={<VendorPortalLayout />}>
                  <Route index element={<VendorDashboardPage />} />
                  <Route path="verify-documents" element={<VerifyDocumentsPage />} />
                  <Route path="bookings" element={<BookingsPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="packages" element={<PackagesPage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="earnings" element={<EarningsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="deals" element={<DealsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="support" element={<SupportPage />} />
                </Route>

                {/* Route Aliases for Vendor Portal */}
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
