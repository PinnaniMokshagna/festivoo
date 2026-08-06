import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar, Star, TrendingUp, Clock, CheckCircle2, XCircle,
  Download, ArrowRight, Sparkles, Heart, Wallet, Bell,
  ChevronRight, MapPin, Users, Mail, Phone, FileText, LogOut,
  MessageSquare, PhoneCall, Send, X
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { Booking, Vendor } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';

type BookingWithVendor = Booking & { vendor?: Vendor };

const DEMO_BOOKINGS: BookingWithVendor[] = [
  {
    id: 'demo-1',
    booking_ref: 'FEST-2026-8912',
    customer_name: 'Kranti',
    customer_email: 'kranti@festivo.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Grand Wedding Reception',
    event_date: '2026-09-15',
    guests: 350,
    total_amount: 145000,
    special_requests: 'Requires Royal Marquee setup and live catering stations.',
    payment_status: 'paid',
    status: 'confirmed',
    payment_intent_id: null,
    vendor_id: 'v1',
    created_at: new Date().toISOString(),
    vendor: {
      id: 'v1',
      name: 'Royal Palace Convention Center',
      slug: 'royal-palace-convention',
      category: 'Venue',
      description: 'Luxury wedding venue and convention hall.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      rating: 4.9,
      reviews: 128,
      price_label: '₹1,50,000',
      price_amount: 150000,
      price_unit: 'per event',
      location: 'Hyderabad, Telangana',
      verified: true,
      badge: 'Featured',
      badge_color: 'gold',
      capacity: '500 guests',
      experience_years: 8,
      gallery: [],
      tags: ['Air Conditioned', 'Valet Parking', 'Catering Allowed'],
      created_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-2',
    booking_ref: 'FEST-2026-4421',
    customer_name: 'Kranti',
    customer_email: 'kranti@festivo.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Catering & Fine Dining',
    event_date: '2026-09-15',
    guests: 350,
    total_amount: 85000,
    special_requests: 'South & North Indian Multi-Cuisine Buffet with live counters.',
    payment_status: 'paid',
    status: 'confirmed',
    payment_intent_id: null,
    vendor_id: 'v2',
    created_at: new Date().toISOString(),
    vendor: {
      id: 'v2',
      name: 'Spice Craft Gourmet Caterers',
      slug: 'spice-craft-caterers',
      category: 'Catering',
      description: 'Premium event catering service.',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
      rating: 4.8,
      reviews: 94,
      price_label: '₹85,000',
      price_amount: 85000,
      price_unit: 'per event',
      location: 'Hyderabad, Telangana',
      verified: true,
      badge: 'Top Rated',
      badge_color: 'sage',
      capacity: '1000 guests',
      experience_years: 12,
      gallery: [],
      tags: ['Multi-cuisine', 'Live Counters', 'Buffet Setup'],
      created_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-3',
    booking_ref: 'FEST-2026-1092',
    customer_name: 'Kranti',
    customer_email: 'kranti@festivo.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Wedding Photography & Drone',
    event_date: '2026-09-15',
    guests: 350,
    total_amount: 60000,
    special_requests: 'Full day coverage + 4K Teaser Video & Drone highlights.',
    payment_status: 'paid',
    status: 'pending',
    payment_intent_id: null,
    vendor_id: 'v3',
    created_at: new Date().toISOString(),
    vendor: {
      id: 'v3',
      name: 'Candid Moments Photography',
      slug: 'candid-moments-photo',
      category: 'Photographer',
      description: 'Candid wedding photography & cinematography.',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      rating: 4.9,
      reviews: 76,
      price_label: '₹60,000',
      price_amount: 60000,
      price_unit: 'per event',
      location: 'Hyderabad, Telangana',
      verified: true,
      badge: 'Trending',
      badge_color: 'gold',
      capacity: null,
      experience_years: 6,
      gallery: [],
      tags: ['4K Video', 'Drone Shots', 'Album Included'],
      created_at: new Date().toISOString()
    }
  }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'invoices'>('overview');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'bookings', 'saved', 'invoices'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'bookings' | 'saved' | 'invoices');
    }
  }, [searchParams]);
  const [reviewingBooking, setReviewingBooking] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Live Chat & Vendor Call Modal States
  const [activeChatVendor, setActiveChatVendor] = useState<{ name: string; category: string; image?: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'vendor'; text: string; time: string }>>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [activeCallVendor, setActiveCallVendor] = useState<{ name: string; phone: string; location: string } | null>(null);

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
      if (data && data.length > 0) {
        const vendorIds = [...new Set(data.map(b => b.vendor_id))];
        const { data: vendors } = await supabase
          .from('vendors')
          .select('*')
          .in('id', vendorIds);
        const vendorMap = new Map((vendors ?? []).map(v => [v.id, v]));
        setBookings(data.map(b => ({ ...b, vendor: vendorMap.get(b.vendor_id) })));
      } else {
        // Fallback to DEMO_BOOKINGS if no real database entries found
        setBookings(DEMO_BOOKINGS);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  // Interactive Live Chat & Call Handlers
  const handleOpenChat = (vendorName: string, category: string, image?: string) => {
    setActiveChatVendor({ name: vendorName, category, image });
    setChatMessages([
      {
        id: '1',
        sender: 'vendor',
        text: `Namaste! Welcome to ${vendorName}. How can we assist you with your ${category} order details?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeChatVendor) return;
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    const currentText = chatInputText;
    setChatInputText('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'vendor' as const,
          text: `Thank you for your message! ${activeChatVendor.name} support has noted your request ("${currentText}"). Our event manager will confirm your requirements shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const handleOpenCall = (vendorName: string, location: string) => {
    setActiveCallVendor({
      name: vendorName,
      phone: '+91 98765 43210',
      location: location || 'Hyderabad, India'
    });
  };

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
        {/* Header Banner */}
        <div className="bg-[#243e2b] py-8 relative overflow-hidden text-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#3b5942] rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white tracking-wide">
                    {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="bg-[#47654e] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" /> Customer
                    </span>
                    <span className="text-sage-200/90 text-sm font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors relative">
                  <Bell className="w-4.5 h-4.5 text-gold-400" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-500 text-dark-900 font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-[#243e2b]">
                    {upcomingBookings.length || 3}
                  </span>
                </button>
                <button
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-8 overflow-x-auto">
              {(['overview', 'bookings', 'saved', 'invoices'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-sage-900 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Section */}
          {activeTab === 'overview' && (
            <>
              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                  {
                    label: 'Total Bookings',
                    value: String(bookings.length || 3),
                    icon: Calendar,
                    iconBg: 'bg-[#ebf3ec] text-[#3b5d43]',
                    action: () => setActiveTab('bookings')
                  },
                  {
                    label: 'Upcoming Events',
                    value: String(upcomingBookings.length || 3),
                    icon: Clock,
                    iconBg: 'bg-[#ebf3ec] text-[#3b5d43]',
                    action: () => setActiveTab('bookings')
                  },
                  {
                    label: 'Total Spent',
                    value: totalSpent > 0 ? `₹${(totalSpent / 1000).toFixed(0)}K` : '₹290K',
                    icon: Wallet,
                    iconBg: 'bg-[#fbf3e6] text-[#866838]',
                    action: () => setActiveTab('invoices')
                  },
                  {
                    label: 'Reviews Given',
                    value: String(pastBookings.length || 0),
                    icon: Star,
                    iconBg: 'bg-[#fcf6ec] text-[#866838]',
                    action: () => setActiveTab('saved')
                  },
                ].map((stat) => (
                  <div 
                    key={stat.label} 
                    onClick={stat.action} 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100/60 card-hover cursor-pointer hover:border-sage-300 transition-all group relative flex flex-col justify-between min-h-[140px]"
                  >
                    <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-serif text-3xl md:text-4xl font-extrabold text-[#1a3020] mb-1 tracking-tight">{stat.value}</p>
                      <p className="text-dark-500 text-xs md:text-sm font-medium flex items-center justify-between">
                        <span>{stat.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-sage-400 group-hover:translate-x-0.5 transition-transform" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upcoming Events */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-sage-100/60 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl font-bold text-[#1c3323] flex items-center gap-2.5">
                        <Calendar className="w-6 h-6 text-[#3b5d43]" /> Upcoming Events
                      </h2>
                      <button onClick={() => setActiveTab('bookings')} className="text-dark-600 hover:text-sage-900 text-sm font-semibold flex items-center gap-1 transition-colors">
                        View all <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#ebf3ec] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-[#3b5d43]" />
                        </div>
                        <p className="font-bold text-[#1c3323] text-lg mb-1">No upcoming events</p>
                        <p className="text-dark-500 text-sm mb-5">Start planning your next celebration!</p>
                        <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#223a27] text-white font-bold rounded-xl hover:shadow-md transition-all text-sm">
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

                {/* Right Column: Quick Actions */}
                <div className="space-y-4">
                  <div className="bg-[#223a27] text-white rounded-2xl p-6 shadow-md border border-[#2d4b33]">
                    <div className="flex items-center gap-2 mb-5">
                      <Sparkles className="w-5 h-5 text-gold-400" />
                      <h3 className="font-serif text-xl font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Browse Vendors', icon: ArrowRight, action: () => navigate('/vendors') },
                        { label: 'Explore Services', icon: Sparkles, action: () => navigate('/explore') },
                      ].map(({ label, icon: Icon, action }) => (
                        <button 
                          key={label} 
                          onClick={action} 
                          className="w-full flex items-center justify-between p-3.5 bg-[#34513a] hover:bg-[#406247] rounded-xl text-white text-sm font-bold transition-all group border border-white/5 shadow-sm"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-gold-400" /> {label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
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
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-sage-100 items-center justify-between">
                          <div className="flex items-center gap-3">
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

                          {booking.vendor && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenChat(booking.vendor?.name || 'Vendor', booking.vendor?.category || 'Service', booking.vendor?.image)}
                                className="px-3 py-1.5 bg-sage-100 text-sage-700 hover:bg-sage-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-sage-600" /> Live Chat
                              </button>
                              <button
                                onClick={() => handleOpenCall(booking.vendor?.name || 'Vendor', booking.vendor?.location || 'Hyderabad')}
                                className="px-3 py-1.5 bg-gold-100 text-gold-800 hover:bg-gold-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-gold-600" /> Call
                              </button>
                            </div>
                          )}
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

      {/* 🟢 Live Vendor Chat Modal */}
      {activeChatVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col h-[520px] overflow-hidden border border-sage-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sage-800 to-sage-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center font-bold text-white overflow-hidden">
                  {activeChatVendor.image ? <img src={activeChatVendor.image} alt="" className="w-full h-full object-cover" /> : activeChatVendor.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight text-white">{activeChatVendor.name}</h3>
                  <p className="text-xs text-sage-200">{activeChatVendor.category} · Online Support</p>
                </div>
              </div>
              <button onClick={() => setActiveChatVendor(null)} className="p-1 hover:bg-white/20 rounded-lg text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-sage-50/50">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-sage-600 text-white rounded-br-none' : 'bg-white text-sage-900 border border-sage-200 rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                    <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'user' ? 'text-sage-200' : 'text-dark-400'}`}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-sage-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-sage-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button onClick={handleSendMessage} className="p-2.5 bg-gradient-brand text-white rounded-xl hover:shadow-glow transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📞 Vendor Call Modal */}
      {activeCallVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-sage-200 relative">
            <button onClick={() => setActiveCallVendor(null)} className="absolute top-4 right-4 text-dark-400 hover:text-sage-900">
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <PhoneCall className="w-8 h-8" />
            </div>

            <h3 className="font-display text-xl font-bold text-sage-900 mb-1">{activeCallVendor.name}</h3>
            <p className="text-dark-500 text-sm mb-4">{activeCallVendor.location}</p>

            <div className="bg-sage-50 p-4 rounded-xl border border-sage-200 mb-5">
              <p className="text-xs text-sage-600 font-bold uppercase tracking-wider mb-1">Direct Support Number</p>
              <p className="font-mono text-lg font-extrabold text-sage-900">{activeCallVendor.phone}</p>
            </div>

            <a
              href={`tel:${activeCallVendor.phone.replace(/\s+/g, '')}`}
              className="w-full block py-3 bg-gradient-brand text-white font-bold rounded-xl shadow-glow hover:shadow-card-hover transition-all text-sm mb-2"
            >
              Call Vendor Now
            </a>
            <button onClick={() => setActiveCallVendor(null)} className="text-xs font-bold text-sage-600 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
