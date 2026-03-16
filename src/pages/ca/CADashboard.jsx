import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../../components/Common/StatsCard';
import ClientTable from '../../components/Common/ClientTable';
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
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CADashboard = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Check login status on component mount and when user changes
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Mock data instead of API calls
  const mockClients = {
    total: 24,
    readyCount: 8,
    attentionCount: 3,
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', lastActivity: '2 hours ago', documents: 12 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', lastActivity: '1 day ago', documents: 8 },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', lastActivity: '3 days ago', documents: 15 },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', lastActivity: '5 days ago', documents: 7 },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', lastActivity: '1 week ago', documents: 3 },
    ]
  };

  const mockPendingReviews = [
    { id: 1, clientName: 'John Doe', documentType: 'T4 Slip', submittedAt: '2024-03-15' },
    { id: 2, clientName: 'Jane Smith', documentType: 'Rental Income', submittedAt: '2024-03-14' },
    { id: 3, clientName: 'Bob Johnson', documentType: 'Medical Receipts', submittedAt: '2024-03-12' },
    { id: 4, clientName: 'Alice Brown', documentType: 'Charitable Donations', submittedAt: '2024-03-10' },
  ];

  const mockActivity = [
    { id: 1, description: 'John Doe uploaded T4 slip', time: '2 hours ago', type: 'upload' },
    { id: 2, description: 'Jane Smith submitted rental income', time: '5 hours ago', type: 'submit' },
    { id: 3, description: 'Bob Johnson requested review', time: '1 day ago', type: 'request' },
    { id: 4, description: 'Alice Brown updated profile', time: '2 days ago', type: 'update' },
    { id: 5, description: 'Charlie Wilson added documents', time: '3 days ago', type: 'upload' },
    { id: 6, description: 'New client registered', time: '4 days ago', type: 'new' },
  ];

  // Chart data
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
      icon: UserGroupIcon
    },
    {
      title: 'Pending Reviews',
      value: mockPendingReviews.length,
      change: 5,
      trend: 'up',
      icon: ClockIcon
    },
    {
      title: 'Ready to File',
      value: mockClients.readyCount,
      change: 8,
      trend: 'up',
      icon: CheckCircleIcon
    },
    {
      title: 'Needs Attention',
      value: mockClients.attentionCount,
      change: 3,
      trend: 'down',
      icon: ExclamationTriangleIcon
    },
  ];

  // Mock CA Login Function
  const handleMockLogin = async () => {
    try {
      // Create a mock CA user
      const mockCAUser = {
        id: 'mock-ca-1',
        name: 'Jane Smith, CA',
        email: 'ca@demo.com',
        role: 'ca',
        userType: 'professional',
        caNumber: '123456',
        firmName: 'Smith & Associates'
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockCAUser));
      
      // Force page reload to reflect logged in state
      window.location.href = '/ca/dashboard';
    } catch (error) {
      console.error('Mock login failed:', error);
    }
  };

  // Mock Logout Function
  const handleMockLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <UserCircleIcon className="h-20 w-20 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CA Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Please login to access the CA dashboard and manage your clients.
          </p>
          <button
            onClick={handleMockLogin}
            className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Login as Mock CA
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Demo credentials will be auto-filled. No real login required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name || 'Jane Smith, CA'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'ca@demo.com'} • CA Number: {user?.caNumber || '123456'}</p>
          </div>
        </div>
        <button
          onClick={handleMockLogout}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CA Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your clients today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions - Tax Summary Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-primary-500" />
          Quick Tax Summary Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/ca/clients/1/tax-summary"
            className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-xl hover:shadow-md transition-shadow border border-primary-100 group"
          >
            <h3 className="font-medium text-gray-900 text-lg">John Doe</h3>
            <p className="text-sm text-gray-500 mt-1">View complete tax data</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Ready to view</span>
              <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                View Summary →
              </span>
            </div>
          </Link>
          
          <Link
            to="/ca/clients/2/tax-summary"
            className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-xl hover:shadow-md transition-shadow border border-primary-100 group"
          >
            <h3 className="font-medium text-gray-900 text-lg">Jane Smith</h3>
            <p className="text-sm text-gray-500 mt-1">View complete tax data</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending review</span>
              <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                View Summary →
              </span>
            </div>
          </Link>
          
          <Link
            to="/ca/clients/3/tax-summary"
            className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-xl hover:shadow-md transition-shadow border border-primary-100 group"
          >
            <h3 className="font-medium text-gray-900 text-lg">Bob Johnson</h3>
            <p className="text-sm text-gray-500 mt-1">View complete tax data</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>
              <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                View Summary →
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Activity</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivity.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <DocumentIcon className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{item.description}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/ca/activity" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all activity →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Clients</h3>
          <Link to="/ca/clients" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all clients →
          </Link>
        </div>
        <ClientTable clients={mockClients.data} />
      </div>

      {/* Pending Reviews */}
      {mockPendingReviews.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
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
        </div>
      )}

      {/* Demo Data Notice */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
        <p>🔧 Using mock data for demonstration. No real client information is displayed.</p>
      </div>
    </div>
  );
};

export default CADashboard;