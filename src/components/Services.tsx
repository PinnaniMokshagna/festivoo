import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { CATEGORIES } from '../lib/categories';

export default function Services() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 animate-on-scroll ${inView ? 'in-view' : ''}`}>
          <span className="inline-block text-sage-600 text-sm font-bold tracking-widest uppercase mb-3">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Everything You Need
            <br />
            <span className="text-gradient">Under One Roof</span>
          </h2>
          <p className="text-dark-500 text-lg max-w-xl mx-auto font-medium">
            14 service categories, 2,500+ verified vendors — curated to make your event extraordinary.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-${Math.min((i + 1) * 100, 800)}`}
            >
              <div
                onClick={() => navigate(`/category/${encodeURIComponent(cat.label)}`)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 cursor-pointer card-hover border border-sage-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                      <cat.icon className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

                  {/* Count badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-soft">
                    <span className="text-sage-800 text-xs font-bold">From {cat.startingPrice}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-sage-900 text-lg mb-1.5 group-hover:text-sage-600 transition-colors duration-200">
                        {cat.label}
                      </h3>
                      <p className="text-dark-500 text-sm leading-relaxed line-clamp-2 font-medium">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                    <span className="text-sage-500 text-xs font-bold">View Details</span>
                    <button className="text-sage-600 text-sm font-bold flex items-center gap-1 group/btn">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
