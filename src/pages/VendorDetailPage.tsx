import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, CheckCircle2, Heart, Share2, ArrowLeft, ArrowRight, X,
  Users, Clock, Sparkles, ChevronLeft, Camera, Calendar, MessageSquare, ThumbsUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useInView } from '../hooks/useInView';
import { supabase } from '../lib/supabase';
import type { Vendor } from '../lib/supabase';
import { dataCache } from '../lib/cache';

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  vendor_reply: string | null;
  created_at: string;
};

function PhotoLightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const [zoom, setZoom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-dark-900/95 backdrop-blur-xl" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300">
        <X className="w-5 h-5" />
      </button>

      <div className="absolute top-6 left-6 z-10 glass rounded-xl px-4 py-2">
        <span className="text-white text-sm font-medium">{current + 1} / {images.length}</span>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-5xl max-h-[85vh] mx-auto px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          style={{
            transform: zoom ? 'scale(1.05) rotateX(2deg)' : 'scale(1) rotateX(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            key={current}
            src={images[current]}
            alt=""
            className="max-h-[80vh] max-w-full object-contain mx-auto block animate-scale-in cursor-zoom-in"
            onClick={() => setZoom(!zoom)}
          />
          <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
        className="absolute left-4 z-10 w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:-translate-x-0.5 duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
        className="absolute right-4 z-10 w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:translate-x-0.5 duration-200"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`overflow-hidden rounded-lg border-2 transition-all duration-200 ${i === current ? 'border-sage-400 scale-110' : 'border-white/20 opacity-60 hover:opacity-90'}`}
            style={{ width: 48, height: 36 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    if (ref.current) {
      ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    }
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

export default function VendorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { ref: aboutRef, inView: aboutInView } = useInView<HTMLDivElement>();
  const { ref: galleryRef, inView: galleryInView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!slug) return;

    // Check if vendor is already in all_vendors cache for instant loading
    const allVendors = dataCache.get<Vendor[]>('all_vendors');
    const cachedVendor = allVendors?.find((v) => v.slug === slug) ?? null;
    if (cachedVendor) {
      setVendor(cachedVendor);
      setLoading(false);
    }

    // Fetch vendor + reviews in parallel (no waterfall)
    Promise.all([
      dataCache.fetchWithCache(`vendor_${slug}`, async () => {
        const { data } = await supabase.from('vendors').select('*').eq('slug', slug).maybeSingle();
        return data as Vendor | null;
      }),
      dataCache.fetchWithCache(`reviews_${slug}`, async () => {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('vendor_id', cachedVendor?.id ?? '')
          .order('created_at', { ascending: false });
        return (data as Review[]) || [];
      }),
    ]).then(([vendorData, reviewData]) => {
      setVendor(vendorData);
      setReviews(reviewData);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-dark-500 font-medium">Loading vendor details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Vendor not found</h2>
            <button onClick={() => navigate('/vendors')} className="text-sage-600 hover:underline font-semibold">Browse vendors</button>
          </div>
        </div>
      </>
    );
  }

  const filteredGallery = (vendor.gallery || []).filter(img => img && !img.includes('pexels.com'));
  const hasImage = vendor.image && !vendor.image.includes('pexels.com');
  const allImages = filteredGallery.length ? filteredGallery : (hasImage ? [vendor.image] : []);

  return (
    <>
      <Navbar />
      {lightboxIndex !== null && (
        <PhotoLightbox images={allImages} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <div className="min-h-screen bg-cream-50/50 pt-16">
        <div className="relative h-72 md:h-96 overflow-hidden">
          {hasImage ? (
            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sage-800 to-dark-900 flex items-center justify-center">
              <span className="text-white/20 text-7xl font-display font-bold">{vendor.category[0] || 'V'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-transparent to-dark-900/80" />
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                {vendor.badge && (
                  <span className={`${vendor.badge_color} text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block`}>{vendor.badge}</span>
                )}
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">{vendor.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span className="text-white/80 text-sm">{vendor.location}</span>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-2.5 py-1 rounded-full">{vendor.category}</span>
                  {vendor.verified && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                      <span className="text-white/80 text-xs">Verified</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLiked(!liked)} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <Heart className={`w-5 h-5 ${liked ? 'text-sage-400 fill-sage-400' : 'text-white'}`} />
                </button>
                <button className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div ref={aboutRef} className={`bg-white rounded-2xl shadow-card p-6 animate-on-scroll ${aboutInView ? 'in-view' : ''}`}>
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-sage-50 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-sage-600 fill-sage-600" />
                    </div>
                    <div>
                      <p className="text-dark-900 font-bold text-lg leading-none">{vendor.rating}</p>
                      <p className="text-dark-400 text-xs">{vendor.reviews} reviews</p>
                    </div>
                  </div>
                  {vendor.capacity && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-cream-700" />
                      </div>
                      <div>
                        <p className="text-dark-900 font-bold text-sm leading-none">{vendor.capacity}</p>
                        <p className="text-dark-400 text-xs">Capacity</p>
                      </div>
                    </div>
                  )}
                  {vendor.experience_years && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gold-600" />
                      </div>
                      <div>
                        <p className="text-dark-900 font-bold text-sm leading-none">{vendor.experience_years}+ Years</p>
                        <p className="text-dark-400 text-xs">Experience</p>
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="font-display text-xl font-bold text-dark-900 mb-3">About</h2>
                <p className="text-dark-600 leading-relaxed">{vendor.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {vendor.tags.map(tag => (
                    <span key={tag} className="text-dark-700 text-sm bg-cream-50 px-3 py-1.5 rounded-lg border border-cream-200 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-sage-500" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {allImages.length > 0 && (
                <div ref={galleryRef} className={`bg-white rounded-2xl shadow-card p-6 animate-on-scroll ${galleryInView ? 'in-view' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-dark-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-sage-500" /> Photo Gallery
                    </h2>
                    <span className="text-dark-400 text-sm">{allImages.length} photos</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {allImages.map((img, i) => (
                      <TiltCard key={i} className="cursor-pointer">
                        <div
                          className="relative rounded-xl overflow-hidden aspect-square group shadow-sm hover:shadow-xl transition-shadow duration-300"
                          onClick={() => setLightboxIndex(i)}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/20 transition-colors duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Camera className="w-4 h-4 text-dark-800" />
                            </div>
                          </div>
                          <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <TiltCard>
                  <div className="bg-white rounded-2xl shadow-card p-6 border border-cream-200">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="text-dark-400 text-sm">Starting from</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-display text-3xl font-bold text-dark-900">{vendor.price_unit}{vendor.price_amount.toLocaleString('en-IN')}</span>
                          <span className="text-dark-400 text-sm">/{vendor.price_label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                          <span className="font-bold text-dark-900">{vendor.rating}</span>
                        </div>
                        <p className="text-dark-400 text-xs">{vendor.reviews} reviews</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/book/${vendor.slug}`)}
                      className="w-full py-4 bg-gradient-brand text-white font-bold text-lg rounded-xl hover:shadow-glow hover:scale-[1.02] transition-all duration-300 active:scale-95 mb-3 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" /> Book This Vendor
                    </button>

                    <p className="text-center text-dark-400 text-xs">No advance payment required to enquire</p>

                    <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
                      {[
                        'Instant booking confirmation',
                        'Free cancellation within 24h',
                        'Secure payment gateway',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sage-500 flex-shrink-0" />
                          <span className="text-dark-600 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>

                <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl p-5 border border-sage-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-sage-600" />
                    </div>
                    <span className="font-bold text-dark-900 text-sm">Festivo Guarantee</span>
                  </div>
                  <p className="text-dark-600 text-xs leading-relaxed">All vendors on Festivo are verified and background-checked. We ensure quality service or full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
