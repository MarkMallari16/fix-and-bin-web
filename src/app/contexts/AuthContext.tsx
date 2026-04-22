import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-42111711`;

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'worker';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, silent?: boolean) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'customer' | 'worker') => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing Supabase session
    const checkSupabaseSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Sync user data from backend
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const result = await response.json();
          if (result.success && result.user) {
            setUser({
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role
            });
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };
    
    checkSupabaseSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Sync user when signed in
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const result = await response.json();
          if (result.success && result.user) {
            setUser({
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role
            });
          }
        } catch (error) {
          console.error('Error syncing user on auth change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, name: string, role: 'customer' | 'worker'): Promise<boolean> => {
    try {
      // Try to register via backend first (preferred method)
      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password, name, role })
        });

        const result = await response.json();
        
        if (result.success) {
          // Backend registration successful - now sign in
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            console.error('Sign in after registration error:', error);
            return false;
          }

          // Set user from result
          setUser({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role
          });

          return true;
        }
      } catch (backendError) {
        console.log('Backend registration unavailable, using direct Supabase signup:', backendError);
      }

      // Fallback: Direct Supabase registration (if backend is not deployed)
      console.log('Using direct Supabase registration...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);

        // Check if user already exists - try to login instead
        if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
          console.log('User already exists, attempting silent login...');
          // Silently try to login
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (!loginError && loginData.session && loginData.user) {
            // Login successful
            const userProfile = {
              id: loginData.user.id,
              email: loginData.user.email || email,
              name: loginData.user.user_metadata?.name || name,
              role: (loginData.user.user_metadata?.role as 'customer' | 'worker') || role
            };
            setUser(userProfile);
            return true;
          }
        }

        console.error('Registration failed:', signUpError.message);
        return false;
      }

      if (signUpData.user) {
        // Check if email confirmation is required
        const confirmationRequired = !signUpData.session;
        
        if (confirmationRequired) {
          // Email confirmation required - don't try to auto-login
          console.log('Account created. Email confirmation may be required.');
          return true; // Return true because signup was successful
        }

        // If we have a session, we're already logged in
        if (signUpData.session) {
          // Create user profile object
          const userProfile = {
            id: signUpData.user.id,
            email: signUpData.user.email || email,
            name,
            role
          };

          setUser(userProfile);

          // Try to sync to backend in background (non-blocking)
          fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${signUpData.session.access_token}`,
              'Content-Type': 'application/json'
            }
          }).catch(err => console.log('Background sync failed (non-critical):', err));

          return true;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string, silent = false): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        // Don't show alerts - let the UI component handle error display
        return false;
      }

      if (data.session && data.user) {
        // Try to sync user data from backend
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const result = await response.json();
          if (result.success && result.user) {
            setUser({
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role
            });
            return true;
          }
        } catch (syncError) {
          console.log('Backend sync failed, using local user data:', syncError);
        }

        // Fallback: Use user data from Supabase Auth if backend sync fails
        const userProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: (data.user.user_metadata?.role as 'customer' | 'worker') || 'customer'
        };

        setUser(userProfile);
        console.log('Login successful with fallback user data');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      // Do not forget to complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Google login error:', error);
      }
      // User will be set by the onAuthStateChange listener
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}