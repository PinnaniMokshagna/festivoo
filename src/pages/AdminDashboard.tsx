import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, BarChart3, Store, Star, LogOut,
  Download, Eye, Search, Filter, DollarSign,
  ShieldCheck, ShieldAlert, CheckCircle2, Clock, XCircle, FileText, User, Building, CreditCard
} from 'lucide-react';
import { useAuth as useMainAuth } from '../lib/auth';
import { useAuth as useVendorAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Vendor, Booking } from '../lib/supabase';
import { dataCache } from '../lib/cache';
import Navbar from '../components/Navbar';
import { VerifiedBadge } from '../components/ui/verified-badge';

type VendorWithProfile = Vendor & {
  approval_status?: string;
  commission_rate?: number;
  subscription_tier?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user: mainUser, signOut } = useMainAuth();
  const { user: vendorUser, kycStatus: currentKycStatus, setKycStatus, setAdminModalOpen } = useVendorAuth();
  const [vendors, setVendors] = useState<VendorWithProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'kyc' | 'bookings' | 'revenue'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Pending KYC vendors list from localStorage
  const [pendingKycVendors, setPendingKycVendors] = useState<any[]>([]);

  useEffect(() => {
    if (!mainUser) { navigate('/auth'); return; }
  }, [mainUser, navigate]);

  const loadKycApplications = () => {
    const rawPending = localStorage.getItem('festivo_pending_vendors');
    if (rawPending) {
      try {
        setPendingKycVendors(JSON.parse(rawPending));
      } catch (e) {
        setPendingKycVendors([]);
      }
    } else {
      // Default fallback demo application if empty
      const demoApp = [
        {
          id: 'VND-77192',
          name: vendorUser.businessName || 'Royal Moments Studio',
          category: vendorUser.category || 'Wedding Photography',
          location: vendorUser.location || 'Mumbai & Udaipur',
          slug: vendorUser.username || 'aarav-photography',
          details: {
            email: vendorUser.email || 'aarav.photography@luxuryweddings.in',
            owner: vendorUser.fullName || 'Aarav Sharma',
            registrationDate: new Date().toISOString().split('T')[0],
            status: currentKycStatus === 'pending' ? 'KYC Submitted' : currentKycStatus === 'verified' ? 'Approved' : 'Unverified',
            kyc: {
              aadhaarFront: 'aadhaar_scanned_front.pdf',
              pan: 'pan_card_scanned.pdf',
              cancelledCheque: 'cancelled_cheque_hdfc.pdf',
              gst: 'gstin_27AABC1234F1Z5.pdf'
            }
          }
        }
      ];
      setPendingKycVendors(demoApp);
    }
  };

  useEffect(() => {
    loadKycApplications();
  }, [currentKycStatus]);

  useEffect(() => {
    const fetchData = async () => {
      const [vendorData, bookingData] = await Promise.all([
        dataCache.fetchWithCache('all_vendors', async () => {
          const { data } = await supabase.from('vendors').select('*').order('rating', { ascending: false });
          return (data ?? []) as VendorWithProfile[];
        }),
        dataCache.fetchWithCache('admin_bookings', async () => {
          const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50);
          return data ?? [];
        }),
      ]);
      setVendors(vendorData as VendorWithProfile[]);
      setBookings(bookingData as Booking[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const approveVendorKyc = (email: string) => {
    const emailLower = email.toLowerCase();
    localStorage.setItem(`festivo_kyc_status_${emailLower}`, 'Approved');
    localStorage.setItem('vendor_kyc_status', 'verified');
    setKycStatus('verified');

    // Update list
    setPendingKycVendors(prev =>
      prev.map(item => {
        if (item.details?.email?.toLowerCase() === emailLower) {
          return {
            ...item,
            badge: 'Approved',
            badge_color: 'bg-sage-600',
            details: { ...item.details, status: 'Approved' }
          };
        }
        return item;
      })
    );
  };

  const rejectVendorKyc = (email: string) => {
    const emailLower = email.toLowerCase();
    localStorage.setItem(`festivo_kyc_status_${emailLower}`, 'Rejected');
    localStorage.setItem('vendor_kyc_status', 'unverified');
    setKycStatus('unverified');

    setPendingKycVendors(prev =>
      prev.map(item => {
        if (item.details?.email?.toLowerCase() === emailLower) {
          return {
            ...item,
            badge: 'Rejected',
            badge_color: 'bg-red-500',
            details: { ...item.details, status: 'Rejected' }
          };
        }
        return item;
      })
    );
  };

  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0);
  const commissionRevenue = Math.round(totalRevenue * 0.15);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'verified' && v.verified) || (filterStatus === 'unverified' && !v.verified);
    return matchesSearch && matchesStatus;
  });

  const toggleVerify = async (vendor: Vendor) => {
    const newStatus = !vendor.verified;
    await supabase.from('vendors').update({ verified: newStatus }).eq('id', vendor.id);
    setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, verified: newStatus } : v));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-50/50 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-900 to-sage-800 py-8 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Admin Portal & KYC Approvals</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gold-500 text-sage-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" /> System Admin
                    </span>
                    <span className="text-sage-200 text-sm">{mainUser?.email}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            <div className="flex gap-2 mt-6 overflow-x-auto">
              {(['overview', 'kyc', 'vendors', 'bookings', 'revenue'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab ? 'bg-white text-sage-900 shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'kyc' && <ShieldCheck className="w-4 h-4 text-gold-400" />}
                  {tab === 'kyc' ? 'KYC Vendor Approvals' : tab}
                  {tab === 'kyc' && pendingKycVendors.some(v => v.details?.status === 'KYC Submitted' || v.details?.status === 'Pending Verification') && (
                    <span className="bg-gold-500 text-sage-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-sage-50 text-sage-600' },
                { label: 'Commission Earned', value: `₹${(commissionRevenue / 1000).toFixed(0)}K`, icon: ShieldCheck, color: 'bg-cream-100 text-cream-800' },
                { label: 'Total Vendors', value: String(vendors.length), icon: Store, color: 'bg-sage-100 text-sage-700' },
                { label: 'Total Bookings', value: String(bookings.length), icon: BarChart3, color: 'bg-cream-50 text-cream-900' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-card p-5">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="font-display text-2xl font-bold text-sage-900">{stat.value}</p>
                  <p className="text-dark-500 text-sm mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* KYC Vendor Approvals Tab */}
          {activeTab === 'kyc' && (
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-sage-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-sage-600" /> Vendor KYC Document Verification Queue
                  </h2>
                  <p className="text-xs text-dark-500 mt-1">Review government IDs, GST certificates, and bank documents before granting vendor verification badges.</p>
                </div>
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-glow-sage transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Inspection Modal View
                </button>
              </div>

              <div className="space-y-4">
                {pendingKycVendors.map((item, idx) => {
                  const status = item.details?.status || 'KYC Submitted';
                  const email = item.details?.email || 'vendor@luxuryweddings.in';
                  const isApproved = status === 'Approved';

                  return (
                    <div key={idx} className="rounded-2xl border border-sage-200 bg-cream-50/50 p-5 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {item.name ? item.name[0] : 'V'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sage-900 text-base">{item.name}</h3>
                              {isApproved && <VerifiedBadge size="sm" />}
                            </div>
                            <p className="text-xs font-medium text-sage-700">Owner: {item.details?.owner || 'Vendor Owner'} ({email})</p>
                            <p className="text-xs text-dark-500">{item.category} · {item.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            isApproved
                              ? 'bg-sage-100 text-sage-800 border-sage-300'
                              : status === 'Rejected'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-gold-100 text-gold-800 border-gold-300 animate-pulse'
                          }`}>
                            {status}
                          </span>

                          {!isApproved && (
                            <button
                              onClick={() => approveVendorKyc(email)}
                              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold shadow-glow-sage transition-all flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve & Issue Blue Badge
                            </button>
                          )}

                          {status !== 'Rejected' && !isApproved && (
                            <button
                              onClick={() => rejectVendorKyc(email)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Documents Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-sage-100 space-y-1">
                          <p className="font-bold text-sage-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-sage-600" /> Government ID (Aadhaar / PAN)
                          </p>
                          <p className="text-dark-500 font-mono">{item.details?.kyc?.aadhaarFront || 'aadhaar_front.pdf'}</p>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-sage-100 space-y-1">
                          <p className="font-bold text-sage-900 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-gold-600" /> GST / Registration Certificate
                          </p>
                          <p className="text-dark-500 font-mono">{item.details?.kyc?.gst || 'gstin_certificate.pdf'}</p>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-sage-100 space-y-1">
                          <p className="font-bold text-sage-900 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-sage-600" /> Bank Proof / Cancelled Cheque
                          </p>
                          <p className="text-dark-500 font-mono">{item.details?.kyc?.cancelledCheque || 'cancelled_cheque.pdf'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vendors Management */}
          {activeTab === 'vendors' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-sage-500" /> Vendor Management ({vendors.length})
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors..."
                    className="px-4 py-2 border border-sage-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 w-48"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-sage-200 rounded-xl text-sm font-medium text-dark-700 outline-none"
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sage-100">
                      {['Vendor', 'Category', 'Location', 'Rating', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="pb-3 text-left text-dark-500 text-xs font-bold uppercase tracking-wider pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {filteredVendors.map(v => (
                      <tr key={v.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              {v.image && !v.image.includes('pexels.com') ? (
                                <img src={v.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{v.category[0] || 'V'}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sage-900 text-sm">{v.name}</p>
                              <p className="text-dark-400 text-xs">{v.reviews} reviews</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-sm text-dark-700">{v.category}</td>
                        <td className="py-4 pr-4 text-sm text-dark-700">{v.location}</td>
                        <td className="py-4 pr-4 font-bold text-sage-900 text-sm">₹{Number(v.price_amount).toLocaleString('en-IN')}</td>
                        <td className="py-4">
                          {v.verified ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <button onClick={() => toggleVerify(v)} className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
                            {v.verified ? <XCircle className="w-4 h-4 text-cream-600" /> : <CheckCircle2 className="w-4 h-4 text-sage-600" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sage-500" /> All Bookings ({bookings.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sage-100">
                      {['Ref', 'Customer', 'Event', 'Date', 'Amount', 'Status'].map(h => (
                        <th key={h} className="pb-3 text-left text-dark-500 text-xs font-bold uppercase tracking-wider pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs text-dark-500">{b.booking_ref}</td>
                        <td className="py-4 pr-4 font-bold text-sage-900 text-sm">{b.customer_name}</td>
                        <td className="py-4 pr-4 text-sm text-dark-700">{b.event_type}</td>
                        <td className="py-4 pr-4 text-sm text-dark-700">{new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className="py-4 pr-4 font-bold text-sage-900 text-sm">₹{b.total_amount.toLocaleString('en-IN')}</td>
                        <td className="py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'text-sage-700 bg-sage-100' : 'text-gold-700 bg-gold-100'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue */}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-sage-500" /> Revenue & Commission Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sage-50 rounded-xl">
                  <p className="text-xs text-dark-500">Gross Total Revenue</p>
                  <p className="text-xl font-bold text-sage-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-cream-100 rounded-xl">
                  <p className="text-xs text-dark-500">Platform Commission (15%)</p>
                  <p className="text-xl font-bold text-cream-900 mt-1">₹{commissionRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-sage-100 rounded-xl">
                  <p className="text-xs text-dark-500">Vendor Net Payouts</p>
                  <p className="text-xl font-bold text-sage-800 mt-1">₹{(totalRevenue - commissionRevenue).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
