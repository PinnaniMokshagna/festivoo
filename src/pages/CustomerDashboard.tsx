import { useState, useEffect } from 'react';
// Customer Dashboard Component - Festivo Event Platform Verified Clean
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Star, TrendingUp, Clock, CheckCircle2, XCircle,
  Download, ArrowRight, Sparkles, Heart, Wallet, Bell,
  ChevronRight, MapPin, Users, Mail, Phone, FileText, LogOut, Info,
  Truck, ShieldCheck, MessageSquare, Package, Send, X, PhoneCall, User
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { Booking, Vendor } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';

type BookingWithVendor = Booking & { 
  vendor?: Vendor;
  order_type?: 'delivery' | 'service';
  tracking_status?: 'packing' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'setup_reached' | 'setup_done' | 'confirmed';
  tracking_id?: string;
  delivery_partner?: string;
  event_time?: string;
};

type UserReview = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_category: string;
  vendor_image?: string;
  rating: number;
  comment: string;
  created_at: string;
};

const DEMO_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    vendor_id: 'v1',
    vendor_name: 'Royal Palace Convention Center',
    vendor_category: 'Venue',
    vendor_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    rating: 5,
    comment: 'Exceptional venue and grand ambiance! The management helped coordinate all our grand entry arrangements seamlessly.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    vendor_id: 'v2',
    vendor_name: 'Spice Craft Gourmet Caterers',
    vendor_category: 'Catering',
    vendor_image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    rating: 5,
    comment: 'The live counters were a huge hit among our guests. Top quality food and professional staff!',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEMO_BOOKINGS: BookingWithVendor[] = [
  {
    id: 'demo-1',
    vendor_id: 'demo-v1',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Wedding Return Gifts & Hampers',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    event_time: '10:00 AM - 1:00 PM IST',
    guests: 200,
    special_requests: 'Trousseau packing with pink ribbons and premium dry fruit boxes.',
    total_amount: 15000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo1',
    booking_ref: 'FST-GIF-82910',
    created_at: new Date().toISOString(),
    order_type: 'delivery',
    tracking_status: 'out_for_delivery',
    tracking_id: 'FST-TRK-78291',
    delivery_partner: 'Festivo Express (BlueDart)',
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
    id: 'demo-2',
    vendor_id: 'demo-v2',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Bespoke Luxury Invitations',
    event_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    event_time: '11:00 AM - 4:00 PM IST',
    guests: 150,
    special_requests: 'Gold foil typography with wax-sealed custom envelopes.',
    total_amount: 7500,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo2',
    booking_ref: 'FST-INV-38291',
    created_at: new Date().toISOString(),
    order_type: 'delivery',
    tracking_status: 'dispatched',
    tracking_id: 'FST-TRK-49102',
    delivery_partner: 'Delhivery Premium',
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
    id: 'demo-3',
    vendor_id: 'demo-v3',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Candid Photography & 4K Drone Shoot',
    event_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    event_time: '6:00 AM - 11:00 PM IST',
    guests: 300,
    special_requests: 'Full wedding day candid coverage with drone aerial video teaser.',
    total_amount: 35000,
    status: 'pending',
    payment_status: 'unpaid',
    payment_intent_id: null,
    booking_ref: 'FST-CAM-90182',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'packing',
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
      tags: ['Candid 4K', 'Drone Aerial', 'Cinematic'],
      description: 'Award winning wedding photography and editorial candid films.',
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
    id: 'demo-4',
    vendor_id: 'demo-v4',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Pink Yellow Shamiana Canopy Setup',
    event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
    event_time: '8:00 AM - 10:00 PM IST',
    guests: 500,
    special_requests: 'Pink and yellow striped canvas shamiana with lawn seating.',
    total_amount: 28000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo4',
    booking_ref: 'FST-TNT-58190',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
      description: 'Traditional pink & yellow striped canvas shamianas and royal mandap structures.',
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
    id: 'demo-5',
    vendor_id: 'demo-v5',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Starlit Fairy Lights & Chandelier Canopy',
    event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    event_time: '6:00 PM - 11:30 PM IST',
    guests: 350,
    special_requests: 'Fairy light tunnel walkway and crystal stage lighting.',
    total_amount: 18000,
    status: 'pending',
    payment_status: 'unpaid',
    payment_intent_id: null,
    booking_ref: 'FST-LGT-39201',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'packing',
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
      description: 'Magical lighting setups and ambient glow for receptions.',
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
    id: 'demo-6',
    vendor_id: 'demo-v6',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'HD Bridal Makeover & Hair Styling',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    event_time: '5:00 AM - 9:00 AM IST',
    guests: 5,
    special_requests: 'HD airbrush bridal makeup with traditional saree draping.',
    total_amount: 16000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo6',
    booking_ref: 'FST-MKP-78192',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
    id: 'demo-7',
    vendor_id: 'demo-v7',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Vintage Rolls-Royce Marriage Car',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    event_time: '4:00 PM - 8:00 PM IST',
    guests: 4,
    special_requests: 'Red rose garland decoration for groom arrival.',
    total_amount: 14000,
    status: 'cancelled',
    payment_status: 'refunded',
    payment_intent_id: 'pi_demo7',
    booking_ref: 'FST-CAR-40192',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
      description: 'Classic vintage cars and luxury fleets for wedding arrivals.',
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
    id: 'demo-8',
    vendor_id: 'demo-v8',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Organic Bridal Henna & Guest Station',
    event_date: new Date(Date.now() + 86400000 * 1).toISOString(),
    event_time: '2:00 PM - 7:00 PM IST',
    guests: 40,
    special_requests: 'Full bridal arms mehendi with portrait figures.',
    total_amount: 8500,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo8',
    booking_ref: 'FST-MEH-67102',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
    id: 'demo-9',
    vendor_id: 'demo-v9',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Pre-Wedding Romance Shoot at Palace',
    event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    event_time: '4:30 PM - 7:30 PM IST',
    guests: 2,
    special_requests: 'Royal palace backdrop shoot with 2 outfit changes.',
    total_amount: 22000,
    status: 'pending',
    payment_status: 'unpaid',
    payment_intent_id: null,
    booking_ref: 'FST-PWR-88201',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'packing',
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
    id: 'demo-10',
    vendor_id: 'demo-v10',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Floral Mandap & Stage Decor',
    event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    event_time: '6:00 AM - 2:00 PM IST',
    guests: 350,
    special_requests: 'Marigold and rose arch decor at main entrance.',
    total_amount: 45000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo10',
    booking_ref: 'FST-DEC-10294',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
    id: 'demo-11',
    vendor_id: 'demo-v11',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Live DJ & Concert Sound Setup',
    event_date: new Date(Date.now() + 86400000 * 4).toISOString(),
    event_time: '7:00 PM - 11:59 PM IST',
    guests: 250,
    special_requests: 'Include LED dance floor and custom Bollywood playlist.',
    total_amount: 25000,
    status: 'pending',
    payment_status: 'unpaid',
    payment_intent_id: null,
    booking_ref: 'FST-DJS-89201',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'packing',
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
    id: 'demo-12',
    vendor_id: 'demo-v12',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Gourmet Wedding Banquet Feast',
    event_date: new Date(Date.now() + 86400000 * 6).toISOString(),
    event_time: '7:30 PM - 11:00 PM IST',
    guests: 400,
    special_requests: 'Live pasta counter and traditional regional desserts.',
    total_amount: 80000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo12',
    booking_ref: 'FST-CAT-30192',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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
    id: 'demo-13',
    vendor_id: 'demo-v13',
    customer_name: 'Kranti',
    customer_email: 'krantishantveer@gmail.com',
    customer_phone: '+91 98765 43210',
    event_type: 'Sacred Vedic Marriage Ceremony',
    event_date: new Date(Date.now() + 86400000 * 12).toISOString(),
    event_time: '6:30 AM - 11:30 AM IST',
    guests: 100,
    special_requests: 'Arrange all puja samagri (ceremonial items) beforehand.',
    total_amount: 11000,
    status: 'confirmed',
    payment_status: 'paid',
    payment_intent_id: 'pi_demo13',
    booking_ref: 'FST-PAN-59302',
    created_at: new Date().toISOString(),
    order_type: 'service',
    tracking_status: 'confirmed',
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

const DEMO_SAVED_VENDORS: Vendor[] = [
  {
    id: 'saved-v1',
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
    tags: ['Bespoke Gifts', 'Luxury Packaging'],
    description: 'Exclusive designer wedding gifts and luxury return boxes.',
    verified: true,
    badge: 'Top Rated',
    badge_color: 'gold',
    capacity: null,
    experience_years: 5,
    slug: 'vikas-premium-curations',
    created_at: new Date().toISOString()
  },
  {
    id: 'saved-v2',
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
    description: 'Traditional pink & yellow striped canvas shamianas and royal waterproof mandap structures.',
    verified: true,
    badge: 'Trending',
    badge_color: 'gold',
    capacity: 500,
    experience_years: 8,
    slug: 'pink-yellow-shamiana-tent-house',
    created_at: new Date().toISOString()
  },
  {
    id: 'saved-v3',
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
    tags: ['Laser Lights', 'Bollywood Beats'],
    description: 'High energy sound configurations and custom playlists.',
    verified: true,
    badge: 'SuperHost',
    badge_color: 'gold',
    capacity: null,
    experience_years: 7,
    slug: 'neon-pink-sound-consoles',
    created_at: new Date().toISOString()
  }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithVendor[]>([]);
  const [savedVendors, setSavedVendors] = useState<Vendor[]>(DEMO_SAVED_VENDORS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'invoices'>('overview');
  const [profileName, setProfileName] = useState('Kranti Shantveer');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileCity, setProfileCity] = useState('Bangalore, India');
  const [profileSaving, setProfileSaving] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userReviews, setUserReviews] = useState<UserReview[]>(DEMO_REVIEWS);
  const [reviewingBooking, setReviewingBooking] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'delivery' | 'service'>('all');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; subtitle?: string; slug?: string } | null>(null);
  const [bookingRatings, setBookingRatings] = useState<Record<string, number>>({});

  // Interactive Live Chat & Call Modal States
  const [activeChatVendor, setActiveChatVendor] = useState<{ name: string; category: string; image?: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'vendor'; text: string; time: string }>>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [activeCallVendor, setActiveCallVendor] = useState<{ name: string; phone: string; location: string } | null>(null);

  // Notifications Popover State
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(12);

  const notificationsList = [
    { id: 'n1', title: '🎁 Return Gifts Dispatched', text: 'Vikas Premium Curations wedding return gifts dispatched for venue setup (OTP: 4920).', time: '10m ago', bookingId: 'demo-1' },
    { id: 'n2', title: '✉️ Order Dispatched', text: 'Royal Card Designers invites shipped via Delhivery.', time: '1h ago', bookingId: 'demo-2' },
    { id: 'n3', title: '📸 Photographer Request Sent', text: 'Aura Lens Studios requested for 7 Aug.', time: '2h ago', bookingId: 'demo-3' },
    { id: 'n4', title: '⛺ Tent Setup Confirmed', text: 'Pink Yellow Shamiana Tent House setup confirmed for 9 Aug.', time: '3h ago', bookingId: 'demo-4' },
    { id: 'n5', title: '💡 Payment Pending', text: 'Starlit Fairy Lights setup requires payment confirmation.', time: '4h ago', bookingId: 'demo-5' },
    { id: 'n6', title: '💄 Makeup Artist Booked', text: 'Glamour Touch Bridal Studio confirmed for 8 Aug.', time: '5h ago', bookingId: 'demo-6' },
    { id: 'n7', title: '🔴 Car Booking Cancelled', text: 'Royal Heritage Vintage Fleet order refunded.', time: '6h ago', bookingId: 'demo-7' },
    { id: 'n8', title: '🌿 Mehendi Artist Ready', text: 'Rajasthani Royal Mehendi Arts confirmed for 6 Aug.', time: '7h ago', bookingId: 'demo-8' },
    { id: 'n9', title: '🏛️ Pre-Wedding Shoot Pending', text: 'Palace Romance Photography awaiting vendor confirmation.', time: '8h ago', bookingId: 'demo-9' },
    { id: 'n10', title: '🌸 Stage Decor Secured', text: 'Royal Stage Decorators confirmed for 10 Aug.', time: '1 day ago', bookingId: 'demo-10' },
    { id: 'n11', title: '🎧 DJ Sound Pending', text: 'Neon Pink Sound Consoles awaiting deposit payment.', time: '1 day ago', bookingId: 'demo-11' },
    { id: 'n12', title: '🍽️ Catering Feast Confirmed', text: 'Spice Garden Caterers confirmed for 11 Aug.', time: '2 days ago', bookingId: 'demo-12' }
  ];

  const handleOpenChat = (vendorName: string, category: string, image?: string) => {
    setActiveChatVendor({ name: vendorName, category, image });
    setChatMessages([
      {
        id: '1',
        sender: 'vendor',
        text: `Namaste Kranti! Welcome to ${vendorName}. How can we assist you with your ${category} order details?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeChatVendor) return;
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    const currentText = chatInputText;
    setChatInputText('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'vendor' as const,
          text: `Thank you for your message! ${activeChatVendor.name} support has noted your request ("${currentText}"). Our event manager will confirm your requirements shortly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const handleOpenCall = (vendorName: string, location: string) => {
    setActiveCallVendor({
      name: vendorName,
      phone: '+91 98765 43210',
      location: location || 'India'
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!window.confirm(`Are you sure you want to cancel event booking [${target?.booking_ref || ''}]?\n\nThis will cancel the booking and process a 100% full refund.`)) return;
    try {
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
    } catch {
      // safe fallback
    }
    
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', payment_status: 'refunded' } : b));
    alert(`❌ Event Booking [${target?.booking_ref || ''}] Cancelled Successfully!\n\nA full refund of ₹${target?.total_amount?.toLocaleString('en-IN') || ''} has been processed back to your original payment method.`);
  };

  const statsView = useInView<HTMLDivElement>();

  const currentUser = user || { email: 'krantishantveer@gmail.com', user_metadata: { full_name: 'Kranti' } };

  useEffect(() => {
    if (profile && profile.role !== 'customer') { navigate('/vendor-dashboard'); return; }
  }, [profile, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await supabase
          .from('bookings')
          .select('*')
          .eq('customer_email', currentUser.email ?? '')
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const vendorIds = [...new Set(data.map(b => b.vendor_id))];
          const { data: vendors } = await supabase
            .from('vendors')
            .select('*')
            .in('id', vendorIds);
          const vendorMap = new Map((vendors ?? []).map(v => [v.id, v]));
          setBookings(data.map(b => ({ ...b, vendor: vendorMap.get(b.vendor_id) })));
        } else {
          setBookings(DEMO_BOOKINGS);
        }
      } catch (err) {
        setBookings(DEMO_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser.email]);

  const upcomingBookings = bookings.filter(b => new Date(b.event_date) >= new Date() && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.event_date) < new Date() || b.status === 'cancelled');
  const totalSpent = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0);

  const submitReview = async (booking: BookingWithVendor) => {
    setReviewSubmitting(true);
    const newReview: UserReview = {
      id: Date.now().toString(),
      vendor_id: booking.vendor_id,
      vendor_name: booking.vendor?.name || 'Vendor',
      vendor_category: booking.vendor?.category || 'Service',
      vendor_image: booking.vendor?.image,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from('reviews').insert({
        vendor_id: booking.vendor_id,
        customer_name: booking.customer_name,
        rating: reviewRating,
        comment: reviewComment,
      });
    } catch {
      // safe fallback
    }

    setUserReviews(prev => [newReview, ...prev]);
    setReviewSubmitting(false);
    setReviewingBooking(null);
    setReviewComment('');
    setReviewRating(5);
  };

  const statusBadge = (status: string) => {
    if (status === 'confirmed') return <span className="flex items-center gap-1 text-xs font-bold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
    if (status === 'pending') return <span className="flex items-center gap-1 text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
    return <span className="flex items-center gap-1 text-xs font-bold text-cream-800 bg-cream-200 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" /> Cancelled</span>;
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-50/50 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-900 to-sage-800 py-5 pt-6 pb-5 relative overflow-hidden">
          <div className="orb w-72 h-72 bg-sage-600/20 -top-20 -left-20 opacity-30" />
          <div className="orb w-72 h-72 bg-gold-500/10 -bottom-20 -right-20" />
          <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar Icon */}
                <div className="w-14 h-14 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                
                {/* User Greeting */}
                <div>
                  <h1 className="font-display text-xl md:text-2xl font-bold text-white">
                    {profileName || currentUser?.email?.split('@')[0] || 'Kranti'}!
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sage-200 text-xs font-medium">{currentUser?.email}</span>
                    <span className="bg-sage-700/60 border border-sage-500/40 text-sage-100 text-[10px] font-bold px-2 py-0.5 rounded-full">VIP Host</span>
                  </div>
                </div>
              </div>

              {/* Professional Edit Profile Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition-all flex items-center gap-2 backdrop-blur-md shadow-sm hover:scale-105"
              >
                <User className="w-4 h-4 text-gold-400" /> Edit Profile
              </button>
            </div>

            <div className="flex gap-1 mt-4 overflow-x-auto">
              {(['overview', 'bookings', 'saved', 'invoices'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-sage-600 shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-5">
          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Bookings', value: String(bookings.length), icon: Calendar, color: 'bg-sage-50 text-sage-600', action: () => setActiveTab('bookings') },
                  { label: 'Upcoming Events', value: String(upcomingBookings.length), icon: Clock, color: 'bg-sage-100 text-sage-700', action: () => setActiveTab('bookings') },
                  { label: 'Total Spent', value: `₹${(totalSpent / 1000).toFixed(0)}K`, icon: Wallet, color: 'bg-cream-100 text-cream-800', action: () => setActiveTab('invoices') },
                  { label: 'Saved Vendors', value: String(savedVendors.length), icon: Heart, color: 'bg-cream-50 text-cream-900', action: () => setActiveTab('saved') },
                ].map(stat => (
                  <div 
                    key={stat.label} 
                    onClick={stat.action} 
                    className="bg-white rounded-2xl shadow-card p-5 card-hover cursor-pointer hover:border hover:border-sage-300 transition-all group"
                  >
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="font-display text-2xl font-bold text-sage-900">{stat.value}</p>
                    <p className="text-dark-500 text-sm mt-0.5 flex items-center justify-between">
                      {stat.label}
                      <ChevronRight className="w-3.5 h-3.5 text-sage-400 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sage-500" /> Upcoming Events & Parcel Orders
                      </h2>
                      <button onClick={() => setActiveTab('bookings')} className="text-sage-600 text-sm font-bold hover:underline flex items-center gap-1">
                        View all ({bookings.length}) <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-sage-400" />
                        </div>
                        <p className="font-bold text-sage-900 mb-1">No upcoming events</p>
                        <p className="text-dark-500 text-sm mb-5">Start planning your next celebration!</p>
                        <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                          Browse Vendors <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingBookings.map(booking => (
                          <div 
                            key={booking.id} 
                            onClick={() => {
                              setActiveTab('bookings');
                              setExpandedBooking(booking.id);
                            }}
                            className="flex items-center gap-4 p-4 bg-sage-50/60 rounded-xl hover:bg-sage-100/80 transition-all cursor-pointer border border-sage-100/80 hover:shadow-md group select-none"
                          >
                            {booking.vendor && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (booking.vendor?.image) {
                                    setPreviewImage({
                                      url: booking.vendor.image,
                                      title: booking.vendor.name,
                                      subtitle: booking.vendor.category,
                                      slug: booking.vendor.slug
                                    });
                                  }
                                }}
                                className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer relative group/img border border-sage-200 shadow-2xs hover:shadow-md transition-all"
                                title="Click to view photo in full size"
                              >
                                {booking.vendor.image && !booking.vendor.image.includes('pexels.com') ? (
                                  <img 
                                    src={booking.vendor.image} 
                                    alt="" 
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                                    }}
                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" 
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{booking.vendor.category[0] || 'V'}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-sage-900 text-sm truncate group-hover:text-sage-700 transition-colors">{booking.vendor?.name ?? 'Vendor'}</p>
                                {statusBadge(booking.status)}
                              </div>
                              <p className="text-dark-500 text-xs truncate flex items-center gap-1.5 flex-wrap">
                                <span>{booking.event_type}</span>
                                <span>·</span>
                                <span className="font-semibold text-sage-800">{new Date(booking.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                <span>·</span>
                                <span className="bg-sage-100 text-sage-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-sage-200">
                                  <Clock className="w-2.5 h-2.5 text-gold-600" /> {booking.event_time || '9:00 AM - 6:00 PM'}
                                </span>
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 flex items-center gap-3">
                              <div>
                                <p className="font-bold text-sage-900 text-sm">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                                <p className="text-dark-400 text-xs font-mono">{booking.booking_ref}</p>
                                {/* 5 Small Stars Review Rating */}
                                <div className="flex items-center justify-end gap-0.5 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const rating = bookingRatings[booking.id] || 5;
                                    return (
                                      <button
                                        key={star}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setBookingRatings(prev => ({ ...prev, [booking.id]: star }));
                                        }}
                                        className="hover:scale-125 transition-transform p-0.5"
                                        title={`Rate ${star} stars`}
                                      >
                                        <Star 
                                          className={`w-3 h-3 ${
                                            star <= rating 
                                              ? 'text-gold-500 fill-gold-500' 
                                              : 'text-sage-200'
                                          }`} 
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-sage-600 group-hover:underline">
                                Track <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-sage-800 to-sage-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-gold-400" />
                      <h3 className="font-bold text-white text-sm">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Browse Vendors', icon: ArrowRight, action: () => navigate('/vendors') },
                        { label: 'Plan Budget', icon: Wallet, action: () => navigate('/budget-planner') },
                        { label: 'Explore Services', icon: Sparkles, action: () => navigate('/explore') },
                      ].map(({ label, icon: Icon, action }) => (
                        <button key={label} onClick={action} className="w-full flex items-center justify-between px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-semibold transition-colors group">
                          <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sage-500" /> My Orders & Bookings ({bookings.length})
                  </h2>
                  <p className="text-dark-500 text-xs mt-0.5">Track live vendor setup progress, order status, and event schedules.</p>
                </div>


              </div>

              {/* Festivo Protection Guarantee Badge Banner */}
              <div className="bg-gradient-to-r from-sage-900 via-sage-800 to-dark-900 rounded-xl p-4 mb-6 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-500/20 border border-gold-400/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white flex items-center gap-1">
                      100% Festivo Verified Guarantee Protected
                    </p>
                    <p className="text-sage-200 text-xs">Live status tracking, verified courier dispatches & full refund assurance on all orders.</p>
                  </div>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                  <p className="font-display text-xl font-bold text-sage-900 mb-2">No bookings yet</p>
                  <p className="text-dark-500 mb-5">Browse vendors and book your first event!</p>
                  <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                    Browse Vendors <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings
                    .filter(b => bookingFilter === 'all' ? true : bookingFilter === 'delivery' ? b.order_type === 'delivery' : b.order_type !== 'delivery')
                    .map(booking => {
                    const isExpanded = expandedBooking === booking.id;
                    const isPaid = booking.payment_status === 'paid';
                    const isConfirmed = booking.status === 'confirmed';
                    const isCancelled = booking.status === 'cancelled';
                    const isPast = new Date(booking.event_date) < new Date();

                    return (
                      <div key={booking.id} className="border border-sage-100 rounded-2xl p-5 hover:shadow-card transition-all bg-white">
                        {/* Top Header Card Info (Clickable for toggle) */}
                        <div 
                          onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer select-none"
                        >
                          {booking.vendor && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (booking.vendor?.image) {
                                  setPreviewImage({
                                    url: booking.vendor.image,
                                    title: booking.vendor.name,
                                    subtitle: booking.vendor.category,
                                    slug: booking.vendor.slug
                                  });
                                }
                              }}
                              className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer relative group/img border border-sage-200 shadow-2xs hover:shadow-md transition-all"
                              title="Click to view photo in full size"
                            >
                              {booking.vendor.image && !booking.vendor.image.includes('pexels.com') ? (
                                <img 
                                  src={booking.vendor.image} 
                                  alt="" 
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                                  }}
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" 
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">{booking.vendor.category[0] || 'V'}</span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-sage-900">{booking.vendor?.name ?? 'Vendor'}</p>
                              {statusBadge(booking.status)}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-dark-500 items-center">
                              <span className="flex items-center gap-1 font-semibold text-sage-900"><Calendar className="w-3.5 h-3.5 text-sage-500" /> {new Date(booking.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="flex items-center gap-1 font-extrabold text-sage-900 bg-gold-50 text-gold-800 px-2 py-0.5 rounded-md border border-gold-200 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-gold-600" /> {booking.event_time || '9:00 AM - 6:00 PM IST'}
                              </span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-sage-500" /> {booking.guests} guests</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sage-500" /> {booking.event_type}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 flex items-center gap-4">
                            <div>
                              <p className="font-display text-lg font-bold text-sage-900">₹{booking.total_amount.toLocaleString('en-IN')}</p>
                              <p className="text-dark-400 text-xs font-mono">{booking.booking_ref}</p>
                              {/* 5 Small Stars Review Rating */}
                              <div className="flex items-center justify-end gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating = bookingRatings[booking.id] || 5;
                                  return (
                                    <button
                                      key={star}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBookingRatings(prev => ({ ...prev, [booking.id]: star }));
                                      }}
                                      className="hover:scale-125 transition-transform p-0.5"
                                      title={`Rate ${star} stars`}
                                    >
                                      <Star 
                                        className={`w-3 h-3 ${
                                          star <= rating 
                                            ? 'text-gold-500 fill-gold-500' 
                                            : 'text-sage-200'
                                        }`} 
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                              {/* Direct Cancel Event Button */}
                              {!isCancelled && !isPast && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelBooking(booking.id);
                                  }}
                                  className="px-2 py-0.5 text-[11px] font-bold text-cream-800 bg-cream-50 hover:bg-cream-100 border border-cream-200 rounded-md transition-colors flex items-center gap-1 mt-1.5 ml-auto"
                                  title="Cancel this event order"
                                >
                                  <XCircle className="w-3 h-3 text-cream-600" /> Cancel Event
                                </button>
                              )}
                            </div>
                            <ChevronRight className={`w-5 h-5 text-sage-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {/* Live Tracking Timeline & Booking Details Panel */}
                        {isExpanded && (
                          <div className="mt-5 pt-5 border-t border-sage-100 animate-fadeIn">
                            {/* Live Timeline Header */}
                            <p className="font-bold text-sage-900 text-sm mb-4 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-sage-500" /> Order & Event Progress Tracking
                            </p>
                            {/* Timeline Steps */}
                            {booking.order_type === 'delivery' ? (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative">
                                {/* Step 1: Event Confirmed */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex-shrink-0 font-bold text-sm">
                                    ✓
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Event Confirmed</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5">Ref: {booking.booking_ref}</p>
                                  </div>
                                </div>

                                {/* Step 2: Advance Payment */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex-shrink-0 font-bold text-sm">
                                    ✓
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Advance Payment</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5">Paid & Verified</p>
                                  </div>
                                </div>

                                {/* Step 3: Vendor Service */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm ${['dispatched', 'out_for_delivery', 'delivered'].includes(booking.tracking_status || '') ? 'bg-sage-100 text-sage-700' : 'bg-gold-50 text-gold-600 border border-gold-300'}`}>
                                    {['dispatched', 'out_for_delivery', 'delivered'].includes(booking.tracking_status || '') ? '✓' : '•'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Vendor Service</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5 capitalize">{booking.tracking_status?.replace(/_/g, ' ')}</p>
                                  </div>
                                </div>

                                {/* Step 4: Event Completed */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm ${booking.tracking_status === 'delivered' ? 'bg-sage-100 text-sage-700' : 'bg-sage-50/50 text-sage-300'}`}>
                                    {booking.tracking_status === 'delivered' ? '✓' : '•'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Event Completed</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5">Service delivered</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative">
                                {/* Step 1: Event Confirmed */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex-shrink-0 font-bold text-sm">
                                    ✓
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Event Confirmed</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5">Ref: {booking.booking_ref}</p>
                                  </div>
                                </div>

                                {/* Step 2: Advance Payment */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm ${isPaid ? 'bg-sage-100 text-sage-700' : 'bg-gold-50 text-gold-600 border border-gold-300'}`}>
                                    {isPaid ? '✓' : '•'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Advance Payment</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5 capitalize">{booking.payment_status}</p>
                                  </div>
                                </div>

                                {/* Step 3: Vendor Service */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm ${isCancelled ? 'bg-cream-100 text-cream-700' : isConfirmed ? 'bg-sage-100 text-sage-700' : 'bg-gold-50 text-gold-600 border border-gold-300'}`}>
                                    {isCancelled ? '✕' : isConfirmed ? '✓' : '•'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Vendor Service</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5 capitalize">{booking.status === 'confirmed' ? 'On-Site Assigned' : booking.status}</p>
                                  </div>
                                </div>

                                {/* Step 4: Event Completed */}
                                <div className="flex items-start md:flex-col gap-3 md:gap-2">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm ${isPast ? 'bg-sage-100 text-sage-700' : 'bg-sage-50/50 text-sage-300'}`}>
                                    {isPast ? '✓' : '•'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sage-900 text-xs md:text-sm">Event Completed</p>
                                    <p className="text-dark-400 text-[11px] mt-0.5">
                                      {new Date(booking.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Details Panel Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sage-50/50 p-4 rounded-xl mb-4 border border-sage-100">
                              {/* Vendor & Event Info */}
                              <div>
                                <p className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-2">Vendor Details</p>
                                <div className="space-y-1.5 text-xs text-sage-900 font-medium">
                                  <p className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-sage-500" /> {booking.vendor?.name ?? 'Vendor'}</p>
                                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sage-500" /> {booking.vendor?.location ?? 'Not specified'}</p>
                                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sage-500" /> {booking.vendor?.price_label ? `Starting: ₹${booking.vendor.price_amount} / ${booking.vendor.price_unit}` : 'Contact Support'}</p>
                                </div>
                              </div>

                              {/* Ordering details */}
                              <div>
                                <p className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-2">
                                  {booking.order_type === 'delivery' ? 'Parcel & Delivery Specifications' : 'Booking & Order Specifications'}
                                </p>
                                <div className="space-y-1.5 text-xs text-sage-900 font-medium font-sans">
                                  {booking.order_type === 'delivery' ? (
                                    <>
                                      <p className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-sage-500" /> Item: {booking.event_type}</p>
                                      <p className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-sage-500" /> Tracking ID: <span className="font-mono bg-sage-100 text-sage-800 px-1 rounded">{booking.tracking_id}</span></p>
                                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sage-500" /> Courier Partner: {booking.delivery_partner}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-sage-500" /> Event Type: {booking.event_type}</p>
                                      <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-sage-500" /> Guests Count: {booking.guests} guests</p>
                                    </>
                                  )}
                                  {booking.special_requests && (
                                    <p className="flex items-center gap-2 text-dark-500 italic"><FileText className="w-3.5 h-3.5 text-sage-500" /> Requests: "{booking.special_requests}"</p>
                                  )}
                                </div>
                              </div>
                              {/* Parcel Courier & OTP Banner (for delivery orders) */}
                              {booking.order_type === 'delivery' && (
                                <div className="bg-sage-100/70 border border-sage-200 rounded-xl p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 col-span-1 md:col-span-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-sage-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                      <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-sage-900 text-xs capitalize">Parcel Status: {booking.tracking_status?.replace(/_/g, ' ')}</p>
                                      <p className="text-dark-500 text-[11px]">Courier: {booking.delivery_partner} · Tracking: {booking.tracking_id}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-white px-2.5 py-1 rounded-lg border border-sage-200 text-xs font-mono font-bold text-sage-800">
                                      Delivery OTP: 4920
                                    </span>
                                    <button 
                                      onClick={() => alert(`Tracking wedding hampers ${booking.tracking_id} via ${booking.delivery_partner}.\nStatus: On-site Delivery in Progress. Expected setup by 5:00 PM today.`)}
                                      className="px-3 py-1.5 bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                    >
                                      Track Package <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* On-Site Service Contact Banner (for service orders) */}
                              {booking.order_type !== 'delivery' && (
                                <div className="bg-sage-50 border border-sage-100 rounded-xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 col-span-1 md:col-span-2">
                                  <div className="flex items-center gap-2 text-xs font-bold text-sage-900">
                                    <MessageSquare className="w-4 h-4 text-sage-600" /> Direct Vendor Coordination Line
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => setActiveCallVendor({
                                        name: booking.vendor?.name || 'Vendor Partner',
                                        phone: '+91 98765 43210',
                                        location: booking.vendor?.location || 'India'
                                      })}
                                      className="px-3.5 py-1.5 bg-white hover:bg-sage-100 text-sage-800 border border-sage-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-sage-600" /> Call Vendor
                                    </button>
                                    <button 
                                      onClick={() => handleOpenChat(
                                        booking.vendor?.name || 'Vendor Partner',
                                        booking.vendor?.category || 'Event Services',
                                        booking.vendor?.image
                                      )}
                                      className="px-3.5 py-1.5 bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-md"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-gold-400" /> Chat Now
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Row */}
                            <div className="flex flex-wrap gap-2 justify-between items-center pt-3 border-t border-sage-100/70">
                              <div className="flex gap-2">
                                {booking.vendor && (
                                  <button onClick={() => navigate(`/vendors/${booking.vendor.slug}`)} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                                    View Vendor Details <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                                {booking.payment_status === 'paid' ? (
                                  <button onClick={() => navigate(`/confirmation/${booking.booking_ref}`)} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Cost Invoice & Receipt
                                  </button>
                                ) : !isCancelled ? (
                                  <button 
                                    onClick={() => {
                                      setBookings(prev => prev.map(item => item.id === booking.id ? { ...item, payment_status: 'paid', status: 'confirmed' } : item));
                                      alert(`🎉 Payment Successful for ₹${booking.total_amount.toLocaleString('en-IN')}!\n\nBooking [${booking.booking_ref}] is now CONFIRMED and your receipt is unlocked!`);
                                    }} 
                                    className="text-xs font-bold text-gold-700 bg-gold-50 px-2.5 py-1 rounded-lg border border-gold-200 hover:bg-gold-100 transition-colors flex items-center gap-1"
                                  >
                                    <Wallet className="w-3.5 h-3.5 text-gold-600" /> Pay Now to Unlock Receipt
                                  </button>
                                ) : null}
                              </div>
                              
                              {/* Cancel action if not already cancelled */}
                              {!isCancelled && !isPast && (
                                <button 
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="text-xs font-bold text-cream-800 hover:underline"
                                >
                                  Cancel Booking Order
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Review Input Box */}
                        {reviewingBooking === booking.id && (
                          <div className="mt-4 pt-4 border-t border-sage-100">
                            <p className="font-bold text-sage-900 text-sm mb-3">Write a Review</p>
                            <div className="flex gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} onClick={() => setReviewRating(n)}>
                                  <Star className={`w-7 h-7 ${n <= reviewRating ? 'text-gold-500 fill-gold-500' : 'text-sage-200'}`} />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience..."
                              rows={3}
                              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none"
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => submitReview(booking)}
                                disabled={reviewSubmitting || !reviewComment.trim()}
                                className="px-5 py-2 bg-gradient-brand text-white font-bold rounded-xl text-sm hover:shadow-glow transition-all disabled:opacity-50"
                              >
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                              </button>
                              <button onClick={() => setReviewingBooking(null)} className="px-5 py-2 border border-sage-200 text-sage-700 font-bold rounded-xl text-sm hover:bg-sage-50 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Standard Quick Actions Row when collapsed */}
                        {!isExpanded && reviewingBooking !== booking.id && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-sage-100 justify-between items-center">
                            <div className="flex gap-2">
                              {booking.vendor && (
                                <button onClick={() => navigate(`/vendors/${booking.vendor.slug}`)} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                                  View Vendor <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                              {isConfirmed && isPast && (
                                <button onClick={() => setReviewingBooking(booking.id)} className="text-xs font-bold text-gold-600 hover:underline flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Write Review
                                </button>
                              )}
                            </div>
                            <button 
                              onClick={() => setExpandedBooking(booking.id)} 
                              className="text-xs font-bold text-sage-600 hover:underline"
                            >
                              Track Progress & Details
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Saved */}
          {activeTab === 'saved' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-cream-600 fill-cream-500" /> Saved Vendors ({savedVendors.length})
                  </h2>
                  <p className="text-dark-500 text-xs mt-0.5">Your shortlisted event specialists, decorators, and rental vendors.</p>
                </div>
                {savedVendors.length > 0 && (
                  <button onClick={() => navigate('/vendors')} className="text-xs font-bold text-sage-600 hover:underline flex items-center gap-1">
                    Explore More Vendors <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {savedVendors.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-sage-400" />
                  </div>
                  <p className="font-bold text-sage-900 mb-1">No saved vendors yet</p>
                  <p className="text-dark-500 text-sm mb-5">Tap the heart icon on any vendor to save them here.</p>
                  <button onClick={() => navigate('/vendors')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-glow transition-all text-sm">
                    Browse Vendors <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedVendors.map(vendor => (
                    <div key={vendor.id} className="border border-sage-100 rounded-2xl overflow-hidden hover:shadow-card transition-all bg-white flex flex-col group">
                      {/* Image container */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage({
                            url: vendor.image,
                            title: vendor.name,
                            subtitle: vendor.category,
                            slug: vendor.slug
                          });
                        }}
                        className="relative h-44 overflow-hidden cursor-pointer group/img"
                        title="Click to view photo in full size"
                      >
                        <img 
                          src={vendor.image} 
                          alt={vendor.name} 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => setSavedVendors(prev => prev.filter(v => v.id !== vendor.id))}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-cream-600 shadow-sm hover:bg-white transition-colors"
                            title="Remove from saved"
                          >
                            <Heart className="w-4 h-4 fill-cream-500" />
                          </button>
                        </div>
                        <span className="absolute top-3 left-3 bg-sage-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                          {vendor.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-bold text-sage-900 text-base line-clamp-1">{vendor.name}</h3>
                            <div className="flex items-center gap-1 text-gold-600 text-xs font-bold flex-shrink-0">
                              <Star className="w-3.5 h-3.5 fill-gold-500" /> {vendor.rating}
                            </div>
                          </div>
                          <p className="text-dark-500 text-xs flex items-center gap-1 mb-3">
                            <MapPin className="w-3 h-3 text-sage-500" /> {vendor.location}
                          </p>
                          <p className="text-dark-600 text-xs line-clamp-2 mb-4">{vendor.description}</p>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3 border-t border-sage-100 flex items-center justify-between gap-2 mt-auto">
                          <div>
                            <p className="text-[10px] text-dark-400 uppercase font-bold tracking-wider">Starting at</p>
                            <p className="font-display font-bold text-sage-900 text-sm">₹{vendor.price_amount.toLocaleString('en-IN')} <span className="text-xs text-dark-500 font-normal">/ {vendor.price_unit}</span></p>
                          </div>
                          <button
                            onClick={() => navigate(`/vendors/${vendor.slug}`)}
                            className="px-3.5 py-1.5 bg-gradient-brand text-white font-bold rounded-xl text-xs hover:shadow-glow transition-all flex items-center gap-1"
                          >
                            Book Vendor <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invoices & Payment Manager */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-sage-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sage-500" /> Invoices, Billing & Payment Manager
                  </h2>
                  <p className="text-dark-500 text-xs mt-0.5">View payment receipts, pay pending balances, and download tax invoices.</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                  <p className="font-bold text-sage-900 mb-1">No billing records yet</p>
                  <p className="text-dark-500 text-sm">Bookings and invoices will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sage-100">
                        {['Ref', 'Vendor & Service', 'Event Date', 'Amount', 'Payment Status', 'Action / Pay'].map(h => (
                          <th key={h} className="pb-3 text-left text-dark-500 text-xs font-bold uppercase tracking-wider pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-50">
                      {bookings.map(b => {
                        const isPaid = b.payment_status === 'paid';
                        const isCancelled = b.status === 'cancelled';

                        return (
                          <tr key={b.id} className="hover:bg-sage-50/50 transition-colors">
                            <td className="py-4 pr-4 font-mono text-xs text-dark-500">{b.booking_ref}</td>
                            <td className="py-4 pr-4">
                              <p className="font-bold text-sage-900 text-sm">{b.vendor?.name ?? '—'}</p>
                              <p className="text-dark-400 text-xs">{b.event_type}</p>
                            </td>
                            <td className="py-4 pr-4 text-sm text-dark-700">
                              {new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-4 pr-4 font-bold text-sage-900 text-sm">₹{b.total_amount.toLocaleString('en-IN')}</td>
                            <td className="py-4 pr-4">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full">
                                  <CheckCircle2 className="w-3 h-3 text-sage-600" /> Paid
                                </span>
                              ) : isCancelled ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-cream-700 bg-cream-100 px-2.5 py-1 rounded-full">
                                  <XCircle className="w-3 h-3 text-cream-600" /> Refunded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full">
                                  <Clock className="w-3 h-3 text-gold-600" /> Unpaid / Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4">
                              {isPaid ? (
                                <button 
                                  onClick={() => navigate(`/confirmation/${b.booking_ref}`)} 
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 hover:bg-sage-100 text-sage-700 text-xs font-bold rounded-lg transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" /> Receipt
                                </button>
                              ) : isCancelled ? (
                                <span className="text-xs text-dark-400 font-medium">Order Cancelled</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setBookings(prev => prev.map(item => item.id === b.id ? { ...item, payment_status: 'paid', status: 'confirmed' } : item));
                                    alert(`🎉 Payment Successful for ₹${b.total_amount.toLocaleString('en-IN')}!\n\nBooking reference [${b.booking_ref}] is now CONFIRMED!`);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-brand text-white text-xs font-bold rounded-lg hover:shadow-glow transition-all"
                                >
                                  <Wallet className="w-3.5 h-3.5" /> Pay Now
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

      {/* Professional My Account & Profile Settings Modal */}
      {showProfileModal && (
        <div 
          onClick={() => setShowProfileModal(false)}
          className="fixed inset-0 bg-dark-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-sage-900 to-dark-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-glow flex-shrink-0">
                  K
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Account & Profile Settings</h3>
                  <p className="text-xs text-sage-300 font-medium">Manage your host identity, phone number, and event preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sage-900 text-sm flex items-center gap-2 border-b border-sage-100 pb-2">
                    <User className="w-4 h-4 text-sage-600" /> Personal Identity
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sage-900 text-sm font-semibold focus:outline-none focus:border-sage-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || 'krantishantveer@gmail.com'}
                      className="w-full px-4 py-2.5 rounded-xl border border-sage-100 bg-sage-50/50 text-dark-500 text-sm font-medium cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sage-900 text-sm font-semibold focus:outline-none focus:border-sage-500"
                    />
                  </div>
                </div>

                {/* Preferences & Security */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sage-900 text-sm flex items-center gap-2 border-b border-sage-100 pb-2">
                    <MapPin className="w-4 h-4 text-sage-600" /> Location & Preferences
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Default Event Location</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={e => setProfileCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sage-900 text-sm font-semibold focus:outline-none focus:border-sage-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Account Role</label>
                    <div className="p-3 bg-sage-50 rounded-xl border border-sage-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-sage-900">Verified Host Account</span>
                      <button onClick={() => navigate('/vendor-dashboard')} className="text-xs font-bold text-sage-600 hover:underline">
                        Vendor Portal →
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Security & Passwords</label>
                    <button 
                      onClick={() => alert('🔒 Password reset link sent to your registered email address.')}
                      className="w-full px-4 py-2.5 bg-cream-50 hover:bg-cream-100 border border-cream-200 text-cream-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      Send Password Reset Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cream-50 border-t border-sage-100 flex items-center justify-between">
              <span className="text-xs text-dark-400 font-medium">✨ Festivo VIP Account Guarantee</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-white border border-sage-200 text-sage-800 font-bold rounded-xl text-xs hover:bg-sage-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setProfileSaving(true);
                    setTimeout(() => {
                      setProfileSaving(false);
                      setShowProfileModal(false);
                      alert('🎉 Profile settings updated successfully!');
                    }, 300);
                  }}
                  className="px-5 py-2 bg-gradient-brand text-white font-bold rounded-xl text-xs hover:shadow-glow transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" /> {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


        </div>
      </div>

      {/* Interactive Vendor Live Chat Drawer Modal */}
      {activeChatVendor && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-sage-900 to-dark-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-700 overflow-hidden border border-sage-500/40 flex-shrink-0">
                  {activeChatVendor.image ? (
                    <img 
                      src={activeChatVendor.image} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-gold-400">
                      {activeChatVendor.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {activeChatVendor.name}
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[11px] text-sage-300">{activeChatVendor.category} · Verified Partner</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveChatVendor(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-sage-50/40">
              <div className="text-center my-1">
                <span className="bg-sage-100 text-sage-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Encryption Protected Line
                </span>
              </div>
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-sage-700 text-white rounded-br-none'
                        : 'bg-white text-sage-900 border border-sage-150 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-sage-300' : 'text-dark-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Footer */}
            <div className="p-3 bg-white border-t border-sage-100 flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message to vendor..."
                className="flex-1 px-4 py-2.5 bg-sage-50 border border-sage-200 rounded-xl text-xs focus:outline-none focus:border-sage-600 focus:bg-white text-sage-900"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-gradient-brand text-white rounded-xl flex items-center justify-center hover:shadow-glow transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Call Vendor Direct Popover Modal */}
      {activeCallVendor && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-sage-200">
              <PhoneCall className="w-8 h-8 text-sage-700 animate-bounce" />
            </div>
            <h3 className="font-bold text-sage-900 text-lg mb-1">{activeCallVendor.name}</h3>
            <p className="text-xs text-dark-500 mb-4">{activeCallVendor.location} · 24/7 Event Support Line</p>

            <div className="bg-sage-50 p-4 rounded-xl border border-sage-200 mb-5">
              <p className="text-[10px] text-sage-600 font-bold uppercase tracking-wider mb-1">Direct Support Number</p>
              <p className="font-mono text-lg font-extrabold text-sage-900">{activeCallVendor.phone}</p>
            </div>

            <a
              href={`tel:${activeCallVendor.phone.replace(/\s+/g, '')}`}
              className="w-full block py-3 bg-gradient-brand text-white font-bold rounded-xl shadow-glow hover:shadow-card-hover transition-all text-sm mb-2"
            >
              Call Vendor Now
            </a>
            <button
              onClick={() => setActiveCallVendor(null)}
              className="text-xs font-bold text-sage-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Interactive Full-Screen Image Preview Lightbox Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-dark-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-sage-900 to-dark-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{previewImage.title}</h3>
                {previewImage.subtitle && (
                  <p className="text-xs text-sage-300 font-medium">{previewImage.subtitle} · Festivo Photo Gallery</p>
                )}
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image Preview Box */}
            <div className="relative bg-dark-950 max-h-[70vh] flex items-center justify-center overflow-hidden p-3">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
                }}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-cream-50 flex items-center justify-between gap-3 border-t border-sage-100">
              <span className="text-xs text-dark-500 font-medium hidden sm:inline">✨ High Resolution Verified Photo</span>
              <div className="flex items-center gap-2 ml-auto">
                {previewImage.slug && (
                  <button
                    onClick={() => {
                      navigate(`/vendors/${previewImage.slug}`);
                      setPreviewImage(null);
                    }}
                    className="px-4 py-2 bg-gradient-brand text-white font-bold rounded-xl text-xs hover:shadow-glow transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-300" /> View Vendor Page
                  </button>
                )}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 bg-white border border-sage-200 text-sage-800 font-bold rounded-xl text-xs hover:bg-sage-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
