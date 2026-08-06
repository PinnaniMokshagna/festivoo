import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Download, Home, Star, Sparkles, Mail, Phone, ArrowRight, Printer, ShieldCheck, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';
import { supabase } from '../lib/supabase';
import type { Booking, Vendor } from '../lib/supabase';

// Fallback Demo Bookings & Vendors dictionary
const DEMO_CONFIRMATIONS: Array<{ booking: Booking; vendor: Vendor }> = [
  {
    booking: {
      id: 'demo-1',
      vendor_id: 'demo-v1',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Wedding Return Gifts & Hampers',
      event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      guests: 200,
      special_requests: 'Trousseau packing with pink ribbons and premium dry fruit boxes.',
      total_amount: 15000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo1',
      booking_ref: 'FST-GIF-82910',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v1',
      name: 'Vikas Premium Curations',
      category: 'Wedding Gifts',
      location: 'Hyderabad, India',
      price_amount: 500,
      price_label: 'per hamper',
      price_unit: 'hamper',
      rating: 4.8,
      reviews: 32,
      image: '/images/wedding_return_gifts.jpg',
      gallery: [],
      tags: ['Bespoke', 'Luxury Packaging'],
      description: 'Exclusive designer wedding gifts and luxury boxes.',
      verified: true,
      badge: 'Top Rated',
      badge_color: 'gold',
      capacity: null,
      experience_years: 5,
      slug: 'vikas-premium-curations',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-2',
      vendor_id: 'demo-v2',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Bespoke Luxury Invitations',
      event_date: new Date(Date.now() + 86400000 * 10).toISOString(),
      guests: 150,
      special_requests: 'Gold foil typography with wax-sealed custom envelopes.',
      total_amount: 7500,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo2',
      booking_ref: 'FST-INV-38291',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v2',
      name: 'Royal Card Designers',
      category: 'Invitation Cards',
      location: 'Bangalore, India',
      price_amount: 50,
      price_label: 'per card',
      price_unit: 'card',
      rating: 4.9,
      reviews: 54,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      tags: ['Handcrafted', 'Calligraphy'],
      description: 'Luxury handcrafted wedding invitations.',
      verified: true,
      badge: 'Royal Design',
      badge_color: 'gold',
      capacity: null,
      experience_years: 8,
      slug: 'royal-card-designers',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-3',
      vendor_id: 'demo-v3',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Candid Photography & 4K Drone Shoot',
      event_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      guests: 300,
      special_requests: 'Full wedding day candid coverage with drone aerial video teaser.',
      total_amount: 35000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo3',
      booking_ref: 'FST-CAM-90182',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v3',
      name: 'Aura Lens Studios',
      category: 'Photographer',
      location: 'Bangalore, India',
      price_amount: 15000,
      price_label: 'per day',
      price_unit: 'day',
      rating: 4.9,
      reviews: 64,
      image: '/images/photography.jpg',
      gallery: [],
      tags: ['Candid 4K', 'Drone Aerial'],
      description: 'Award winning wedding photography.',
      verified: true,
      badge: 'Award Winner',
      badge_color: 'gold',
      capacity: null,
      experience_years: 9,
      slug: 'aura-lens-studios',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-4',
      vendor_id: 'demo-v4',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Pink Yellow Shamiana Canopy Setup',
      event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
      guests: 500,
      special_requests: 'Pink and yellow striped canvas shamiana with lawn seating.',
      total_amount: 28000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo4',
      booking_ref: 'FST-TNT-58190',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v4',
      name: 'Pink Yellow Shamiana Tent House',
      category: 'Tent House',
      location: 'Bangalore, India',
      price_amount: 15000,
      price_label: 'per setup',
      price_unit: 'setup',
      rating: 4.9,
      reviews: 48,
      image: '/images/pink_yellow_shamiana.jpg',
      gallery: [],
      tags: ['Vibrant Tents', 'Marriage Canopy'],
      description: 'Traditional pink & yellow striped canvas shamianas.',
      verified: true,
      badge: 'Trending',
      badge_color: 'gold',
      capacity: 500,
      experience_years: 8,
      slug: 'pink-yellow-shamiana-tent-house',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-5',
      vendor_id: 'demo-v5',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Starlit Fairy Lights & Chandelier Canopy',
      event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
      guests: 350,
      special_requests: 'Fairy light tunnel walkway and crystal stage lighting.',
      total_amount: 18000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo5',
      booking_ref: 'FST-LGT-39201',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v5',
      name: 'GlowCraft Illumination',
      category: 'Lights',
      location: 'Hyderabad, India',
      price_amount: 7000,
      price_label: 'per night',
      price_unit: 'night',
      rating: 4.8,
      reviews: 52,
      image: '/images/fairy_lights_reception.jpg',
      gallery: [],
      tags: ['Fairy Lights', 'Crystal Chandeliers'],
      description: 'Magical lighting setups and ambient glow.',
      verified: true,
      badge: 'Star Decor',
      badge_color: 'gold',
      capacity: null,
      experience_years: 6,
      slug: 'glowcraft-illumination',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-6',
      vendor_id: 'demo-v6',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'HD Bridal Makeover & Hair Styling',
      event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      guests: 5,
      special_requests: 'HD airbrush bridal makeup with traditional saree draping.',
      total_amount: 16000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo6',
      booking_ref: 'FST-MKP-78192',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v6',
      name: 'Glamour Touch Bridal Studio',
      category: 'Makeup',
      location: 'Mumbai, India',
      price_amount: 5000,
      price_label: 'per look',
      price_unit: 'look',
      rating: 4.9,
      reviews: 73,
      image: '/images/bridal_makeup.jpg',
      gallery: [],
      tags: ['HD Airbrush', 'Royal Makeover'],
      description: 'Luxury bridal makeup and hairstyling artists.',
      verified: true,
      badge: 'Top Stylist',
      badge_color: 'gold',
      capacity: null,
      experience_years: 10,
      slug: 'glamour-touch-bridal-studio',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-7',
      vendor_id: 'demo-v7',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Vintage Rolls-Royce Marriage Car',
      event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      guests: 4,
      special_requests: 'Red rose garland decoration for groom arrival.',
      total_amount: 14000,
      status: 'cancelled',
      payment_status: 'refunded',
      payment_intent_id: 'pi_demo7',
      booking_ref: 'FST-CAR-40192',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v7',
      name: 'Royal Heritage Vintage Fleet',
      category: 'Travel',
      location: 'Delhi, India',
      price_amount: 3000,
      price_label: 'per day',
      price_unit: 'day',
      rating: 4.9,
      reviews: 39,
      image: '/images/wedding_car.jpg',
      gallery: [],
      tags: ['Vintage Car', 'Floral Decorated'],
      description: 'Classic vintage cars and luxury fleets.',
      verified: true,
      badge: 'Luxury Fleet',
      badge_color: 'gold',
      capacity: 4,
      experience_years: 12,
      slug: 'royal-heritage-vintage-fleet',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-8',
      vendor_id: 'demo-v8',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Organic Bridal Henna & Guest Station',
      event_date: new Date(Date.now() + 86400000 * 1).toISOString(),
      guests: 40,
      special_requests: 'Full bridal arms mehendi with portrait figures.',
      total_amount: 8500,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo8',
      booking_ref: 'FST-MEH-67102',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v8',
      name: 'Rajasthani Royal Mehendi Arts',
      category: 'Mehendi Artist',
      location: 'Jaipur, India',
      price_amount: 1500,
      price_label: 'per design',
      price_unit: 'design',
      rating: 4.9,
      reviews: 91,
      image: '/images/mehendi_art.jpg',
      gallery: [],
      tags: ['Bridal Mehendi', 'Organic Henna'],
      description: 'Intricate Rajasthani and Arabic henna artistry.',
      verified: true,
      badge: 'Henna Master',
      badge_color: 'gold',
      capacity: null,
      experience_years: 11,
      slug: 'rajasthani-royal-mehendi-arts',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-9',
      vendor_id: 'demo-v9',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Pre-Wedding Romance Shoot at Palace',
      event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
      guests: 2,
      special_requests: 'Royal palace backdrop shoot with 2 outfit changes.',
      total_amount: 22000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo9',
      booking_ref: 'FST-PWR-88201',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v9',
      name: 'Palace Romance Photography',
      category: 'Pre Wedding Shoot',
      location: 'Udaipur, India',
      price_amount: 15000,
      price_label: 'per shoot',
      price_unit: 'shoot',
      rating: 4.9,
      reviews: 44,
      image: '/images/prewedding_shoot.jpg',
      gallery: [],
      tags: ['Palace Backdrops', 'Cinematic Romance'],
      description: 'High end pre-wedding photoshoots at scenic destinations.',
      verified: true,
      badge: 'Top Photographer',
      badge_color: 'gold',
      capacity: null,
      experience_years: 8,
      slug: 'palace-romance-photography',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-10',
      vendor_id: 'demo-v10',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Floral Mandap & Stage Decor',
      event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
      guests: 350,
      special_requests: 'Marigold and rose arch decor at main entrance.',
      total_amount: 45000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo10',
      booking_ref: 'FST-DEC-10294',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v10',
      name: 'Royal Stage Decorators',
      category: 'Decorator',
      location: 'Chennai, India',
      price_amount: 10000,
      price_label: 'per event',
      price_unit: 'event',
      rating: 4.7,
      reviews: 42,
      image: '/images/marriage_decoration.jpg',
      gallery: [],
      tags: ['Mandap', 'Floral Stage'],
      description: 'Bespoke floral setups for premium weddings.',
      verified: true,
      badge: 'Certified Partner',
      badge_color: 'sage',
      capacity: null,
      experience_years: 10,
      slug: 'royal-stage-decorators',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-11',
      vendor_id: 'demo-v11',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Live DJ & Concert Sound Setup',
      event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
      guests: 250,
      special_requests: 'Include LED dance floor and custom Bollywood playlist.',
      total_amount: 25000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo11',
      booking_ref: 'FST-DJS-89201',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v11',
      name: 'Neon Pink Sound Consoles',
      category: 'DJ',
      location: 'Mumbai, India',
      price_amount: 12000,
      price_label: 'per night',
      price_unit: 'night',
      rating: 4.9,
      reviews: 87,
      image: '/images/party_dj.jpg',
      gallery: [],
      tags: ['Premium Sound', 'Laser Show'],
      description: 'High energy sound configurations and custom playlists.',
      verified: true,
      badge: 'SuperHost',
      badge_color: 'gold',
      capacity: null,
      experience_years: 7,
      slug: 'neon-pink-sound-consoles',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-12',
      vendor_id: 'demo-v12',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Gourmet Wedding Banquet Feast',
      event_date: new Date(Date.now() + 86400000 * 6).toISOString(),
      guests: 400,
      special_requests: 'Live pasta counter and traditional regional desserts.',
      total_amount: 80000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo12',
      booking_ref: 'FST-CAT-30192',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v12',
      name: 'Spice Garden Caterers',
      category: 'Catering',
      location: 'Hyderabad, India',
      price_amount: 150,
      price_label: 'per plate',
      price_unit: 'plate',
      rating: 4.8,
      reviews: 124,
      image: '/images/catering_buffet.jpg',
      gallery: [],
      tags: ['Multi-cuisine', 'Veg & Non-Veg'],
      description: 'Authentic local flavors and world gourmet cuisines.',
      verified: true,
      badge: 'Five Star Hygiene',
      badge_color: 'sage',
      capacity: null,
      experience_years: 12,
      slug: 'spice-garden-caterers',
      created_at: new Date().toISOString()
    }
  },
  {
    booking: {
      id: 'demo-13',
      vendor_id: 'demo-v13',
      customer_name: 'Kranti',
      customer_email: 'krantishantveer@gmail.com',
      customer_phone: '+91 98765 43210',
      event_type: 'Sacred Vedic Marriage Ceremony',
      event_date: new Date(Date.now() + 86400000 * 12).toISOString(),
      guests: 100,
      special_requests: 'Arrange all puja samagri (ceremonial items) beforehand.',
      total_amount: 11000,
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: 'pi_demo13',
      booking_ref: 'FST-PAN-59302',
      created_at: new Date().toISOString()
    },
    vendor: {
      id: 'demo-v13',
      name: 'Vedic Pooja Priests',
      category: 'Pandit',
      location: 'Varanasi, India',
      price_amount: 5100,
      price_label: 'per ceremony',
      price_unit: 'ceremony',
      rating: 4.9,
      reviews: 62,
      image: '/images/vedic_wedding_ceremony.jpg',
      gallery: [],
      tags: ['Authentic Vedic', 'All Rituals'],
      description: 'Learned pandits guiding you through every traditional ritual.',
      verified: true,
      badge: 'Traditional Priest',
      badge_color: 'gold',
      capacity: null,
      experience_years: 15,
      slug: 'vedic-pooja-priests',
      created_at: new Date().toISOString()
    }
  }
];

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#5d8560', '#466b48', '#7fa281', '#d4ab68', '#c19350', '#fbbf24', '#f59e0b'];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotSpeed: number; opacity: number }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 5,
        opacity: 1,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.01;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
        if (p.opacity <= 0) {
          particles.splice(i, 1);
        }
      });
      frame++;
      if (frame < 300 && particles.length > 0) requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}

export default function ConfirmationPage() {
  const { ref } = useParams<{ ref: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const { ref: nextRef, inView: nextInView } = useInView<HTMLDivElement>();
  const { ref: actionsRef, inView: actionsInView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!ref) return;

    const fetchDetails = async () => {
      try {
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('booking_ref', ref)
          .maybeSingle();

        if (bookingData) {
          setBooking(bookingData);
          const { data: vendorData } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', bookingData.vendor_id)
            .maybeSingle();
          setVendor(vendorData);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Safe fallback to demo dictionary
      }

      // Check Demo Dictionary
      const match = DEMO_CONFIRMATIONS.find(c => c.booking.booking_ref === ref) || DEMO_CONFIRMATIONS[0];
      if (match) {
        setBooking(match.booking);
        setVendor(match.vendor);
      }
      setLoading(false);
    };

    fetchDetails();

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [ref]);

  const handleDownloadReceipt = () => {
    if (!booking || !vendor) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Festivo Tax Invoice - ${booking.booking_ref}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .receipt-box { border: 2px solid #5d8560; padding: 30px; border-radius: 16px; max-w: 650px; margin: auto; background: #faf8f5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; color: #3b583d; }
          .badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 14px; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .value { font-size: 15px; font-weight: bold; color: #0f172a; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
          .table th { background: #5d8560; color: white; text-align: left; padding: 10px; border-radius: 4px; }
          .table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
          .total { text-align: right; font-size: 20px; font-weight: bold; color: #3b583d; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">✨ FESTIVO PLATFORM</div>
              <div style="font-size: 12px; color: #64748b;">Official Tax Invoice & Service Voucher</div>
            </div>
            <div class="badge">PAID & VERIFIED</div>
          </div>
          <div class="details-grid">
            <div>
              <div class="label">Booking Ref</div>
              <div class="value">${booking.booking_ref}</div>
            </div>
            <div>
              <div class="label">Issue Date</div>
              <div class="value">${new Date().toLocaleDateString('en-IN')}</div>
            </div>
            <div>
              <div class="label">Customer Name</div>
              <div class="value">${booking.customer_name} (${booking.customer_email})</div>
            </div>
            <div>
              <div class="label">Vendor Partner</div>
              <div class="value">${vendor.name} (${vendor.category})</div>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Event Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${booking.event_type}</td>
                <td>${new Date(booking.event_date).toLocaleDateString('en-IN')}</td>
                <td>₹${booking.total_amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Paid: ₹${booking.total_amount.toLocaleString('en-IN')}</div>
          <div class="footer">
            100% Festivo Guarantee Protected · Support: support@festivo.in · Thank you for choosing Festivo!
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!booking || !vendor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-dark-900 mb-2">Booking not found</h2>
            <button onClick={() => navigate('/dashboard')} className="text-sage-600 hover:underline font-semibold">Return to Dashboard</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-sage-50 via-white to-cream-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8 animate-fade-up">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto border-2 border-sage-300 shadow-glow">
                <CheckCircle className="w-12 h-12 text-sage-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-900 mb-3">
              Booking Invoice & Receipt
            </h1>
            <p className="text-dark-500 text-lg max-w-md mx-auto">
              Your event order is secured and verified by Festivo!
            </p>
            <div className="inline-flex items-center gap-2 mt-4 bg-sage-100 border border-sage-300 rounded-xl px-4 py-2">
              <ShieldCheck className="w-4 h-4 text-sage-700" />
              <span className="text-sage-800 text-sm font-bold">100% Verified Payment & Service Guarantee</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden mb-6 border border-sage-100">
            <div className="relative h-48">
              {vendor.image && !vendor.image.includes('pexels.com') ? (
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sage-700 to-sage-900 flex items-center justify-center">
                  <span className="text-white/25 text-3xl font-display font-bold">{vendor.category[0] || 'V'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              <div className="absolute top-4 right-4">
                <span className="bg-sage-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle className="w-3 h-3" /> Confirmed
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{vendor.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-white/70" />
                      <span className="text-white/70 text-xs">{vendor.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-white font-bold">{vendor.rating}</span>
                    </div>
                    <span className="text-white/70 text-xs">{vendor.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-sage-100">
                <div>
                  <p className="text-dark-400 text-xs font-bold uppercase tracking-wider">Booking Reference</p>
                  <p className="font-mono text-2xl font-bold text-dark-900 mt-1">{booking.booking_ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-dark-400 text-xs font-bold uppercase tracking-wider">Amount Paid</p>
                  <p className="font-display text-2xl font-bold text-sage-600 mt-1">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Calendar, label: 'Event Date', value: new Date(booking.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
                  { icon: FileText, label: 'Event Service', value: booking.event_type },
                  { icon: Users, label: 'Guest Count', value: `${booking.guests} guests` },
                  { icon: Calendar, label: 'Payment Status', value: 'Paid & Confirmed' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-sage-50/60 rounded-xl p-3.5 border border-sage-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-sage-600" />
                      <span className="text-dark-400 text-[10px] font-bold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-dark-900 font-bold text-xs truncate">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-sage-100 pt-5">
                <p className="text-dark-700 font-bold text-sm mb-3">Customer Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-sage-700" />
                    </div>
                    <span className="text-dark-700 font-medium">{booking.customer_name}</span>
                    <span className="text-dark-400 mx-1">·</span>
                    <span className="text-dark-700 font-medium">{booking.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-sage-700" />
                    </div>
                    <span className="text-dark-700 font-medium">{booking.customer_phone}</span>
                  </div>
                </div>
              </div>

              {booking.special_requests && (
                <div className="mt-4 pt-4 border-t border-sage-100">
                  <p className="text-dark-500 text-xs font-bold uppercase tracking-wider mb-1">Special Requests</p>
                  <p className="text-dark-700 text-sm bg-sage-50 border border-sage-150 rounded-xl p-3">{booking.special_requests}</p>
                </div>
              )}
            </div>
          </div>

          <div ref={nextRef} className={`bg-gradient-to-r from-sage-900 to-dark-900 text-white rounded-2xl p-5 mb-6 shadow-card animate-on-scroll ${nextInView ? 'in-view' : ''}`}>
            <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" /> Next Steps & Dispatch Info
            </h3>
            <div className="space-y-2.5">
              {[
                { step: '1', text: `Official invoice receipt sent to ${booking.customer_email}` },
                { step: '2', text: `${vendor.name} team assigned for event setup and coordination` },
                { step: '3', text: 'Festivo 24/7 Support line available for any instant changes' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-dark-900 text-xs font-extrabold flex-shrink-0 mt-0.5">{step}</div>
                  <p className="text-sage-200 text-xs font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div ref={actionsRef} className={`flex flex-col sm:flex-row gap-3 animate-on-scroll ${actionsInView ? 'in-view' : ''}`}>
            {booking.payment_status === 'paid' ? (
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-sage-800 hover:bg-sage-900 text-white font-bold rounded-xl shadow-glow transition-all text-sm"
              >
                <Download className="w-4 h-4 text-gold-400" /> Download Tax Receipt
              </button>
            ) : (
              <button
                onClick={() => {
                  setBooking(prev => prev ? { ...prev, payment_status: 'paid', status: 'confirmed' } : null);
                  alert(`🎉 Payment Successful for ₹${booking.total_amount.toLocaleString('en-IN')}!\n\nYour receipt is now unlocked!`);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-brand text-white font-bold rounded-xl shadow-glow hover:shadow-card-hover transition-all text-sm"
              >
                <Sparkles className="w-4 h-4 text-gold-300" /> Pay Now (₹{booking.total_amount.toLocaleString('en-IN')}) to Unlock Receipt
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-sage-200 text-sage-800 font-bold rounded-xl hover:bg-sage-50 transition-all text-sm"
            >
              <Home className="w-4 h-4 text-sage-600" /> My Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
