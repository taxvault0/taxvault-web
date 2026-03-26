import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  MapPin,
  FileText,
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
  Home,
  Gift,
  Wallet,
  BadgeDollarSign,
  Store,
  Package,
  Percent,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import {
  buildHouseholdProfile,
  getOptionalProfiles,
} from 'utils/taxProfile';

const SLIP_LABELS = {
  T4: 'T4 Employment Slip',
  T4A: 'T4A Contract / Gig Income',
  T5: 'T5 Investment Income',
  T3: 'T3 Trust Income',
  T5008: 'T5008 Securities Transactions',
  RRSP: 'RRSP Contribution Receipt',
  FHSA: 'FHSA Contribution Record',
  TFSA: 'TFSA Records',
  TUITION: 'Tuition / T2202',
  MEDICAL: 'Medical Receipts',
  DONATIONS: 'Donation Receipts',
  CHILD_CARE: 'Child Care Receipts',
  MOVING: 'Moving Expense Records',
  RENTAL: 'Rental Income Records',
  FOREIGN: 'Foreign Income Documents',
  CRYPTO: 'Crypto Transaction Records',
  BUSINESS_RECORDS: 'Business Records / Statements',
  GST_HST: 'GST / HST Records',
  PAYROLL: 'Payroll Records',
  INVENTORY: 'Inventory Records',
  HOME_OFFICE: 'Home Office Records',
};

const RECEIPT_LABELS = {
  fuel: 'Fuel',
  maintenance: 'Maintenance',
  parking_tolls: 'Parking / Tolls',
  meals: 'Meals',
  mobile_internet: 'Mobile / Internet',
  supplies: 'Supplies',
  equipment: 'Equipment',
  insurance: 'Insurance',
  rent_utilities: 'Rent / Utilities',
  home_office: 'Home Office',
  vehicle_expenses: 'Vehicle Expenses',
  payroll_expenses: 'Payroll Expenses',
  inventory_purchases: 'Inventory Purchases',
  professional_fees: 'Professional Fees',
  other: 'Other Receipts',
};

const OPTIONAL_PROFILE_TO_SLIP = {
  TFSA: 'TFSA',
  RRSP: 'RRSP',
  FHSA: 'FHSA',
  Investments: 'T5',
  Donations: 'DONATIONS',
};

const OPTIONAL_PROFILE_TO_ATTENTION = {
  TFSA: {
    text: 'Review your TFSA records and contribution history',
    to: '/accounts',
  },
  RRSP: {
    text: 'Upload your RRSP contribution receipts',
    to: '/documents?category=rrsp',
  },
  FHSA: {
    text: 'Upload your FHSA contribution records',
    to: '/documents?category=fhsa',
  },
  CCB: {
    text: 'Review your Canada Child Benefit records',
    to: '/accounts',
  },
  Investments: {
    text: 'Upload your investment statements and slips',
    to: '/documents?category=investments',
  },
  Donations: {
    text: 'Upload your charitable donation receipts',
    to: '/documents?category=donations',
  },
};

const GIG_PLATFORM_CONFIG = {
  uber: {
    name: 'Uber Records',
    description: 'Trip earnings, payouts, and annual tax summaries',
    to: '/documents?category=uber',
    icon: Car,
  },
  doordash: {
    name: 'DoorDash Records',
    description: 'Delivery earnings, payouts, and tax summaries',
    to: '/documents?category=doordash',
    icon: Receipt,
  },
  skip: {
    name: 'Skip Records',
    description: 'Order earnings, payouts, and yearly records',
    to: '/documents?category=skip',
    icon: FileText,
  },
  instacart: {
    name: 'Instacart Records',
    description: 'Shopper earnings, payouts, and tax summaries',
    to: '/documents?category=instacart',
    icon: Store,
  },
};

const getSlipAttentionText = (slip) => {
  switch (slip) {
    case 'T4':
      return 'Upload your T4 employment slip';
    case 'T4A':
      return 'Upload your T4A / contract / gig income slip';
    case 'T5':
      return 'Upload your T5 investment income slip';
    case 'T3':
      return 'Upload your T3 trust income slip';
    case 'T5008':
      return 'Upload your T5008 securities transaction records';
    case 'RRSP':
      return 'Upload your RRSP contribution receipts';
    case 'FHSA':
      return 'Upload your FHSA contribution records';
    case 'TFSA':
      return 'Review and upload your TFSA records';
    case 'TUITION':
      return 'Upload your tuition / T2202 documents';
    case 'MEDICAL':
      return 'Upload your medical expense receipts';
    case 'DONATIONS':
      return 'Upload your donation receipts';
    case 'CHILD_CARE':
      return 'Upload your child care receipts';
    case 'MOVING':
      return 'Upload your moving expense records';
    case 'RENTAL':
      return 'Upload your rental income records';
    case 'FOREIGN':
      return 'Upload your foreign income documents';
    case 'CRYPTO':
      return 'Upload your crypto transaction records';
    case 'BUSINESS_RECORDS':
      return 'Upload your business records and statements';
    case 'GST_HST':
      return 'Upload your GST / HST records';
    case 'PAYROLL':
      return 'Upload your payroll records';
    case 'INVENTORY':
      return 'Upload your inventory records';
    case 'HOME_OFFICE':
      return 'Upload your home office records';
    default:
      return `Upload ${SLIP_LABELS[slip] || slip}`;
  }
};

const getReceiptAttentionText = (receipt) => {
  switch (receipt) {
    case 'fuel':
      return 'Upload your fuel receipts';
    case 'maintenance':
      return 'Upload your maintenance receipts';
    case 'parking_tolls':
      return 'Upload your parking and toll receipts';
    case 'meals':
      return 'Upload your meal receipts';
    case 'mobile_internet':
      return 'Upload your mobile and internet bills';
    case 'supplies':
      return 'Upload your supply receipts';
    case 'equipment':
      return 'Upload your equipment receipts';
    case 'insurance':
      return 'Upload your insurance receipts';
    case 'rent_utilities':
      return 'Upload your rent and utility records';
    case 'home_office':
      return 'Upload your home office expense records';
    case 'vehicle_expenses':
      return 'Upload your vehicle expense records';
    case 'payroll_expenses':
      return 'Upload your payroll expense records';
    case 'inventory_purchases':
      return 'Upload your inventory purchase records';
    case 'professional_fees':
      return 'Upload your professional fee receipts';
    default:
      return `Upload ${RECEIPT_LABELS[receipt] || receipt}`;
  }
};

const getSlipRoute = (slip, isSpouse = false) => {
  const prefix = isSpouse ? 'spouse-' : '';

  switch (slip) {
    case 'T4':
      return `/documents?category=${prefix}t4`;
    case 'T4A':
      return isSpouse
        ? '/documents?category=spouse-gig'
        : '/documents?category=t4a';
    case 'RRSP':
      return `/documents?category=${prefix}rrsp`;
    case 'FHSA':
      return `/documents?category=${prefix}fhsa`;
    case 'TFSA':
      return `/documents?category=${prefix}tfsa`;
    case 'TUITION':
      return `/documents?category=${prefix}tuition`;
    case 'MEDICAL':
      return `/documents?category=${prefix}medical`;
    case 'DONATIONS':
      return `/documents?category=${prefix}donations`;
    case 'CHILD_CARE':
      return `/documents?category=${prefix}child-care`;
    case 'MOVING':
      return `/documents?category=${prefix}moving`;
    case 'T5':
    case 'T3':
    case 'T5008':
      return `/documents?category=${prefix}investments`;
    case 'RENTAL':
      return `/documents?category=${prefix}rental`;
    case 'FOREIGN':
      return `/documents?category=${prefix}foreign-income`;
    case 'CRYPTO':
      return `/documents?category=${prefix}crypto`;
    case 'BUSINESS_RECORDS':
      return isSpouse ? '/documents?category=spouse-business' : '/business/sales-income';
    case 'GST_HST':
      return isSpouse ? '/documents?category=spouse-business' : '/business/gst-records';
    case 'PAYROLL':
      return isSpouse ? '/documents?category=spouse-business' : '/business/payroll';
    case 'INVENTORY':
      return isSpouse ? '/documents?category=spouse-business' : '/business/inventory';
    case 'HOME_OFFICE':
      return '/receipts';
    default:
      return '/documents';
  }
};

const getReceiptRoute = (receipt) => {
  switch (receipt) {
    case 'rent_utilities':
      return '/business/rent-utilities';
    case 'payroll_expenses':
      return '/business/payroll';
    case 'inventory_purchases':
      return '/business/inventory';
    default:
      return '/receipts';
  }
};

const OptionalProfilesGuide = ({
  title = 'Optional Tax Accounts & Deductions',
  optionalProfiles,
}) => {
  if (!optionalProfiles.length) return null;

  const iconMap = {
    TFSA: Landmark,
    RRSP: PiggyBank,
    FHSA: Home,
    CCB: BadgeDollarSign,
    Investments: TrendingUp,
    Donations: Gift,
  };

  return (
    <Card className="border-l-4 border-purple-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Wallet size={20} className="mr-2 text-purple-600" />
          {title}
        </h3>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {optionalProfiles.map((item) => {
            const Icon = iconMap[item.label] || FileText;

            return (
              <Link
                key={item.key}
                to={item.to}
                className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">Manage related records</p>
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

const HouseholdSummaryCard = ({ household }) => {
  const spouse = household.spouse;

  return (
    <Card className="border-indigo-200 bg-indigo-50">
      <Card.Body>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-900">Household Tax Summary</p>
            <p className="mt-1 text-sm text-indigo-700">
              Your dashboard includes both your tax profile and your spouse profile.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {household.user.employment && <Badge variant="info">You: T4</Badge>}
            {household.user.gigWork && <Badge variant="success">You: Gig</Badge>}
            {household.user.business && <Badge variant="warning">You: Business</Badge>}

            {spouse?.employment && <Badge variant="info">Spouse: T4</Badge>}
            {spouse?.gigWork && <Badge variant="success">Spouse: Gig</Badge>}
            {spouse?.business && <Badge variant="warning">Spouse: Business</Badge>}
            {spouse?.unemployed && <Badge variant="default">Spouse: Unemployed</Badge>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const IncomeGuideCard = ({ title, icon: Icon, colorClass, documents }) => (
  <Card className={`border-l-4 ${colorClass}`}>
    <Card.Header>
      <h3 className="flex items-center text-lg font-bold">
        <Icon size={20} className="mr-2" />
        {title}
      </h3>
    </Card.Header>

    <Card.Body>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.map((doc) => {
          const ItemIcon = doc.icon;

          return (
            <Link
              key={doc.name}
              to={doc.to}
              className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <ItemIcon size={16} />
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

const Dashboard = () => {
  const { user } = useAuth();

  const household = useMemo(() => buildHouseholdProfile(user), [user]);

  const profile = household.user;
  const spouse = household.spouse;

  const hasSpouse = household.hasSpouse;

  const myOptionalProfiles = getOptionalProfiles(profile);
  const spouseOptionalProfiles = getOptionalProfiles(spouse || {});

  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const selectedReceiptCategories =
    user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];
  const suggestedReceiptCategories =
    user?.onboarding?.suggestedReceiptCategories || [];

  const baseSlipKeys = useMemo(() => {
    const merged = new Set([...selectedSlips, ...suggestedSlips]);

    if (profile.employment) merged.add('T4');
    if (profile.gigWork || profile.selfEmployment) merged.add('T4A');

    if (profile.business) {
      merged.add('BUSINESS_RECORDS');
      merged.add('GST_HST');
      merged.add('PAYROLL');
      merged.add('INVENTORY');
    }

    myOptionalProfiles.forEach((item) => {
      const mapped = OPTIONAL_PROFILE_TO_SLIP[item.label];
      if (mapped) merged.add(mapped);
    });

    return Array.from(merged);
  }, [selectedSlips, suggestedSlips, profile, myOptionalProfiles]);

  const finalReceiptCategories = useMemo(() => {
    const merged = new Set([...selectedReceiptCategories, ...suggestedReceiptCategories]);

    if (profile.gigWork) {
      merged.add('fuel');
      merged.add('maintenance');
      merged.add('parking_tolls');
      merged.add('mobile_internet');
      merged.add('vehicle_expenses');
      merged.add('insurance');
    }

    if (profile.selfEmployment) {
      merged.add('mobile_internet');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
      merged.add('home_office');
    }

    if (profile.business) {
      merged.add('rent_utilities');
      merged.add('payroll_expenses');
      merged.add('inventory_purchases');
      merged.add('insurance');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
    }

    return Array.from(merged);
  }, [selectedReceiptCategories, suggestedReceiptCategories, profile]);

  const normalizedGigPlatforms = useMemo(() => {
    const rawPlatforms =
      user?.gigPlatforms ||
      user?.onboarding?.gigPlatforms ||
      user?.documentPreferences?.gigPlatforms ||
      [];

    return rawPlatforms
      .map((platform) => String(platform).trim().toLowerCase())
      .filter(Boolean);
  }, [user]);

  const gigDocuments = useMemo(() => {
    const platformCards = normalizedGigPlatforms
      .map((platform) => GIG_PLATFORM_CONFIG[platform])
      .filter(Boolean);

    return [
      {
        name: 'T4A / Other Gig Income',
        icon: DollarSign,
        description: 'Contract, commission, or platform income',
        to: '/documents?category=t4a',
      },
      ...platformCards,
      {
        name: 'Mileage',
        icon: MapPin,
        description: 'Track work-related driving',
        to: '/mileage',
      },
    ];
  }, [normalizedGigPlatforms]);

  const myActiveAreas = [
    profile.employment ? 'My T4' : null,
    profile.gigWork ? 'My Gig Work' : null,
    profile.business ? 'My Business' : null,
    ...myOptionalProfiles.map((item) => `My ${item.label}`),
  ].filter(Boolean);

  const spouseActiveAreas = hasSpouse
    ? [
        spouse?.employment ? 'Spouse T4' : null,
        spouse?.gigWork ? 'Spouse Gig Work' : null,
        spouse?.business ? 'Spouse Business' : null,
        spouse?.unemployed ? 'Spouse Unemployed' : null,
        ...spouseOptionalProfiles.map((item) => `Spouse ${item.label}`),
      ].filter(Boolean)
    : [];

  const activeProfiles = [...myActiveAreas, ...spouseActiveAreas];

  const quickActions = [
    {
      to: '/documents',
      label: 'Upload Tax Docs',
      description: 'Slips and tax records',
      icon: FileText,
      classes: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      show: true,
    },
    {
      to: '/receipts',
      label: 'Upload Receipt',
      description: 'Expenses and proof',
      icon: Receipt,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
      show: true,
    },
    {
      to: '/find-ca',
      label: 'Find a CA',
      description: 'Get expert help',
      icon: Briefcase,
      classes: 'bg-rose-50 hover:bg-rose-100 text-rose-600',
      show: true,
    },
    {
      to: '/mileage',
      label: 'Log Mileage',
      description: 'Track work trips',
      icon: MapPin,
      classes: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
      show: profile.gigWork,
    },
    {
      to: '/business/dashboard',
      label: 'Business Area',
      description: 'Open business tools',
      icon: Building2,
      classes: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
      show: profile.business,
    },
    {
      to: '/tax-checklist',
      label: 'Checklist',
      description: hasSpouse ? 'Combined household checklist' : 'See what is missing',
      icon: CheckCircle2,
      classes: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
      show: true,
    },
  ].filter((item) => item.show);

  const slipAttentionItems = baseSlipKeys.map((slip) => ({
    key: `slip-${slip}`,
    text: getSlipAttentionText(slip),
    to: getSlipRoute(slip),
  }));

  const receiptAttentionItems = finalReceiptCategories.map((receipt) => ({
    key: `receipt-${receipt}`,
    text: getReceiptAttentionText(receipt),
    to: getReceiptRoute(receipt),
  }));

  const myOptionalAttentionItems = myOptionalProfiles
    .map((item) => {
      const mapped = OPTIONAL_PROFILE_TO_ATTENTION[item.label];
      if (!mapped) return null;

      return {
        key: `optional-${item.key}`,
        text: mapped.text,
        to: mapped.to || item.to,
      };
    })
    .filter(Boolean);

  const spouseAttentionItems = hasSpouse
    ? [
        spouse?.employment
          ? {
              key: 'spouse-t4',
              text: 'Upload spouse T4 slip',
              to: '/documents?category=spouse-t4',
            }
          : null,
        spouse?.gigWork
          ? {
              key: 'spouse-gig',
              text: 'Upload spouse T4A and spouse gig expenses',
              to: '/documents?category=spouse-gig',
            }
          : null,
        spouse?.business
          ? {
              key: 'spouse-business',
              text: 'Review spouse business records',
              to: '/documents?category=spouse-business',
            }
          : null,
        ...spouseOptionalProfiles
          .map((item) => {
            const mapped = OPTIONAL_PROFILE_TO_ATTENTION[item.label];
            if (!mapped) return null;

            return {
              key: `spouse-optional-${item.key}`,
              text: `Review spouse ${mapped.text.replace(/^Upload your |^Review your /, '').toLowerCase()}`,
              to: item.to || mapped.to,
            };
          })
          .filter(Boolean),
      ].filter(Boolean)
    : [];

  const attentionMap = new Map();
  [
    ...slipAttentionItems,
    ...receiptAttentionItems,
    ...myOptionalAttentionItems,
    ...spouseAttentionItems,
  ].forEach((item) => {
    if (!attentionMap.has(item.text)) {
      attentionMap.set(item.text, item);
    }
  });

  const attentionItems = Array.from(attentionMap.values());

  const documentStats = useMemo(() => {
    const baseTotal =
      baseSlipKeys.length +
      finalReceiptCategories.length +
      myOptionalProfiles.length +
      spouseOptionalProfiles.length +
      (hasSpouse ? 4 : 0);

    const total = Math.max(baseTotal, 1);

    const uploadedSeed =
      Math.floor(baseSlipKeys.length * 0.45) +
      Math.floor(finalReceiptCategories.length * 0.35) +
      myOptionalProfiles.length +
      Math.min(spouseOptionalProfiles.length, 2);

    const uploaded = Math.min(uploadedSeed, total);
    const pending = Math.max(total - uploaded, 0);

    return {
      total,
      uploaded,
      pending,
      completion: Math.round((uploaded / total) * 100),
    };
  }, [
    baseSlipKeys.length,
    finalReceiptCategories.length,
    myOptionalProfiles.length,
    spouseOptionalProfiles.length,
    hasSpouse,
  ]);

  const upcomingDeadlines = [
    {
      id: 1,
      task: hasSpouse ? 'Household Tax Filing Deadline' : 'Tax Filing Deadline',
      date: 'Apr 30, 2026',
      daysLeft: 40,
      priority: 'high',
    },
    profile.business && {
      id: 2,
      task: 'Review Business Records',
      date: 'Apr 20, 2026',
      daysLeft: 30,
      priority: 'info',
    },
    profile.gigWork && {
      id: 3,
      task: 'Review Gig Expenses',
      date: 'Apr 15, 2026',
      daysLeft: 25,
      priority: 'warning',
    },
    hasSpouse && spouse?.gigWork && {
      id: 4,
      task: 'Review Spouse Gig Expenses',
      date: 'Apr 15, 2026',
      daysLeft: 25,
      priority: 'warning',
    },
  ].filter(Boolean);

  const taxNews = [
    { id: 1, title: 'Review all slips before filing', date: 'Mar 2026' },
    { id: 2, title: 'Keep household records organized year-round', date: 'Mar 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">
          {hasSpouse
            ? 'Your dashboard now reflects both your profile and your spouse profile.'
            : 'Your tax dashboard changes based on your tax profile, accounts, and onboarding selections.'}
        </p>
      </div>

      {hasSpouse && <HouseholdSummaryCard household={household} />}

      <Card>
        <Card.Header>
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start with the most common household tasks first.
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
            <p className="mt-2 text-3xl font-bold text-primary-600">{documentStats.uploaded}</p>
            <p className="mt-1 text-xs text-gray-500">Estimated from selected setup</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Pending Items</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">{documentStats.pending}</p>
            <p className="mt-1 text-xs text-gray-500">Still needs attention</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Active Tax Areas</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">{activeProfiles.length}</p>
            <p className="mt-1 text-xs text-gray-500">
              {hasSpouse ? 'User + spouse combined' : 'Primary user only'}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Account Type</p>
            <p
              className={`mt-2 text-3xl font-bold ${
                hasSpouse ? 'text-green-700' : 'text-blue-700'
              }`}
            >
              {hasSpouse ? 'HOUSEHOLD' : 'SINGLE'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {hasSpouse ? 'User + spouse profile active' : 'Only primary user profile active'}
            </p>
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
              {attentionItems.length > 0 ? (
                <div className="relative overflow-hidden">
                  <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
                  <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

                  <div className="flex gap-3 whitespace-nowrap animate-scroll-x">
                    {[...attentionItems, ...attentionItems].map((item, index) => (
                      <Link
                        key={`${item.key}-${index}`}
                        to={item.to}
                        className="inline-flex shrink-0 items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition hover:from-blue-100 hover:to-indigo-100"
                      >
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  No immediate items found. Review your checklist or update your tax profile.
                </div>
              )}
            </Card.Body>
          </Card>

          {baseSlipKeys.includes('T4') && (
            <IncomeGuideCard
              title="Employment"
              icon={Briefcase}
              colorClass="border-blue-500"
              documents={[
                {
                  name: 'T4 Slip',
                  icon: FileText,
                  description: 'Employment income slip',
                  to: '/documents?category=t4',
                },
              ]}
            />
          )}

          {baseSlipKeys.includes('T4A') && (
            <IncomeGuideCard
              title="Gig Platforms & Income"
              icon={Car}
              colorClass="border-green-500"
              documents={gigDocuments}
            />
          )}

          {(baseSlipKeys.includes('BUSINESS_RECORDS') ||
            baseSlipKeys.includes('GST_HST') ||
            baseSlipKeys.includes('PAYROLL') ||
            baseSlipKeys.includes('INVENTORY')) && (
            <IncomeGuideCard
              title="Business"
              icon={Building2}
              colorClass="border-indigo-500"
              documents={[
                {
                  name: 'Business Dashboard',
                  icon: Store,
                  description: 'Open business overview',
                  to: '/business/dashboard',
                },
                {
                  name: 'Sales & Income',
                  icon: DollarSign,
                  description: 'Business income records',
                  to: '/business/sales-income',
                },
                {
                  name: 'GST / HST Records',
                  icon: Percent,
                  description: 'GST tracking and records',
                  to: '/business/gst-records',
                },
                {
                  name: 'Inventory',
                  icon: Package,
                  description: 'Stock and product records',
                  to: '/business/inventory',
                },
              ]}
            />
          )}

          {hasSpouse && spouse?.employment && (
            <IncomeGuideCard
              title="Spouse Employment"
              icon={HeartHandshake}
              colorClass="border-sky-500"
              documents={[
                {
                  name: 'Spouse T4 Slip',
                  icon: FileText,
                  description: 'Employment income slip',
                  to: '/documents?category=spouse-t4',
                },
              ]}
            />
          )}

          {hasSpouse && spouse?.gigWork && (
            <IncomeGuideCard
              title="Spouse Gig / Self-Employment"
              icon={HeartHandshake}
              colorClass="border-teal-500"
              documents={[
                {
                  name: 'Spouse T4A / Income',
                  icon: DollarSign,
                  description: 'Spouse gig income records',
                  to: '/documents?category=spouse-gig',
                },
                {
                  name: 'Spouse Expense Receipts',
                  icon: Receipt,
                  description: 'Spouse gig-related receipts',
                  to: '/documents?category=spouse-gig-expenses',
                },
              ]}
            />
          )}

          {hasSpouse && spouse?.business && (
            <IncomeGuideCard
              title="Spouse Business"
              icon={HeartHandshake}
              colorClass="border-fuchsia-500"
              documents={[
                {
                  name: 'Spouse Business Records',
                  icon: Building2,
                  description: 'Business income and expense records',
                  to: '/documents?category=spouse-business',
                },
              ]}
            />
          )}

          {baseSlipKeys.some((slip) =>
            [
              'RRSP',
              'FHSA',
              'TFSA',
              'TUITION',
              'MEDICAL',
              'DONATIONS',
              'CHILD_CARE',
              'MOVING',
              'T5',
              'T3',
              'T5008',
              'RENTAL',
              'FOREIGN',
              'CRYPTO',
              'HOME_OFFICE',
            ].includes(slip)
          ) && (
            <Card className="border-l-4 border-amber-500">
              <Card.Header>
                <h3 className="flex items-center text-lg font-bold">
                  <FileText size={20} className="mr-2 text-amber-600" />
                  Additional Tax Documents
                </h3>
              </Card.Header>

              <Card.Body>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {baseSlipKeys
                    .filter((slip) =>
                      [
                        'RRSP',
                        'FHSA',
                        'TFSA',
                        'TUITION',
                        'MEDICAL',
                        'DONATIONS',
                        'CHILD_CARE',
                        'MOVING',
                        'T5',
                        'T3',
                        'T5008',
                        'RENTAL',
                        'FOREIGN',
                        'CRYPTO',
                        'HOME_OFFICE',
                      ].includes(slip)
                    )
                    .map((slip) => (
                      <Link
                        key={slip}
                        to={getSlipRoute(slip)}
                        className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                              <FileText size={16} />
                            </div>
                            <p className="text-sm font-medium">{SLIP_LABELS[slip] || slip}</p>
                            <p className="text-xs text-gray-500">Upload and manage records</p>
                          </div>
                          <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {finalReceiptCategories.length > 0 && (
            <Card className="border-l-4 border-emerald-500">
              <Card.Header>
                <h3 className="flex items-center text-lg font-bold">
                  <Receipt size={20} className="mr-2 text-emerald-600" />
                  Expected Receipt Categories
                </h3>
              </Card.Header>

              <Card.Body>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {finalReceiptCategories.map((receipt) => (
                    <Link
                      key={receipt}
                      to={getReceiptRoute(receipt)}
                      className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Receipt size={16} />
                          </div>
                          <p className="text-sm font-medium">
                            {RECEIPT_LABELS[receipt] || receipt}
                          </p>
                          <p className="text-xs text-gray-500">Upload related receipts</p>
                        </div>
                        <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          <OptionalProfilesGuide
            title="My Optional Tax Accounts"
            optionalProfiles={myOptionalProfiles}
          />

          {hasSpouse && spouseOptionalProfiles.length > 0 && (
            <OptionalProfilesGuide
              title="Spouse Optional Tax Accounts"
              optionalProfiles={spouseOptionalProfiles}
            />
          )}

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-xl font-bold">
                  <Bell size={20} className="mr-2 text-primary-500" />
                  Tax Updates & Reminders
                </h2>
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
                    Review your {hasSpouse ? 'household' : 'tax'} checklist before filing
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
                Based on uploaded household documents and tracked deductions
              </p>

              <div className="space-y-2 text-sm">
                {baseSlipKeys.includes('T4') && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Employment Credits</span>
                    <span className="font-medium">$750</span>
                  </div>
                )}
                {baseSlipKeys.includes('T4A') && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Gig / Self-Employment</span>
                    <span className="font-medium">$600</span>
                  </div>
                )}
                {(baseSlipKeys.includes('RRSP') || baseSlipKeys.includes('FHSA')) && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Registered Accounts</span>
                    <span className="font-medium">$500</span>
                  </div>
                )}
                {baseSlipKeys.includes('DONATIONS') && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Donations</span>
                    <span className="font-medium">$200</span>
                  </div>
                )}
                {hasSpouse && spouse?.employment && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Spouse Employment Credits</span>
                    <span className="font-medium">$450</span>
                  </div>
                )}
              </div>
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
                        deadline.priority === 'high'
                          ? 'warning'
                          : deadline.priority === 'warning'
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
                Connect with a verified CA to review your household tax readiness.
              </p>

              <Link to="/find-ca" className="mt-4 block">
                <Button variant="primary" fullWidth>
                  Book Consultation
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <div className="flex items-center">
                <Calendar size={20} className="mr-3 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Current Tax Year</p>
                  <p className="text-xs text-primary-600">
                    Keep user and spouse records updated throughout the year
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