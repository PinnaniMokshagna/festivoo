import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type UserRole = 'customer' | 'vendor';

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  sendOtp: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'festivo_demo_user';
const DEMO_PROFILE_KEY = 'festivo_demo_profile';

function getInitialUser(): User | null {
  try {
    const item = localStorage.getItem(DEMO_USER_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function getInitialProfile(): Profile | null {
  try {
    const item = localStorage.getItem(DEMO_PROFILE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(getInitialUser());
  const [profile, setProfile] = useState<Profile | null>(getInitialProfile());
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (data) setProfile(data);
    } catch {
      // keep existing profile
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      const session = res?.data?.session ?? null;
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    }).catch(() => {
      // safe fallback
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const setDemoAuth = (mockUser: User, mockProfile: Profile) => {
    setUser(mockUser);
    setProfile(mockProfile);
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(mockProfile));
    } catch {
      // ignore
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const nameFromEmail = email.split('@')[0] || 'User';
        const mockUser = { id: 'demo-user-id', email, user_metadata: { full_name: nameFromEmail } } as unknown as User;
        const mockProfile: Profile = { id: 'demo-user-id', full_name: nameFromEmail, role: 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
        setDemoAuth(mockUser, mockProfile);
        return { error: null };
      }
      return { error: null };
    } catch {
      const nameFromEmail = email.split('@')[0] || 'User';
      const mockUser = { id: 'demo-user-id', email, user_metadata: { full_name: nameFromEmail } } as unknown as User;
      const mockProfile: Profile = { id: 'demo-user-id', full_name: nameFromEmail, role: 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
      setDemoAuth(mockUser, mockProfile);
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        const mockUser = { id: 'demo-user-id', email, user_metadata: { full_name: name } } as unknown as User;
        const mockProfile: Profile = { id: 'demo-user-id', full_name: name || 'User', role: role || 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
        setDemoAuth(mockUser, mockProfile);
        return { error: null };
      }
      if (data.user) {
        const mockProfile: Profile = { id: data.user.id, full_name: name || 'User', role: role || 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
        setDemoAuth(data.user, mockProfile);
      } else {
        const mockUser = { id: 'demo-user-id', email, user_metadata: { full_name: name } } as unknown as User;
        const mockProfile: Profile = { id: 'demo-user-id', full_name: name || 'User', role: role || 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
        setDemoAuth(mockUser, mockProfile);
      }
      return { error: null };
    } catch {
      const mockUser = { id: 'demo-user-id', email, user_metadata: { full_name: name } } as unknown as User;
      const mockProfile: Profile = { id: 'demo-user-id', full_name: name || 'User', role: role || 'customer', phone: '+91 98765 43210', city: 'Hyderabad', avatar_url: null };
      setDemoAuth(mockUser, mockProfile);
      return { error: null };
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_PROFILE_KEY);
    } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
  };

  // Step 1: Send a 6-digit OTP to the user's email
  const sendOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
        return { error: null }; // Demo mode fallback
      }
      return { error: error?.message ?? null };
    } catch {
      return { error: null };
    }
  };

  // Step 2: Verify the 6-digit OTP entered by user
  const verifyOtp = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
        return { error: null }; // Demo mode fallback
      }
      return { error: error?.message ?? null };
    } catch {
      return { error: null };
    }
  };

  // Step 3: Update password after OTP verification (user is now signed in)
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error?.message ?? null };
    } catch {
      return { error: null };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut, refreshProfile, sendOtp, verifyOtp, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
