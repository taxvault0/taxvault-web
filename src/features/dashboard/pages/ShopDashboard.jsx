import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  DollarSign,
  FileText,
  Users,
  Percent,
  Package,
  TrendingUp,
  Calendar,
  ChevronRight,
  MapPin,
  Star,
  UserPlus,
  Receipt,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Wallet,
  PieChart,
  BarChart3,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import StatsCard from 'components/ui/StatsCard';
import { PROVINCES } from 'constants/provinces';

const ShopDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');

  const years = [2024, 2023, 2022, 2021];

  const stats = {
    totalSales: 245000,
    totalExpenses: 185000,
    netIncome: 60000,
    gstCollected: 12250,
    employees: 3,
    inventoryValue: 45000,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'sale',
      description: 'Monthly sales uploaded',
      date: '2024-03-15',
      status: 'verified',
    },
    {
      id: 2,
      type: 'expense',
      description: 'March rent receipt',
      date: '2024-03-14',
      status: 'pending',
    },
    {
      id: 3,
      type: 'payroll',
      description: 'Payroll processed',
      date: '2024-03-10',
      status: 'verified',
    },
    {
      id: 4,
      type: 'gst',
      description: 'GST return filed',
      date: '2024-03-05',
      status: 'verified',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      task: 'GST/HST Return',
      dueDate: '2024-04-30',
      daysLeft: 15,
      priority: 'high',
    },
    {
      id: 2,
      task: 'Payroll Source Deductions',
      dueDate: '2024-04-15',
      daysLeft: 0,
      priority: 'high',
    },
    {
      id: 3,
      task: 'April Rent Receipt',
      dueDate: '2024-04-05',
      daysLeft: -10,
      priority: 'overdue',
    },
  ];

  const recommendedCAs = [
    {
      id: 1,
      initials: 'DC',
      name: 'David Chen, CPA',
      firm: 'Chen & Associates',
      distance: '2.3',
      rating: 4.8,
      status: 'Accepting',
      specialties: ['Retail Expert', 'Franchise', 'GST/HST'],
    },
    {
      id: 2,
      initials: 'LW',
      name: 'Lisa Wong, CPA',
      firm: 'Wong Financial',
      distance: '4.1',
      rating: 4.9,
      status: 'Accepting',
      specialties: ['Inventory', 'Payroll', 'Corporate Tax'],
    },
    {
      id: 3,
      initials: 'RS',
      name: 'Raj Singh, CPA',
      firm: 'Singh & Co.',
      distance: '1.8',
      rating: 4.7,
      status: 'Accepting',
      specialties: ['Small Business', 'Tax Planning', 'QuickBooks'],
    },
  ];

  const provinceInfo = PROVINCES.find((p) => p.id === province);

  const getTaxRateDisplay = () => {
    if (!provinceInfo) return '';

    switch (provinceInfo.taxSystem) {
      case 'GST only':
        return `GST Rate: ${provinceInfo.gst}%`;
      case 'GST + PST':
        return `GST ${provinceInfo.gst}% + PST ${provinceInfo.pst}%`;
      case 'GST + QST':
        return `GST ${provinceInfo.gst}% + QST ${provinceInfo.qst}%`;
      case 'HST':
        return `HST Rate: ${provinceInfo.hst}%`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Shop Owner Dashboard
            </h1>
            <Badge variant="gold" className="text-sm">
              <Store size={14} className="mr-1" />
              Retail/Franchise
            </Badge>
          </div>
          <p className="mt-1 text-gray-500">
            Welcome back! Here&apos;s your business overview for {selectedYear}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedYear === year
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Tax info banner */}
      <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100">
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="rounded-lg bg-primary-200 p-2">
                <Percent className="text-primary-700" size={24} />
              </div>
              <div className="ml-3">
                <p className="font-medium text-primary-800">
                  Tax System: {provinceInfo?.taxSystem}
                </p>
                <p className="text-sm text-primary-600">{getTaxRateDisplay()}</p>
              </div>
            </div>

            <Link to="/shop/gst-records">
              <Button
                variant="outline"
                size="sm"
                className="border-primary-300 text-primary-700 hover:bg-primary-200"
              >
                View GST/HST Details
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          trendValue={12}
          color="primary"
        />
        <StatsCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          icon={Wallet}
          trend="down"
          trendValue={5}
          color="warning"
        />
        <StatsCard
          title="Net Income"
          value={`$${stats.netIncome.toLocaleString()}`}
          icon={PieChart}
          trend="up"
          trendValue={8}
          color="success"
        />
        <StatsCard
          title="GST Collected"
          value={`$${stats.gstCollected.toLocaleString()}`}
          icon={Percent}
          trend="up"
          trendValue={15}
          color="info"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left main content */}
        <div className="space-y-6 xl:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.employees}
                  </p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <Users size={24} className="text-primary-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.inventoryValue.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-success-100 p-3">
                  <Package size={24} className="text-success-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Monthly Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(stats.totalSales / 12).toFixed(0)}
                  </p>
                </div>
                <div className="rounded-full bg-info-100 p-3">
                  <BarChart3 size={24} className="text-info-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <Link
                  to="/shop/sales-income"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <DollarSign
                    className="mx-auto mb-2 text-primary-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Sales</p>
                  <p className="text-xs text-gray-500">Add monthly sales</p>
                </Link>

                <Link
                  to="/shop/inventory"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <Package
                    className="mx-auto mb-2 text-success-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Inventory</p>
                  <p className="text-xs text-gray-500">Track purchases</p>
                </Link>

                <Link
                  to="/shop/payroll"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <Users
                    className="mx-auto mb-2 text-info-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Payroll</p>
                  <p className="text-xs text-gray-500">Manage employees</p>
                </Link>

                <Link
                  to="/shop/rent-utilities"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <FileText
                    className="mx-auto mb-2 text-warning-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Rent & Bills</p>
                  <p className="text-xs text-gray-500">Upload receipts</p>
                </Link>

                <Link
                  to="/shop/rent-utilities"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <Receipt
                    className="mx-auto mb-2 text-purple-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Expenses</p>
                  <p className="text-xs text-gray-500">Track spending</p>
                </Link>

                <Link
                  to="/shop/gst-records"
                  className="group rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md"
                >
                  <Percent
                    className="mx-auto mb-2 text-secondary-500 transition-transform group-hover:scale-110"
                    size={24}
                  />
                  <p className="text-sm font-medium">Tax Summary</p>
                  <p className="text-xs text-gray-500">GST/PST details</p>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Find CA */}
          <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50">
            <Card.Body>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-lg bg-primary-200 p-2">
                    <UserPlus className="text-primary-700" size={24} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-primary-800">
                      Find a Chartered Accountant
                    </h3>
                    <p className="text-sm text-primary-600">
                      Specializing in retail & franchise accounting
                    </p>
                  </div>
                </div>

                <Link
                  to="/find-ca"
                  className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View All
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {recommendedCAs.map((ca) => (
                  <Link
                    key={ca.id}
                    to={`/find-ca/${ca.id}`}
                    className="rounded-lg border border-gray-100 bg-white p-4 transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-secondary-100">
                          <span className="text-lg font-bold text-primary-600">
                            {ca.initials}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900">{ca.name}</p>
                          <p className="text-sm text-gray-500">{ca.firm}</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        {ca.status}
                      </Badge>
                    </div>

                    <div className="mb-3 flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      <span>{ca.distance} km away • </span>
                      <div className="ml-1 flex items-center">
                        <Star size={14} className="fill-current text-yellow-400" />
                        <span className="ml-1 font-medium">{ca.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {ca.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="info"
                          size="sm"
                          className="bg-primary-50 text-primary-700"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center text-xs text-primary-600">
                      <Clock size={12} className="mr-1" />
                      <span>Typically responds within 2 hours</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/find-ca"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Browse all {provinceInfo?.name} CAs specializing in retail →
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Document status */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Document Status</h3>
                <Link
                  to="/documents"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Manage documents
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link
                  to="/shop/business-info"
                  className="group rounded-lg border p-4 transition-colors hover:border-primary-500"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Building2
                      size={20}
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <Badge variant="warning" size="sm">
                      1 missing
                    </Badge>
                  </div>
                  <p className="font-medium">Business Info</p>
                  <p className="text-sm text-gray-500">4/5 documents</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full bg-warning-500"
                      style={{ width: '80%' }}
                    />
                  </div>
                </Link>

                <Link
                  to="/shop/sales-income"
                  className="group rounded-lg border p-4 transition-colors hover:border-primary-500"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <DollarSign
                      size={20}
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <Badge variant="warning" size="sm">
                      4 missing
                    </Badge>
                  </div>
                  <p className="font-medium">Sales Records</p>
                  <p className="text-sm text-gray-500">8/12 months</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full bg-warning-500"
                      style={{ width: '66%' }}
                    />
                  </div>
                </Link>

                <Link
                  to="/shop/rent-utilities"
                  className="group rounded-lg border p-4 transition-colors hover:border-primary-500"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <FileText
                      size={20}
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <Badge variant="warning" size="sm">
                      2 missing
                    </Badge>
                  </div>
                  <p className="font-medium">Rent & Utilities</p>
                  <p className="text-sm text-gray-500">6/8 documents</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full bg-warning-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right utility rail */}
        <div className="space-y-6 xl:col-span-4">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
                <Badge variant="warning">3 pending</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`flex items-center justify-between rounded-lg p-3 ${
                      deadline.priority === 'overdue' ? 'bg-warning-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar
                        size={16}
                        className={`mr-2 ${
                          deadline.priority === 'overdue'
                            ? 'text-warning-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{deadline.task}</p>
                        <p className="text-sm text-gray-500">
                          Due: {deadline.dueDate}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        deadline.priority === 'high'
                          ? 'warning'
                          : deadline.priority === 'overdue'
                          ? 'error'
                          : 'info'
                      }
                    >
                      {deadline.daysLeft > 0
                        ? `${deadline.daysLeft} days left`
                        : 'Overdue'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link
                  to="/shop/dashboard"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center">
                      {activity.type === 'sale' && (
                        <DollarSign size={16} className="mr-2 text-success-500" />
                      )}
                      {activity.type === 'expense' && (
                        <Receipt size={16} className="mr-2 text-warning-500" />
                      )}
                      {activity.type === 'payroll' && (
                        <Users size={16} className="mr-2 text-info-500" />
                      )}
                      {activity.type === 'gst' && (
                        <Percent size={16} className="mr-2 text-primary-500" />
                      )}

                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>

                    <Badge
                      variant={activity.status === 'verified' ? 'success' : 'pending'}
                    >
                      {activity.status === 'verified' ? (
                        <span className="flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          Pending
                        </span>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-warning-200 bg-warning-50">
            <Card.Body>
              <div className="flex items-start">
                <AlertTriangle
                  className="mr-3 flex-shrink-0 text-warning-600"
                  size={24}
                />
                <div>
                  <h4 className="mb-1 font-semibold text-warning-800">
                    Tax Deadline Approaching
                  </h4>
                  <p className="text-sm text-warning-700">
                    Your Q1 GST/HST return is due in 15 days. Make sure all your
                    sales records and expense receipts are uploaded for accurate
                    filing.
                  </p>
                  <Link
                    to="/shop/gst-records"
                    className="mt-3 inline-block text-sm font-medium text-warning-700 underline hover:text-warning-800"
                  >
                    Prepare return now →
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
