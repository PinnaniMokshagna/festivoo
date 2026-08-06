import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft,
  CheckCircle2, Building2, Users, Star, Shield, Zap,
  Camera, Utensils, Flower2, Music, Store, Search, CalendarCheck,
  TrendingUp, Heart, Briefcase
} from 'lucide-react';
import { useAuth, type UserRole } from '../lib/auth';

/* ── Data ───────────────────────────────────────────────────────── */

const VENDOR_FEATURES = [
  { icon: Building2, text: 'Create your vendor profile & showcase portfolio' },
  { icon: TrendingUp, text: 'Get discovered by thousands of event planners' },
  { icon: Zap, text: 'Receive & manage bookings instantly' },
  { icon: Shield, text: 'Verified badge & priority listing' },
];

const CUSTOMER_FEATURES = [
  { icon: Search, text: 'Access 2,500+ verified vendors across India' },
  { icon: Heart, text: 'Save favourites and compare vendors easily' },
  { icon: CalendarCheck, text: 'Instant booking with secure payments' },
  { icon: Shield, text: 'Free cancellation & full buyer protection' },
];

const vendorSlides = [
  { image: '', tag: 'For Vendors', title: 'Grow Your\nBusiness' },
  { image: '', tag: 'Showcase', title: 'Your Work,\nAmplified' },
  { image: '', tag: 'Connect', title: 'Reach More\nCustomers' },
];

const customerSlides = [
  { image: '', tag: 'For Customers', title: 'Plan Perfect\nEvents' },
  { image: '', tag: 'Discover', title: 'Find The Best\nVendors' },
  { image: '', tag: 'Celebrate', title: 'Every Moment\nMatters' },
];

/* ── Main Component ─────────────────────────────────────────────── */

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, sendOtp, verifyOtp, updatePassword } = useAuth();

  const [role, setRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [screen, setScreen] = useState<'form' | 'forgot'>('form');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1=email, 2=OTP, 3=new password
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotShowPassword, setForgotShowPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const slides = role === 'vendor' ? vendorSlides : customerSlides;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    if (user) navigate(role === 'vendor' ? '/vendor-dashboard' : '/vendors');
  }, [user, navigate, role]);

  /* ── Handlers ─────────────────────────────────────────────────── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your full name');
      if (password.length < 6) return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) { setError(error); return; }
      // Navigate based on profile role — handled by auth context / redirect effect
      navigate('/vendors');
    } else {
      if (!role) { setLoading(false); return; }
      const { error } = await signUp(email, password, name, role);
      setLoading(false);
      if (error) { setError(error); return; }
      navigate(role === 'vendor' ? '/vendor-dashboard' : '/vendors');
    }
  };

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m);
    setError('');
  };

  const resetRole = () => {
    setRole(null);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setScreen('form');
    setForgotEmail('');
    setForgotStep(1);
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotError('');
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) { setForgotError('Please enter your email address'); return; }
    setForgotLoading(true); setForgotError('');
    const { error } = await sendOtp(forgotEmail.trim());
    setForgotLoading(false);
    if (error) { setForgotError('No account found with this email address.'); return; }
    setForgotStep(2);
  };

  // Step 2: Verify OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length !== 6) { setForgotError('Please enter the full 6-digit code'); return; }
    setForgotLoading(true); setForgotError('');
    const { error } = await verifyOtp(forgotEmail.trim(), forgotOtp.trim());
    setForgotLoading(false);
    if (error) { setForgotError('Invalid or expired code. Please try again.'); return; }
    setForgotStep(3);
  };

  // Step 3: Set new password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword.length < 6) { setForgotError('Password must be at least 6 characters'); return; }
    setForgotLoading(true); setForgotError('');
    const { error } = await updatePassword(forgotNewPassword);
    setForgotLoading(false);
    if (error) { setForgotError(error); return; }
    // Success — navigate to dashboard
    navigate(role === 'vendor' ? '/vendor-dashboard' : '/dashboard');
  };

  const slide = slides[slideIndex] ?? slides[0];
  const isVendor = role === 'vendor';

  /* ── Render ───────────────────────────────────────────────────── */

  // No role selected yet → show role selection screen
  if (!role) {
    return <RoleSelectionScreen mounted={mounted} onSelect={setRole} onBack={() => navigate('/')} />;
  }

  // Forgot password / OTP screen
  if (screen === 'forgot') {
    return (
      <ForgotPasswordScreen
        role={role}
        step={forgotStep}
        email={forgotEmail}
        otp={forgotOtp}
        newPassword={forgotNewPassword}
        showPassword={forgotShowPassword}
        onEmailChange={setForgotEmail}
        onOtpChange={setForgotOtp}
        onNewPasswordChange={setForgotNewPassword}
        onToggleShowPassword={() => setForgotShowPassword(p => !p)}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onUpdatePassword={handleUpdatePassword}
        loading={forgotLoading}
        error={forgotError}
        onBack={() => {
          if (forgotStep === 1) { setScreen('form'); }
          else { setForgotStep(s => (s - 1) as 1 | 2 | 3); }
          setForgotError('');
        }}
      />
    );
  }

  // Role selected → show auth form
  return (
    <>
      <div className="min-h-screen flex">
        {/* Left visual panel */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
          {slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-1000"
              style={{ opacity: i === slideIndex ? 1 : 0, transform: i === slideIndex ? 'scale(1)' : 'scale(1.05)' }}
            >
              <img src={s.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Overlays — color depends on role */}
          <div className={`absolute inset-0 ${isVendor ? 'bg-gradient-to-br from-sage-950/90 via-sage-900/60 to-sage-950/80' : 'bg-gradient-to-br from-sage-900/80 via-sage-800/45 to-sage-900/75'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-950/70 via-transparent to-transparent" />

          <div className="orb w-96 h-96 bg-sage-600/20 -top-20 -left-20" />
          <div className="orb w-72 h-72 bg-gold-400/15 bottom-10 right-10" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group w-fit">
                <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-3xl font-bold">Festivo</span>
              </button>

              {/* Role badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isVendor ? 'bg-sage-800/60 border border-gold-400/30' : 'bg-sage-700/40 border border-white/20'} backdrop-blur-sm`}>
                {isVendor ? <Store className="w-4 h-4 text-gold-400" /> : <Users className="w-4 h-4 text-cream-400" />}
                <span className="text-sm font-bold">{isVendor ? 'Vendor Portal' : 'Customer Portal'}</span>
              </div>
            </div>

            {/* Slide content */}
            <div key={`${role}-${slideIndex}`} className="animate-fade-up">
              <p className={`text-sm font-bold tracking-widest uppercase mb-3 ${isVendor ? 'text-gold-400' : 'text-cream-400'}`}>
                {slide.tag}
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6 whitespace-pre-line drop-shadow-lg">
                {slide.title}
              </h2>

              {/* Feature list */}
              <div className="space-y-3 max-w-sm">
                {(isVendor ? VENDOR_FEATURES : CUSTOMER_FEATURES).slice(0, 3).map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isVendor ? 'bg-gold-400/15 border border-gold-400/25' : 'bg-sage-500/20 border border-sage-400/25'}`}>
                      <Icon className={`w-4 h-4 ${isVendor ? 'text-gold-400' : 'text-cream-300'}`} />
                    </div>
                    <span className="text-sage-100 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['1239291', '1516680', '1181686', '1024993'].map(n => (
                    <div key={n} className="w-8 h-8 rounded-full border-2 border-sage-900 overflow-hidden">
                      <img
                        src={''}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sage-200 text-sm font-medium">
                  {isVendor ? 'Join 2,500+ vendors' : 'Join 50,000+ happy customers'}
                </p>
              </div>

              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`transition-all duration-300 rounded-full ${i === slideIndex ? 'w-6 h-2 bg-gold-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-6 bg-cream-50 relative min-h-screen">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 flex items-center gap-2 text-dark-500 hover:text-sage-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Home</span>
          </button>

          <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 border border-sage-100">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-2xl font-bold text-sage-900">Festivo</span>
              </div>

              {/* Role indicator */}
              <div className={`flex items-center justify-between p-3 rounded-xl mb-6 ${isVendor ? 'bg-sage-900' : 'bg-sage-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVendor ? 'bg-sage-700' : 'bg-sage-100'}`}>
                    {isVendor ? <Store className="w-5 h-5 text-gold-400" /> : <Users className="w-5 h-5 text-sage-600" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isVendor ? 'text-white' : 'text-sage-900'}`}>
                      {isVendor ? 'Vendor Account' : 'Customer Account'}
                    </p>
                    <p className={`text-xs ${isVendor ? 'text-sage-300' : 'text-sage-600'}`}>
                      {isVendor ? 'You offer event services' : 'You plan & book events'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetRole}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${isVendor ? 'bg-sage-700 text-sage-200 hover:bg-sage-600' : 'bg-white text-sage-600 border border-sage-200 hover:border-sage-400'}`}
                >
                  Switch
                </button>
              </div>

              {/* Heading */}
              <h1 className="font-display text-3xl font-bold text-sage-900 mb-1">
                {mode === 'signin'
                  ? isVendor ? 'Vendor Sign In' : 'Welcome Back!'
                  : isVendor ? 'Create Vendor Account' : 'Create Your Account'}
              </h1>
              <p className="text-dark-500 text-sm mb-6">
                {mode === 'signin'
                  ? isVendor
                    ? 'Sign in to manage your bookings and listings.'
                    : 'Sign in to access your bookings and events.'
                  : isVendor
                    ? 'Join Festivo as a vendor and grow your business.'
                    : 'Join Festivo and start planning your perfect event.'}
              </p>

              {/* Sign In / Sign Up toggle */}
              <div className="flex gap-1.5 p-1 bg-sage-50 rounded-xl mb-7">
                {(['signin', 'signup'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      mode === m ? 'bg-white text-sage-600 shadow-sm' : 'text-dark-500 hover:text-sage-700'
                    }`}
                  >
                    {m === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="animate-fade-up">
                    <label className="block text-dark-700 font-bold text-sm mb-1.5">
                      {isVendor ? 'Business / Full Name' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isVendor ? 'Your business name' : 'Your full name'}
                        className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm text-dark-800 bg-white outline-none transition-all focus:ring-2 focus:ring-sage-300 focus:border-sage-400 hover:border-sage-300 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-dark-700 font-bold text-sm mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm text-dark-800 bg-white outline-none transition-all focus:ring-2 focus:ring-sage-300 focus:border-sage-400 hover:border-sage-300 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-700 font-bold text-sm mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                      required
                      className="w-full pl-10 pr-10 py-3 border border-sage-200 rounded-xl text-sm text-dark-800 bg-white outline-none transition-all focus:ring-2 focus:ring-sage-300 focus:border-sage-400 hover:border-sage-300 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-sage-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signin' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setScreen('forgot'); setForgotEmail(email); }}
                      className="text-sage-600 text-sm font-bold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-cream-100 border border-cream-300 rounded-xl animate-fade-in">
                    <p className="text-cream-900 text-sm font-bold">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {mode === 'signin'
                        ? isVendor ? 'Sign In to Dashboard' : 'Sign In'
                        : isVendor ? 'Create Vendor Account' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick role switch hint */}
              <div className="mt-6 p-4 bg-sage-50 rounded-xl border border-sage-100 text-center">
                <p className="text-dark-500 text-xs font-medium">
                  {isVendor ? (
                    <>Are you here to plan an event?{' '}
                      <button onClick={() => setRole('customer')} className="text-sage-700 font-bold hover:underline">
                        Switch to Customer
                      </button>
                    </>
                  ) : (
                    <>Are you an event service provider?{' '}
                      <button onClick={() => setRole('vendor')} className="text-sage-700 font-bold hover:underline">
                        Switch to Vendor
                      </button>
                    </>
                  )}
                </p>
              </div>

              <p className="text-center text-dark-500 text-xs mt-5 font-medium">
                By continuing, you agree to Festivo's{' '}
                <button className="text-sage-600 font-bold hover:underline">Terms</button> &{' '}
                <button className="text-sage-600 font-bold hover:underline">Privacy Policy</button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Forgot Password Screen (OTP) ───────────────────────────────── */

function ForgotPasswordScreen({
  role, step, email, otp, newPassword, showPassword,
  onEmailChange, onOtpChange, onNewPasswordChange, onToggleShowPassword,
  onSendOtp, onVerifyOtp, onUpdatePassword,
  loading, error, onBack,
}: {
  role: UserRole;
  step: 1 | 2 | 3;
  email: string;
  otp: string;
  newPassword: string;
  showPassword: boolean;
  onEmailChange: (v: string) => void;
  onOtpChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onToggleShowPassword: () => void;
  onSendOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onUpdatePassword: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  onBack: () => void;
}) {
  const isVendor = role === 'vendor';
  const accent = isVendor ? 'bg-sage-900' : 'bg-sage-100';
  const accentIcon = isVendor ? 'text-gold-400' : 'text-sage-600';
  const stepLabels = ['Email', 'Verify OTP', 'New Password'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card-hover border border-sage-100 p-8">

          {/* Back */}
          <button onClick={onBack} className="flex items-center gap-2 text-dark-500 hover:text-sage-700 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">{step === 1 ? 'Back to Sign In' : 'Back'}</span>
          </button>

          {/* Step indicators */}
          <div className="flex items-center mb-6">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i + 1 < step ? 'bg-sage-600 text-white' :
                    i + 1 === step ? (isVendor ? 'bg-sage-900 text-gold-400' : 'bg-sage-600 text-white') :
                    'bg-sage-100 text-dark-400'
                  }`}>
                    {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${i + 1 === step ? 'text-sage-800' : 'text-dark-400'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`h-px flex-1 mx-2 mb-4 ${i + 1 < step ? 'bg-sage-400' : 'bg-sage-100'}`} />}
              </div>
            ))}
          </div>

          {/* Icon */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent}`}>
            {step === 1 && <Mail className={`w-6 h-6 ${accentIcon}`} />}
            {step === 2 && <Shield className={`w-6 h-6 ${accentIcon}`} />}
            {step === 3 && <Lock className={`w-6 h-6 ${accentIcon}`} />}
          </div>

          {/* STEP 1: Email */}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">Forgot password?</h2>
              <p className="text-dark-500 text-sm font-medium mb-6">
                Enter your {isVendor ? 'vendor' : 'customer'} account email. We'll send a 6-digit OTP code instantly.
              </p>
              <form onSubmit={onSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><Mail className="w-4 h-4" /></div>
                    <input type="email" value={email} onChange={e => onEmailChange(e.target.value)}
                      placeholder="your@email.com" required
                      className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm text-dark-800 bg-white outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 hover:border-sage-300 font-medium transition-all" />
                  </div>
                </div>
                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-700 text-sm font-bold">{error}</p></div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</> : <>Send OTP Code <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">Enter OTP Code</h2>
              <p className="text-dark-500 text-sm font-medium mb-1">6-digit code sent to:</p>
              <p className="text-sage-700 font-bold text-sm mb-5 break-all">{email}</p>
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-2">OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full px-4 py-4 border-2 border-sage-200 rounded-xl text-3xl font-bold text-center text-sage-900 bg-white outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 tracking-[0.6em] transition-all"
                  />
                  <p className="text-dark-400 text-xs font-medium mt-2 text-center">Code expires in 10 minutes · Check spam if not received</p>
                </div>
                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-700 text-sm font-bold">{error}</p></div>}
                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</> : <>Verify Code <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <>
              <h2 className="font-display text-2xl font-bold text-sage-900 mb-1">Set New Password</h2>
              <p className="text-dark-500 text-sm font-medium mb-6">Choose a strong new password for your account.</p>
              <form onSubmit={onUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-1.5">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><Lock className="w-4 h-4" /></div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => onNewPasswordChange(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      autoFocus
                      className="w-full pl-10 pr-10 py-3 border border-sage-200 rounded-xl text-sm text-dark-800 bg-white outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 hover:border-sage-300 font-medium transition-all"
                    />
                    <button type="button" onClick={onToggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-sage-700 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-700 text-sm font-bold">{error}</p></div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : <>Update Password <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ── Role Selection Screen ──────────────────────────────────────── */

function RoleSelectionScreen({
  mounted, onSelect, onBack,
}: {
  mounted: boolean;
  onSelect: (role: UserRole) => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream-50 relative overflow-hidden flex items-center justify-center px-4 pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="orb w-96 h-96 bg-sage-400/20 -top-20 right-1/4" />
      <div className="orb w-72 h-72 bg-cream-400/20 bottom-0 left-1/4" style={{ animationDelay: '2s' }} />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-dark-500 hover:text-sage-700 transition-colors group z-10"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Home</span>
      </button>


      <div className={`relative z-10 w-full max-w-5xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-3">
            How do you want to <span className="text-gradient">join?</span>
          </h1>
          <p className="text-dark-500 text-lg font-medium max-w-lg mx-auto">
            Choose your account type to continue. Each has a tailored experience.
          </p>
        </div>

        {/* Two big cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <RoleCard
            role="customer"
            icon={Users}
            accentIcon={Search}
            title="I'm a Customer"
            subtitle="I want to plan & book events"
            description="Discover vendors, compare prices, and book the perfect services for your celebration."
            features={CUSTOMER_FEATURES}
            accent="sage"
            ctaLabel="Continue as Customer"
            mounted={mounted}
            onClick={() => onSelect('customer')}
          />

          {/* Vendor Card */}
          <RoleCard
            role="vendor"
            icon={Store}
            accentIcon={Briefcase}
            title="I'm a Vendor"
            subtitle="I offer services for events"
            description="List your business, showcase your portfolio, and receive bookings from customers."
            features={VENDOR_FEATURES}
            accent="gold"
            ctaLabel="Continue as Vendor"
            mounted={mounted}
            onClick={() => onSelect('vendor')}
          />
        </div>

        {/* Bottom info */}
        <div className="text-center mt-8">
          <p className="text-dark-500 text-sm font-medium">
            Not sure? You can switch your role anytime after signing up.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Role Card ──────────────────────────────────────────────────── */

function RoleCard({
  role, icon: Icon, accentIcon: AccentIcon, title, subtitle, description, features, accent, ctaLabel, mounted, onClick,
}: {
  role: UserRole;
  icon: typeof Users;
  accentIcon: typeof Search;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: typeof Users; text: string }[];
  accent: 'sage' | 'gold';
  ctaLabel: string;
  mounted: boolean;
  onClick: () => void;
}) {
  const isGold = accent === 'gold';
  const delay = role === 'customer' ? 'delay-100' : 'delay-300';

  return (
    <div className={`animate-on-scroll ${mounted ? 'in-view' : ''} ${delay}`}>
      <button
        onClick={onClick}
        className={`group relative w-full text-left rounded-3xl p-8 border-2 transition-all duration-400 card-hover overflow-hidden ${
          isGold
            ? 'bg-sage-900 border-sage-800 hover:border-gold-500/50 hover:shadow-card-hover'
            : 'bg-white border-sage-200 hover:border-sage-400 hover:shadow-card-hover'
        }`}
      >
        {/* Decorative gradient blob */}
        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40 ${
          isGold ? 'bg-gold-500/15' : 'bg-sage-400/15'
        }`} />

        {/* Icon row */}
        <div className="relative flex items-center justify-between mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isGold ? 'bg-sage-700' : 'bg-sage-100'
          }`}>
            <Icon className={`w-8 h-8 ${isGold ? 'text-gold-400' : 'text-sage-600'}`} />
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isGold ? 'bg-gold-400/10 border border-gold-400/20' : 'bg-sage-50 border border-sage-200'
          }`}>
            <AccentIcon className={`w-5 h-5 ${isGold ? 'text-gold-400' : 'text-sage-500'}`} />
          </div>
        </div>

        {/* Title */}
        <h2 className={`font-display text-2xl font-bold mb-1 ${isGold ? 'text-white' : 'text-sage-900'}`}>
          {title}
        </h2>
        <p className={`text-sm font-bold mb-3 ${isGold ? 'text-gold-400' : 'text-sage-600'}`}>
          {subtitle}
        </p>
        <p className={`text-sm leading-relaxed mb-6 font-medium ${isGold ? 'text-sage-300' : 'text-dark-500'}`}>
          {description}
        </p>

        {/* Feature list */}
        <div className="space-y-2.5 mb-8">
          {features.map(({ icon: FeatureIcon, text }) => (
            <div key={text} className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isGold ? 'bg-sage-700' : 'bg-sage-100'
              }`}>
                <FeatureIcon className={`w-3 h-3 ${isGold ? 'text-gold-400' : 'text-sage-600'}`} />
              </div>
              <span className={`text-sm font-medium ${isGold ? 'text-sage-200' : 'text-dark-600'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`flex items-center justify-between pt-5 border-t transition-colors ${
          isGold ? 'border-sage-700 group-hover:border-gold-400/30' : 'border-sage-100 group-hover:border-sage-300'
        }`}>
          <span className={`font-bold text-sm ${isGold ? 'text-white' : 'text-sage-900'}`}>
            {ctaLabel}
          </span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 ${
            isGold ? 'bg-gold-500/15 group-hover:bg-gold-500/25' : 'bg-sage-100 group-hover:bg-sage-200'
          }`}>
            <ArrowRight className={`w-5 h-5 ${isGold ? 'text-gold-400' : 'text-sage-600'}`} />
          </div>
        </div>
      </button>
    </div>
  );
}
