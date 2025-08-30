import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'dept' | 'superadmin';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('token');
    if (token) {
      // Simulate token validation
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password, role);
      
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.register(name, email, password, phone);
      
      if (response.success && response.data) {
        setUser(response.data.user as User);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};