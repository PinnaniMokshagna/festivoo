import { Search, CalendarCheck, Handshake, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Discover',
    desc: 'Search through 2,500+ verified vendors across catering, decor, venues, photography, and more. Filter by budget, rating, and location.',
    color: 'from-sage-500 to-sage-700',
    shadow: 'shadow-[0_10px_40px_rgba(70,107,72,0.20)]',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Plan Your Event',
    desc: 'Select your event type, set your budget, choose your date and location. Our smart assistant helps you build the perfect event package.',
    color: 'from-cream-500 to-cream-700',
    shadow: 'shadow-[0_10px_40px_rgba(161,122,66,0.20)]',
  },
  {
    icon: Handshake,
    step: '03',
    title: 'Book with Confidence',
    desc: 'Compare vendor packages, read verified reviews, chat directly with service providers, and book securely with transparent pricing.',
    color: 'from-sage-600 to-sage-800',
    shadow: 'shadow-[0_10px_40px_rgba(70,107,72,0.22)]',
  },
  {
    icon: PartyPopper,
    step: '04',
    title: 'Celebrate Perfectly',
    desc: 'Sit back and enjoy your event while our vendors handle everything. Track bookings in real-time and get post-event support.',
    color: 'from-gold-500 to-gold-700',
    shadow: 'shadow-[0_10px_40px_rgba(217,119,6,0.20)]',
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden" ref={ref}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-20 animate-on-scroll ${inView ? 'in-view' : ''}`}>
          <span className="inline-block text-sage-600 text-sm font-bold tracking-widest uppercase mb-3">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Plan Your Dream Event in
            <span className="text-gradient"> 4 Simple Steps</span>
          </h2>
          <p className="text-dark-500 text-lg max-w-xl mx-auto font-medium">
            From discovery to celebration — we make event planning effortless and enjoyable.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px">
            <div className="mx-auto max-w-4xl">
              <div className="h-px bg-gradient-to-r from-sage-400 via-cream-500 to-gold-500 opacity-30 mx-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, step, title, desc, color, shadow }, i) => (
              <div
                key={step}
                className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-${(i + 1) * 100} group text-center`}
              >
                {/* Icon */}
                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} ${shadow} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-sage-200 flex items-center justify-center shadow-soft">
                    <span className="text-[10px] font-bold text-sage-700">{step}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-sage-900 font-bold text-xl mb-3 group-hover:text-sage-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-dark-500 text-sm leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 animate-on-scroll ${inView ? 'in-view' : ''} delay-500`}>
          <button
            onClick={() => navigate('/vendors')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-brand text-white font-bold text-lg rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Start Planning Your Event
            <span className="text-xl">✦</span>
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate('/budget-planner')}
              className="text-sage-600 font-bold text-sm hover:underline inline-flex items-center gap-1"
            >
              Or try our AI Budget Planner
              <span className="text-base">→</span>
            </button>
          </div>
          <p className="text-dark-400 text-sm mt-3 font-medium">No upfront payment required. Free to browse.</p>
        </div>
      </div>
    </section>
  );
}
