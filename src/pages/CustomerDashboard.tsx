import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Star, TrendingUp, Clock, CheckCircle2, XCircle,
  Download, ArrowRight, Sparkles, Heart, Wallet, Bell,
  ChevronRight, MapPin, Users, Mail, Phone, FileText, LogOut
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { Booking, Vendor } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';

type BookingWithVendor = Booking & { vendor?: Vendor };

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'invoices'>('overview');
  const [reviewingBooking, setReviewingBooking] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const statsView = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (profile && profile.role !== 'customer') { navigate('/vendor-dashboard'); return; }
  }, [user, profile, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_email', user.email ?? '')
        .order('created_at', { ascending: false });
      if (data) {
        const vendorIds = [...new Set(data.map(b => b.vendor_id))];
        const { data: vendors } = await supabase
          .from('vendors')
          .select('*')
          .in('id', vendorIds);
        const vendorMap = new Map((vendors ?? []).map(v => [v.id, v]));
        setBookings(data.map(b => ({ ...b, vendor: vendorMap.get(b.vendor_id) })));
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(b => new Date(b.event_date) >= new Date() && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.event_date) < new Date() || b.status === 'cancelled');
  const totalSpent = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0);

  const submitReview = async (booking: Booking) => {
    setReviewSubmitting(true);
    await supabase.from('reviews').insert({
      vendor_id: booking.vendor_id,
      customer_name: booking.customer_name,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewSubmitting(false);
    setReviewingBooking(null);
    setReviewComment('');
    setReviewRating(5);
  };

  const statusBadge = (status: string) => {
    if (status === 'confirmed') return <span className="flex items-center gap-1 text-xs font-bold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
    if (status === 'pending') return <span className="flex items-center gap-1 text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
    return <span className="flex items-center gap-1 text-xs font-bold text-cream-800 bg-cream-200 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" /> Cancelled</span>;
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
          <div className="orb w-72 h-72 bg-sage-600/20 -top-20 -left-20 opacity-30" />
          <div className="orb w-72 h-72 bg-gold-500/10 -bottom-20 -right-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {profile?.full_name || user?.email?.split('@')[0] || 'Welcome'}!
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-sage-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Customer
                    </span>
                    <span className="text-sage-200 text-sm">{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">{upcomingBookings.length}</span>
                </button>
                <button
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>

            <div className="flex gap-1 mt-6 overflow-x-auto">
              {(['overview', 'bookings', 'saved', 'invoices'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-sage-600' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div ref={statsView.ref} className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-on-scroll ${statsView.inView ? 'in-view' : ''}`}>
                {[
                  { label: 'Total Bookings', value: String(bookings.length), icon: Calendar, color: 'bg-sage-50 text-sage-600' },
                  { label: 'Upcoming Events', value: String(upcomingBookings.length), icon: Clock, color: 'bg-sage-100 text-sage-700' },
                  { label: 'Total Spent', value: `₹${(totalSpent / 1000).toFixed(0)}K`, icon: Wallet, color: 'bg-cream-100 text-cream-800' },
                  { label: 'Reviews Given', value: String(pastBookings.length), icon: Star, color: 'bg-cream-50 text-cream-900' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl shadow-card p-5 card-hover">
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="font-display text-2xl font-bold text-sage-900">{stat.value}</p>
                    <p className="text-dark-500 text-sm mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sage-500" /> Upcoming Events
                      </h2>
                      <button onClick={() => setActiveTab('bookings')} className="text-sage-600 text-sm font-bold hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-sage-400" />
                        </div>
                        <p className="font-bold text-sage-900 mb-1">No upcoming events</p>
                        <p className="text-dark-500 text-sm mb-5">Start planning your next celebration!</p>
                        <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                          Browse Vendors <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingBookings.slice(0, 5).map(booking => (
                          <div key={booking.id} className="flex items-center gap-4 p-4 bg-sage-50/60 rounded-xl hover:bg-sage-100/60 transition-colors">
                            {booking.vendor && (
                              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                {booking.vendor.image && !booking.vendor.image.includes('pexels.com') ? (
                                  <img src={booking.vendor.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{booking.vendor.category[0] || 'V'}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-sage-900 text-sm truncate">{booking.vendor?.name ?? 'Vendor'}</p>
                                {statusBadge(booking.status)}
                              </div>
                              <p className="text-dark-500 text-xs">{booking.event_type} · {new Date(booking.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {booking.guests} guests</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-sage-900 text-sm">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                              <p className="text-dark-400 text-xs font-mono">{booking.booking_ref}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-sage-800 to-sage-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-gold-400" />
                      <h3 className="font-bold text-white text-sm">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Browse Vendors', icon: ArrowRight, action: () => navigate('/vendors') },
                        { label: 'Plan Budget', icon: Wallet, action: () => navigate('/budget-planner') },
                        { label: 'Explore Services', icon: Sparkles, action: () => navigate('/explore') },
                      ].map(({ label, icon: Icon, action }) => (
                        <button key={label} onClick={action} className="w-full flex items-center justify-between px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-semibold transition-colors group">
                          <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <h3 className="font-bold text-sage-900 text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sage-500" /> Recent Activity
                    </h3>
                    <div className="space-y-2.5">
                      {bookings.slice(0, 4).map(b => (
                        <div key={b.id} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${b.status === 'confirmed' ? 'bg-sage-500' : b.status === 'pending' ? 'bg-gold-500' : 'bg-cream-500'}`} />
                          <span className="text-dark-600 font-medium truncate flex-1">{b.vendor?.name ?? 'Booking'} · {b.event_type}</span>
                          <span className="text-dark-400">{new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      ))}
                      {bookings.length === 0 && <p className="text-dark-400 text-xs text-center py-4">No activity yet</p>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sage-500" /> My Bookings ({bookings.length})
              </h2>
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                  <p className="font-display text-xl font-bold text-sage-900 mb-2">No bookings yet</p>
                  <p className="text-dark-500 mb-5">Browse vendors and book your first event!</p>
                  <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                    Browse Vendors <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="border border-sage-100 rounded-2xl p-5 hover:shadow-card transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {booking.vendor && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            {booking.vendor.image && !booking.vendor.image.includes('pexels.com') ? (
                              <img src={booking.vendor.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{booking.vendor.category[0] || 'V'}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-sage-900">{booking.vendor?.name ?? 'Vendor'}</p>
                            {statusBadge(booking.status)}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.guests} guests</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.event_type}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-lg font-bold text-sage-900">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                          <p className="text-dark-400 text-xs font-mono">{booking.booking_ref}</p>
                        </div>
                      </div>

                      {reviewingBooking === booking.id ? (
                        <div className="mt-4 pt-4 border-t border-sage-100">
                          <p className="font-bold text-sage-900 text-sm mb-3">Write a Review</p>
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(n => (
                              <button key={n} onClick={() => setReviewRating(n)}>
                                <Star className={`w-7 h-7 ${n <= reviewRating ? 'text-gold-500 fill-gold-500' : 'text-sage-200'}`} />
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={3}
                            className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none"
                          />
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => submitReview(booking)}
                              disabled={reviewSubmitting || !reviewComment.trim()}
                              className="px-5 py-2 bg-gradient-brand text-white font-bold rounded-xl text-sm hover:shadow-glow transition-all disabled:opacity-50"
                            >
                              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button onClick={() => setReviewingBooking(null)} className="px-5 py-2 border border-sage-200 text-sage-700 font-bold rounded-xl text-sm hover:bg-sage-50 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-sage-100">
                          {booking.vendor && (
                            <button onClick={() => navigate(`/vendors/${booking.vendor?.slug}`)} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                              View Vendor <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {booking.status === 'confirmed' && new Date(booking.event_date) < new Date() && (
                            <button onClick={() => setReviewingBooking(booking.id)} className="text-xs font-bold text-gold-600 hover:underline flex items-center gap-1">
                              <Star className="w-3 h-3" /> Write Review
                            </button>
                          )}
                          <button onClick={() => navigate(`/confirmation/${booking.booking_ref}`)} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                            <FileText className="w-3 h-3" /> View Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved */}
          {activeTab === 'saved' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-sage-500" /> Saved Vendors
              </h2>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-sage-400" />
                </div>
                <p className="font-bold text-sage-900 mb-1">No saved vendors yet</p>
                <p className="text-dark-500 text-sm mb-5">Tap the heart icon on any vendor to save them here.</p>
                <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                  Browse Vendors <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Invoices */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sage-500" /> Invoices & Receipts
              </h2>
              {bookings.filter(b => b.payment_status === 'paid').length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                  <p className="font-bold text-sage-900 mb-1">No invoices yet</p>
                  <p className="text-dark-500 text-sm">Paid bookings will generate invoices here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sage-100">
                        {['Ref', 'Vendor', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                          <th key={h} className="pb-3 text-left text-dark-500 text-xs font-bold uppercase tracking-wider pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-50">
                      {bookings.filter(b => b.payment_status === 'paid').map(b => (
                        <tr key={b.id} className="hover:bg-sage-50/50 transition-colors">
                          <td className="py-4 pr-4 font-mono text-xs text-dark-500">{b.booking_ref}</td>
                          <td className="py-4 pr-4 font-bold text-sage-900 text-sm">{b.vendor?.name ?? '—'}</td>
                          <td className="py-4 pr-4 text-sm text-dark-700">{new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="py-4 pr-4 font-bold text-sage-900 text-sm">₹{b.total_amount.toLocaleString('en-IN')}</td>
                          <td className="py-4"><span className="flex items-center gap-1 text-xs font-bold text-sage-700 bg-sage-100 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Paid</span></td>
                          <td className="py-4">
                            <button onClick={() => navigate(`/confirmation/${b.booking_ref}`)} className="text-sage-600 hover:text-sage-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
