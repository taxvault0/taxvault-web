import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users for development
const DEMO_USERS = {
  'user@demo.com': {
    id: 'demo-user-1',
    name: 'John Doe',
    email: 'user@demo.com',
    role: 'user',
    userType: 'regular',
    password: 'demo1234'
  },
  'ca@demo.com': {
    id: 'demo-ca-1',
    name: 'Jane Smith, CA',
    email: 'ca@demo.com',
    role: 'ca',
    userType: 'professional',
    password: 'demo1234',
    firmName: 'Smith & Associates'
  },
  'shop@demo.com': {
    id: 'demo-shop-1',
    name: 'Mike Wilson',
    email: 'shop@demo.com',
    role: 'user',
    userType: 'shop-owner',
    password: 'demo1234',
    businessName: 'Wilson Retail'
  },
  'gig@test.com': {
    id: 'test-gig-1',
    name: 'Sarah Johnson',
    email: 'gig@test.com',
    role: 'user',
    userType: 'gig-worker',
    password: 'password123'
  },
  'employee@test.com': {
    id: 'test-emp-1',
    name: 'Tom Brown',
    email: 'employee@test.com',
    role: 'user',
    userType: 'employee',
    password: 'password123'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // FORCE DEMO MODE - Always true since we don't have a backend
  const isDemoMode = true;

  useEffect(() => {
    const initializeAuth = async () => {
      // Check localStorage for saved user
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // We don't need fetchUser since we're in demo mode
  const fetchUser = async () => {
    // Not used in demo mode
  };

  const login = async (email, password, role = 'user', caNumber = null) => {
    // Demo mode login only
    const demoUser = DEMO_USERS[email];
    
    if (demoUser && demoUser.password === password) {
      // Check if role matches (if specified)
      if (role === 'ca' && demoUser.role !== 'ca') {
        toast.error('This account is not a CA account');
        return { success: false, error: 'Invalid account type' };
      }
      if (role === 'user' && demoUser.role !== 'user') {
        toast.error('This account is not a user account');
        return { success: false, error: 'Invalid account type' };
      }

      const userData = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        userType: demoUser.userType,
        ...(demoUser.businessName && { businessName: demoUser.businessName }),
        ...(demoUser.firmName && { firmName: demoUser.firmName })
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${demoUser.name}!`);
      return { success: true, user: userData };
    }
    
    toast.error('Invalid email or password');
    return { success: false, error: 'Invalid credentials' };
  };

  // Enhanced demo login function - supports all user types
  const demoLogin = async (userType) => {
    try {
      // Map user types to demo emails
      const emailMap = {
        'user': 'user@demo.com',
        'ca': 'ca@demo.com',
        'shop': 'shop@demo.com',
        'shop-owner': 'shop@demo.com',
        'gig': 'gig@test.com',
        'gig-worker': 'gig@test.com',
        'employee': 'employee@test.com'
      };
      
      const email = emailMap[userType];
      if (!email) {
        toast.error('Invalid demo user type');
        return { success: false, error: 'Invalid demo user type' };
      }
      
      const demoUser = DEMO_USERS[email];
      
      if (demoUser) {
        const userData = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          userType: demoUser.userType,
          ...(demoUser.businessName && { businessName: demoUser.businessName }),
          ...(demoUser.firmName && { firmName: demoUser.firmName })
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Logged in as ${demoUser.name}`);
        return { success: true, user: userData };
      }
      
      toast.error('Demo login failed');
      return { success: false, error: 'Demo login failed' };
    } catch (error) {
      toast.error('Demo login failed');
      return { success: false, error: error.message };
    }
  };

  const verifyMfa = async (userId, token) => {
    toast.error('MFA not available in demo mode');
    return { success: false };
  };

  const register = async (userData) => {
    toast.success('Registration successful! (Demo mode)');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUserType = (newUserType) => {
    setUser(prev => ({
      ...prev,
      userType: newUserType
    }));
    toast.success(`User type updated to ${newUserType}`);
  };

  const value = {
    user,
    loading,
    login,
    demoLogin,
    verifyMfa,
    register,
    logout,
    updateUserType,
    isAuthenticated: !!user,
    isCA: user?.role === 'ca',
    isAdmin: user?.role === 'admin',
    isGigWorker: user?.userType === 'gig-worker',
    isShopOwner: user?.userType === 'shop-owner',
    isEmployee: user?.userType === 'employee',
    isDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};