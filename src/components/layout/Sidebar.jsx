import React, { useMemo } from 'react';
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
  UserPlus,
  HeartPulse,
  MessageCircle,
  Building2,
  Landmark,
  Gift,
  Wallet,
  BadgeDollarSign,
} from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';

const toBoolean = (value) => value === true;

const normalizeIncomeSources = (sources) => {
  if (!Array.isArray(sources)) return [];
  return sources.map((item) => String(item).trim().toLowerCase());
};

const normalizeUserType = (userType) => String(userType || '').trim().toLowerCase();

const buildTaxProfile = (user) => {
  const rawTaxProfile = user?.taxProfile || {};
  const businessInfo = user?.businessInfo || {};
  const incomeSources = normalizeIncomeSources(user?.incomeSources);
  const userType = normalizeUserType(user?.userType);

  const hasEmploymentSource =
    incomeSources.includes('employment') ||
    incomeSources.includes('t4') ||
    incomeSources.includes('employee') ||
    userType === 'employee' ||
    userType === 't4' ||
    userType === 't4-employee';

  const hasGigSource =
    incomeSources.includes('gig') ||
    incomeSources.includes('gig_work') ||
    incomeSources.includes('gig-work') ||
    incomeSources.includes('self_employed') ||
    incomeSources.includes('self-employed') ||
    userType === 'gig-worker' ||
    userType === 'gig' ||
    userType === 'self-employed';

  const hasBusinessSource =
    incomeSources.includes('business') ||
    incomeSources.includes('business_owner') ||
    incomeSources.includes('business-owner') ||
    userType === 'business' ||
    userType === 'business_owner' ||
    userType === 'business-owner' ||
    Boolean(businessInfo.businessName) ||
    Boolean(businessInfo.businessType) ||
    Boolean(businessInfo.gstRegistered) ||
    Boolean(businessInfo.hasEmployees) ||
    Boolean(businessInfo.hasInventory) ||
    toBoolean(rawTaxProfile.business) ||
    toBoolean(rawTaxProfile.incorporatedBusiness);

  return {
    employment: toBoolean(rawTaxProfile.employment) || hasEmploymentSource,
    gigWork: toBoolean(rawTaxProfile.gigWork) || hasGigSource,
    business:
      toBoolean(rawTaxProfile.business) ||
      toBoolean(rawTaxProfile.incorporatedBusiness) ||
      hasBusinessSource,

    tfsa: toBoolean(rawTaxProfile.tfsa),
    rrsp: toBoolean(rawTaxProfile.rrsp),
    fhsa: toBoolean(rawTaxProfile.fhsa),
    ccb: toBoolean(rawTaxProfile.ccb),
    investments: toBoolean(rawTaxProfile.investments),
    donations: toBoolean(rawTaxProfile.donations),
  };
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const unreadCount = 3;
  const taxProfile = useMemo(() => buildTaxProfile(user), [user]);

  const hasEmployment = taxProfile.employment;
  const hasGigWork = taxProfile.gigWork;
  const hasBusiness = taxProfile.business;
  const isBusinessOnly = hasBusiness && !hasEmployment && !hasGigWork;

  const activeOptionalProfiles = [
    taxProfile.tfsa && {
      path: '/documents?category=tfsa',
      icon: Landmark,
      label: 'TFSA',
    },
    taxProfile.rrsp && {
      path: '/documents?category=rrsp',
      icon: PiggyBank,
      label: 'RRSP',
    },
    taxProfile.fhsa && {
      path: '/documents?category=fhsa',
      icon: Home,
      label: 'FHSA',
    },
    taxProfile.ccb && {
      path: '/documents?category=ccb',
      icon: BadgeDollarSign,
      label: 'CCB',
    },
    taxProfile.investments && {
      path: '/documents?category=investments',
      icon: TrendingUp,
      label: 'Investments',
    },
    taxProfile.donations && {
      path: '/documents?category=donations',
      icon: Gift,
      label: 'Donations',
    },
  ].filter(Boolean);

  const standardUserSections = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/tax-checklist', icon: FileText, label: 'Tax Checklist', badge: 5 },
      ],
    },
    {
      title: 'Uploads & Records',
      items: [
        { path: '/documents', icon: FileText, label: 'Tax Documents' },
        {
          path: '/receipts',
          icon: Receipt,
          label: 'Receipts & Uploads',
          badge: hasGigWork ? 3 : undefined,
        },
        { path: '/accounts', icon: Wallet, label: 'Accounts & Deductions' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { path: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
        { path: '/consultations', icon: Video, label: 'Consultations', badge: 2 },
        { path: '/find-ca', icon: UserPlus, label: 'Find a CA' },
      ],
    },
    {
      title: 'Profile',
      items: [
        { path: '/profile', icon: Users, label: 'Profile' },
        { path: '/life-events', icon: HeartPulse, label: 'Life Events' },
      ],
    },
  ];

  const businessOnlySections = [
    {
      title: 'Business',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/business/dashboard', icon: Store, label: 'Business Dashboard' },
        { path: '/business/business-info', icon: Building2, label: 'Business Info' },
        { path: '/business/sales-income', icon: DollarSign, label: 'Sales & Income' },
        { path: '/business/inventory', icon: Package, label: 'Inventory' },
        { path: '/business/payroll', icon: Users, label: 'Payroll' },
        { path: '/business/rent-utilities', icon: Home, label: 'Rent & Bills' },
        { path: '/business/gst-records', icon: Percent, label: 'GST/HST Records' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { path: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
        { path: '/consultations', icon: Video, label: 'Consultations', badge: 2 },
        { path: '/find-ca', icon: UserPlus, label: 'Find a CA' },
      ],
    },
    {
      title: 'Profile',
      items: [{ path: '/profile', icon: Users, label: 'Profile' }],
    },
  ];

  const employmentSection = {
    title: 'Employment',
    items: [
      { path: '/documents?category=t4', icon: Briefcase, label: 'T4 & Employment Slips' },
    ],
  };

  const gigWorkerSection = {
    title: 'Gig / Self-Employment',
    items: [
      { path: '/gig/documents/income-records', icon: DollarSign, label: 'Gig Income / T4A' },
      { path: '/receipts', icon: Receipt, label: 'Gig Expense Receipts' },
      { path: '/mileage', icon: MapPin, label: 'Mileage' },
      { path: '/gst-dashboard', icon: Percent, label: 'GST/HST' },
      { path: '/business-use-calculator', icon: Calculator, label: 'Business Use' },
      { path: '/t2125-form', icon: FileText, label: 'T2125 Form' },
    ],
  };

  const businessSection = {
    title: 'Business',
    items: [
      { path: '/business/dashboard', icon: Store, label: 'Business Dashboard' },
      { path: '/business/business-info', icon: Building2, label: 'Business Info' },
      { path: '/business/sales-income', icon: DollarSign, label: 'Sales & Income' },
      { path: '/business/inventory', icon: Package, label: 'Inventory' },
      { path: '/business/payroll', icon: Users, label: 'Payroll' },
      { path: '/business/rent-utilities', icon: Home, label: 'Rent & Bills' },
      { path: '/business/gst-records', icon: Percent, label: 'GST/HST Records' },
    ],
  };

  const optionalProfilesSection =
    activeOptionalProfiles.length > 0
      ? {
          title: 'Active Tax Accounts',
          items: [
            { path: '/accounts', icon: Wallet, label: 'Manage Tax Accounts' },
            ...activeOptionalProfiles,
          ],
        }
      : null;

  const caSections = [
    {
      title: 'Overview',
      items: [
        { path: '/ca/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/ca/analytics', icon: BarChart3, label: 'Analytics' },
      ],
    },
    {
      title: 'Work',
      items: [
        {
          path: '/ca/requests',
          icon: Clock,
          label: 'Requests',
          badge: 8,
          badgeColor: 'warning',
        },
        { path: '/ca/clients', icon: Users, label: 'Clients', badge: 12 },
        { path: '/ca/search', icon: Search, label: 'Find Client' },
        {
          path: '/ca/reviews',
          icon: Clock,
          label: 'Reviews',
          badge: 5,
          badgeColor: 'warning',
        },
      ],
    },
    {
      title: 'Schedule',
      items: [
        { path: '/ca/calendar', icon: Calendar, label: 'Calendar' },
        { path: '/ca/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
      ],
    },
    {
      title: 'Finance',
      items: [
        { path: '/ca/earnings', icon: DollarSign, label: 'Earnings' },
        { path: '/ca/reports', icon: TrendingUp, label: 'Reports' },
      ],
    },
  ];

  const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  let sections = [];

  if (user?.role === 'ca') {
    sections = caSections;
  } else if (isBusinessOnly) {
    sections = [...businessOnlySections];
    if (optionalProfilesSection) sections.push(optionalProfilesSection);
  } else {
    sections = [...standardUserSections];

    if (hasEmployment) sections.push(employmentSection);
    if (hasGigWork) sections.push(gigWorkerSection);
    if (hasBusiness) sections.push(businessSection);
    if (optionalProfilesSection) sections.push(optionalProfilesSection);
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 border-r bg-white
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-xl font-bold text-primary-600">TaxVault</span>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={`${section.title}-${item.path}-${item.label}`}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              item.badgeColor === 'warning'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-1 border-t p-3">
            {bottomItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;