import { Smartphone, CheckCircle, Bell, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const features = [
  { icon: Bell, text: 'Real-time booking notifications' },
  { icon: MessageCircle, text: 'In-app vendor chat' },
  { icon: Shield, text: 'Secure payment gateway' },
  { icon: CheckCircle, text: 'Instant booking confirmation' },
];

export default function AppCTA() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-sage-800 via-sage-700 to-sage-900 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sage-600/30 to-transparent" />
      <div className="orb w-96 h-96 bg-sage-400/20 -top-20 left-1/4" style={{ animationDelay: '0s' }} />
      <div className="orb w-64 h-64 bg-gold-400/15 bottom-0 right-1/4" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`animate-on-scroll-left ${inView ? 'in-view' : ''}`}>
            <span className="inline-block text-gold-400 text-sm font-bold tracking-widest uppercase mb-4">Get The App</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Plan Your Events
              <br />
              <span className="text-gold-400">On The Go</span>
            </h2>
            <p className="text-sage-100 text-lg mb-8 leading-relaxed font-medium">
              Download the Festivo app and carry your entire event planning journey in your pocket. Browse vendors, chat, book, and track — all from your smartphone.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sage-500/30 flex items-center justify-center flex-shrink-0 border border-sage-400/30">
                    <Icon className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-sage-50 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/vendors')} className="flex items-center gap-3 bg-white text-sage-900 px-6 py-3.5 rounded-2xl hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
                <div className="w-8 h-8 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-sage-800"><path fill="currentColor" d="M3.18 23.76c.37.21.8.27 1.21.16l12.86-7.41-2.83-2.83-11.24 10.08zM.32 2.31C.12 2.71 0 3.17 0 3.7v16.6c0 .53.12.99.32 1.39l.07.07 9.31-9.31v-.22L.39 2.24l-.07.07zM20.34 10.38l-2.61-1.5-3.18 3.18 3.18 3.18 2.63-1.52c.75-.43.75-1.14-.02-1.84zM4.39.08L17.25 7.49l-2.83 2.83L3.18.24c.41-.11.84-.05 1.21.16z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-sage-600">GET IT ON</p>
                  <p className="font-bold text-sm -mt-0.5">Google Play</p>
                </div>
              </button>
              <button onClick={() => navigate('/vendors')} className="flex items-center gap-3 bg-white text-sage-900 px-6 py-3.5 rounded-2xl hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
                <div className="w-8 h-8 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-sage-800"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-sage-600">DOWNLOAD ON THE</p>
                  <p className="font-bold text-sm -mt-0.5">App Store</p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center"><p className="text-white font-bold text-2xl">4.9</p><div className="flex gap-0.5 mt-1 justify-center">{[1,2,3,4,5].map(n => <span key={n} className="text-gold-400 text-xs">★</span>)}</div><p className="text-sage-300 text-xs mt-1 font-medium">App Store</p></div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center"><p className="text-white font-bold text-2xl">100K+</p><p className="text-sage-300 text-xs mt-1 font-medium">Downloads</p></div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center"><p className="text-white font-bold text-2xl">4.8</p><div className="flex gap-0.5 mt-1 justify-center">{[1,2,3,4,5].map(n => <span key={n} className="text-gold-400 text-xs">★</span>)}</div><p className="text-sage-300 text-xs mt-1 font-medium">Play Store</p></div>
            </div>
          </div>

          <div className={`animate-on-scroll-right ${inView ? 'in-view' : ''} delay-200 flex justify-center`}>
            <div className="relative">
              <div className="absolute inset-0 bg-sage-400/20 blur-[80px] rounded-full scale-75 translate-y-10" />
              <div className="relative w-64 h-[520px] bg-sage-900 rounded-[3rem] border-4 border-sage-800 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-float">
                <div className="absolute inset-0 bg-gradient-to-b from-sage-800 to-sage-950 overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <span className="text-white text-xs font-medium">9:41</span>
                    <div className="flex gap-1"><div className="w-4 h-2 bg-white/60 rounded-sm" /><div className="w-3 h-2 bg-white/40 rounded-sm" /></div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center"><Smartphone className="w-4 h-4 text-white" /></div>
                      <span className="text-white font-display font-bold text-base">Festivo</span>
                    </div>
                    <div className="bg-sage-700 rounded-xl px-3 py-2.5 flex items-center gap-2 border border-sage-600">
                      <div className="w-3 h-3 rounded-full bg-sage-400" />
                      <span className="text-sage-200 text-xs font-medium">Search vendors...</span>
                    </div>
                  </div>
                  {[
                    { title: 'Wedding Venue', price: '₹1.2L', tag: 'Booked', icon: 'V' },
                    { title: 'Catering', price: '₹850/plate', tag: 'Confirmed', icon: 'C' },
                    { title: 'Photography', price: '₹45K', tag: 'Pending', icon: 'P' },
                  ].map(({ title, price, tag, icon }) => (
                    <div key={title} className="mx-4 mb-2 bg-sage-700/60 rounded-2xl overflow-hidden flex border border-sage-600/50">
                      <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                        <span className="text-white/60 font-bold text-lg">{icon}</span>
                      </div>
                      <div className="flex-1 px-3 py-2">
                        <p className="text-white text-xs font-bold">{title}</p>
                        <p className="text-sage-300 text-[10px] font-medium">{price}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tag === 'Booked' ? 'bg-emerald-500/20 text-emerald-300' : tag === 'Confirmed' ? 'bg-sky-500/20 text-sky-300' : 'bg-gold-500/20 text-gold-300'}`}>{tag}</span>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 bg-sage-800 border-t border-sage-700 flex justify-around py-3 px-4">
                    {['Home', 'Search', 'Bookings', 'Profile'].map((item) => (
                      <div key={item} className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-sm ${item === 'Home' ? 'bg-sage-400' : 'bg-sage-600'}`} />
                        <span className={`text-[8px] font-medium ${item === 'Home' ? 'text-sage-300' : 'text-sage-500'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-sage-800 rounded-b-2xl" />
              </div>
              <div className="absolute -right-4 top-24 glass rounded-2xl px-3 py-2.5 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle className="w-3.5 h-3.5 text-white" /></div>
                  <div><p className="text-sage-900 text-xs font-bold">Booking Confirmed!</p><p className="text-sage-600 text-[10px] font-medium">Grand Pavilion · Oct 15</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
