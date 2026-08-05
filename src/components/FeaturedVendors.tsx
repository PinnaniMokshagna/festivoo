import { useState } from 'react';
import { Star, MapPin, Heart, CheckCircle2, ArrowRight, RotateCw, Sparkles, ShieldCheck, Check, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import type { Vendor } from '../lib/supabase';
import { MOCK_VENDORS } from '../lib/vendors';

function VendorFlipCard({
  vendor,
  index,
  inView,
}: {
  vendor: Vendor;
  index: number;
  inView: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-${Math.min((index + 1) * 100, 600)} group perspective-1000 h-[490px]`}
    >
      {/* 3D Flip Container */}
      <div
        className={`relative w-full h-full duration-700 transition-transform transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT SIDE (Main Profile Card) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl overflow-hidden border border-sage-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          
          {/* Top Cover Image Box */}
          <div className="relative h-56 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.slug}`)}>
            <img
              src={vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-950/70 via-sage-950/20 to-transparent" />

            {/* Top Left Badge */}
            {vendor.badge && (
              <div className="absolute top-3.5 left-3.5">
                <span className="bg-sage-900 text-gold-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-white/20">
                  {vendor.badge}
                </span>
              </div>
            )}

            {/* Top Right Flip & Heart Action Buttons */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-sage-900 text-xs font-extrabold flex items-center gap-1 shadow-md hover:bg-white hover:scale-105 transition-all"
                title="Flip to view services & features"
              >
                <RotateCw className="w-3.5 h-3.5 text-sage-700 animate-spin-slow" />
                <span>Features 🔄</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 ${liked ? 'text-rose-500 fill-rose-500' : 'text-dark-400'}`} />
              </button>
            </div>

            {/* Category tag */}
            <div className="absolute bottom-3 left-3.5">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
                {vendor.category}
              </span>
            </div>
          </div>

          {/* Front Content */}
          <div className="p-5 flex-1 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3
                  onClick={() => navigate(`/vendors/${vendor.slug}`)}
                  className="font-display font-bold text-sage-950 text-xl leading-snug cursor-pointer hover:text-sage-600 transition-colors line-clamp-1"
                >
                  {vendor.name}
                </h3>
                {vendor.verified && <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
              </div>

              <div className="flex items-center gap-1.5 text-sage-600 text-xs font-semibold mb-3">
                <MapPin className="w-3.5 h-3.5 text-sage-500" />
                <span>{vendor.location}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-amber-900 text-xs font-bold">{vendor.rating}</span>
                </div>
                <span className="text-dark-500 text-xs font-semibold">({vendor.reviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {vendor.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-sage-800 text-xs bg-sage-50 px-2.5 py-1 rounded-lg border border-sage-100 font-medium">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-between pt-3 border-t border-sage-100">
              <div>
                <p className="text-sage-950 font-extrabold text-lg leading-none">
                  {vendor.price_unit}{vendor.price_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-dark-400 text-xs mt-0.5 font-semibold">{vendor.price_label}</p>
              </div>

              <button
                onClick={() => navigate(`/vendors/${vendor.slug}`)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-sage-900 hover:bg-sage-800 text-white text-xs font-bold rounded-xl shadow-md hover:scale-105 transition-all"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (Vendor Features & Services) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-sage-950 via-sage-900 to-sage-950 text-white rounded-3xl p-6 border border-sage-700 shadow-2xl flex flex-col justify-between">
          
          <div>
            {/* Header: Title & Flip Back */}
            <div className="flex items-center justify-between pb-3 border-b border-sage-800 mb-4">
              <div>
                <span className="text-gold-400 text-[10px] font-bold uppercase tracking-widest block">Vendor Profile</span>
                <h4 className="font-display font-bold text-white text-lg leading-tight line-clamp-1">{vendor.name}</h4>
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="px-3 py-1.5 bg-sage-800 hover:bg-sage-700 text-gold-300 border border-gold-500/30 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <RotateCw className="w-3 h-3 text-gold-400" />
                <span>Front ↩</span>
              </button>
            </div>

            {/* Overview / Description */}
            <div className="mb-4">
              <p className="text-sage-200 text-xs font-medium leading-relaxed line-clamp-3">
                {vendor.description || `${vendor.name} is a top-rated ${vendor.category} provider in ${vendor.location} delivering premium services.`}
              </p>
            </div>

            {/* Highlights & Features List */}
            <div className="space-y-2 mb-4">
              <h5 className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">Key Services & Amenities</h5>
              {vendor.tags.slice(0, 4).map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-sage-100 text-xs font-medium bg-sage-900/80 p-2 rounded-xl border border-sage-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="line-clamp-1">{tag}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics (Capacity & Experience) */}
            <div className="grid grid-cols-2 gap-2 bg-sage-900/90 p-2.5 rounded-xl border border-sage-800 text-center">
              <div>
                <span className="text-[10px] text-sage-400 font-bold block uppercase">Capacity</span>
                <span className="text-xs font-bold text-white line-clamp-1">{vendor.capacity || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-[10px] text-sage-400 font-bold block uppercase">Experience</span>
                <span className="text-xs font-bold text-gold-400">{vendor.experience_years || 8}+ Years</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-sage-800 flex items-center justify-between">
            <div>
              <span className="text-sage-400 text-[10px] uppercase font-bold block">Starting From</span>
              <p className="text-gold-400 font-extrabold text-lg leading-none">
                {vendor.price_unit}{vendor.price_amount.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              onClick={() => navigate(`/vendors/${vendor.slug}`)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-sage-950 text-xs font-extrabold rounded-xl shadow-md hover:scale-105 transition-all"
            >
              <span>Book Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
    <section id="vendors" className="py-24 bg-white relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="inline-flex items-center gap-2 text-sage-700 text-xs font-bold tracking-widest uppercase mb-3 bg-sage-100 px-3.5 py-1 rounded-full border border-sage-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Verified Top Picks
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-950">
              Featured <span className="text-gradient">Vendors</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-dark-500 text-xs sm:text-sm font-semibold">
              🔄 Click <span className="text-sage-900 font-bold">"Features 🔄"</span> to inspect vendor details
            </p>
            <button
              onClick={() => navigate('/vendors')}
              className="text-sage-700 font-extrabold text-sm border-b-2 border-sage-300 hover:border-sage-700 hover:text-sage-950 transition-colors pb-0.5"
            >
              View All 2,500+ →
            </button>
          </div>
        </div>

        {/* 6 Individual Featured Vendor Flip Cards Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_VENDORS.slice(0, 6).map((vendor, index) => (
            <VendorFlipCard
              key={vendor.id}
              vendor={vendor}
              index={index}
              inView={inView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


