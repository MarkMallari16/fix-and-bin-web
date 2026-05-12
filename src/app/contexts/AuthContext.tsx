import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';
import { createServiceProvider, getServiceProviderByUserId } from '../services/database';

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
        // Try to sync user data from backend, fall back to local data
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              setUser({
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role
              });
              return;
            }
          }
        } catch (error) {
          // Backend not available, use local user data
          console.log('Backend sync not available, using local auth data');
        }

        // Fallback: Use Supabase auth user metadata
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'customer'
        });
      }
    };

    checkSupabaseSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Try to sync user when signed in, fall back to local data
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              setUser({
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role
              });
              return;
            }
          }
        } catch (error) {
          // Backend not available, use local user data
          console.log('Backend sync not available, using local auth data');
        }

        // Fallback: Use Supabase auth user metadata
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'customer'
        });
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
          body: JSON.stringify({ email, password, name, role }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (response.ok) {
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
            const newUser = {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role
            };
            setUser(newUser);

            // If worker role, create service provider profile
            if (result.user.role === 'worker') {
              try {
                await createServiceProvider({
                  userId: result.user.id,
                  fullName: result.user.name,
                  email: result.user.email,
                  phone: '',
                  primarySpecialization: 'Electrician',
                  secondarySkills: [],
                  yearsOfExperience: 0,
                  bio: '',
                  certifications: [],
                  licenses: [],
                  trainingBackground: [],
                  servicesOffered: [],
                  portfolio: [],
                  serviceAreas: [],
                  location: { city: 'Manila', region: 'NCR' },
                  priceRange: { min: 0, max: 0 },
                  startingRate: 0,
                  rating: 0,
                  totalReviews: 0,
                  completedJobs: 0,
                  totalEarnings: 0,
                  reviews: [],
                  status: 'approved',
                  isVerified: false,
                  isTopRated: false,
                  profilePhoto: ''
                });
                console.log('✓ Worker profile created successfully');
              } catch (error) {
                // Silently fail - user can complete profile later
                console.log('Note: Provider profile will be created when database is set up');
              }
            }

            return true;
          }
        }
      } catch (backendError) {
        console.log('Backend registration unavailable, using direct Supabase signup');
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

          // If worker role, create service provider profile
          if (role === 'worker') {
            try {
              await createServiceProvider({
                userId: signUpData.user.id,
                fullName: name,
                email: signUpData.user.email || email,
                phone: '',
                primarySpecialization: 'Electrician',
                secondarySkills: [],
                yearsOfExperience: 0,
                bio: '',
                certifications: [],
                licenses: [],
                trainingBackground: [],
                servicesOffered: [],
                portfolio: [],
                serviceAreas: [],
                location: { city: 'Manila', region: 'NCR' },
                priceRange: { min: 0, max: 0 },
                startingRate: 0,
                rating: 0,
                totalReviews: 0,
                completedJobs: 0,
                totalEarnings: 0,
                reviews: [],
                status: 'approved',
                isVerified: false,
                isTopRated: false,
                profilePhoto: ''
              });
              console.log('✓ Worker profile created and approved');
            } catch (error) {
              // Silently fail - user can complete profile later
              console.log('Note: Provider profile will be created when database is set up');
            }
          }

          // Try to sync to backend in background (non-blocking) with timeout
          fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${signUpData.session.access_token}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(3000)
          }).catch(err => console.log('Background sync not available (non-critical)'));

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
        // Try to sync user data from backend with timeout
        try {
          const response = await fetch(`${API_URL}/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });

          if (response.ok) {
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
          }
        } catch (syncError) {
          console.log('Backend sync not available, using local user data');
        }

        // Fallback: Use user data from Supabase Auth if backend sync fails
        const userProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: (data.user.user_metadata?.role as 'customer' | 'worker') || 'customer'
        };

        setUser(userProfile);
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
      // Get the current URL origin for redirect
      const redirectURL = window.location.origin;

      console.log('Starting Google OAuth with redirect URL:', redirectURL);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      // OAuth redirect will happen automatically
      console.log('Google OAuth initiated successfully');
    } catch (error: any) {
      console.error('Google login error:', error);

      // Show user-friendly error message
      let errorMessage = 'Unable to sign in with Google. ';

      if (error?.message?.includes('not enabled')) {
        errorMessage += 'Google authentication is not enabled for this application. Please contact support or use email/password login.';
      } else if (error?.message?.includes('redirect')) {
        errorMessage += 'Redirect configuration error. Please contact support.';
      } else {
        errorMessage += error?.message || 'Please try again or use email/password login.';
      }

      // Create a temporary toast notification
      if (typeof window !== 'undefined') {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] max-w-md';
        toast.textContent = errorMessage;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
        }, 5000);
      }

      throw error;
    }
  };

  const logout = async () => {
    // Clear user state
    setUser(null);

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear any cached data
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Redirect to home
    window.location.href = '/';
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