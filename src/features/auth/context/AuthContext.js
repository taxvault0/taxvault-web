import React, { createContext, useState, useContext, useEffect } from 'react';
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

const normalizeTaxProfile = (user) => {
  if (user?.taxProfile) {
    return {
      employment: !!user.taxProfile.employment,
      gigWork: !!user.taxProfile.gigWork,
      selfEmployment: !!user.taxProfile.selfEmployment,
      incorporatedBusiness: !!user.taxProfile.incorporatedBusiness,
    };
  }

  return {
    employment:
      user?.userType === 'employee' ||
      user?.userType === 'regular' ||
      !user?.userType,
    gigWork: user?.userType === 'gig-worker',
    selfEmployment: user?.userType === 'self-employed' || user?.userType === 'contractor',
    incorporatedBusiness:
      user?.userType === 'shop-owner' ||
      user?.userType === 'small-business' ||
      user?.userType === 'business',
  };
};

const getPrimaryUserType = (taxProfile) => {
  if (taxProfile?.incorporatedBusiness) return 'business';
  if (taxProfile?.gigWork) return 'gig-worker';
  if (taxProfile?.selfEmployment) return 'self-employed';
  return 'employee';
};

const buildUserData = (rawUser) => {
  const taxProfile = normalizeTaxProfile(rawUser);

  return {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    role: rawUser.role || 'user',
    userType: rawUser.userType || getPrimaryUserType(taxProfile),
    taxProfile,
    phone: rawUser.phone || rawUser.phoneNumber || '',
    address: rawUser.address || '',
    city: rawUser.city || '',
    province: rawUser.province || '',
    postalCode: rawUser.postalCode || '',
    country: rawUser.country || 'Canada',
    assignedCAId: rawUser.assignedCAId || rawUser.caId || null,
    assignedCA: rawUser.assignedCA || null,
    maritalStatus: rawUser.maritalStatus || '',
    spouseInfo: rawUser.spouseInfo || null,
    dependents: rawUser.dependents || [],
    profile: rawUser.profile || {},
    clientId: rawUser.clientId || `TV-${String(rawUser.id || '0001').toUpperCase()}`,
    memberSince: rawUser.memberSince || new Date().getFullYear().toString(),
    ...(rawUser.businessName && { businessName: rawUser.businessName }),
    ...(rawUser.firmName && { firmName: rawUser.firmName }),
    ...(rawUser.caNumber && { caNumber: rawUser.caNumber }),
  };
};

// Demo users
const DEMO_USERS = {
  'user@demo.com': {
    id: 'demo-user-1',
    name: 'John Doe',
    email: 'user@demo.com',
    role: 'user',
    userType: 'employee',
    password: 'demo1234',
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
    },
    clientId: 'TV-DEMO-USER-1',
  },
  'ca@demo.com': {
    id: 'demo-ca-1',
    name: 'Jane Smith, CA',
    email: 'ca@demo.com',
    role: 'ca',
    userType: 'professional',
    password: 'demo1234',
    firmName: 'Smith & Associates',
    caNumber: '123456',
    clientId: 'TV-DEMO-CA-1',
  },
  'shop@demo.com': {
    id: 'demo-shop-1',
    name: 'Mike Wilson',
    email: 'shop@demo.com',
    role: 'user',
    userType: 'business',
    password: 'demo1234',
    businessName: 'Wilson Retail',
    taxProfile: {
      employment: false,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: true,
    },
    clientId: 'TV-DEMO-SHOP-1',
  },
  'gig@test.com': {
    id: 'test-gig-1',
    name: 'Sarah Johnson',
    email: 'gig@test.com',
    role: 'user',
    userType: 'gig-worker',
    password: 'password123',
    taxProfile: {
      employment: false,
      gigWork: true,
      selfEmployment: false,
      incorporatedBusiness: false,
    },
    clientId: 'TV-GIG-1001',
  },
  'employee@test.com': {
    id: 'test-emp-1',
    name: 'Tom Brown',
    email: 'employee@test.com',
    role: 'user',
    userType: 'employee',
    password: 'password123',
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
    },
    clientId: 'TV-EMP-1001',
  },
  'mixed@test.com': {
    id: 'test-mixed-1',
    name: 'Alex Martin',
    email: 'mixed@test.com',
    role: 'user',
    userType: 'employee',
    password: 'password123',
    assignedCAId: 'demo-ca-1',
    assignedCA: {
      id: 'demo-ca-1',
      name: 'Jane Smith, CA',
      firmName: 'Smith & Associates',
    },
    taxProfile: {
      employment: true,
      gigWork: true,
      selfEmployment: false,
      incorporatedBusiness: true,
    },
    businessName: 'Martin Consulting Inc.',
    clientId: 'TV-MIXED-1001',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isDemoMode = true;

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(buildUserData(parsedUser));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role = 'user') => {
    const demoUser = DEMO_USERS[email];

    if (demoUser && demoUser.password === password) {
      if (role === 'ca' && demoUser.role !== 'ca') {
        toast.error('This account is not a CA account');
        return { success: false, error: 'Invalid account type' };
      }

      if (role === 'user' && demoUser.role !== 'user') {
        toast.error('This account is not a user account');
        return { success: false, error: 'Invalid account type' };
      }

      const userData = buildUserData(demoUser);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    }

    toast.error('Invalid email or password');
    return { success: false, error: 'Invalid credentials' };
  };

  const demoLogin = async (userType) => {
    try {
      const emailMap = {
        user: 'user@demo.com',
        ca: 'ca@demo.com',
        shop: 'shop@demo.com',
        'shop-owner': 'shop@demo.com',
        business: 'shop@demo.com',
        gig: 'gig@test.com',
        'gig-worker': 'gig@test.com',
        employee: 'employee@test.com',
        mixed: 'mixed@test.com',
      };

      const email = emailMap[userType];
      if (!email) {
        toast.error('Invalid demo user type');
        return { success: false, error: 'Invalid demo user type' };
      }

      const demoUser = DEMO_USERS[email];
      const userData = buildUserData(demoUser);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Logged in as ${userData.name}`);
      return { success: true, user: userData };
    } catch (error) {
      toast.error('Demo login failed');
      return { success: false, error: error.message };
    }
  };

  const verifyMfa = async () => {
    toast.error('MFA not available in demo mode');
    return { success: false };
  };

  const register = async (userData) => {
    const builtUser = buildUserData({
      id: `user-${Date.now()}`,
      role: 'user',
      ...userData,
      profile: userData.profile || {},
      memberSince: new Date().getFullYear().toString(),
      clientId: `TV-${Date.now().toString().slice(-8)}`,
    });

    setUser(builtUser);
    localStorage.setItem('user', JSON.stringify(builtUser));
    toast.success('Registration successful!');

    return { success: true, user: builtUser };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUserType = (newUserType) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        userType: newUserType,
      };

      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });

    toast.success(`User type updated to ${newUserType}`);
  };

  const updateTaxProfile = (nextTaxProfile) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedTaxProfile = {
        employment: !!nextTaxProfile.employment,
        gigWork: !!nextTaxProfile.gigWork,
        selfEmployment: !!nextTaxProfile.selfEmployment,
        incorporatedBusiness: !!nextTaxProfile.incorporatedBusiness,
      };

      const updated = {
        ...prev,
        taxProfile: updatedTaxProfile,
        userType: getPrimaryUserType(updatedTaxProfile),
      };

      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });

    toast.success('Tax profiles updated');
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
    updateTaxProfile,
    isAuthenticated: !!user,
    isCA: user?.role === 'ca',
    isAdmin: user?.role === 'admin',
    isGigWorker: !!user?.taxProfile?.gigWork,
    isSelfEmployed: !!user?.taxProfile?.selfEmployment,
    isBusinessOwner: !!user?.taxProfile?.incorporatedBusiness,
    isEmployee: !!user?.taxProfile?.employment,
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};