import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  MapPin,
  FileText,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Briefcase,
  Car,
  Receipt,
  ChevronRight,
  Megaphone,
  Building2,
  CheckCircle2,
  PiggyBank,
  Landmark,
  ArrowRight,
  Home,
  Gift,
  Wallet,
  BadgeDollarSign,
  Store,
  Package,
  Percent,
  Users,
  Calculator,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

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

  const hasSelfEmployedSource =
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

    selfEmployed: toBoolean(rawTaxProfile.gigWork) || hasSelfEmployedSource,

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

const VehicleExpenseTracker = ({ visible = true }) => {
  const [vehicleData, setVehicleData] = useState({
    totalKm: '25000',
    businessKm: '16250',
    fuelCost: '3200',
    maintenanceCost: '850',
    insuranceCost: '1200',
    leaseCost: '0',
  });

  const [showDetails, setShowDetails] = useState(false);

  if (!visible) return null;

  const totalKm = parseFloat(vehicleData.totalKm) || 0;
  const businessKm = parseFloat(vehicleData.businessKm) || 0;

  const businessPercentage =
    totalKm > 0 ? ((businessKm / totalKm) * 100).toFixed(1) : '0.0';

  const totalExpenses = [
    parseFloat(vehicleData.fuelCost) || 0,
    parseFloat(vehicleData.maintenanceCost) || 0,
    parseFloat(vehicleData.insuranceCost) || 0,
    parseFloat(vehicleData.leaseCost) || 0,
  ].reduce((a, b) => a + b, 0);

  const deductibleAmount = (
    totalExpenses * (parseFloat(businessPercentage) / 100)
  ).toFixed(2);

  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-lg font-bold">
            <Car size={20} className="mr-2 text-blue-600" />
            Vehicle Expense Summary
          </h3>
          <Badge variant="info">Annual</Badge>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Track mileage and vehicle deductions for self-employed work
        </p>
      </Card.Header>

      <Card.Body>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Business Use</p>
              <p className="text-xl font-bold text-blue-600">{businessPercentage}%</p>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Total KM</p>
              <p className="text-xl font-bold">{totalKm.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Estimated Deduction</p>
                <p className="text-2xl font-bold text-green-700">${deductibleAmount}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                {showDetails ? 'Hide' : 'Details'}
                <ChevronRight
                  size={16}
                  className={`ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Update Year-End Numbers</h4>

              <div>
                <label className="text-xs text-gray-600">Total KM driven this year</label>
                <input
                  type="number"
                  value={vehicleData.totalKm}
                  onChange={(e) =>
                    setVehicleData((prev) => ({ ...prev, totalKm: e.target.value }))
                  }
                  className="mt-1 w-full rounded border p-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Business KM driven</label>
                <input
                  type="number"
                  value={vehicleData.businessKm}
                  onChange={(e) =>
                    setVehicleData((prev) => ({ ...prev, businessKm: e.target.value }))
                  }
                  className="mt-1 w-full rounded border p-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Fuel ($)</label>
                  <input
                    type="number"
                    value={vehicleData.fuelCost}
                    onChange={(e) =>
                      setVehicleData((prev) => ({ ...prev, fuelCost: e.target.value }))
                    }
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Maintenance ($)</label>
                  <input
                    type="number"
                    value={vehicleData.maintenanceCost}
                    onChange={(e) =>
                      setVehicleData((prev) => ({
                        ...prev,
                        maintenanceCost: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Insurance ($)</label>
                  <input
                    type="number"
                    value={vehicleData.insuranceCost}
                    onChange={(e) =>
                      setVehicleData((prev) => ({
                        ...prev,
                        insuranceCost: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Lease ($)</label>
                  <input
                    type="number"
                    value={vehicleData.leaseCost}
                    onChange={(e) =>
                      setVehicleData((prev) => ({ ...prev, leaseCost: e.target.value }))
                    }
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <Link to="/mileage" className="block">
            <Button variant="outline" size="sm" fullWidth>
              Manage Vehicle Expenses
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

const EmploymentGuide = ({ showWorkFromHome }) => {
  const documents = [
    {
      name: 'T4 Slip',
      icon: FileText,
      description: 'Employment income slip',
      to: '/documents?category=t4',
    },
    {
      name: 'RRSP Records',
      icon: PiggyBank,
      description: 'Contribution slips and records',
      to: '/documents?category=rrsp',
    },
    {
      name: 'TFSA Records',
      icon: Landmark,
      description: 'Savings account records',
      to: '/documents?category=tfsa',
    },
    {
      name: 'Investments',
      icon: DollarSign,
      description: 'Investment slips and statements',
      to: '/documents?category=investments',
    },
    ...(showWorkFromHome
      ? [
          {
            name: 'Work From Home',
            icon: Home,
            description: 'Internet and home office records',
            to: '/documents?category=work-from-home',
          },
        ]
      : []),
  ];

  return (
    <Card className="border-l-4 border-blue-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Briefcase size={20} className="mr-2 text-blue-600" />
          Employment (T4) Guide
        </h3>
        <p className="text-sm text-gray-500">
          Upload employment slips and personal tax records here
        </p>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = doc.icon;

            return (
              <Link
                key={doc.name}
                to={doc.to}
                className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </div>

                  <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

const SelfEmploymentGuide = () => {
  const documents = [
    {
      name: 'Self-Employment Income / T4A',
      icon: DollarSign,
      description: 'Contract income, platform payouts, T4A slips',
      to: '/gig/documents/income-records',
    },
    {
      name: 'Fuel & Maintenance',
      icon: Receipt,
      description: 'Vehicle-related receipts',
      to: '/receipts',
    },
    {
      name: 'Mileage Log',
      icon: MapPin,
      description: 'Track work-related driving',
      to: '/mileage',
    },
    {
      name: 'Phone / Internet',
      icon: FileText,
      description: 'Mobile and internet deductions',
      to: '/documents?category=phone-internet',
    },
  ];

  return (
    <Card className="border-l-4 border-green-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Car size={20} className="mr-2 text-green-600" />
          Self-Employment Guide
        </h3>
        <p className="text-sm text-gray-500">
          Keep income, T4A, receipts, and mileage organized
        </p>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = doc.icon;

            return (
              <Link
                key={doc.name}
                to={doc.to}
                className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </div>

                  <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

const OptionalProfilesGuide = ({ optionalProfiles }) => {
  const items = optionalProfiles.map((profile) => ({
    name: profile.label,
    icon: profile.icon,
    description: profile.description,
    to: profile.to,
    iconBg: profile.iconBg,
    iconColor: profile.iconColor,
  }));

  return (
    <Card className="border-l-4 border-purple-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Wallet size={20} className="mr-2 text-purple-600" />
          Optional Tax Accounts & Deductions
        </h3>
        <p className="text-sm text-gray-500">
          Turn these on or off any time from your account settings
        </p>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.to}
                className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
                    >
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>

                  <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>

        <Link to="/accounts" className="mt-4 block">
          <Button variant="outline" fullWidth>
            Manage Tax Accounts
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

const RecommendedHelpCard = () => {
  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-slate-50 to-blue-50">
      <Card.Body>
        <div className="mb-3 flex items-center">
          <Megaphone size={18} className="mr-2 text-blue-600" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Recommended
          </p>
        </div>

        <h3 className="text-lg font-bold text-gray-900">Need expert tax help?</h3>
        <p className="mt-2 text-sm text-gray-600">
          Connect with a verified CA to review your deductions and filing readiness.
        </p>

        <Link to="/find-ca" className="mt-4 block">
          <Button variant="primary" fullWidth>
            Book Consultation
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

const BusinessOnlyDashboard = ({ user, optionalProfiles }) => {
  const businessName = user?.businessInfo?.businessName || 'Your Business';

  const businessQuickActions = [
    {
      to: '/business/dashboard',
      label: 'Open Dashboard',
      description: 'Go to business overview',
      icon: Store,
      classes: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
    },
    {
      to: '/business/business-info',
      label: 'Business Info',
      description: 'Profile, type, GST setup',
      icon: Building2,
      classes: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
    },
    {
      to: '/business/sales-income',
      label: 'Sales & Income',
      description: 'Track revenue',
      icon: DollarSign,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
    },
    {
      to: '/business/inventory',
      label: 'Inventory',
      description: 'Products and stock',
      icon: Package,
      classes: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
    },
    {
      to: '/business/payroll',
      label: 'Payroll',
      description: 'Employee payments',
      icon: Users,
      classes: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
    },
    {
      to: '/business/gst-records',
      label: 'GST/HST',
      description: 'Tax records and review',
      icon: Percent,
      classes: 'bg-pink-50 hover:bg-pink-100 text-pink-600',
    },
  ];

  const businessStats = [
    {
      label: 'Business Profile',
      value: 'Active',
      subtext: businessName,
      icon: Building2,
      valueClass: 'text-indigo-700',
    },
    {
      label: 'Business Areas',
      value: '6',
      subtext: 'Core business sections',
      icon: Store,
      valueClass: 'text-blue-700',
    },
    {
      label: 'Records Health',
      value: 'Good',
      subtext: 'Keep income and GST updated',
      icon: CheckCircle2,
      valueClass: 'text-green-700',
    },
    {
      label: 'Next Review',
      value: 'Apr 20',
      subtext: 'Business records check',
      icon: Calendar,
      valueClass: 'text-orange-700',
    },
  ];

  const businessAttentionItems = [
    'Review business sales and income records',
    'Update GST / HST records',
    'Confirm business expenses are categorized properly',
    'Review payroll records if you have employees',
    'Update inventory counts if applicable',
  ];

  const businessDeadlines = [
    {
      id: 1,
      task: 'Review Business Records',
      date: 'Apr 20, 2026',
      daysLeft: 30,
      priority: 'info',
    },
    {
      id: 2,
      task: 'General Tax Filing Deadline',
      date: 'Apr 30, 2026',
      daysLeft: 40,
      priority: 'high',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">
            This is your business dashboard for {businessName}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Business Owner</Badge>
        </div>
      </div>

      <Card className="border-indigo-200 bg-indigo-50">
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-3">
                <Building2 size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-semibold text-indigo-900">Business-only account detected</p>
                <p className="text-sm text-indigo-700">
                  Employment and gig/self-employment sections are hidden. Only business tools are shown.
                </p>
              </div>
            </div>

            <Link to="/business/dashboard">
              <Button variant="primary">
                Open Business Dashboard
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">Business Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start from your business area only.
          </p>
        </Card.Header>

        <Card.Body>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {businessQuickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`rounded-lg p-4 text-center transition-colors ${action.classes}`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {businessStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className={`mt-2 text-3xl font-bold ${stat.valueClass}`}>{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-500">{stat.subtext}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <Icon size={18} className="text-gray-600" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <Card.Header>
              <h2 className="flex items-center text-xl font-bold">
                <AlertTriangle size={20} className="mr-2 text-primary-500" />
                Business Items to Review
              </h2>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {businessAttentionItems.map((task) => (
                  <div
                    key={task}
                    className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
                  >
                    {task}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-l-4 border-indigo-500">
            <Card.Header>
              <h3 className="flex items-center text-lg font-bold">
                <Store size={20} className="mr-2 text-indigo-600" />
                Business Management
              </h3>
              <p className="text-sm text-gray-500">
                Access your business tools without employment or gig sections.
              </p>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    name: 'Business Dashboard',
                    icon: Store,
                    description: 'Overview of your business area',
                    to: '/business/dashboard',
                  },
                  {
                    name: 'Business Info',
                    icon: Building2,
                    description: 'Business profile and registration',
                    to: '/business/business-info',
                  },
                  {
                    name: 'Sales & Income',
                    icon: DollarSign,
                    description: 'Track revenue and sales records',
                    to: '/business/sales-income',
                  },
                  {
                    name: 'Inventory',
                    icon: Package,
                    description: 'Manage stock and products',
                    to: '/business/inventory',
                  },
                  {
                    name: 'Payroll',
                    icon: Users,
                    description: 'Manage employees and payroll',
                    to: '/business/payroll',
                  },
                  {
                    name: 'GST / HST Records',
                    icon: Percent,
                    description: 'Review GST and filing data',
                    to: '/business/gst-records',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <Icon size={16} />
                          </div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>

                        <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {optionalProfiles.length > 0 && (
            <OptionalProfilesGuide optionalProfiles={optionalProfiles} />
          )}

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-xl font-bold">
                  <Bell size={20} className="mr-2 text-primary-500" />
                  Business Updates & Reminders
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">Business Tips</span>
                    <Badge variant="warning">2 items</Badge>
                  </div>

                  <ul className="space-y-2">
                    <li className="text-sm">
                      <span className="text-gray-700">Keep sales and expense records updated weekly</span>
                      <span className="block text-xs text-gray-500">Mar 2026</span>
                    </li>
                    <li className="text-sm">
                      <span className="text-gray-700">Review GST / HST records before filing</span>
                      <span className="block text-xs text-gray-500">Mar 2026</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Next Important Review
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-red-700">Apr 20, 2026</p>
                  <p className="mt-1 text-xs text-red-600">
                    Review your business records and GST data
                  </p>

                  <Link to="/business/gst-records">
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Review Business Records
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
            <Card.Body>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-bold">
                  <TrendingUp size={20} className="mr-2 text-green-600" />
                  Business Snapshot
                </h3>
              </div>

              <p className="mb-2 text-3xl font-bold text-green-700">Business Only</p>
              <p className="mb-4 text-xs text-gray-600">
                Your dashboard is focused only on business tools and records.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Business Dashboard</span>
                  <span className="font-medium">Enabled</span>
                </div>
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Employment Section</span>
                  <span className="font-medium">Hidden</span>
                </div>
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Gig Section</span>
                  <span className="font-medium">Hidden</span>
                </div>
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Receipts & Uploads</span>
                  <span className="font-medium">Hidden</span>
                </div>
              </div>

              <Link to="/business/dashboard" className="block">
                <Button variant="primary" fullWidth className="mt-4">
                  Open Business Area
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="border-warning-200 bg-warning-50">
            <Card.Header>
              <h3 className="flex items-center text-lg font-bold">
                <Clock size={20} className="mr-2 text-warning-600" />
                Upcoming Deadlines
              </h3>
            </Card.Header>

            <Card.Body>
              <div className="space-y-3">
                {businessDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{deadline.task}</p>
                      <p className="text-xs text-gray-500">Due: {deadline.date}</p>
                    </div>

                    <Badge
                      variant={
                        deadline.priority === 'urgent'
                          ? 'error'
                          : deadline.priority === 'high'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {deadline.daysLeft}d left
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <RecommendedHelpCard />

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <div className="flex items-center">
                <Calendar size={20} className="mr-3 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Current Tax Year</p>
                  <p className="text-xs text-primary-600">
                    Keep your business records updated throughout the year
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const taxProfile = useMemo(() => buildTaxProfile(user), [user]);

  const hasEmployment = taxProfile.employment;
  const hasSelfEmployed = taxProfile.selfEmployed;
  const hasBusiness = taxProfile.business;
  const isBusinessOnly = hasBusiness && !hasEmployment && !hasSelfEmployed;

  const optionalProfiles = [
    taxProfile.tfsa && {
      key: 'tfsa',
      label: 'TFSA',
      icon: Landmark,
      description: 'Savings account records',
      to: '/documents?category=tfsa',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    taxProfile.rrsp && {
      key: 'rrsp',
      label: 'RRSP',
      icon: PiggyBank,
      description: 'Contribution slips and records',
      to: '/documents?category=rrsp',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    taxProfile.fhsa && {
      key: 'fhsa',
      label: 'FHSA',
      icon: Home,
      description: 'First home savings account records',
      to: '/documents?category=fhsa',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    taxProfile.ccb && {
      key: 'ccb',
      label: 'CCB',
      icon: BadgeDollarSign,
      description: 'Canada Child Benefit related records',
      to: '/documents?category=ccb',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
    taxProfile.investments && {
      key: 'investments',
      label: 'Investments',
      icon: TrendingUp,
      description: 'Investment slips and statements',
      to: '/documents?category=investments',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    taxProfile.donations && {
      key: 'donations',
      label: 'Donations',
      icon: Gift,
      description: 'Charitable donation receipts',
      to: '/documents?category=donations',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
  ].filter(Boolean);

  if (isBusinessOnly) {
    return <BusinessOnlyDashboard user={user} optionalProfiles={optionalProfiles} />;
  }

  const totalRequiredDocuments = (() => {
    let total = 0;

    if (hasEmployment) total += 2;
    if (hasSelfEmployed) total += 6;
    if (hasBusiness) total += 5;

    total += optionalProfiles.length;

    return total;
  })();

  const uploadedBase =
    hasEmployment && hasSelfEmployed && hasBusiness
      ? 10
      : hasEmployment && hasSelfEmployed
      ? 8
      : hasSelfEmployed || hasBusiness
      ? 6
      : 4;

  const documentStats = {
    total: totalRequiredDocuments,
    uploaded: Math.min(uploadedBase + optionalProfiles.length, totalRequiredDocuments || 0),
    pending: Math.max(
      totalRequiredDocuments -
        Math.min(uploadedBase + optionalProfiles.length, totalRequiredDocuments || 0),
      0
    ),
    completion:
      totalRequiredDocuments > 0
        ? Math.round(
            (Math.min(uploadedBase + optionalProfiles.length, totalRequiredDocuments || 0) /
              totalRequiredDocuments) *
              100
          )
        : 0,
  };

  const activeProfiles = [
    hasEmployment ? 'T4 Employment' : null,
    hasSelfEmployed ? 'Self-Employed' : null,
    hasBusiness ? 'Business' : null,
    ...optionalProfiles.map((item) => item.label),
  ].filter(Boolean);

  const attentionItems = [
    hasEmployment ? 'Upload your T4 slip' : null,
    hasEmployment ? 'Add work-from-home records if applicable' : null,
    hasSelfEmployed ? 'Upload fuel, maintenance, mobile, and insurance receipts' : null,
    hasSelfEmployed ? 'Upload self-employment income statements / T4A slips' : null,
    hasSelfEmployed ? 'Review mileage records' : null,
    hasBusiness ? 'Update business sales, expenses, and GST records' : null,
    taxProfile.rrsp ? 'Add RRSP contribution slips' : null,
    taxProfile.tfsa ? 'Add TFSA records if needed for review' : null,
    taxProfile.fhsa ? 'Upload FHSA contribution records' : null,
    taxProfile.investments ? 'Upload investment slips and statements' : null,
    taxProfile.donations ? 'Upload donation receipts' : null,
  ].filter(Boolean);

  const quickActions = [
    {
      to: '/documents',
      label: 'Upload Tax Docs',
      description: 'Slips, T4, T4A, accounts',
      icon: FileText,
      classes: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      show: true,
    },
    {
      to: '/receipts',
      label: 'Upload Receipt',
      description: hasSelfEmployed ? 'Fuel, insurance, phone' : 'Add expenses',
      icon: Receipt,
      classes: 'bg-primary-50 hover:bg-primary-100 text-primary-600',
      show: hasSelfEmployed || hasBusiness,
    },
    {
      to: '/mileage',
      label: 'Log Mileage',
      description: 'Track business trips',
      icon: MapPin,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
      show: hasSelfEmployed,
    },
    {
      to: '/accounts',
      label: 'Manage Accounts',
      description: 'TFSA, RRSP, FHSA, more',
      icon: Wallet,
      classes: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
      show: true,
    },
    {
      to: '/tax-checklist',
      label: 'Checklist',
      description: 'See what is missing',
      icon: CheckCircle2,
      classes: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
      show: true,
    },
    {
      to: hasBusiness ? '/business/dashboard' : '/find-ca',
      label: hasBusiness ? 'Business Area' : 'Find a CA',
      description: hasBusiness ? 'Open business tools' : 'Get expert help',
      icon: hasBusiness ? Building2 : MessageCircle,
      classes: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
      show: true,
    },
  ].filter((item) => item.show);

  const upcomingDeadlines = [
    {
      id: 1,
      task: 'Tax Filing Deadline',
      date: 'Apr 30, 2026',
      daysLeft: 40,
      priority: 'high',
    },
    ...(hasSelfEmployed
      ? [
          {
            id: 2,
            task: 'Review Self-Employment Expenses',
            date: 'Apr 15, 2026',
            daysLeft: 25,
            priority: 'warning',
          },
        ]
      : []),
    ...(hasBusiness
      ? [
          {
            id: 3,
            task: 'Review Business Records',
            date: 'Apr 20, 2026',
            daysLeft: 30,
            priority: 'info',
          },
        ]
      : []),
  ];

  const taxNews = [
    { id: 1, title: 'Review all slips before filing', date: 'Mar 2026' },
    { id: 2, title: 'Keep receipts and records organized year-round', date: 'Mar 2026' },
  ];

  const dashboardDescription = [
    hasEmployment ? 'employment' : null,
    hasSelfEmployed ? 'self-employment' : null,
    hasBusiness ? 'business' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">
            Your tax dashboard for {dashboardDescription || 'personal tax'} records.
          </p>
        </div>

        {activeProfiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeProfiles.map((profile) => (
              <Badge key={profile} variant="info">
                {profile}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Card className="border-primary-200 bg-primary-50">
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-800">
                Your dashboard changes with your account type
              </p>
              <p className="mt-1 text-sm text-primary-700">
                If you later add T4, self-employment, business, TFSA, RRSP, FHSA, CCB,
                investments, or donations, your sidebar and dashboard will update automatically.
              </p>
            </div>

            <Link to="/accounts">
              <Button variant="primary">Manage Tax Profile</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {hasBusiness && (
        <Card className="border-indigo-200 bg-indigo-50">
          <Card.Body>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3">
                  <Building2 size={20} className="text-indigo-700" />
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">Business Area</p>
                  <p className="text-sm text-indigo-700">
                    Open your business dashboard for income, expenses, GST, payroll, and more.
                  </p>
                </div>
              </div>

              <Link to="/business/dashboard">
                <Button variant="primary">
                  Open Business Dashboard
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start with the most common tasks first.
          </p>
        </Card.Header>

        <Card.Body>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`rounded-lg p-4 text-center transition-colors ${action.classes}`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Documents Uploaded</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {documentStats.uploaded}
            </p>
            <p className="mt-1 text-xs text-gray-500">This tax year</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Pending Items</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">
              {documentStats.pending}
            </p>
            <p className="mt-1 text-xs text-gray-500">Still needs attention</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Estimated Savings</p>
            <p className="mt-2 text-3xl font-bold text-green-700">$2,450</p>
            <p className="mt-1 text-xs text-gray-500">Based on current uploads</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Active Tax Areas</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {activeProfiles.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Shown on your dashboard</p>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <Card.Header>
              <h2 className="flex items-center text-xl font-bold">
                <AlertTriangle size={20} className="mr-2 text-primary-500" />
                What Needs Attention
              </h2>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {attentionItems.map((task) => (
                  <div
                    key={task}
                    className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
                  >
                    {task}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-xl font-bold">
                  <FileText size={20} className="mr-2 text-primary-500" />
                  Document Checklist
                </h2>

                <Link to="/tax-checklist">
                  <Button variant="ghost" size="sm">
                    View Full Checklist
                  </Button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {documentStats.total}
                  </p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-success-600">
                    {documentStats.uploaded}
                  </p>
                  <p className="text-xs text-gray-500">Uploaded</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-600">
                    {documentStats.pending}
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-info-600">
                    {documentStats.completion}%
                  </p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>

              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-primary-600"
                  style={{ width: `${documentStats.completion}%` }}
                />
              </div>
            </Card.Body>
          </Card>

          {hasEmployment && <EmploymentGuide showWorkFromHome />}
          {hasSelfEmployed && <SelfEmploymentGuide />}
          {optionalProfiles.length > 0 && (
            <OptionalProfilesGuide optionalProfiles={optionalProfiles} />
          )}

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-xl font-bold">
                  <Bell size={20} className="mr-2 text-primary-500" />
                  Tax Updates & Reminders
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">Latest Tips</span>
                    <Badge variant="warning">{taxNews.length} items</Badge>
                  </div>

                  <ul className="space-y-2">
                    {taxNews.map((news) => (
                      <li key={news.id} className="text-sm">
                        <span className="text-gray-700">{news.title}</span>
                        <span className="block text-xs text-gray-500">{news.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Next Important Deadline
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-red-700">Apr 30, 2026</p>
                  <p className="mt-1 text-xs text-red-600">
                    Review your tax checklist before filing
                  </p>

                  <Link to="/tax-checklist">
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Review Checklist
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <VehicleExpenseTracker visible={hasSelfEmployed} />

          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
            <Card.Body>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-bold">
                  <TrendingUp size={20} className="mr-2 text-green-600" />
                  Estimated Tax Savings
                </h3>
              </div>

              <p className="mb-2 text-3xl font-bold text-green-700">$2,450</p>
              <p className="mb-4 text-xs text-gray-600">
                Based on uploaded documents and tracked deductions
              </p>

              <div className="space-y-2 text-sm">
                {hasEmployment && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Employment Credits</span>
                    <span className="font-medium">$750</span>
                  </div>
                )}

                {hasSelfEmployed && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Self-Employment Expenses</span>
                    <span className="font-medium">$600</span>
                  </div>
                )}

                {hasBusiness && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Business Expenses</span>
                    <span className="font-medium">$875</span>
                  </div>
                )}

                {(taxProfile.rrsp || taxProfile.fhsa) && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">RRSP / FHSA</span>
                    <span className="font-medium">$1,250</span>
                  </div>
                )}

                {(taxProfile.donations || taxProfile.investments) && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Investments / Donations</span>
                    <span className="font-medium">$225</span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-green-200 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Savings</span>
                  <span className="text-xl text-green-700">$2,450</span>
                </div>
              </div>

              <Button variant="primary" fullWidth className="mt-4">
                View Breakdown
              </Button>
            </Card.Body>
          </Card>

          <Card className="border-warning-200 bg-warning-50">
            <Card.Header>
              <h3 className="flex items-center text-lg font-bold">
                <Clock size={20} className="mr-2 text-warning-600" />
                Upcoming Deadlines
              </h3>
            </Card.Header>

            <Card.Body>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{deadline.task}</p>
                      <p className="text-xs text-gray-500">Due: {deadline.date}</p>
                    </div>

                    <Badge
                      variant={
                        deadline.priority === 'urgent'
                          ? 'error'
                          : deadline.priority === 'high'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {deadline.daysLeft}d left
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <RecommendedHelpCard />

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <div className="flex items-center">
                <Calendar size={20} className="mr-3 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Current Tax Year</p>
                  <p className="text-xs text-primary-600">
                    Keep slips, receipts, and records updated throughout the year
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;