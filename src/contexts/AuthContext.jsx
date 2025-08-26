import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session?.user?.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setAuthError(null);
        
        if (session?.user) {
          fetchUserProfile(session?.user?.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error && error?.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthError(error?.message);
        return { error };
      }

      return { data };
    } catch (error) {
      const errorMsg = error?.message?.includes('Failed to fetch') 
        ? 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.' :'Something went wrong. Please try again.';
      setAuthError(errorMsg);
      return { error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setAuthError(null);

      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            display_name: userData?.display_name || '',
            role: userData?.role || 'family_member'
          }
        }
      });

      if (error) {
        setAuthError(error?.message);
        return { error };
      }

      return { data };
    } catch (error) {
      const errorMsg = error?.message?.includes('Failed to fetch') 
        ? 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.' :'Something went wrong. Please try again.';
      setAuthError(errorMsg);
      return { error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase?.auth?.signOut();
      
      if (error) {
        setAuthError(error?.message);
        return { error };
      }

      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      const errorMsg = 'Something went wrong during sign out.';
      setAuthError(errorMsg);
      return { error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', user?.id)?.select()?.single();

      if (error) throw error;

      setUserProfile(data);
      return { data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError: () => setAuthError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;