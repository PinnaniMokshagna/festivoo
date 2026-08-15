import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  upcomingEvents,
  bookingRequests,
  scheduleItems,
  reviews as initialReviews,
  packages as initialPackages,
  notifications as initialNotifications,
  portfolioImages,
  profileTasks as initialProfileTasks,
  type BookingStatus,
  type NotificationItem,
  type Package,
  type Review,
} from '@/lib/dashboard-data';

export interface ExtendedBooking {
  id: string;
  customer: string;
  avatar?: string;
  type: string;
  date: string;
  time: string;
  location: string;
  budget: string;
  status: BookingStatus;
  notes?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  time: string;
  date: string;
  location: string;
  customer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'vendor' | 'customer';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  customerName: string;
  avatar: string;
  service: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  views: number;
  likes: number;
  date: string;
}

export interface DealItem {
  id: string;
  code: string;
  discount: number;
  validTill: string;
  packageName: string;
  status: 'active' | 'expired';
}

export interface TransactionItem {
  id: string;
  amount: string;
  rawAmount: number;
  customer: string;
  service: string;
  type: 'credit' | 'payout';
  date: string;
  status: 'completed' | 'pending';
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  message: string;
  response?: string;
  date: string;
}

interface DataContextType {
  // Bookings
  bookings: ExtendedBooking[];
  addBooking: (booking: Omit<ExtendedBooking, 'id'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;

  // Calendar Events
  calendarEvents: CalendarEventItem[];
  addCalendarEvent: (event: Omit<CalendarEventItem, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Messages
  conversations: ChatConversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  startNewConversation: (customerName: string, service: string) => void;

  // Portfolio
  portfolioItems: PortfolioProject[];
  addPortfolioItem: (item: Omit<PortfolioProject, 'id' | 'views' | 'likes'>) => void;
  deletePortfolioItem: (id: string) => void;

  // Packages
  packagesList: Package[];
  addPackageItem: (pkg: Omit<Package, 'id'>) => void;
  editPackageItem: (id: string, pkg: Partial<Package>) => void;
  deletePackageItem: (id: string) => void;
  togglePackagePopular: (id: string) => void;

  // Reviews
  reviewsList: Review[];
  addReviewReply: (id: string, replyText: string) => void;
  addReviewItem: (rev: Omit<Review, 'id'>) => void;

  // Earnings & Transactions
  transactions: TransactionItem[];
  addTransactionItem: (tx: Omit<TransactionItem, 'id'>) => void;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  setTimeframe: (tf: 'weekly' | 'monthly' | 'yearly') => void;

  // Deals
  dealsList: DealItem[];
  addDealItem: (deal: Omit<DealItem, 'id'>) => void;
  toggleDealStatus: (id: string) => void;
  deleteDealItem: (id: string) => void;

  // Support
  supportTickets: SupportTicketItem[];
  addSupportTicket: (ticket: Omit<SupportTicketItem, 'id' | 'status' | 'date'>) => void;

  // Notifications
  notificationsList: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'unread'>) => void;

  // Onboarding & Settings
  profileTasksList: typeof initialProfileTasks;
  toggleProfileTaskItem: (id: string) => void;
  isAvailable: boolean;
  toggleAvailability: () => void;

  // Toast System
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // --- Toast State ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Bookings ---
  const [bookings, setBookings] = useState<ExtendedBooking[]>(() => {
    const saved = localStorage.getItem('vendor_bookings');
    if (saved) return JSON.parse(saved);
    return [
      ...upcomingEvents.map(e => ({
        id: e.id,
        customer: e.customer,
        avatar: e.customer.split(' ').map(n => n[0]).join(''),
        type: e.type,
        date: e.date,
        time: e.time,
        location: e.location,
        budget: e.budget,
        status: e.status,
      })),
      ...bookingRequests.map(r => ({
        id: 'req_' + r.id,
        customer: r.customer,
        avatar: r.avatar,
        type: r.service,
        date: r.eventDate,
        time: '10:00 AM',
        location: 'Venue Pending',
        budget: r.budget,
        status: r.status,
      })),
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendor_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    const handleSync = () => {
      const savedB = localStorage.getItem('vendor_bookings');
      if (savedB) setBookings(JSON.parse(savedB));

      const savedCal = localStorage.getItem('vendor_calendar_events');
      if (savedCal) setCalendarEvents(JSON.parse(savedCal));

      const savedTx = localStorage.getItem('vendor_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));

      const savedNotif = localStorage.getItem('vendor_notifications');
      if (savedNotif) setNotificationsList(JSON.parse(savedNotif));
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const addBooking = (booking: Omit<ExtendedBooking, 'id'>) => {
    const newB: ExtendedBooking = { ...booking, id: 'bk_' + Date.now() };
    setBookings(prev => [newB, ...prev]);
    showToast(`Booking for ${booking.customer} created successfully!`);
    addNotification({
      type: 'booking',
      title: 'New Booking Created',
      message: `${booking.customer} - ${booking.type} on ${booking.date}`,
      time: 'Just now',
    });
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Booking status updated to ${status.toUpperCase()}`);
    addNotification({
      type: 'booking',
      title: `Booking ${status}`,
      message: `Status updated for booking #${id.slice(-4)}`,
      time: 'Just now',
    });
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast('Booking removed', 'info');
  };

  // --- Calendar Events ---
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(() => {
    const saved = localStorage.getItem('vendor_calendar_events');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'Wedding Shoot - Ananya', customer: 'Ananya Sharma', date: '2026-08-12', time: '9:00 AM', location: 'The Leela Palace, Udaipur' },
      { id: '2', title: 'Corporate Event - Rohan', customer: 'Rohan Mehta', date: '2026-08-14', time: '11:00 AM', location: 'JW Marriott, Mumbai' },
      { id: '3', title: 'Birthday Bash - Priya', customer: 'Priya Iyer', date: '2026-08-18', time: '6:00 PM', location: 'Taj Coromandel, Chennai' },
      { id: '4', title: 'Pre-Wedding Shoot', customer: 'Divya Rao', date: '2026-08-25', time: '7:00 PM', location: 'ITC Grand, Bengaluru' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendor_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const addCalendarEvent = (event: Omit<CalendarEventItem, 'id'>) => {
    const newE: CalendarEventItem = { ...event, id: 'ev_' + Date.now() };
    setCalendarEvents(prev => [...prev, newE]);
    showToast(`Event "${event.title}" added to calendar!`);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event deleted from calendar', 'info');
  };

  // --- Messages & Conversations ---
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('vendor_conversations');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'c1',
        customerName: 'Ananya Sharma',
        avatar: 'AS',
        service: 'Wedding Photography',
        lastMessage: 'Can we schedule a call to finalize the shot list?',
        time: '10:30 AM',
        unread: true,
        messages: [
          { id: 'm1', sender: 'customer', text: 'Hi! We loved your portfolio.', timestamp: 'Yesterday 4:15 PM' },
          { id: 'm2', sender: 'vendor', text: 'Thank you Ananya! I would be delighted to shoot your wedding.', timestamp: 'Yesterday 4:30 PM' },
          { id: 'm3', sender: 'customer', text: 'Can we schedule a call to finalize the shot list?', timestamp: '10:30 AM' },
        ],
      },
      {
        id: 'c2',
        customerName: 'Rohan Mehta',
        avatar: 'RM',
        service: 'Corporate Event',
        lastMessage: 'Invoice has been processed. Thank you!',
        time: 'Yesterday',
        unread: false,
        messages: [
          { id: 'm4', sender: 'vendor', text: 'Hi Rohan, here is the detailed package preview.', timestamp: 'Aug 4' },
          { id: 'm5', sender: 'customer', text: 'Invoice has been processed. Thank you!', timestamp: 'Yesterday' },
        ],
      },
      {
        id: 'c3',
        customerName: 'Meera Nair',
        avatar: 'MN',
        service: 'Wedding Decor',
        lastMessage: 'Is September 5th available for decor setup?',
        time: 'Aug 2',
        unread: true,
        messages: [
          { id: 'm6', sender: 'customer', text: 'Is September 5th available for decor setup?', timestamp: 'Aug 2' },
        ],
      },
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('c1');

  useEffect(() => {
    localStorage.setItem('vendor_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'm_' + Date.now(),
      sender: 'vendor',
      text,
      timestamp: nowTime,
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            time: nowTime,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
    showToast('Message sent!');
  };

  const startNewConversation = (customerName: string, service: string) => {
    const existing = conversations.find(c => c.customerName.toLowerCase() === customerName.toLowerCase());
    if (existing) {
      setActiveConversationId(existing.id);
      return;
    }
    const newId = 'c_' + Date.now();
    const newConv: ChatConversation = {
      id: newId,
      customerName,
      avatar: customerName.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU',
      service,
      lastMessage: 'Chat started',
      time: 'Just now',
      unread: false,
      messages: [
        { id: 'm_init_' + Date.now(), sender: 'vendor', text: `Hello ${customerName}, how can I assist you today?`, timestamp: 'Just now' },
      ],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    showToast(`Conversation started with ${customerName}`);
  };

  // --- Portfolio Items ---
  const [portfolioItems, setPortfolioItems] = useState<PortfolioProject[]>(() => {
    const saved = localStorage.getItem('vendor_portfolio_items');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'p1',
        title: 'Royal Heritage Wedding',
        category: 'Weddings',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
        views: 1420,
        likes: 184,
        date: 'Aug 2026',
      },
      {
        id: 'p2',
        title: 'Luxury Floral Stage Decor',
        category: 'Decoration',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
        views: 980,
        likes: 120,
        date: 'Jul 2026',
      },
      {
        id: 'p3',
        title: 'Tech Summit Corporate Gala',
        category: 'Corporate',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
        views: 650,
        likes: 76,
        date: 'Jul 2026',
      },
      {
        id: 'p4',
        title: 'Sunset Beach Engagement',
        category: 'Pre-Wedding',
        imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1000',
        views: 1890,
        likes: 310,
        date: 'Jun 2026',
      },
      {
        id: 'p5',
        title: 'Bridal Glam Makeup Portrait',
        category: 'Makeup',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1000',
        views: 1120,
        likes: 240,
        date: 'Jun 2026',
      },
      {
        id: 'p6',
        title: 'Sangeet Night Stage & Lighting',
        category: 'Weddings',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
        views: 890,
        likes: 95,
        date: 'May 2026',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendor_portfolio_items', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  const addPortfolioItem = (item: Omit<PortfolioProject, 'id' | 'views' | 'likes'>) => {
    const newItem: PortfolioProject = {
      ...item,
      id: 'p_' + Date.now(),
      views: 1,
      likes: 0,
    };
    setPortfolioItems(prev => [newItem, ...prev]);
    showToast('New project added to portfolio!');
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(p => p.id !== id));
    showToast('Portfolio item deleted', 'info');
  };

  // --- Packages ---
  const [packagesList, setPackagesList] = useState<Package[]>(() => {
    const saved = localStorage.getItem('vendor_packages');
    if (saved) return JSON.parse(saved);
    return initialPackages;
  });

  useEffect(() => {
    localStorage.setItem('vendor_packages', JSON.stringify(packagesList));
  }, [packagesList]);

  const addPackageItem = (pkg: Omit<Package, 'id'>) => {
    const newPkg: Package = { ...pkg, id: 'pkg_' + Date.now() };
    setPackagesList(prev => [...prev, newPkg]);
    showToast(`Package "${pkg.name}" added!`);
  };

  const editPackageItem = (id: string, updated: Partial<Package>) => {
    setPackagesList(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Package updated successfully!');
  };

  const deletePackageItem = (id: string) => {
    setPackagesList(prev => prev.filter(p => p.id !== id));
    showToast('Package removed', 'info');
  };

  const togglePackagePopular = (id: string) => {
    setPackagesList(prev => prev.map(p => (p.id === id ? { ...p, popular: !p.popular } : p)));
    showToast('Popular tag updated');
  };

  // --- Reviews ---
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('vendor_reviews');
    if (saved) return JSON.parse(saved);
    return initialReviews;
  });

  useEffect(() => {
    localStorage.setItem('vendor_reviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  const addReviewReply = (id: string, replyText: string) => {
    setReviewsList(prev =>
      prev.map(r => (r.id === id ? { ...r, reply: replyText, reply_date: 'Just now' } : r))
    );
    showToast('Response sent to customer review!');
  };

  const addReviewItem = (rev: Omit<Review, 'id'>) => {
    const newR: Review = { ...rev, id: 'rev_' + Date.now() };
    setReviewsList(prev => [newR, ...prev]);
    showToast('Review submitted');
  };

  // --- Earnings & Transactions ---
  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem('vendor_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'tx1', amount: '₹1,20,000', rawAmount: 120000, customer: 'Ananya Sharma', service: 'Wedding Package', type: 'credit', date: 'Aug 5, 2026', status: 'completed' },
      { id: 'tx2', amount: '₹85,000', rawAmount: 85000, customer: 'Rohan Mehta', service: 'Corporate Photography', type: 'credit', date: 'Aug 3, 2026', status: 'completed' },
      { id: 'tx3', amount: '₹45,000', rawAmount: 45000, customer: 'Priya Iyer', service: 'Birthday Coverage', type: 'credit', date: 'Jul 29, 2026', status: 'completed' },
      { id: 'tx4', amount: '₹50,000', rawAmount: 50000, customer: 'Bank Payout', service: 'UPI Transfer to Bank', type: 'payout', date: 'Jul 25, 2026', status: 'completed' },
    ];
  });

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    localStorage.setItem('vendor_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransactionItem = (tx: Omit<TransactionItem, 'id'>) => {
    const newTx: TransactionItem = { ...tx, id: 'tx_' + Date.now() };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Transaction of ${tx.amount} logged!`);
  };

  // --- Deals ---
  const [dealsList, setDealsList] = useState<DealItem[]>(() => {
    const saved = localStorage.getItem('vendor_deals');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'd1', code: 'ROYALWED15', discount: 15, validTill: 'Sep 30, 2026', packageName: 'Wedding Premium', status: 'active' },
      { id: 'd2', code: 'CORP20', discount: 20, validTill: 'Aug 31, 2026', packageName: 'Corporate', status: 'active' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendor_deals', JSON.stringify(dealsList));
  }, [dealsList]);

  const addDealItem = (deal: Omit<DealItem, 'id'>) => {
    const newD: DealItem = { ...deal, id: 'd_' + Date.now() };
    setDealsList(prev => [newD, ...prev]);
    showToast(`Promo Deal "${deal.code}" created!`);
  };

  const toggleDealStatus = (id: string) => {
    setDealsList(prev =>
      prev.map(d => (d.id === id ? { ...d, status: d.status === 'active' ? 'expired' : 'active' } : d))
    );
    showToast('Deal status updated!');
  };

  const deleteDealItem = (id: string) => {
    setDealsList(prev => prev.filter(d => d.id !== id));
    showToast('Deal deleted', 'info');
  };

  // --- Support Tickets ---
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>(() => {
    const saved = localStorage.getItem('vendor_support_tickets');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'st1', subject: 'Payout delays for UPI transfers', category: 'Payments', priority: 'high', status: 'resolved', message: 'Requested clarification on automated bank payouts.', response: 'Resolved by billing team. Transferred instantly.', date: 'Aug 1, 2026' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendor_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const addSupportTicket = (ticket: Omit<SupportTicketItem, 'id' | 'status' | 'date'>) => {
    const newT: SupportTicketItem = {
      ...ticket,
      id: 'st_' + Date.now(),
      status: 'open',
      date: 'Just now',
    };
    setSupportTickets(prev => [newT, ...prev]);
    showToast('Support ticket submitted! Ticket #' + newT.id.slice(-4));
  };

  // --- Notifications ---
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('vendor_notifications');
    if (saved) return JSON.parse(saved);
    return initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('vendor_notifications', JSON.stringify(notificationsList));
  }, [notificationsList]);

  const markNotificationRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotificationsList([]);
    showToast('Notifications cleared');
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'unread'>) => {
    const newN: NotificationItem = {
      ...notif,
      id: 'n_' + Date.now(),
      unread: true,
    };
    setNotificationsList(prev => [newN, ...prev]);
  };

  // --- Profile Onboarding Tasks ---
  const [profileTasksList, setProfileTasksList] = useState(() => {
    const saved = localStorage.getItem('vendor_profile_tasks');
    if (saved) return JSON.parse(saved);
    return initialProfileTasks;
  });

  useEffect(() => {
    localStorage.setItem('vendor_profile_tasks', JSON.stringify(profileTasksList));
  }, [profileTasksList]);

  const toggleProfileTaskItem = (id: string) => {
    setProfileTasksList((prev: typeof initialProfileTasks) =>
      prev.map((t: { id: string; label: string; done: boolean }) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // --- Vendor Availability ---
  const [isAvailable, setIsAvailable] = useState<boolean>(() => {
    return localStorage.getItem('vendor_availability') !== 'false';
  });

  const toggleAvailability = () => {
    setIsAvailable(prev => {
      const next = !prev;
      localStorage.setItem('vendor_availability', String(next));
      showToast(next ? 'Status set to Accepting Bookings' : 'Status set to Away / Pause Bookings', next ? 'success' : 'info');
      return next;
    });
  };

  return (
    <DataContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,

        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startNewConversation,

        portfolioItems,
        addPortfolioItem,
        deletePortfolioItem,

        packagesList,
        addPackageItem,
        editPackageItem,
        deletePackageItem,
        togglePackagePopular,

        reviewsList,
        addReviewReply,
        addReviewItem,

        transactions,
        addTransactionItem,
        timeframe,
        setTimeframe,

        dealsList,
        addDealItem,
        toggleDealStatus,
        deleteDealItem,

        supportTickets,
        addSupportTicket,

        notificationsList,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,

        profileTasksList,
        toggleProfileTaskItem,

        isAvailable,
        toggleAvailability,

        toast,
        showToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
