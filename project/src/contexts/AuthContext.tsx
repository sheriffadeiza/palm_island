import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, type User as ApiUser } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coach' | 'user' | 'bidder';
  avatar?: string;
  position?: string;
  team?: string;
  joinDate?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; needsVerification?: boolean }>;
  register: (email: string, password: string, name: string, role: 'coach' | 'user' | 'bidder') => Promise<{ success: boolean; message?: string; needsVerification?: boolean }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert API user to frontend user format
const convertApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.fullname,
  role: apiUser.role as 'admin' | 'coach' | 'user' | 'bidder',
  isEmailVerified: apiUser.isEmailVerified,
  avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
  joinDate: new Date().toISOString().split('T')[0]
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedAuth = localStorage.getItem('palmIslandAuth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('palmIslandAuth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; needsVerification?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });

      const convertedUser = convertApiUserToUser(response.user);
      setUser(convertedUser);
      setIsAuthenticated(true);
      localStorage.setItem('palmIslandAuth', JSON.stringify({ user: convertedUser }));

      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Login error:', error);

      // Check if it's an email verification error
      if (error.message?.includes('verify your email')) {
        return {
          success: false,
          message: error.message,
          needsVerification: true
        };
      }

      return {
        success: false,
        message: error.message || 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'coach' | 'user' | 'bidder'): Promise<{ success: boolean; message?: string; needsVerification?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await apiService.register({
        fullname: name,
        email,
        password,
        role
      });

      return {
        success: true,
        message: response.message,
        needsVerification: true
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.verifyEmail(token);
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: error.message || 'Email verification failed. Please try again.'
      };
    }
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.resendVerification(email);
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to resend verification email. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('palmIslandAuth');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('palmIslandAuth', JSON.stringify({ user: updatedUser }));
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    verifyEmail,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
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