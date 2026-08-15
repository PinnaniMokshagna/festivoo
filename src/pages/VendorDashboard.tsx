import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, CalendarCheck, CalendarDays, MessageSquare,
  Images, Package, Star, Wallet, BarChart3, Tag, Settings, LifeBuoy, Clock, Lock, ShieldAlert, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { VerifiedBadge } from '../components/ui/verified-badge';

// Vendor Sub-Pages (Named Exports)
import { DashboardPage as DashboardOverview } from './dashboard-page';
import { VerifyDocumentsPage } from './verify-documents-page';
import { BookingsPage } from './bookings-page';
import { CalendarPage } from './calendar-page';
import { MessagesPage } from './messages-page';
import { PortfolioPage } from './portfolio-page';
import { PackagesPage } from './packages-page';
import { ReviewsPage } from './reviews-page';
import { EarningsPage } from './earnings-page';
import { AnalyticsPage } from './analytics-page';
import { DealsPage } from './deals-page';
import { SettingsPage } from './settings-page';
import { SupportPage } from './support-page';

type VendorTab =
  | 'overview'
  | 'kyc'
  | 'bookings'
  | 'calendar'
  | 'packages'
  | 'portfolio'
  | 'earnings'
  | 'analytics'
  | 'deals'
  | 'messages'
  | 'reviews'
  | 'settings'
  | 'support';

const tabsConfig: { id: VendorTab; label: string; icon: any; gated?: boolean }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck, gated: true },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'packages', label: 'Packages & Services', icon: Package, gated: true },
  { id: 'portfolio', label: 'Portfolio Gallery', icon: Images },
  { id: 'earnings', label: 'Earnings & Payouts', icon: Wallet, gated: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, gated: true },
  { id: 'deals', label: 'Offers & Deals', icon: Tag, gated: true },
  { id: 'messages', label: 'Client Messages', icon: MessageSquare, gated: true },
  { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
  { id: 'settings', label: 'Business Settings', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: LifeBuoy },
];

export default function VendorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, kycStatus } = useAuth();

  // Determine initial tab from search param ?tab=
  const [activeTab, setActiveTab] = useState<VendorTab>(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as VendorTab;
    if (tabParam && tabsConfig.some(t => t.id === tabParam)) {
      return tabParam;
    }
    return 'overview';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as VendorTab;
    if (tabParam && tabsConfig.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleTabChange = (tabId: VendorTab) => {
    setActiveTab(tabId);
    navigate(`/vendor-dashboard?tab=${tabId}`, { replace: true });
  };

  const currentTabObj = tabsConfig.find(t => t.id === activeTab);
  const isGated = currentTabObj?.gated && kycStatus !== 'verified';

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-cream-50/60 pt-20 pb-16">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sage-950 via-sage-900 to-sage-800 text-white py-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-extrabold text-2xl shadow-glow">
                  {user.avatar || 'AS'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {user.businessName || 'Royal Moments Studio'}
                    </h1>
                    {kycStatus === 'verified' && <VerifiedBadge size="md" />}
                  </div>
                  <p className="text-sage-300 text-sm font-semibold mt-0.5">
                    Owner: {user.fullName} (@{user.username}) · {user.category}
                  </p>
                </div>
              </div>

              {/* KYC Status Badge Action Pill */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTabChange('kyc')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    kycStatus === 'verified'
                      ? 'bg-sage-100/90 text-sage-900 border-sage-300 shadow-sm'
                      : kycStatus === 'pending'
                      ? 'bg-gold-100 text-gold-900 border-gold-300 animate-pulse'
                      : 'bg-red-100 text-red-900 border-red-300'
                  }`}
                >
                  {kycStatus === 'verified' && <VerifiedBadge size="sm" />}
                  {kycStatus === 'pending' && <Clock className="w-4 h-4 text-gold-700" />}
                  {kycStatus === 'unverified' && <ShieldAlert className="w-4 h-4 text-red-600" />}
                  <span>
                    {kycStatus === 'verified' && 'Verified Business'}
                    {kycStatus === 'pending' && 'KYC Reviewing (Pending Admin)'}
                    {kycStatus === 'unverified' && 'Complete KYC Verification'}
                  </span>
                </button>
              </div>
            </div>

            {/* Horizontal Navigation Tabs */}
            <div className="flex gap-2 mt-8 overflow-x-auto pb-1 no-scrollbar">
              {tabsConfig.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-sage-950 shadow-md font-extrabold scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.gated && kycStatus !== 'verified' && (
                    <Lock className="w-3 h-3 text-gold-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KYC Gate Banner if unverified */}
          {kycStatus !== 'verified' && (
            <div className="mb-6 rounded-2xl border border-gold-300 bg-gold-50 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-700">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 text-sm">
                    {kycStatus === 'pending'
                      ? 'KYC Submitted — Awaiting Admin Review'
                      : 'KYC Document Verification Required'}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {kycStatus === 'pending'
                      ? 'Your documents have been submitted to Admin. Once approved, all bookings, payouts, and chat features will unlock.'
                      : 'Submit your Aadhaar/PAN, GST, and Bank Proof to unlock client bookings and receive payments.'}
                  </p>
                </div>
              </div>

              {kycStatus !== 'pending' && (
                <button
                  onClick={() => handleTabChange('kyc')}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-glow-sage flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Submit Documents Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Gated Feature Lock Screen */}
          {isGated ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-sage-200 shadow-sm">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-100 border border-gold-300 text-gold-600 shadow-glow-gold">
                  <Lock className="h-10 w-10 text-gold-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 border border-red-200 text-red-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>

              <h3 className="font-display text-2xl font-black text-dark-900 tracking-tight mb-2">
                {currentTabObj?.label} Feature Locked
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                KYC Document Verification is required to access bookings management, packages & pricing, financial earnings, deals, and client messages.
              </p>

              <button
                onClick={() => handleTabChange('kyc')}
                className="flex items-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-xs font-bold text-white shadow-glow-sage transition-all hover:bg-sage-700"
              >
                Complete KYC Verification
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Render Active Tab Component inside Main Application Layout */
            <div className="bg-white rounded-3xl border border-sage-200/80 shadow-card p-6 md:p-8">
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'kyc' && <VerifyDocumentsPage />}
              {activeTab === 'bookings' && <BookingsPage />}
              {activeTab === 'calendar' && <CalendarPage />}
              {activeTab === 'packages' && <PackagesPage />}
              {activeTab === 'portfolio' && <PortfolioPage />}
              {activeTab === 'earnings' && <EarningsPage />}
              {activeTab === 'analytics' && <AnalyticsPage />}
              {activeTab === 'deals' && <DealsPage />}
              {activeTab === 'messages' && <MessagesPage />}
              {activeTab === 'reviews' && <ReviewsPage />}
              {activeTab === 'settings' && <SettingsPage />}
              {activeTab === 'support' && <SupportPage />}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
