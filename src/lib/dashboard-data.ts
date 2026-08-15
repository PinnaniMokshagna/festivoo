export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface NavItem {
  label: string;
  icon: string;
}

export interface SummaryCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  accent: 'sage' | 'gold' | 'dark';
  change?: string;
  trend?: 'up' | 'down';
}

export interface UpcomingEvent {
  id: string;
  customer: string;
  type: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  status: BookingStatus;
}

export interface BookingRequest {
  id: string;
  customer: string;
  avatar: string;
  service: string;
  budget: string;
  eventDate: string;
  status: BookingStatus;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
}

export interface Review {
  id: string;
  customer: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  reply?: string;
  reply_date?: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  services: string[];
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'payment' | 'booking' | 'review' | 'package';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Verify Documents', icon: 'ShieldCheck' },
  { label: 'Bookings', icon: 'CalendarCheck' },
  { label: 'Calendar', icon: 'CalendarDays' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'Portfolio', icon: 'Images' },
  { label: 'Packages', icon: 'Package' },
  { label: 'Reviews', icon: 'Star' },
  { label: 'Earnings', icon: 'Wallet' },
  { label: 'Analytics', icon: 'BarChart3' },
  { label: 'Deals', icon: 'Tag' },
  { label: 'Settings', icon: 'Settings' },
  { label: 'Support', icon: 'LifeBuoy' },
];

export const summaryCards: SummaryCard[] = [
  {
    id: 'requests',
    label: 'New Requests',
    value: '12',
    icon: 'BellRing',
    accent: 'sage',
    change: '+3 today',
    trend: 'up',
  },
  {
    id: 'confirmed',
    label: 'Confirmed Bookings',
    value: '28',
    icon: 'CalendarCheck',
    accent: 'sage',
    change: '+5 this week',
    trend: 'up',
  },
  {
    id: 'earnings',
    label: "Today's Earnings",
    value: '₹48,250',
    icon: 'IndianRupee',
    accent: 'gold',
    change: '+12% vs avg',
    trend: 'up',
  },
  {
    id: 'rating',
    label: 'Average Rating',
    value: '4.9',
    icon: 'Star',
    accent: 'gold',
    change: '312 reviews',
    trend: 'up',
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    customer: 'Ananya Sharma',
    type: 'Wedding Photography',
    date: 'Aug 12, 2026',
    time: '9:00 AM',
    location: 'The Leela Palace, Udaipur',
    budget: '₹1,20,000',
    status: 'confirmed',
  },
  {
    id: '2',
    customer: 'Rohan Mehta',
    type: 'Corporate Event',
    date: 'Aug 14, 2026',
    time: '11:00 AM',
    location: 'JW Marriott, Mumbai',
    budget: '₹85,000',
    status: 'pending',
  },
  {
    id: '3',
    customer: 'Priya Iyer',
    type: 'Birthday Celebration',
    date: 'Aug 18, 2026',
    time: '6:00 PM',
    location: 'Taj Coromandel, Chennai',
    budget: '₹45,000',
    status: 'confirmed',
  },
  {
    id: '4',
    customer: 'Karthik Reddy',
    type: 'Reception Coverage',
    date: 'Aug 22, 2026',
    time: '5:00 PM',
    location: 'Park Hyatt, Hyderabad',
    budget: '₹95,000',
    status: 'pending',
  },
];

export const bookingRequests: BookingRequest[] = [
  {
    id: '1',
    customer: 'Meera Nair',
    avatar: 'MN',
    service: 'Wedding Decor',
    budget: '₹2,50,000',
    eventDate: 'Sep 5, 2026',
    status: 'pending',
  },
  {
    id: '2',
    customer: 'Arjun Kapoor',
    avatar: 'AK',
    service: 'Catering (200 pax)',
    budget: '₹1,80,000',
    eventDate: 'Sep 10, 2026',
    status: 'pending',
  },
  {
    id: '3',
    customer: 'Sneha Gupta',
    avatar: 'SG',
    service: 'Makeup & Styling',
    budget: '₹35,000',
    eventDate: 'Aug 28, 2026',
    status: 'pending',
  },
  {
    id: '4',
    customer: 'Vikram Singh',
    avatar: 'VS',
    service: 'DJ & Sound',
    budget: '₹75,000',
    eventDate: 'Sep 15, 2026',
    status: 'pending',
  },
];

export const scheduleItems: ScheduleItem[] = [
  { id: '1', time: '10:00 AM', title: 'Wedding Shoot', location: 'The Leela Palace' },
  { id: '2', time: '2:00 PM', title: 'Venue Visit', location: 'JW Marriott' },
  { id: '3', time: '6:00 PM', title: 'Reception Coverage', location: 'Taj Coromandel' },
];

export const reviews: Review[] = [
  {
    id: '1',
    customer: 'Ananya Sharma',
    avatar: 'AS',
    rating: 5,
    text: 'Absolutely stunning work! Every moment was captured beautifully. Highly recommend for any wedding.',
    date: '2 days ago',
  },
  {
    id: '2',
    customer: 'Rohan Mehta',
    avatar: 'RM',
    rating: 5,
    text: 'Professional, punctual, and incredibly talented. The corporate event photos exceeded our expectations.',
    date: '5 days ago',
  },
];

export const packages: Package[] = [
  {
    id: '1',
    name: 'Wedding Premium',
    price: '₹1,20,000',
    services: ['Full Day Coverage', '2 Photographers', 'Cinematic Video', '500 Edited Photos', 'Drone Shots'],
    popular: true,
  },
  {
    id: '2',
    name: 'Corporate',
    price: '₹85,000',
    services: ['6 Hour Coverage', '1 Photographer', '200 Edited Photos', 'Same Day Teasers'],
  },
  {
    id: '3',
    name: 'Birthday',
    price: '₹45,000',
    services: ['4 Hour Coverage', '1 Photographer', '100 Edited Photos', '1 Min Reel'],
  },
];

export const notifications: NotificationItem[] = [
  { id: '1', type: 'payment', title: 'Payment Received', message: '₹1,20,000 from Ananya Sharma', time: '5 min ago', unread: true },
  { id: '2', type: 'booking', title: 'New Booking Request', message: 'Meera Nair requested Wedding Decor', time: '1 hour ago', unread: true },
  { id: '3', type: 'review', title: 'New Review Added', message: 'Rohan Mehta rated you 5 stars', time: '3 hours ago', unread: true },
  { id: '4', type: 'package', title: 'Package Viewed', message: 'Wedding Premium viewed 12 times this week', time: '1 day ago', unread: false },
];

export const earningsData = [
  { day: 'Mon', value: 32000 },
  { day: 'Tue', value: 41000 },
  { day: 'Wed', value: 38000 },
  { day: 'Thu', value: 52000 },
  { day: 'Fri', value: 48000 },
  { day: 'Sat', value: 65000 },
  { day: 'Sun', value: 42000 },
];

export const profileTasks = [
  { id: '1', label: 'Upload Portfolio', done: true },
  { id: '2', label: 'Verify Documents', done: true },
  { id: '3', label: 'Add Packages', done: true },
  { id: '4', label: 'Bank Verification', done: false },
];

export const portfolioImages = [
  { id: '1', query: 'indian wedding photography ceremony' },
  { id: '2', query: 'elegant event decoration flowers' },
  { id: '3', query: 'corporate event stage lighting' },
  { id: '4', query: 'birthday party celebration decoration' },
  { id: '5', query: 'bridal makeup portrait indian' },
  { id: '6', query: 'dj night party lights' },
];
