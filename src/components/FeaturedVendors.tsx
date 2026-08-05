import { Star, MapPin, Heart, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import type { Vendor } from '../lib/supabase';

import { MOCK_VENDORS } from '../lib/vendors';

function VendorCard({ vendor, index, inView }: { vendor: Vendor; index: number; inView: boolean }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-${(index + 1) * 100}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 border border-sage-100 card-hover h-full flex flex-col">
        <div className="relative h-52 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.slug}`)}>
          {vendor.image ? (
            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sage-700 to-sage-900 flex items-center justify-center">
              <span className="text-white/30 text-4xl font-display font-bold">{vendor.category[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-sage-950/50 to-transparent" />
          {vendor.badge && (
            <div className="absolute top-3 left-3">
              <span className={`${vendor.badge_color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{vendor.badge}</span>
            </div>
          )}
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'text-sage-600 fill-sage-500' : 'text-dark-400'}`} />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-full">{vendor.category}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.slug}`)}>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-sage-900 text-lg leading-tight group-hover:text-sage-600 transition-colors">{vendor.name}</h3>
                {vendor.verified && <CheckCircle2 className="w-4 h-4 text-sage-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-sage-500" />
                <span className="text-sage-600 text-xs font-medium">{vendor.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-sage-50 px-2 py-1 rounded-lg border border-sage-100">
              <Star className="w-3.5 h-3.5 text-sage-600 fill-sage-500" />
              <span className="text-sage-800 text-sm font-bold">{vendor.rating}</span>
            </div>
            <span className="text-dark-500 text-xs font-medium">({vendor.reviews} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-sage-700 text-xs bg-sage-50 px-2 py-1 rounded-lg border border-sage-100 font-medium">{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-sage-100">
            <div>
              <p className="text-sage-900 font-bold text-lg leading-none">{vendor.price_unit}{vendor.price_amount.toLocaleString('en-IN')}</p>
              <p className="text-dark-500 text-xs mt-0.5 font-medium">{vendor.price_label}</p>
            </div>
            <button
              onClick={() => navigate(`/book/${vendor.slug}`)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-brand text-white text-sm font-bold rounded-xl hover:shadow-glow hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Book Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedVendors() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  return (
    <section id="vendors" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-on-scroll ${inView ? 'in-view' : ''}`}>
          <div>
            <span className="inline-flex items-center gap-2 text-sage-600 text-sm font-bold tracking-widest uppercase mb-3">
              <TrendingUp className="w-4 h-4" />
              Top Picks
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-900">
              Featured <span className="text-gradient">Vendors</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-dark-500 text-sm font-medium">Handpicked by our experts</p>
            <button onClick={() => navigate('/vendors')} className="text-sage-600 font-bold text-sm border-b-2 border-sage-300 hover:border-sage-600 transition-colors pb-0.5">
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VENDORS.slice(0, 6).map((vendor, i) => (
            <VendorCard key={vendor.id} vendor={vendor} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
