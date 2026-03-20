import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Upload,
  MapPin,
  FileText,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Briefcase,
  Car,
  Percent,
  Receipt,
  ChevronRight,
  Megaphone,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const VehicleExpenseTracker = () => {
  const [vehicleData, setVehicleData] = useState({
    totalKm: '25000',
    businessKm: '16250',
    fuelCost: '3200',
    maintenanceCost: '850',
    insuranceCost: '1200',
    leaseCost: '0',
  });

  const [showDetails, setShowDetails] = useState(false);

  const businessPercentage =
    vehicleData.totalKm && vehicleData.businessKm
      ? (
          (parseFloat(vehicleData.businessKm) / parseFloat(vehicleData.totalKm)) *
          100
        ).toFixed(1)
      : 0;

  const totalExpenses = [
    parseFloat(vehicleData.fuelCost) || 0,
    parseFloat(vehicleData.maintenanceCost) || 0,
    parseFloat(vehicleData.insuranceCost) || 0,
    parseFloat(vehicleData.leaseCost) || 0,
  ].reduce((a, b) => a + b, 0);

  const deductibleAmount = (
    totalExpenses * (parseFloat(businessPercentage || 0) / 100)
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
        <p className="mt-1 text-xs text-gray-500">Year-end totals for tax filing</p>
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
              <p className="text-xl font-bold">
                {parseInt(vehicleData.totalKm || 0, 10).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Estimated Deduction</p>
                <p className="text-2xl font-bold text-green-700">${deductibleAmount}</p>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                {showDetails ? 'Hide' : 'Details'}
                <ChevronRight
                  size={16}
                  className={`ml-1 transition-transform ${
                    showDetails ? 'rotate-90' : ''
                  }`}
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
                    setVehicleData({ ...vehicleData, totalKm: e.target.value })
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
                    setVehicleData({ ...vehicleData, businessKm: e.target.value })
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
                      setVehicleData({ ...vehicleData, fuelCost: e.target.value })
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
                      setVehicleData({
                        ...vehicleData,
                        maintenanceCost: e.target.value,
                      })
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
                      setVehicleData({
                        ...vehicleData,
                        insuranceCost: e.target.value,
                      })
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
                      setVehicleData({ ...vehicleData, leaseCost: e.target.value })
                    }
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <Link to="/vehicle-expenses" className="block">
            <Button variant="outline" size="sm" fullWidth>
              Manage Vehicle Expenses
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

const GigWorkerDocumentGuide = () => {
  const documents = [
    {
      name: 'Income Records',
      icon: DollarSign,
      colorClasses: 'bg-green-100 text-green-600',
      description: 'T4A, payment statements',
    },
    {
      name: 'Expense Receipts',
      icon: Receipt,
      colorClasses: 'bg-orange-100 text-orange-600',
      description: 'Business purchases',
    },
    {
      name: 'Mileage Log',
      icon: MapPin,
      colorClasses: 'bg-blue-100 text-blue-600',
      description: 'Business km tracked',
    },
    {
      name: 'GST/HST Records',
      icon: Percent,
      colorClasses: 'bg-purple-100 text-purple-600',
      description: 'Annual summary',
    },
  ];

  return (
    <Card className="border-l-4 border-green-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Briefcase size={20} className="mr-2 text-green-600" />
          Gig / Self-Employment Guide
        </h3>
        <p className="text-sm text-gray-500">Useful documents for side income and contract work</p>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div key={doc.name} className="rounded-lg bg-gray-50 p-3">
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${doc.colorClasses}`}
                >
                  <Icon size={16} />
                </div>
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

const EmploymentGuide = () => {
  const documents = [
    { name: 'T4 Slip', icon: FileText, description: 'Employment income slip' },
    { name: 'T4A / Benefits', icon: DollarSign, description: 'Other employer-issued slips' },
    { name: 'RRSP Receipts', icon: Receipt, description: 'Contribution records' },
    { name: 'Medical / Donations', icon: Receipt, description: 'Tax credit support' },
  ];

  return (
    <Card className="border-l-4 border-blue-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Briefcase size={20} className="mr-2 text-blue-600" />
          Employment Filing Guide
        </h3>
        <p className="text-sm text-gray-500">Key records for salary and payroll-based income</p>
      </Card.Header>

      <Card.Body>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div key={doc.name} className="rounded-lg bg-gray-50 p-3">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon size={16} />
                </div>
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

const BusinessGuide = () => {
  return (
    <Card className="border-l-4 border-purple-500">
      <Card.Header>
        <h3 className="flex items-center text-lg font-bold">
          <Building2 size={20} className="mr-2 text-purple-600" />
          Corporation / Business Guide
        </h3>
        <p className="text-sm text-gray-500">Track company-level records separately from personal taxes</p>
      </Card.Header>
      <Card.Body>
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          Keep payroll, sales, expenses, GST/HST records, and corporate documents organized
          to support both personal and business filing.
        </div>
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
          Connect with a verified CA to review deductions, multiple income sources,
          and filing readiness.
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

const Dashboard = () => {
  const { user } = useAuth();

  const taxProfile = user?.taxProfile || {
    employment: true,
    gigWork: user?.userType === 'gig-worker' || user?.userType === 'self-employed',
    selfEmployment: user?.userType === 'self-employed',
    incorporatedBusiness: user?.userType === 'shop-owner' || user?.userType === 'business',
  };

  const hasEmployment = !!taxProfile.employment;
  const hasGigWork = !!taxProfile.gigWork || !!taxProfile.selfEmployment;
  const hasBusiness = !!taxProfile.incorporatedBusiness;

  const documentStats = {
    total: 24,
    uploaded: 8,
    pending: 16,
    completion: 33,
  };

  const upcomingDeadlines = [
    { id: 1, task: 'GST/HST Filing', date: 'Apr 30, 2024', daysLeft: 15, priority: 'high' },
    { id: 2, task: 'RRSP Contribution', date: 'Mar 1, 2024', daysLeft: 0, priority: 'urgent' },
    { id: 3, task: 'Tax Filing Deadline', date: 'Apr 30, 2024', daysLeft: 15, priority: 'high' },
  ];

  const taxNews = [
    { id: 1, title: '2024 tax brackets announced', date: 'Jan 15, 2024' },
    { id: 2, title: 'FHSA limit increased to $8,000', date: 'Jan 10, 2024' },
  ];

  const quickActions = [
    {
      to: '/receipts',
      label: 'Upload Receipt',
      description: 'Scan or upload',
      icon: Upload,
      classes: 'bg-primary-50 hover:bg-primary-100 text-primary-600',
    },
    {
      to: '/mileage',
      label: 'Log Mileage',
      description: 'Track trips',
      icon: MapPin,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
      show: hasGigWork,
    },
    {
      to: '/tax-checklist',
      label: 'Checklist',
      description: 'View progress',
      icon: FileText,
      classes: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
    },
    {
      to: '/find-ca',
      label: 'Find a CA',
      description: 'Get help',
      icon: MessageCircle,
      classes: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
    },
    {
      to: '/shop/dashboard',
      label: 'Business Area',
      description: 'Open records',
      icon: Building2,
      classes: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
      show: hasBusiness,
    },
  ].filter((item) => item.show === undefined || item.show);

  const activeProfiles = [
    hasEmployment ? 'Employment' : null,
    hasGigWork ? 'Gig / Self-Employment' : null,
    hasBusiness ? 'Corporation / Business' : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600">Here&apos;s your tax readiness summary</p>
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
            <p className="text-sm text-gray-500">Pending Documents</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">
              {documentStats.pending}
            </p>
            <p className="mt-1 text-xs text-gray-500">Still required</p>
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
            <p className="text-sm text-gray-500">Active Tax Profiles</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {activeProfiles.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Income types to file</p>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
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
                    <span className="text-sm font-medium text-yellow-800">
                      Latest News
                    </span>
                    <Badge variant="warning">{taxNews.length} new</Badge>
                  </div>
                  <ul className="space-y-2">
                    {taxNews.map((news) => (
                      <li key={news.id} className="text-sm">
                        <span className="text-gray-700">{news.title}</span>
                        <span className="block text-xs text-gray-500">
                          {news.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      RRSP Deadline
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">Mar 1, 2024</p>
                  <p className="mt-1 text-xs text-red-600">
                    Only 14 days left to contribute
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Review Contributions
                  </Button>
                </div>
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

              {documentStats.pending > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="mr-2 text-yellow-600" />
                    <span className="text-sm text-yellow-700">
                      {documentStats.pending} documents still needed
                    </span>
                  </div>
                  <Link
                    to="/tax-checklist"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Upload Now
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>

          {hasEmployment && <EmploymentGuide />}
          {hasGigWork && <GigWorkerDocumentGuide />}
          {hasBusiness && <BusinessGuide />}

          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold">Quick Actions</h2>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.to}
                      className={`rounded-lg p-4 text-center transition-colors ${action.classes}`}
                    >
                      <Icon size={24} className="mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-gray-900">
                        {action.label}
                      </h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          {hasGigWork && <VehicleExpenseTracker />}

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
                Based on uploaded documents
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">RRSP/FHSA</span>
                  <span className="font-medium">$1,250</span>
                </div>
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Donations</span>
                  <span className="font-medium">$375</span>
                </div>
                <div className="flex justify-between rounded bg-white p-2">
                  <span className="text-gray-600">Medical</span>
                  <span className="font-medium">$225</span>
                </div>
                {hasGigWork && (
                  <div className="flex justify-between rounded bg-green-100 p-2">
                    <span className="font-medium">Business Expenses</span>
                    <span className="font-bold text-green-700">$600</span>
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
                      {deadline.daysLeft > 0 ? `${deadline.daysLeft}d left` : 'Today'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <RecommendedHelpCard />

          <Card>
            <Card.Body>
              <h3 className="mb-3 font-bold">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="block rounded p-2 transition-colors hover:bg-gray-50"
                >
                  👤 Profile Settings
                </Link>
                <Link
                  to="/documents"
                  className="block rounded p-2 transition-colors hover:bg-gray-50"
                >
                  📁 All Documents
                </Link>
                <Link
                  to="/support"
                  className="block rounded p-2 transition-colors hover:bg-gray-50"
                >
                  💬 Help & Support
                </Link>
                {hasBusiness && (
                  <Link
                    to="/shop/dashboard"
                    className="block rounded p-2 transition-colors hover:bg-gray-50"
                  >
                    🏢 Business Dashboard
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <div className="flex items-center">
                <Calendar size={20} className="mr-3 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Tax Year 2023</p>
                  <p className="text-xs text-primary-600">
                    Filing deadline: Apr 30, 2024
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