import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ChevronDown, Star, Users, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
    tag: 'Dream Weddings',
    title: 'Your Perfect',
    highlight: 'Wedding Day',
    subtitle: 'Begins Here',
  },
  {
    image: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
    tag: 'Corporate Events',
    title: 'Elevate Your',
    highlight: 'Corporate',
    subtitle: 'Experience',
  },
  {
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
    tag: 'Unforgettable Parties',
    title: 'Celebrate Every',
    highlight: 'Milestone',
    subtitle: 'In Style',
  },
];

const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Baby Shower'];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [eventType, setEventType] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (eventType) params.set('occasion', eventType);
    if (city) params.set('city', city);
    if (date) params.set('date', date);
    navigate(`/vendors?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Darker overlay for guaranteed text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-sage-950/70 via-sage-900/50 to-sage-950/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-sage-950/40 via-transparent to-transparent" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-white text-sm font-bold transition-all duration-500">{slide.tag}</span>
        </div>

        <div className="mb-4 min-h-[160px] sm:min-h-[180px] md:min-h-[210px] lg:min-h-[250px] flex items-center justify-center">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight drop-shadow-lg transition-all duration-500">
            {slide.title}{' '}
            <span className="text-gold-400">{slide.highlight}</span>
            <br />
            <span className="text-white">{slide.subtitle}</span>
          </h1>
        </div>

        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium drop-shadow">
          India's most trusted platform to discover, compare, and book top event vendors — all in one seamless experience.
        </p>

        {/* Search bar */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div className="bg-white rounded-2xl shadow-card-hover p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-600">
                <Search className="w-4 h-4" />
              </div>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full pl-10 pr-4 py-4 text-sage-900 bg-transparent rounded-xl focus:bg-sage-50 transition-colors outline-none text-sm font-bold appearance-none cursor-pointer search-input"
              >
                <option value="">Select Occasion</option>
                {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-500 pointer-events-none" />
            </div>

            <div className="hidden md:block w-px bg-sage-200 my-2" />

            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-600">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Select City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-4 text-sage-900 bg-transparent rounded-xl focus:bg-sage-50 transition-colors outline-none text-sm font-bold placeholder:text-sage-400 search-input"
              />
            </div>

            <div className="hidden md:block w-px bg-sage-200 my-2" />

            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-600">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-4 text-sage-900 bg-transparent rounded-xl focus:bg-sage-50 transition-colors outline-none text-sm font-bold search-input"
              />
            </div>

            <button
              onClick={handleSearch}
              className="md:w-auto w-full px-8 py-4 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all duration-300 active:scale-95 whitespace-nowrap"
            >
              Search Vendors
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 px-6 py-3 glass text-sage-900 font-bold rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 text-gold-600" />
              Explore Showcase
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {['Wedding', 'Corporate', 'Birthday', 'Anniversary'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/vendors?occasion=${tag}`)}
                  className="text-white text-xs font-bold border border-white/30 rounded-full px-3 py-1.5 hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-gold-500' : 'w-2 h-2 bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  );
}
