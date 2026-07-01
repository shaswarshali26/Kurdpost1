import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PASSWORDS: Record<string, string> = {
  'ahmad@example.com': 'password123',
  'soran@kurdshop.com': 'password123',
  'dilan@gov.krd': 'password123',
  'admin@kurdpost.krd': 'admin123',
  'shirin@example.com': 'password123',
  'karwan@techkrd.com': 'password123',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const found = mockUsers.find(u => u.email === email);
    if (!found) return { success: false, error: 'No account found with that email address.' };
    if (DEMO_PASSWORDS[email] !== password) return { success: false, error: 'Incorrect password.' };
    setUser(found);
    return { success: true };
  }, []);

  const register = useCallback(async (data: Partial<User> & { password: string }) => {
    await new Promise(r => setTimeout(r, 800));
    const exists = mockUsers.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'An account with this email already exists.' };
    const newUser: User = {
      id: `u${Date.now()}`,
      role: (data.role as UserRole) || 'citizen',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      isVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      companyName: data.companyName,
      department: data.department,
    };
    mockUsers.push(newUser);
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
