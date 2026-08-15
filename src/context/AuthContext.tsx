import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';

export type KycStatus = 'unverified' | 'pending' | 'verified';

export interface KycDocumentRecord {
  govtIdType: string;
  govtIdNumber: string;
  govtIdFile?: string;
  businessRegNumber?: string;
  businessRegFile?: string;
  bankProofFile?: string;
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  website: string;
  businessName: string;
  category: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  upiId: string;
  bankAccount: string;
  ifsc: string;
  usernameHistory: number[]; // Timestamps of username modifications
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_default_01',
  email: 'aarav.photography@luxuryweddings.in',
  fullName: 'Aarav Sharma',
  username: 'aarav.photography',
  website: 'https://royalmoments.in',
  businessName: 'Royal Moments Studio',
  category: 'Wedding & Event Photography',
  phone: '+91 98765 43210',
  location: 'Mumbai & Udaipur, India',
  bio: 'Award-winning destination wedding photographer capturing royal moments across India ✨📸',
  avatar: 'AS',
  upiId: 'aarav.sharma@okaxis',
  bankAccount: '•••• •••• 8842',
  ifsc: 'HDFC0001234',
  usernameHistory: [],
};

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  isAdminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;

  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, name: string, business: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Instagram Username Rules
  canChangeUsername: () => { allowed: boolean; remainingChanges: number; daysUntilReset?: number };
  changeUsername: (newUsername: string) => { success: boolean; message: string };

  // Admin KYC Approval State
  kycStatus: KycStatus;
  setKycStatus: (status: KycStatus) => void;
  kycRecord: KycDocumentRecord | null;
  submitKycDocuments: (record: Omit<KycDocumentRecord, 'submittedAt'>) => void;
  adminApproveKyc: () => void;
  adminRejectKyc: (reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vendor_user_profile');
    let profileData = DEFAULT_USER;
    if (saved) {
      try {
        profileData = { ...DEFAULT_USER, ...JSON.parse(saved) };
      } catch (e) {}
    }
    
    // Sync with main auth profile if present
    const mainUser = localStorage.getItem('festivo_user');
    const mainProfile = localStorage.getItem('festivo_profile');
    if (mainUser && mainProfile) {
      try {
        const userObj = JSON.parse(mainUser);
        const profileObj = JSON.parse(mainProfile);
        if (profileObj.role === 'vendor') {
          return {
            ...profileData,
            email: userObj.email || profileData.email,
            fullName: profileObj.full_name || profileData.fullName,
            businessName: profileObj.full_name ? `${profileObj.full_name} Studio` : profileData.businessName,
          };
        }
      } catch (e) {}
    }
    return profileData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const mainUser = localStorage.getItem('festivo_user');
    const mainProfile = localStorage.getItem('festivo_profile');
    if (mainUser && mainProfile) {
      try {
        const profileObj = JSON.parse(mainProfile);
        if (profileObj.role === 'vendor') {
          return true;
        }
      } catch (e) {}
    }
    return localStorage.getItem('vendor_is_authenticated') === 'true';
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);

  // KYC Verification State
  const [kycStatus, setKycStatus] = useState<KycStatus>(() => {
    // Sync with email-specific KYC status if user is present in localStorage
    const mainUser = localStorage.getItem('festivo_user');
    if (mainUser) {
      try {
        const userObj = JSON.parse(mainUser);
        if (userObj.email) {
          const emailLower = userObj.email.toLowerCase();
          const specStatus = localStorage.getItem(`festivo_kyc_status_${emailLower}`);
          if (specStatus === 'Approved') return 'verified';
          if (specStatus === 'Pending Verification') return 'pending';
          if (specStatus === 'Rejected') return 'unverified';
        }
      } catch (e) {}
    }
    const saved = localStorage.getItem('vendor_kyc_status');
    if (saved) return saved as KycStatus;
    return 'unverified';
  });

  const [kycRecord, setKycRecord] = useState<KycDocumentRecord | null>(() => {
    const saved = localStorage.getItem('vendor_kyc_record');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('vendor_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vendor_is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('vendor_kyc_status', kycStatus);
  }, [kycStatus]);

  useEffect(() => {
    const handleSync = (e?: StorageEvent) => {
      if (!e || e.key === 'vendor_kyc_status') {
        const saved = localStorage.getItem('vendor_kyc_status');
        if (saved && (saved === 'verified' || saved === 'pending' || saved === 'unverified')) {
          setKycStatus(saved as KycStatus);
        }
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', () => handleSync());
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', () => handleSync());
    };
  }, []);

  useEffect(() => {
    if (kycRecord) {
      localStorage.setItem('vendor_kyc_record', JSON.stringify(kycRecord));
    }
  }, [kycRecord]);

  // Sync kycStatus state when user changes (e.g. logs in)
  useEffect(() => {
    if (user && user.email) {
      const emailLower = user.email.toLowerCase();
      const specStatus = localStorage.getItem(`festivo_kyc_status_${emailLower}`);
      if (specStatus === 'Approved') {
        setKycStatus('verified');
      } else if (specStatus === 'Pending Verification') {
        setKycStatus('pending');
      } else if (specStatus === 'Rejected') {
        setKycStatus('unverified');
      }
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vendor_kyc_status' && e.newValue) {
        setKycStatus(e.newValue as KycStatus);
      }
      if (user.email && e.key === `festivo_kyc_status_${user.email.toLowerCase()}`) {
        if (e.newValue === 'Approved') {
          setKycStatus('verified');
          localStorage.setItem('vendor_kyc_status', 'verified');
        } else if (e.newValue === 'Pending Verification') {
          setKycStatus('pending');
          localStorage.setItem('vendor_kyc_status', 'pending');
        } else if (e.newValue === 'Rejected') {
          setKycStatus('unverified');
          localStorage.setItem('vendor_kyc_status', 'unverified');
        }
      }
      if (e.key === 'vendor_kyc_record' && e.newValue) {
        try {
          setKycRecord(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user.email]);

  // Sync with Supabase Auth if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
          }));
        } else {
          setIsAuthenticated(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Instagram Username Rule Check: Max 2 changes within 14 days
  const canChangeUsername = () => {
    const now = Date.now();
    const history = user.usernameHistory || [];
    // Filter history to last 14 days
    const recentChanges = history.filter(timestamp => now - timestamp < FOURTEEN_DAYS_MS);

    if (recentChanges.length >= 2) {
      const oldestInWindow = Math.min(...recentChanges);
      const daysUntilReset = Math.ceil((FOURTEEN_DAYS_MS - (now - oldestInWindow)) / (24 * 60 * 60 * 1000));
      return {
        allowed: false,
        remainingChanges: 0,
        daysUntilReset,
      };
    }

    return {
      allowed: true,
      remainingChanges: 2 - recentChanges.length,
    };
  };

  const changeUsername = (newUsername: string): { success: boolean; message: string } => {
    const cleanUsername = newUsername.trim().toLowerCase().replace(/[^a-z0-9._]/g, '');
    if (!cleanUsername) {
      return { success: false, message: 'Invalid username format.' };
    }

    if (cleanUsername === user.username) {
      return { success: true, message: 'Username is unchanged.' };
    }

    const check = canChangeUsername();
    if (!check.allowed) {
      return {
        success: false,
        message: `Username Rule: You can only change your @username handle twice every 14 days. Please wait ${check.daysUntilReset} more day(s).`,
      };
    }

    const now = Date.now();
    const updatedHistory = [...(user.usernameHistory || []), now];

    setUser(prev => ({
      ...prev,
      username: cleanUsername,
      usernameHistory: updatedHistory,
    }));

    return {
      success: true,
      message: `Username updated to @${cleanUsername}! (${2 - updatedHistory.filter(t => now - t < FOURTEEN_DAYS_MS).length} changes remaining in 14 days)`,
    };
  };

  const login = async (email: string, _pass: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signInWithPassword({ email, password: _pass });
    }
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
    }));
    return true;
  };

  const signup = async (email: string, name: string, business: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signUp({ email, password: 'password123' });
    }
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email,
      fullName: name,
      businessName: business,
      username: name.toLowerCase().replace(/\s+/g, '.'),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase() || 'VN',
    }));
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    localStorage.removeItem('vendor_is_authenticated');
    localStorage.removeItem('vendor_user_profile');
    localStorage.removeItem('festivo_user');
    localStorage.removeItem('festivo_profile');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  // Vendor submits documents -> status moves to 'pending' for Admin approval
  const submitKycDocuments = (record: Omit<KycDocumentRecord, 'submittedAt'>) => {
    const submittedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const fullRecord: KycDocumentRecord = {
      ...record,
      submittedAt: submittedDate,
    };
    setKycRecord(fullRecord);
    setKycStatus('pending');

    // 1. Add/update the vendor application in `festivo_pending_vendors` for Admin approval
    const localPending = JSON.parse(localStorage.getItem('festivo_pending_vendors') || '[]');
    const existingIndex = localPending.findIndex((v: any) => v.details?.email?.toLowerCase() === user.email.toLowerCase());

    const pendingVendor = {
      id: user.id || `VND-${Math.floor(100000 + Math.random() * 900000)}`,
      name: user.businessName,
      category: user.category || 'Photographer',
      location: user.location,
      price_amount: 48250,
      price_label: 'Starting Package',
      price_unit: 'day',
      rating: 4.9,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      logo: 'AS',
      verified: false,
      badge: 'KYC Submitted',
      badge_color: 'bg-gold-500',
      slug: user.username || 'aarav-photography',
      details: {
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        owner: user.fullName,
        address: user.location,
        serviceAreas: ['Mumbai', 'Udaipur'],
        languages: ['English', 'Hindi'],
        teamSize: '2–5 Members',
        experience: '3–5 Years',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'KYC Submitted',
        kyc: {
          aadhaarFront: record.govtIdFile || 'aadhaar_scanned_front_back.pdf',
          aadhaarBack: 'aadhaar_scanned_front_back.pdf',
          pan: record.govtIdFile || 'pan_card_scanned.pdf',
          cancelledCheque: record.bankProofFile || 'cancelled_cheque.pdf',
          gst: record.businessRegFile || undefined
        }
      }
    };

    if (existingIndex > -1) {
      const existingVendor = localPending[existingIndex];
      const updatedVendor = {
        ...existingVendor,
        badge: 'KYC Submitted',
        badge_color: 'bg-gold-500',
        details: {
          ...(existingVendor.details || {}),
          status: 'KYC Submitted',
          kyc: {
            aadhaarFront: record.govtIdFile || 'aadhaar_scanned_front_back.pdf',
            aadhaarBack: 'aadhaar_scanned_front_back.pdf',
            pan: record.govtIdFile || 'pan_card_scanned.pdf',
            cancelledCheque: record.bankProofFile || 'cancelled_cheque.pdf',
            gst: record.businessRegFile || undefined
          }
        }
      };
      localPending[existingIndex] = updatedVendor;
    } else {
      localPending.unshift(pendingVendor);
    }
    localStorage.setItem('festivo_pending_vendors', JSON.stringify(localPending));

    // Also sync the specific flag read by tab 3 of AdminDashboard
    localStorage.setItem(`festivo_kyc_status_${user.email.toLowerCase()}`, 'Pending Verification');

    const vendorName = existingIndex > -1 ? localPending[existingIndex].name : user.businessName;
    const vendorCategory = existingIndex > -1 ? localPending[existingIndex].category : (user.category || 'Photographer');
    const vendorId = existingIndex > -1 ? localPending[existingIndex].id : pendingVendor.id;

    // 2. Create Admin Notification
    const notifications = JSON.parse(localStorage.getItem('festivo_admin_notifications') || '[]');
    const newNotif = {
      id: `AN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'new_application',
      vendorId: vendorId,
      vendorName: vendorName,
      message: `KYC documents submitted by "${vendorName}" (${vendorCategory}) for review.`,
      timestamp: new Date().toISOString(),
      read: false
    };
    localStorage.setItem('festivo_admin_notifications', JSON.stringify([newNotif, ...notifications]));

    // Dispatch storage event to notify other open tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Admin Portal functions
  const adminApproveKyc = () => {
    setKycStatus('verified');
  };

  const adminRejectKyc = () => {
    setKycStatus('unverified');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthModalOpen,
        setAuthModalOpen,

        isAdminModalOpen,
        setAdminModalOpen,

        login,
        signup,
        logout,
        updateProfile,

        canChangeUsername,
        changeUsername,

        kycStatus,
        setKycStatus,
        kycRecord,
        submitKycDocuments,
        adminApproveKyc,
        adminRejectKyc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
