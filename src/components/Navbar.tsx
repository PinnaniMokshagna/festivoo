import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, LogOut, User, Store, LayoutDashboard, Bell, ChevronDown, Heart, Calendar, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'About', href: '/about' },
];

const notificationsList = [
  { id: 'n1', title: '🎁 Return Gifts Dispatched', text: 'Vikas Premium Curations wedding return gifts dispatched for venue setup (OTP: 4920).', time: '10m ago' },
  { id: 'n2', title: '✉️ Order Dispatched', text: 'Royal Card Designers invites shipped via Delhivery.', time: '1h ago' },
  { id: 'n3', title: '📸 Photographer Request Sent', text: 'Aura Lens Studios requested for 7 Aug.', time: '2h ago' },
  { id: 'n4', title: '⛺ Tent Setup Confirmed', text: 'Pink Yellow Shamiana Tent House setup confirmed for 9 Aug.', time: '3h ago' },
  { id: 'n5', title: '💡 Payment Pending', text: 'Starlit Fairy Lights setup requires payment confirmation.', time: '4h ago' },
  { id: 'n6', title: '💄 Makeup Artist Booked', text: 'Glamour Touch Bridal Studio confirmed for 8 Aug.', time: '5h ago' },
  { id: 'n7', title: '🔴 Car Booking Cancelled', text: 'Royal Heritage Vintage Fleet order refunded.', time: '6h ago' },
  { id: 'n8', title: '🌿 Mehendi Artist Ready', text: 'Rajasthani Royal Mehendi Arts confirmed for 6 Aug.', time: '7h ago' },
  { id: 'n9', title: '🏛️ Pre-Wedding Shoot Pending', text: 'Palace Romance Photography awaiting vendor confirmation.', time: '8h ago' },
  { id: 'n10', title: '🌸 Stage Decor Secured', text: 'Royal Stage Decorators confirmed for 10 Aug.', time: '1 day ago' },
  { id: 'n11', title: '🎧 DJ Sound Pending', text: 'Neon Pink Sound Consoles awaiting deposit payment.', time: '1 day ago' },
  { id: 'n12', title: '🍽️ Catering Feast Confirmed', text: 'Spice Garden Caterers confirmed for 11 Aug.', time: '2 days ago' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(12);

  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTransparent = isHome && !scrolled;

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === '/') {
      navigate('/');
    } else if (href.startsWith('/#')) {
      if (isHome) {
        document.querySelector(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.querySelector(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const handleSignOut = async () => {
    setShowUserDropdown(false);
    await signOut();
    navigate('/');
  };

  const userDisplayName = profile?.full_name || user?.email?.split('@')[0] || 'Kranti';
  const isVendor = profile?.role === 'vendor';

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent py-4'
          : 'bg-cream-50/95 backdrop-blur-xl shadow-soft py-2.5'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className={`font-display text-2xl font-bold tracking-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-sage-900'}`}>
                Festivo
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-bold hover-underline transition-colors duration-200 ${
                    isTransparent ? 'text-white/95 hover:text-white' : 'text-sage-700 hover:text-sage-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3 justify-end ml-auto">
            {user ? (
              /* SIGNED IN STATE */
              <>
                {/* Working Top Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                      setUnreadCount(0);
                    }}
                    className={`p-2.5 rounded-xl transition-all hover:scale-105 relative ${
                      isTransparent ? 'text-white hover:bg-white/10' : 'text-sage-800 hover:bg-sage-100'
                    }`}
                    title="Live Notifications"
                  >
                    <Bell className="w-5 h-5 text-gold-500 fill-gold-500/20" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full text-[10px] font-extrabold text-dark-900 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Top Navbar Working Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-sage-200 text-sage-900 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-4 bg-gradient-to-r from-sage-900 to-dark-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-gold-400" />
                          <h3 className="font-bold text-sm text-white">Event & Dispatch Alerts</h3>
                        </div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-mono">12 Updates</span>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-sage-100">
                        {notificationsList.map(n => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              navigate('/dashboard');
                              setShowNotifications(false);
                            }}
                            className="p-3.5 hover:bg-sage-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-xs text-sage-900">{n.title}</p>
                              <span className="text-[10px] text-dark-400">{n.time}</span>
                            </div>
                            <p className="text-dark-500 text-xs line-clamp-2 leading-relaxed">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>



                {/* User Profile Button with Dropdown Toggle */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowNotifications(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200 border ${
                      isTransparent 
                        ? 'text-white bg-white/10 hover:bg-white/20 border-white/20' 
                        : 'text-sage-900 bg-white hover:bg-sage-50 border-sage-200 shadow-2xs'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                      {userDisplayName[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-bold truncate max-w-[120px]">{userDisplayName}</span>
                    {isVendor && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-gold-100 text-gold-800">
                        Vendor
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-sage-500 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Sleek User Profile & Sign Out Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-sage-200 text-sage-900 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2 space-y-1">
                      {/* User Profile Summary Header */}
                      <div className="p-3 bg-sage-50/70 rounded-xl mb-1 border border-sage-100">
                        <p className="font-bold text-sm text-sage-900 truncate">{userDisplayName}</p>
                        <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sage-700 bg-sage-100 px-2 py-0.5 rounded-full mt-1.5">
                          <ShieldCheck className="w-3 h-3 text-sage-600" /> Festivo Verified Account
                        </span>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate(isVendor ? '/vendor-dashboard' : '/dashboard');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-sage-800 hover:bg-sage-100/70 rounded-xl transition-colors text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-sage-600" /> Customer Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-sage-800 hover:bg-sage-100/70 rounded-xl transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-sage-600" /> Edit Profile & Account
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/vendors');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-sage-800 hover:bg-sage-100/70 rounded-xl transition-colors text-left"
                      >
                        <Store className="w-4 h-4 text-sage-600" /> Explore Vendors
                      </button>

                      <div className="my-1 border-t border-sage-100" />

                      {/* Sign Out Action in Dropdown */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-cream-800 hover:bg-cream-100/70 rounded-xl transition-colors text-left group"
                      >
                        <LogOut className="w-4 h-4 text-cream-600 group-hover:scale-110 transition-transform" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* BEFORE SIGNED IN (GUEST STATE) */
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className={`text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isTransparent ? 'text-white/95 hover:bg-white/10' : 'text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/vendors')}
                  className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-brand text-white shadow-glow hover:shadow-card-hover hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isTransparent ? 'text-white' : 'text-sage-800'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-cream-50 border-t border-sage-200 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left text-sage-800 font-bold py-2 hover:text-sage-600 transition-colors"
            >
              {link.label}
            </button>
          ))}
          {user && (
            <div className="pt-3 border-t border-sage-200 space-y-2">
              <div className="px-1 py-1 font-bold text-xs text-sage-700">Signed in as {userDisplayName}</div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate(isVendor ? '/vendor-dashboard' : '/dashboard');
                }}
                className="flex items-center gap-2 w-full text-left text-sage-800 font-bold py-2 hover:text-sage-600"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full text-left text-cream-800 font-bold py-2 hover:text-cream-600"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
