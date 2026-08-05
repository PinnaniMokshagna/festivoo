import { useState, useEffect } from 'react';
import { Search, CalendarCheck, Handshake, PartyPopper, CheckCircle2, Star, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Discover',
    desc: 'Search through 2,500+ verified vendors across catering, decor, venues, photography, and more. Filter by budget, rating, and location.',
    color: 'from-sage-500 to-sage-700',
    mockScreen: {
      tag: 'Step 1: Discover',
      heading: 'Find Best Vendors',
      sub: 'Search catering, decor, photography...',
      pills: ['Bengaluru', '5 Star Decor', 'Under ₹50K'],
      card: { title: 'Blossom Decor Studio', rating: '4.9 ★', badge: 'Verified' }
    }
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Plan Your Event',
    desc: 'Select your event type, set your budget, choose your date and location. Our smart assistant helps you build the perfect event package.',
    color: 'from-cream-500 to-cream-700',
    mockScreen: {
      tag: 'Step 2: Custom Package',
      heading: 'Configure Budget',
      sub: 'AI Smart Allocation & Date Picker',
      pills: ['Oct 24, 2026', 'Wedding Event', '300 Guests'],
      card: { title: 'Package Estimate: ₹4.5 Lakhs', rating: 'Budget OK', badge: 'AI Optimized' }
    }
  },
  {
    step: '03',
    icon: Handshake,
    title: 'Book with Confidence',
    desc: 'Compare vendor packages, read verified reviews, chat directly with service providers, and book securely with transparent pricing.',
    color: 'from-sage-600 to-sage-800',
    mockScreen: {
      tag: 'Step 3: Secure Booking',
      heading: 'Confirm & Chat',
      sub: 'Direct chat & transparent contracts',
      pills: ['Direct Vendor Chat', '100% Escrow', 'Instant Receipt'],
      card: { title: 'Contract Signed & Locked', rating: 'Protected', badge: '100% Safe' }
    }
  },
  {
    step: '04',
    icon: PartyPopper,
    title: 'Celebrate Perfectly',
    desc: 'Sit back and enjoy your event while our vendors handle everything. Track bookings in real-time and get post-event support.',
    color: 'from-gold-500 to-gold-700',
    mockScreen: {
      tag: 'Step 4: Event Day',
      heading: 'Enjoy Your Party!',
      sub: 'Real-time timeline tracking & support',
      pills: ['Live Updates', 'Dedicated Manager', 'Memories Captured'],
      card: { title: 'Grand Wedding Live 🎉', rating: 'In Progress', badge: 'Enjoy!' }
    }
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Auto-switch steps every 3.5s or on hover/click
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [inView]);

  const activeData = steps[activeStep];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sage-600 text-sm font-bold tracking-widest uppercase mb-3">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Plan Your Dream Event in
            <span className="text-gradient"> 4 Simple Steps</span>
          </h2>
          <p className="text-dark-500 text-lg max-w-xl mx-auto font-medium">
            Watch the live app screen update dynamically as you explore each step!
          </p>
        </div>

        {/* Interactive Split Grid (Steps on Left, Live Animated iPhone Mockup on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 4 Step Cards */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map(({ step, icon: Icon, title, desc, color }, i) => {
              const isActive = i === activeStep;
              return (
                <div
                  key={step}
                  onClick={() => setActiveStep(i)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 border ${
                    isActive
                      ? 'bg-sage-900 text-white border-sage-700 shadow-xl scale-[1.02]'
                      : 'bg-cream-50/70 hover:bg-cream-100/80 text-sage-900 border-cream-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 ${
                        isActive ? 'scale-110' : ''
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold tracking-wider uppercase ${isActive ? 'text-gold-400' : 'text-sage-600'}`}>
                          Step {step}
                        </span>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                          </span>
                        )}
                      </div>
                      <h3 className={`font-display text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-sage-950'}`}>
                        {title}
                      </h3>
                      <p className={`text-sm font-medium leading-relaxed ${isActive ? 'text-sage-200' : 'text-dark-500'}`}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive iPhone Frame displaying step animation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80">
              {/* Glow Aura */}
              <div className="absolute inset-0 bg-sage-400/20 blur-[60px] rounded-full scale-90 translate-y-4" />

              {/* iPhone 15 Pro Metallic Frame */}
              <div className="relative bg-gradient-to-b from-[#2d3134] via-[#1a1c1e] to-[#0f1011] rounded-[3rem] p-[9px] shadow-[0_30px_90px_rgba(0,0,0,0.35)] border border-white/20">
                
                {/* Dynamic Island Notch */}
                <div className="w-24 h-7 bg-black rounded-full mx-auto absolute top-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-between px-2.5 shadow-md">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0a0a0d] border border-white/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#151930]" />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0d140f] border border-white/10" />
                </div>

                {/* iPhone OLED Screen Container */}
                <div className="bg-sage-950 rounded-[2.4rem] pt-12 pb-6 px-4 h-[490px] flex flex-col justify-between overflow-hidden relative border border-sage-800/80 shadow-inner">
                  
                  {/* Screen Glare Overlay */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/15 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Animated Screen Content (Swaps on step change) */}
                  <div key={activeStep} className="animate-fade-in relative z-20">
                    
                    {/* Tag pill */}
                    <span className="inline-block bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-3">
                      {activeData.mockScreen.tag}
                    </span>

                    <h4 className="text-white font-display text-lg font-bold leading-tight mb-1">
                      {activeData.mockScreen.heading}
                    </h4>
                    <p className="text-sage-300 text-xs font-medium mb-4">
                      {activeData.mockScreen.sub}
                    </p>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {activeData.mockScreen.pills.map((pill) => (
                        <span key={pill} className="bg-sage-800/90 text-sage-200 border border-sage-700/80 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          ✓ {pill}
                        </span>
                      ))}
                    </div>

                    {/* Active Mock Card */}
                    <div className="bg-gradient-to-br from-sage-900 to-sage-950 p-3.5 rounded-2xl border border-sage-700/80 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white leading-tight">
                          {activeData.mockScreen.card.title}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {activeData.mockScreen.card.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gold-400 font-bold">
                        <Star className="w-3 h-3 fill-gold-400" />
                        <span>{activeData.mockScreen.card.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Mock */}
                  <div className="relative z-20 pt-4 border-t border-sage-800/80 flex justify-around">
                    {steps.map((s, idx) => (
                      <button
                        key={s.step}
                        onClick={() => setActiveStep(idx)}
                        className={`flex flex-col items-center gap-1 transition-all ${
                          idx === activeStep ? 'scale-110 text-gold-400' : 'text-sage-500 opacity-60'
                        }`}
                      >
                        <s.icon className="w-4 h-4" />
                        <span className="text-[9px] font-bold">{s.step}</span>
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => navigate('/vendors')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-brand text-white font-bold text-lg rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Start Planning Your Event
            <span className="text-xl">✦</span>
          </button>
        </div>

      </div>
    </section>
  );
}
