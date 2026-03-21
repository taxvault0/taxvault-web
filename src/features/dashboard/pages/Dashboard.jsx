import React, { useMemo } from 'react';
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

const OptionalProfilesGuide = ({ title = 'Optional Tax Accounts & Deductions', optionalProfiles }) => {
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
  const isBusinessOnly = household.userBusinessOnly;

  const myOptionalProfiles = getOptionalProfiles(profile);
  const spouseOptionalProfiles = getOptionalProfiles(spouse || {});

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
      description: 'T4, T4A, spouse records',
      icon: FileText,
      classes: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      show: !isBusinessOnly,
    },
    {
      to: '/receipts',
      label: 'Upload Receipt',
      description: 'Gig and expense receipts',
      icon: Receipt,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
      show: profile.gigWork,
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
      to: '/accounts',
      label: 'Manage Accounts',
      description: 'RRSP, TFSA, FHSA, more',
      icon: Wallet,
      classes: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
      show: true,
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

  const attentionItems = [
    profile.employment ? 'Upload your T4 slip' : null,
    profile.gigWork ? 'Upload your T4A and gig expense receipts' : null,
    profile.business ? 'Review your business sales, expenses, and GST records' : null,
    hasSpouse && spouse?.employment ? 'Upload spouse T4 slip' : null,
    hasSpouse && spouse?.gigWork ? 'Upload spouse T4A and spouse gig expenses' : null,
    hasSpouse && spouse?.business ? 'Review spouse business records' : null,
    hasSpouse && spouse?.unemployed ? 'Check spouse RRSP, TFSA, FHSA, donations, and investments' : null,
  ].filter(Boolean);

  const documentStats = {
    total: 8 + myOptionalProfiles.length + spouseOptionalProfiles.length + (hasSpouse ? 6 : 0),
    uploaded: 4 + myOptionalProfiles.length + Math.min(spouseOptionalProfiles.length, 2),
  };
  documentStats.pending = Math.max(documentStats.total - documentStats.uploaded, 0);
  documentStats.completion =
    documentStats.total > 0
      ? Math.round((documentStats.uploaded / documentStats.total) * 100)
      : 0;

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">
            {hasSpouse
              ? 'Your dashboard now reflects both your profile and your spouse profile.'
              : 'Your tax dashboard changes based on your tax profile.'}
          </p>
        </div>

        {activeProfiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeProfiles.map((profileItem) => (
              <Badge key={profileItem} variant="info">
                {profileItem}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {hasSpouse && <HouseholdSummaryCard household={household} />}

      <Card className="border-primary-200 bg-primary-50">
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-800">
                Household-aware tax profile
              </p>
              <p className="mt-1 text-sm text-primary-700">
                The dashboard now updates from user + spouse income types instead of hardcoded roles.
              </p>
            </div>

            <Link to="/accounts">
              <Button variant="primary">Manage Tax Profile</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

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
            <p className="mt-1 text-xs text-gray-500">Household total</p>
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
            <p className="mt-1 text-xs text-gray-500">User + spouse combined</p>
          </Card.Body>
        </Card>

       <Card>
        <Card.Body>
          <p className="text-sm text-gray-500">Account Type</p>
          <p className={`mt-2 text-3xl font-bold ${hasSpouse ? 'text-green-700' : 'text-blue-700'}`}>
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

          {profile.employment && (
            <IncomeGuideCard
              title="My Employment"
              icon={Briefcase}
              colorClass="border-blue-500"
              documents={[
                {
                  name: 'My T4 Slip',
                  icon: FileText,
                  description: 'Employment income slip',
                  to: '/documents?category=t4',
                },
              ]}
            />
          )}

          {profile.gigWork && (
            <IncomeGuideCard
              title="My Gig / Self-Employment"
              icon={Car}
              colorClass="border-green-500"
              documents={[
                {
                  name: 'My T4A / Income',
                  icon: DollarSign,
                  description: 'Platform payouts and income slips',
                  to: '/gig/documents/income-records',
                },
                {
                  name: 'My Gig Receipts',
                  icon: Receipt,
                  description: 'Fuel, maintenance, phone, insurance',
                  to: '/receipts',
                },
                {
                  name: 'My Mileage',
                  icon: MapPin,
                  description: 'Track work-related driving',
                  to: '/mileage',
                },
              ]}
            />
          )}

          {profile.business && (
            <IncomeGuideCard
              title="My Business"
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

          {hasSpouse && spouse?.unemployed && (
            <IncomeGuideCard
              title="Spouse Optional Records"
              icon={HeartHandshake}
              colorClass="border-gray-400"
              documents={[
                {
                  name: 'Spouse RRSP / TFSA / FHSA',
                  icon: Wallet,
                  description: 'Optional accounts and contribution records',
                  to: '/documents?category=spouse-optional',
                },
              ]}
            />
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
                {profile.employment && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">My Employment Credits</span>
                    <span className="font-medium">$750</span>
                  </div>
                )}
                {profile.gigWork && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">My Gig Expenses</span>
                    <span className="font-medium">$600</span>
                  </div>
                )}
                {hasSpouse && spouse?.employment && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Spouse Employment Credits</span>
                    <span className="font-medium">$450</span>
                  </div>
                )}
                {hasSpouse && spouse?.gigWork && (
                  <div className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">Spouse Gig Expenses</span>
                    <span className="font-medium">$400</span>
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