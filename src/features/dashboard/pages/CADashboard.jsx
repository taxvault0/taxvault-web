import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  FolderOpenIcon,
  ArrowRightIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import StatsCard from 'components/shared/StatsCard';
import ClientTable from 'components/shared/ClientTable';
import TotalClientsCard from 'features/ca/pages/TotalClientsCard';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Badge from 'components/ui/Badge';

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
    { id: 1, clientName: 'John Doe', documentType: 'T4 Slip', submittedAt: '2026-03-25' },
    { id: 2, clientName: 'Jane Smith', documentType: 'Rental Income', submittedAt: '2026-03-25' },
    { id: 3, clientName: 'Bob Johnson', documentType: 'Medical Receipts', submittedAt: '2026-03-24' },
    { id: 4, clientName: 'Alice Brown', documentType: 'Charitable Donations', submittedAt: '2026-03-23' },
  ];

  const mockActivity = [
    { id: 1, description: 'John Doe uploaded T4 slip', time: '2 hours ago', type: 'upload' },
    { id: 2, description: 'Jane Smith submitted gig income docs', time: '5 hours ago', type: 'submit' },
    { id: 3, description: 'Bob Johnson requested review', time: '1 day ago', type: 'request' },
    { id: 4, description: 'Alice Brown updated business info', time: '2 days ago', type: 'update' },
    { id: 5, description: 'Charlie Wilson added corporate docs', time: '3 days ago', type: 'upload' },
    { id: 6, description: 'New client registered', time: '4 days ago', type: 'new' },
  ];

  const todaysPlan = [
    {
      id: 1,
      time: '9:30 AM',
      title: 'Consultation Call',
      client: 'John Doe',
      type: 'Consultation',
      status: 'Upcoming',
    },
    {
      id: 2,
      time: '11:00 AM',
      title: 'Document Review Meeting',
      client: 'Jane Smith',
      type: 'Review',
      status: 'Today',
    },
    {
      id: 3,
      time: '2:00 PM',
      title: 'Tax Filing Appointment',
      client: 'Alice Brown',
      type: 'Tax Filing',
      status: 'Priority',
    },
    {
      id: 4,
      time: '4:30 PM',
      title: 'Business Return Review',
      client: 'Charlie Wilson',
      type: 'Business',
      status: 'Today',
    },
  ];

  const urgentActions = [
    {
      id: 1,
      title: 'Documents waiting for review',
      value: mockPendingReviews.length,
      link: '/ca/reviews',
    },
    {
      id: 2,
      title: 'Clients ready to file',
      value: mockClients.readyCount,
      link: '/ca/clients',
    },
    {
      id: 3,
      title: 'Clients needing attention',
      value: mockClients.attentionCount,
      link: '/ca/clients',
    },
    {
      id: 4,
      title: 'Unread client conversations',
      value: 6,
      link: '/ca/messages',
    },
  ];

  const pipeline = [
    { label: 'New', count: 4, color: 'bg-slate-100 text-slate-700' },
    { label: 'Pending Docs', count: 8, color: 'bg-amber-100 text-amber-700' },
    { label: 'In Review', count: 5, color: 'bg-blue-100 text-blue-700' },
    { label: 'Filing Today', count: 3, color: 'bg-purple-100 text-purple-700' },
    { label: 'Completed', count: 11, color: 'bg-emerald-100 text-emerald-700' },
  ];

  const needsAttention = [
    {
      id: 1,
      name: 'Jane Smith',
      issue: 'Missing supporting gig receipts',
      level: 'Medium',
    },
    {
      id: 2,
      name: 'Charlie Wilson',
      issue: 'Business return documents incomplete',
      level: 'High',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      issue: 'No activity for 3 days',
      level: 'Low',
    },
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'CA'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here&apos;s your operational view for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1.5 text-sm">
            CA Dashboard
          </Badge>
          <Link
            to="/ca/calendar"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Open Calendar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TotalClientsCard
          total={mockClients.total}
          change={12}
          trend="up"
          breakdown={profileCounts}
        />

        {stats
          .filter((stat) => stat.title !== 'Total Clients')
          .map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <Card className="overflow-hidden border-primary-100 bg-gradient-to-br from-primary-50 via-white to-white">
            <Card.Body className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Plan</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Meetings, consultations, and tax filing appointments for today.
                  </p>
                </div>
                <Link
                  to="/ca/calendar"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Full calendar
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {todaysPlan.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary-600">{item.time}</p>
                        <h3 className="mt-1 text-sm font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.client}</p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                        {item.type}
                      </span>
                      <Link
                        to="/ca/calendar"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Client Pipeline</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Track where clients are in the filing workflow.
                  </p>
                </div>
                <Link
                  to="/ca/clients"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Open clients →
                </Link>
              </div>
            </Card.Header>

            <Card.Body className="pt-0">
              <div className="flex flex-wrap gap-2">
                {pipeline.map((item) => (
                  <span
                    key={item.label}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${item.color}`}
                  >
                    {item.label}: {item.count}
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                  <DocumentTextIcon className="h-5 w-5 text-primary-500" />
                  Quick Tax Summary Access
                </h3>
                <Link
                  to="/ca/clients"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all →
                </Link>
              </div>
            </Card.Header>

            <Card.Body className="pt-0">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Link
                  to="/ca/clients/1/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-medium text-gray-900">John Doe</h3>
                  <p className="mt-1 text-sm text-gray-500">Employment client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-700">
                      Ready
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </Link>

                <Link
                  to="/ca/clients/2/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-medium text-gray-900">Jane Smith</h3>
                  <p className="mt-1 text-sm text-gray-500">Employment + gig client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                      Pending
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </Link>

                <Link
                  to="/ca/clients/3/tax-summary"
                  className="group rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-medium text-gray-900">Bob Johnson</h3>
                  <p className="mt-1 text-sm text-gray-500">Self-employed client</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Verified
                    </span>
                    <span className="text-sm font-medium text-primary-600 transition-transform group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
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

        <div className="space-y-5 xl:col-span-4">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Urgent Actions</h3>
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="space-y-1">
                {urgentActions.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-base font-semibold text-gray-900">Clients Needing Attention</h3>
            </Card.Header>
            <Card.Body className="space-y-3 pt-0">
              {needsAttention.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.issue}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.level === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : item.level === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="space-y-3">
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
              <Card.Body className="p-4">
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
                    <div className="mt-3">
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
              <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
            </Card.Header>
            <Card.Body className="space-y-1 pt-0">
              <Link
                to="/ca/clients"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
              >
                <UserGroupIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-700">View Clients</span>
              </Link>
              <Link
                to="/ca/requests"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
              >
                <BriefcaseIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-700">Consultation Requests</span>
              </Link>
              <Link
                to="/ca/calendar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
              >
                <CalendarDaysIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-700">View Calendar</span>
              </Link>
              <Link
                to="/ca/messages"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-700">Client Messages</span>
              </Link>
              <Link
                to="/ca/reviews"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
              >
                <FolderOpenIcon className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-700">Review Documents</span>
              </Link>
            </Card.Body>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body className="p-4">
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