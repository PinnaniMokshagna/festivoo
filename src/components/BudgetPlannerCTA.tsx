import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Sparkles, TrendingUp, PieChart, Lightbulb } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export default function BudgetPlannerCTA() {
  const navigate = useNavigate();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section ref={ref} className="py-20 bg-cream-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-gradient-to-br from-sage-800 to-sage-900 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="orb w-72 h-72 bg-gold-500/10 -top-10 -right-10" />
          <div className="orb w-64 h-64 bg-sage-600/20 -bottom-10 -left-10" style={{ animationDelay: '1.5s' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-5">
                <Calculator className="w-4 h-4 text-gold-400" />
                <span className="text-white text-sm font-bold">New: AI Budget Planner</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Plan Your Event Budget <span className="text-gradient-gold">Smartly</span>
              </h2>
              <p className="text-sage-200 text-lg mb-6 font-medium leading-relaxed">
                Get an AI-powered budget breakdown tailored to your event type, guest count, and city. Adjust allocations, get smart recommendations, and find vendors that fit your budget.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/budget-planner')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-105 transition-all duration-300"
                >
                  <Calculator className="w-5 h-5" /> Plan My Budget
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/vendors')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Browse Vendors
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: PieChart, title: 'Smart Breakdown', desc: 'Category-wise allocation' },
                { icon: Lightbulb, title: 'AI Tips', desc: 'Personalized recommendations' },
                { icon: TrendingUp, title: 'City Pricing', desc: 'Location-aware estimates' },
                { icon: Sparkles, title: 'Vendor Matching', desc: 'Find vendors in budget' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 transition-all duration-500 hover:bg-white/15"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-sage-300 text-xs mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
