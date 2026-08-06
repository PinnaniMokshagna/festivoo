import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, LogOut, User, Store, LayoutDashboard, Bell, HelpCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    await signOut();
    navigate('/');
  };

  const userDisplayName = user?.email?.split('@')[0] || 'User';
  const isVendor = profile?.role === 'vendor';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent py-4'
          : 'bg-cream-50/95 backdrop-blur-xl shadow-soft py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex items-center gap-2 justify-end ml-auto">
            {user ? (
              /* SIGNED IN STATE */
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-xl transition-all hover:scale-110 relative ${
                      isTransparent ? 'text-white hover:bg-white/10' : 'text-sage-700 hover:bg-sage-100'
                    }`}
                    title="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5 text-gold-500" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full text-[10px] font-extrabold text-dark-900 flex items-center justify-center border border-white shadow-sm animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                {/* User Display Name & Dashboard Button */}
                <button
                  onClick={() => navigate(isVendor ? '/vendor-dashboard' : '/dashboard')}
                  className={`text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    isTransparent ? 'text-white/95 hover:bg-white/10' : 'text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {isVendor ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span>{userDisplayName}</span>
                  {isVendor && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-gold-100 text-gold-700">
                      Vendor
                    </span>
                  )}
                </button>
                {/* Dashboard Shortcut Icon */}
                <button
                  onClick={() => navigate(isVendor ? '/vendor-dashboard' : '/dashboard')}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-sage-700 hover:bg-sage-100'
                  }`}
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </button>
                {/* Sign Out Icon */}
                <button
                  onClick={handleSignOut}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-sage-700 hover:bg-sage-100'
                  }`}
                  aria-label="Sign out"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {/* 24x7 Customer Support Button */}
                <button
                  onClick={() => {
                    if (location.pathname === '/dashboard') {
                      window.location.hash = 'support';
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }
                    navigate('/dashboard?support=true#support');
                  }}
                  className={`p-2 rounded-xl transition-all hover:scale-110 flex items-center gap-1 text-xs font-bold cursor-pointer ${
                    isTransparent ? 'text-white bg-white/10 hover:bg-white/20' : 'text-sage-800 bg-sage-100 hover:bg-sage-200'
                  }`}
                  aria-label="24x7 Customer Support"
                  title="PhonePe Style 24x7 Customer Support"
                >
                  <HelpCircle className="w-4 h-4 text-gold-500" />
                  <span className="hidden lg:inline">Customer Support</span>
                </button>
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
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              /* SIGNED IN (Mobile) */
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sage-50 border border-sage-200">
                  {isVendor ? <Store className="w-4 h-4 text-sage-700" /> : <User className="w-4 h-4 text-sage-700" />}
                  <span className="text-sm font-bold text-sage-800">{userDisplayName}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${isVendor ? 'bg-gold-100 text-gold-700' : 'bg-sage-100 text-sage-600'}`}>
                    {isVendor ? 'Vendor' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); navigate(isVendor ? '/vendor-dashboard' : '/dashboard'); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border border-sage-200 text-sage-700 hover:bg-sage-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-sm font-bold py-2.5 rounded-xl border border-sage-300 text-sage-700 hover:border-sage-500 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              /* BEFORE SIGNED IN (Mobile) */
              <button
                onClick={() => { setMobileOpen(false); navigate('/auth'); }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border border-sage-300 text-sage-700 hover:border-sage-500 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
            
            <button
              onClick={() => { setMobileOpen(false); navigate('/vendors'); }}
              className="w-full text-sm font-bold py-2.5 rounded-xl bg-gradient-brand text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
