import { useState } from 'react';
import { Star, MapPin, Heart, CheckCircle2, TrendingUp, ArrowRight, RotateCw, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import type { Vendor } from '../lib/supabase';
import { MOCK_VENDORS } from '../lib/vendors';

// Pair 6 featured vendors into 3 flip cards (Front = vendor 1, Back = vendor 2)
const vendorPairs = [
  { front: MOCK_VENDORS[0], back: MOCK_VENDORS[1] },
  { front: MOCK_VENDORS[2], back: MOCK_VENDORS[3] },
  { front: MOCK_VENDORS[4], back: MOCK_VENDORS[5] },
];

function FlippableVendorCard({
  frontVendor,
  backVendor,
  cardIndex,
  inView,
}: {
  frontVendor: Vendor;
  backVendor: Vendor;
  cardIndex: number;
  inView: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [likedFront, setLikedFront] = useState(false);
  const [likedBack, setLikedBack] = useState(false);
  const navigate = useNavigate();

  const activeVendor = isFlipped ? backVendor : frontVendor;

  return (
    <div
      className={`animate-on-scroll ${inView ? 'in-view' : ''} delay-${(cardIndex + 1) * 150} group perspective-1000 h-[480px]`}
    >
      {/* 3D Flip Container */}
      <div
        className={`relative w-full h-full duration-700 transition-transform transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl overflow-hidden border border-sage-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          
          {/* Top Image Box */}
          <div className="relative h-56 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/vendors/${frontVendor.slug}`)}>
            <img
              src={frontVendor.image}
              alt={frontVendor.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-950/70 via-sage-950/20 to-transparent" />

            {/* Top Left Badge */}
            {frontVendor.badge && (
              <div className="absolute top-3.5 left-3.5">
                <span className="bg-sage-900 text-gold-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-white/20">
                  {frontVendor.badge}
                </span>
              </div>
            )}

            {/* Top Right Buttons: Flip & Like */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-sage-900 text-xs font-extrabold flex items-center gap-1 shadow-md hover:bg-white hover:scale-105 transition-all"
                title="Flip to view partner vendor"
              >
                <RotateCw className="w-3.5 h-3.5 text-sage-700 animate-spin-slow" />
                <span>Flip Card 🔄</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLikedFront(!likedFront);
                }}
                className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 ${likedFront ? 'text-rose-500 fill-rose-500' : 'text-dark-400'}`} />
              </button>
            </div>

            {/* Category tag */}
            <div className="absolute bottom-3 left-3.5">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
                {frontVendor.category}
              </span>
            </div>
          </div>

          {/* Front Content */}
          <div className="p-5 flex-1 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3
                  onClick={() => navigate(`/vendors/${frontVendor.slug}`)}
                  className="font-display font-bold text-sage-950 text-xl leading-snug cursor-pointer hover:text-sage-600 transition-colors"
                >
                  {frontVendor.name}
                </h3>
                {frontVendor.verified && <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-amber-900 text-xs font-bold">{frontVendor.rating}</span>
                </div>
                <span className="text-dark-500 text-xs font-semibold">({frontVendor.reviews} verified reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {frontVendor.tags.slice(0, 3).map((tag) => (
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
                  {frontVendor.price_unit}{frontVendor.price_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-dark-400 text-xs mt-0.5 font-semibold">{frontVendor.price_label}</p>
              </div>

              <button
                onClick={() => navigate(`/vendors/${frontVendor.slug}`)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-sage-900 hover:bg-sage-800 text-white text-xs font-bold rounded-xl shadow-md hover:scale-105 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE (Flipped) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-sage-950 to-sage-900 text-white rounded-3xl overflow-hidden border border-sage-700 shadow-2xl flex flex-col justify-between">
          
          {/* Top Image Box */}
          <div className="relative h-56 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/vendors/${backVendor.slug}`)}>
            <img
              src={backVendor.image}
              alt={backVendor.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-sage-950/40 to-transparent" />

            {/* Top Left Badge */}
            <div className="absolute top-3.5 left-3.5">
              <span className="bg-gold-500 text-sage-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                Featured Alternate
              </span>
            </div>

            {/* Top Right Flip Back Button */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="px-3 py-1.5 bg-sage-900/90 text-gold-300 border border-gold-500/40 backdrop-blur-md rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md hover:bg-sage-950 hover:scale-105 transition-all"
                title="Flip back"
              >
                <RotateCw className="w-3.5 h-3.5 text-gold-400" />
                <span>Flip Back ↩</span>
              </button>
            </div>

            {/* Category Tag */}
            <div className="absolute bottom-3 left-3.5">
              <span className="bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-bold px-3 py-1 rounded-full">
                {backVendor.category}
              </span>
            </div>
          </div>

          {/* Back Content */}
          <div className="p-5 flex-1 flex flex-col justify-between bg-sage-950">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3
                  onClick={() => navigate(`/vendors/${backVendor.slug}`)}
                  className="font-display font-bold text-white text-xl leading-snug cursor-pointer hover:text-gold-300 transition-colors"
                >
                  {backVendor.name}
                </h3>
                {backVendor.verified && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-gold-500/20 px-2.5 py-0.5 rounded-lg border border-gold-500/30">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  <span className="text-gold-300 text-xs font-bold">{backVendor.rating}</span>
                </div>
                <span className="text-sage-300 text-xs font-medium">({backVendor.reviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {backVendor.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-sage-200 text-xs bg-sage-800/80 px-2.5 py-1 rounded-lg border border-sage-700 font-medium">
                    ✦ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-sage-800">
              <div>
                <p className="text-gold-400 font-extrabold text-lg leading-none">
                  {backVendor.price_unit}{backVendor.price_amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sage-400 text-xs mt-0.5 font-medium">{backVendor.price_label}</p>
              </div>

              <button
                onClick={() => navigate(`/vendors/${backVendor.slug}`)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-sage-950 text-xs font-extrabold rounded-xl shadow-md hover:scale-105 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
              Interactive Showcase
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-sage-950">
              Featured <span className="text-gradient">Vendors</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-dark-500 text-xs sm:text-sm font-semibold">
              🔄 Click <span className="text-sage-900 font-bold">"Flip Card"</span> to reveal alternate top picks
            </p>
            <button
              onClick={() => navigate('/vendors')}
              className="text-sage-700 font-extrabold text-sm border-b-2 border-sage-300 hover:border-sage-700 hover:text-sage-950 transition-colors pb-0.5"
            >
              View All 2,500+ →
            </button>
          </div>
        </div>

        {/* 3 Flip Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendorPairs.map((pair, index) => (
            <FlippableVendorCard
              key={pair.front.id}
              frontVendor={pair.front}
              backVendor={pair.back}
              cardIndex={index}
              inView={inView}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

