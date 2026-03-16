import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Upload, 
  UserPlus,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Calendar,
  Receipt,
  Car,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatsCard from '../../components/ui/StatsCard';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const years = [2025, 2024, 2023, 2022];

  const QuickAction = ({ icon: Icon, label, onClick, color = 'primary' }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center group"
    >
      <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center mb-2 group-hover:bg-${color}-100 transition-colors`}>
        <Icon size={24} className={`text-${color}-500`} />
      </div>
      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-500`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon size={20} className={`text-${color}-500`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center">
          {trend > 0 ? (
            <TrendingUp size={16} className="text-success-500 mr-1" />
          ) : (
            <TrendingDown size={16} className="text-warning-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-success-500' : 'text-warning-500'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );

  const ReceiptItem = ({ vendor, date, amount }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
          <Receipt size={20} className="text-primary-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{vendor}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="font-semibold text-gray-900 mr-2">${amount}</span>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
              <div className="ml-2 lg:ml-0 flex items-center">
                <span className="text-2xl font-bold text-primary-500">TaxVault</span>
                {user?.role === 'ca' && (
                  <Badge variant="gold" className="ml-2">CA</Badge>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <Avatar 
                  name={user?.name || 'User'} 
                  size="md"
                />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Year selector */}
          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${year === selectedYear 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
            <QuickAction icon={Camera} label="Scan Receipt" onClick={() => navigate('/receipts/scan')} />
            <QuickAction icon={MapPin} label="Track Mileage" onClick={() => navigate('/mileage/track')} />
            <QuickAction icon={Upload} label="Upload Doc" onClick={() => navigate('/documents/upload')} />
            <QuickAction icon={UserPlus} label="Invite CA" onClick={() => navigate('/profile/invite')} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Income"
              value="$0"
              icon={<TrendingUp />}
              trend={12}
              color="success"
            />
            <StatsCard
              title="Expenses"
              value="$0"
              icon={<Receipt />}
              trend={-5}
              color="warning"
            />
            <StatsCard
              title="Net Income"
              value="$0"
              icon={<TrendingUp />}
              trend={8}
              color="primary"
            />
            <StatsCard
              title="GST Owing"
              value="$0"
              icon={<Receipt />}
              color="secondary"
              subtitle="5% rate"
            />
          </div>

          {/* Recent receipts section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent receipts */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Receipts</h2>
                <button 
                  onClick={() => navigate('/receipts')}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  See All
                </button>
              </div>
              
              <Card>
                <div className="divide-y divide-gray-100">
                  <ReceiptItem vendor="Shell" date="Mar 15, 2024" amount="45.23" />
                  <ReceiptItem vendor="Amazon" date="Mar 14, 2024" amount="89.99" />
                  <ReceiptItem vendor="Canadian Tire" date="Mar 12, 2024" amount="123.45" />
                </div>
              </Card>
            </div>

            {/* Upcoming deadlines */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <Card className="bg-gradient-to-br from-warning-50 to-orange-50 border border-warning-100">
                <div className="flex items-start">
                  <div className="p-2 bg-warning-100 rounded-lg mr-4">
                    <Calendar size={24} className="text-warning-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Tax Filing Deadline</h3>
                    <p className="text-sm text-gray-600 mt-1">April 30, 2025</p>
                    <div className="mt-3">
                      <Badge variant="warning">45 days left</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center p-2 text-primary-500">
            <TrendingUp size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Receipt size={20} />
            <span className="text-xs mt-1">Receipts</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Car size={20} />
            <span className="text-xs mt-1">Mileage</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <FileText size={20} />
            <span className="text-xs mt-1">Documents</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>

      {/* Logout button (desktop) */}
      <button
        onClick={logout}
        className="hidden lg:flex fixed bottom-4 right-4 items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-soft hover:shadow-lg transition-shadow border border-gray-200"
      >
        <LogOut size={18} className="text-warning-500" />
        <span className="text-sm text-gray-700">Logout</span>
      </button>
    </div>
  );
};

export default Dashboard;