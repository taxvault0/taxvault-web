import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  TruckIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import StatsCard from 'components/shared/StatsCard';
import ClientTable from 'components/shared/ClientTable';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Badge from 'components/ui/Badge';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CADashboard = () => {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const mockClients = {
    total: 24,
    readyCount: 8,
    attentionCount: 3,
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        lastActivity: '2 hours ago',
        documents: 12,
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'pending',
        lastActivity: '1 day ago',
        documents: 8,
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        status: 'active',
        lastActivity: '3 days ago',
        documents: 15,
        taxProfile: {
          employment: false,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: false,
        },
      },
      {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        status: 'active',
        lastActivity: '5 days ago',
        documents: 7,
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
      },
      {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        status: 'inactive',
        lastActivity: '1 week ago',
        documents: 3,
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: true,
        },
      },
    ],
  };

  const mockPendingReviews = [
    { id: 1, clientName: 'John Doe', documentType: 'T4 Slip', submittedAt: '2024-03-15' },
    { id: 2, clientName: 'Jane Smith', documentType: 'Rental Income', submittedAt: '2024-03-14' },
    { id: 3, clientName: 'Bob Johnson', documentType: 'Medical Receipts', submittedAt: '2024-03-12' },
    { id: 4, clientName: 'Alice Brown', documentType: 'Charitable Donations', submittedAt: '2024-03-10' },
  ];

  const mockActivity = [
    { id: 1, description: 'John Doe uploaded T4 slip', time: '2 hours ago', type: 'upload' },
    { id: 2, description: 'Jane Smith submitted gig income docs', time: '5 hours ago', type: 'submit' },
    { id: 3, description: 'Bob Johnson requested review', time: '1 day ago', type: 'request' },
    { id: 4, description: 'Alice Brown updated business info', time: '2 days ago', type: 'update' },
    { id: 5, description: 'Charlie Wilson added corporate docs', time: '3 days ago', type: 'upload' },
    { id: 6, description: 'New client registered', time: '4 days ago', type: 'new' },
  ];

  const profileCounts = useMemo(() => {
    const clients = mockClients.data || [];
    return {
      employment: clients.filter((c) => c.taxProfile?.employment).length,
      gig: clients.filter((c) => c.taxProfile?.gigWork).length,
      selfEmployment: clients.filter((c) => c.taxProfile?.selfEmployment).length,
      business: clients.filter((c) => c.taxProfile?.incorporatedBusiness).length,
      mixed: clients.filter((c) => Object.values(c.taxProfile || {}).filter(Boolean).length > 1).length,
    };
  }, [mockClients.data]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Documents Processed',
        data: [65, 78, 92, 85, 110, 95],
        backgroundColor: 'rgba(0, 90, 156, 0.5)',
        borderColor: '#005A9C',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const stats = [
    {
      title: 'Total Clients',
      value: mockClients.total,
      change: 12,
      trend: 'up',
      icon: UserGroupIcon,
    },
    {
      title: 'Pending Reviews',
      value: mockPendingReviews.length,
      change: 5,
      trend: 'up',
      icon: ClockIcon,
    },
    {
      title: 'Ready to File',
      value: mockClients.readyCount,
      change: 8,
      trend: 'up',
      icon: CheckCircleIcon,
    },
    {
      title: 'Needs Attention',
      value: mockClients.attentionCount,
      change: 3,
      trend: 'down',
      icon: ExclamationTriangleIcon,
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">CA Dashboard</h2>
        <p className="text-gray-600">
          Please log in to access the CA dashboard and manage your clients.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'CA'}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here&apos;s what&apos;s happening with your clients today.
          </p>
        </div>

        <Badge variant="info" className="px-4 py-2 text-sm">
          CA Dashboard
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Employment Clients</p>
              <p className="text-2xl font-bold text-blue-600">{profileCounts.employment}</p>
            </div>
            <BriefcaseIcon className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gig Clients</p>
              <p className="text-2xl font-bold text-green-600">{profileCounts.gig}</p>
            </div>
            <TruckIcon className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Self-Employed</p>
              <p className="text-2xl font-bold text-purple-600">{profileCounts.selfEmployment}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Business Clients</p>
              <p className="text-2xl font-bold text-indigo-600">{profileCounts.business}</p>
            </div>
            <BuildingOffice2Icon className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Mixed Profiles</p>
              <p className="text-2xl font-bold text-orange-600">{profileCounts.mixed}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <Card.Header>
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <DocumentTextIcon className="h-5 w-5 text-primary-500" />
                Quick Tax Summary Access
              </h3>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link
                  to="/ca/clients/1/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-medium text-gray-900">John Doe</h3>
                  <p className="mt-1 text-sm text-gray-500">Employment client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-700">
                      Ready to view
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View Summary →
                    </span>
                  </div>
                </Link>

                <Link
                  to="/ca/clients/2/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-medium text-gray-900">Jane Smith</h3>
                  <p className="mt-1 text-sm text-gray-500">Employment + gig client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                      Pending review
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View Summary →
                    </span>
                  </div>
                </Link>

                <Link
                  to="/ca/clients/3/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-medium text-gray-900">Bob Johnson</h3>
                  <p className="mt-1 text-sm text-gray-500">Self-employed client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Verified
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View Summary →
                    </span>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Monthly Activity</h3>
            </Card.Header>
            <Card.Body>
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Clients</h3>
              <Link
                to="/ca/clients"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all clients →
              </Link>
            </div>
            <ClientTable clients={mockClients.data} />
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {mockActivity.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                        <DocumentIcon className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">{item.description}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  to="/ca/activity"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all activity →
                </Link>
              </div>
            </Card.Body>
          </Card>

          {mockPendingReviews.length > 0 && (
            <Card className="border-warning-200 bg-warning-50">
              <Card.Body>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-warning-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-warning-800">
                      Pending Reviews
                    </h3>
                    <div className="mt-2 text-sm text-warning-700">
                      <p>
                        You have {mockPendingReviews.length} documents waiting for review.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link
                        to="/ca/reviews"
                        className="text-sm font-medium text-warning-800 hover:text-warning-900"
                      >
                        View pending reviews →
                      </Link>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </Card.Header>
            <Card.Body className="space-y-2">
              <Link to="/ca/clients" className="block rounded p-2 hover:bg-gray-50">
                👥 View Clients
              </Link>
              <Link to="/ca/requests" className="block rounded p-2 hover:bg-gray-50">
                📝 Consultation Requests
              </Link>
              <Link to="/ca/calendar" className="block rounded p-2 hover:bg-gray-50">
                📅 View Calendar
              </Link>
              <Link to="/ca/messages" className="block rounded p-2 hover:bg-gray-50">
                💬 Client Messages
              </Link>
            </Card.Body>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <p className="text-sm font-medium text-primary-800">Demo Mode</p>
              <p className="mt-1 text-xs text-primary-600">
                Using mock data for demonstration. No real client information is displayed.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CADashboard;