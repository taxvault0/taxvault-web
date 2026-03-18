import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileText,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Percent,
  Calculator,
  Store,
  Briefcase,
  Home,
  Package,
  DollarSign,
  PiggyBank,
  BarChart3,
  Calendar,
  Video,
  Search,
  CalendarClock,
  UserPlus,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // Regular user navigation items
  const userNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tax-checklist', icon: FileText, label: 'Tax Checklist', badge: 5 },
    { path: '/receipts', icon: Receipt, label: 'Receipts', badge: 3 },
    { path: '/mileage', icon: MapPin, label: 'Mileage' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/accounts', icon: PiggyBank, label: 'Accounts', badge: 2 },
    { path: '/profile', icon: Users, label: 'Profile' },
    { path: '/find-ca', icon: UserPlus, label: 'Find a CA', badge: 3 },
    { path: '/life-events', icon: HeartPulse, label: 'Life Events' },
    { path: '/consultations', icon: Video, label: 'Consultations', badge: 2 }, // Using Video icon for consultations
  ];

  // Gig worker specific items
  const gigWorkerNavItems = [
    { path: '/gst-dashboard', icon: Percent, label: 'GST/HST' },
    { path: '/business-use-calculator', icon: Calculator, label: 'Business Use' },
    { path: '/t2125-form', icon: FileText, label: 'T2125 Form' },
  ];

  // Shop owner specific items
  const shopOwnerNavItems = [
    { path: '/shop/dashboard', icon: Store, label: 'Shop Dashboard' },
    { path: '/shop/sales', icon: DollarSign, label: 'Sales' },
    { path: '/shop/inventory', icon: Package, label: 'Inventory' },
    { path: '/shop/payroll', icon: Users, label: 'Payroll' },
    { path: '/shop/rent-utilities', icon: Home, label: 'Rent & Bills' },
  ];

  // CA navigation items - CLEANED UP (removed duplicates)
  const caNavItems = [
    { path: '/ca/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/ca/analytics', icon: BarChart3, label: 'Analytics' },
    { 
      path: '/ca/requests', 
      icon: Clock, 
      label: 'Consultation Requests', 
      badge: 8, 
      badgeColor: 'warning' 
    },
    { path: '/ca/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/ca/clients', icon: Users, label: 'Clients', badge: 12 },
    { path: '/ca/search', icon: Search, label: 'Find Client' },
    { 
      path: '/ca/reviews', 
      icon: Clock, 
      label: 'Pending Reviews', 
      badge: 5, 
      badgeColor: 'warning' 
    },
    { path: '/ca/earnings', icon: DollarSign, label: 'Earnings' },
    { path: '/ca/reports', icon: TrendingUp, label: 'Reports' },
  ];

  // Bottom navigation items (always shown)
  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  // Determine which navigation items to show based on user role and type
  const getNavItems = () => {
    // If user is CA, show only CA items
    if (user?.role === 'ca') {
      return caNavItems;
    }

    // For regular users, start with base user items
    let items = [...userNavItems];

    // Add gig worker items if user type is gig-worker
    if (user?.userType === 'gig-worker') {
      items = [...items, ...gigWorkerNavItems];
    }

    // Add shop owner items if user type is shop-owner
    if (user?.userType === 'shop-owner') {
      items = [...items, ...shopOwnerNavItems];
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <span className="text-2xl font-bold text-primary-500">TaxVault</span>
            {user?.userType === 'gig-worker' && (
              <span className="ml-2 text-xs bg-secondary-500 text-white px-2 py-1 rounded-full">
                Gig
              </span>
            )}
            {user?.userType === 'shop-owner' && (
              <span className="ml-2 text-xs bg-success-500 text-white px-2 py-1 rounded-full">
                Shop
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={onClose}
                >
                  <item.icon size={18} className="mr-3" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.badgeColor === 'warning'
                          ? 'bg-warning-100 text-warning-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Bottom navigation */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="space-y-1">
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={onClose}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;