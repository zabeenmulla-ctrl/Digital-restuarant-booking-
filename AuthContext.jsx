import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData } from '../lib/mockData';

const AuthContext = createContext();

// Pre-configured Demo Accounts for BCA Project Viva Demonstration
export const DEMO_USERS = {
  customer: {
    id: 'user-demo-customer',
    name: 'Rahul Sharma',
    email: 'customer@qaswahills.com',
    phone: '+91 98765 12345',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  owner: {
    id: 'user-demo-owner',
    name: 'Zabeen Mulla (General Manager)',
    email: 'manager@qaswahills.com',
    phone: '+91 98234 56789',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  },
  admin: {
    id: 'user-demo-admin',
    name: 'System Administrator',
    email: 'admin@qaswahills.com',
    phone: '+91 99999 88888',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStoredData('auth_user', DEMO_USERS.customer);
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setStoredData('auth_user', user);
    } else {
      localStorage.removeItem('qaswa_auth_user');
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', data.user.id)
          .single();

        if (profile) {
          const loggedUser = {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            avatar: profile.avatar_url
          };
          setUser(loggedUser);
          return { success: true, user: loggedUser };
        }
      }

      // Local / Offline demo authentication
      let matchedRole = 'customer';
      if (email.includes('admin')) matchedRole = 'admin';
      else if (email.includes('owner') || email.includes('manager')) matchedRole = 'owner';

      const demo = DEMO_USERS[matchedRole] || {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: '+91 98000 00000',
        role: matchedRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };

      setUser(demo);
      return { success: true, user: demo };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up handler
  const signup = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Create profile record
        await supabase.from('profiles').insert([
          {
            auth_user_id: data.user.id,
            full_name: name,
            email,
            phone,
            role
          }
        ]);
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Role Switcher for College Viva Demo
  const switchDemoRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setUser(DEMO_USERS[roleKey]);
    }
  };

  // Profile update
  const updateProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        switchDemoRole,
        updateProfile,
        isAdmin: user?.role === 'admin',
        isOwner: user?.role === 'owner',
        isCustomer: user?.role === 'customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
