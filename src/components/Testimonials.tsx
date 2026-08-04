import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Bride — Mumbai',
    initials: 'PS',
    color: 'from-sage-500 to-sage-700',
    rating: 5, event: 'Wedding',
    text: 'Festivo made our wedding planning an absolute dream. We found the perfect venue, caterer, and photographer — all within our budget. The booking process was seamless and the vendors were incredibly professional.',
    highlight: 'Saved 3 weeks of vendor hunting',
  },
  {
    name: 'Arjun Mehta',
    role: 'Corporate Manager — Bangalore',
    initials: 'AM',
    color: 'from-dark-600 to-dark-800',
    rating: 5, event: 'Corporate Event',
    text: 'We used Festivo for our annual company gala and the experience was outstanding. The coordinator handled everything with precision. The catering was world-class and the decor was beyond our expectations.',
    highlight: 'Flawless 400-person corporate event',
  },
  {
    name: 'Ananya Krishnan',
    role: 'Event Host — Chennai',
    initials: 'AK',
    color: 'from-cream-600 to-cream-800',
    rating: 5, event: 'Birthday Party',
    text: 'I planned my daughter\'s 18th birthday through Festivo and it was magical! The platform helped me compare multiple decorators and I found one that perfectly matched our "Garden Wonderland" theme.',
    highlight: 'Perfect themed birthday celebration',
  },
  {
    name: 'Rohit & Sneha Gupta',
    role: 'Couple — Delhi',
    initials: 'RG',
    color: 'from-sage-600 to-dark-700',
    rating: 5, event: 'Anniversary',
    text: 'Our 25th anniversary was everything we dreamed of, thanks to Festivo. The budget tracking feature helped us stay within limits while still having a lavish celebration. Pure magic!',
    highlight: 'Intimate yet grand celebration',
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView();
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (!isAuto) return;
    const interval = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [isAuto]);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-cream-50 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sage-50/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 animate-on-scroll ${inView ? 'in-view' : ''}`}>
          <span className="inline-block text-sage-600 text-sm font-bold tracking-widest uppercase mb-3">Client Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-900">
            Moments That <span className="text-gradient">Matter</span>
          </h2>
        </div>

        <div className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-200`}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-card p-8 md:p-12 relative overflow-hidden border border-sage-100">
              <div className="absolute top-6 right-8 opacity-10">
                <Quote className="w-24 h-24 text-sage-500" />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center ring-4 ring-sage-100`}>
                      <span className="text-white font-display font-bold text-xl">{t.initials}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-sage-600 rounded-full p-1">
                      <Star className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-sage-900">{t.name}</p>
                    <p className="text-dark-500 text-sm font-medium">{t.role}</p>
                    <span className="inline-block mt-2 bg-sage-100 text-sage-700 text-xs font-bold px-3 py-1 rounded-full">{t.event}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-400" />
                    ))}
                  </div>
                  <p className="text-dark-700 text-lg leading-relaxed mb-6 italic font-medium">"{t.text}"</p>
                  <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-xl px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-sage-500" />
                    <span className="text-sage-700 text-sm font-bold">{t.highlight}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIsAuto(false); setCurrent(i); }}
                    className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2.5 bg-sage-600' : 'w-2.5 h-2.5 bg-sage-200 hover:bg-sage-300'}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setIsAuto(false); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); }} className="w-10 h-10 rounded-xl border border-sage-200 flex items-center justify-center text-sage-700 hover:border-sage-400 hover:bg-sage-50 transition-all duration-200">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => { setIsAuto(false); setCurrent((c) => (c + 1) % testimonials.length); }} className="w-10 h-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center hover:shadow-glow transition-all duration-200">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {testimonials.map((tt, i) => (
            <button
              key={tt.name}
              onClick={() => { setIsAuto(false); setCurrent(i); }}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border-2 ${i === current ? 'border-sage-400 bg-white shadow-card' : 'border-transparent bg-white/60 hover:bg-white hover:border-sage-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{tt.initials}</span>
                </div>
                <p className="text-sage-800 font-bold text-xs truncate">{tt.name.split(' ')[0]}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: tt.rating }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 text-gold-500 fill-gold-400" />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
