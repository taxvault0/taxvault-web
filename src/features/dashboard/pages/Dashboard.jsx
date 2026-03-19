// src/pages/user/Dashboard.jsx
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
  Home,
  Receipt,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// Import gig worker components
// import GSTDashboard from '../gig/GSTDashboard'; // Commented out - Quarterly breakdown removed

// Vehicle Expense Tracker Component - Redesigned for annual filing
const VehicleExpenseTracker = () => {
  const [vehicleData, setVehicleData] = useState({
    totalKm: '25000',
    businessKm: '16250',
    fuelCost: '3200',
    maintenanceCost: '850',
    insuranceCost: '1200',
    leaseCost: '0'
  });

  const [showDetails, setShowDetails] = useState(false);

  const businessPercentage = vehicleData.totalKm && vehicleData.businessKm
    ? ((parseFloat(vehicleData.businessKm) / parseFloat(vehicleData.totalKm)) * 100).toFixed(1)
    : 0;

  const totalExpenses = [
    parseFloat(vehicleData.fuelCost) || 0,
    parseFloat(vehicleData.maintenanceCost) || 0,
    parseFloat(vehicleData.insuranceCost) || 0,
    parseFloat(vehicleData.leaseCost) || 0
  ].reduce((a, b) => a + b, 0);

  const deductibleAmount = (totalExpenses * (businessPercentage / 100)).toFixed(2);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-200">
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center text-lg">
            <Car size={20} className="mr-2 text-blue-600" />
            Vehicle Expense Summary
          </h3>
          <Badge variant="info">Annual</Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">Year-end totals for tax filing</p>
      </Card.Header>
      <Card.Body>
        {/* Summary View */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500">Business Use</p>
              <p className="text-xl font-bold text-blue-600">{businessPercentage}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500">Total KM</p>
              <p className="text-xl font-bold">{parseInt(vehicleData.totalKm).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Estimated Deduction</p>
                <p className="text-2xl font-bold text-green-700">${deductibleAmount}</p>
              </div>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 text-sm hover:underline flex items-center"
              >
                {showDetails ? 'Hide' : 'Details'} 
                <ChevronRight size={16} className={`ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>

          {/* Detailed Inputs - Toggleable */}
          {showDetails && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="font-medium text-sm">Update Year-End Numbers</h4>
              
              <div>
                <label className="text-xs text-gray-600">Total KM driven this year</label>
                <input
                  type="number"
                  value={vehicleData.totalKm}
                  onChange={(e) => setVehicleData({...vehicleData, totalKm: e.target.value})}
                  className="w-full p-2 border rounded mt-1 text-sm"
                  placeholder="e.g., 25000"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-600">Business KM driven</label>
                <input
                  type="number"
                  value={vehicleData.businessKm}
                  onChange={(e) => setVehicleData({...vehicleData, businessKm: e.target.value})}
                  className="w-full p-2 border rounded mt-1 text-sm"
                  placeholder="e.g., 15000"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Fuel ($)</label>
                  <input
                    type="number"
                    value={vehicleData.fuelCost}
                    onChange={(e) => setVehicleData({...vehicleData, fuelCost: e.target.value})}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Maintenance ($)</label>
                  <input
                    type="number"
                    value={vehicleData.maintenanceCost}
                    onChange={(e) => setVehicleData({...vehicleData, maintenanceCost: e.target.value})}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Insurance ($)</label>
                  <input
                    type="number"
                    value={vehicleData.insuranceCost}
                    onChange={(e) => setVehicleData({...vehicleData, insuranceCost: e.target.value})}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Lease ($)</label>
                  <input
                    type="number"
                    value={vehicleData.leaseCost}
                    onChange={(e) => setVehicleData({...vehicleData, leaseCost: e.target.value})}
                    className="w-full p-2 border rounded mt-1 text-sm"
                  />
                </div>
              </div>

              <div className="bg-blue-100 p-2 rounded text-xs text-blue-700 mt-2">
                <strong>💡 Tip:</strong> Enter your year-end totals. The deductible amount is calculated based on your business use percentage.
              </div>
            </div>
          )}

          <Link to="/vehicle-expenses" className="block mt-2">
            <Button variant="outline" size="sm" fullWidth>
              Manage Vehicle Expenses
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

// Gig Worker Document Guide Component
const GigWorkerDocumentGuide = () => {
  const documents = [
    { name: 'Income Records', icon: DollarSign, color: 'green', description: 'T4A, payment statements' },
    { name: 'Expense Receipts', icon: Receipt, color: 'orange', description: 'Business purchases' },
    { name: 'Mileage Log', icon: MapPin, color: 'blue', description: 'Business km tracked' },
    { name: 'GST/HST Records', icon: Percent, color: 'purple', description: 'Annual summary' }
  ];

  return (
    <Card className="border-l-4 border-green-500">
      <Card.Header>
        <h3 className="font-bold flex items-center text-lg">
          <Briefcase size={20} className="mr-2 text-green-600" />
          Gig Worker Document Guide
        </h3>
        <p className="text-sm text-gray-500">Essential documents for tax time</p>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 gap-3">
          {documents.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className={`w-8 h-8 bg-${doc.color}-100 rounded-full flex items-center justify-center mb-2`}>
                  <Icon size={16} className={`text-${doc.color}-600`} />
                </div>
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 bg-blue-50 p-2 rounded text-xs text-blue-700">
          <strong>📌 Remember:</strong> Keep all documents for 6 years in case of CRA review.
        </div>
      </Card.Body>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const isGigWorker = user?.userType === 'gig-worker' || user?.userType === 'self-employed';

  // Document stats
  const documentStats = {
    total: 24,
    uploaded: 8,
    pending: 16,
    completion: 33
  };

  const upcomingDeadlines = [
    { id: 1, task: 'GST/HST Filing', date: 'Apr 30, 2024', daysLeft: 15, priority: 'high' },
    { id: 2, task: 'RRSP Contribution', date: 'Mar 1, 2024', daysLeft: 0, priority: 'urgent' },
    { id: 3, task: 'Tax Filing Deadline', date: 'Apr 30, 2024', daysLeft: 15, priority: 'high' }
  ];

  const taxNews = [
    { id: 1, title: '2024 tax brackets announced', date: 'Jan 15, 2024' },
    { id: 2, title: 'FHSA limit increased to $8,000', date: 'Jan 10, 2024' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your tax readiness summary
              </p>
            </div>
            {isGigWorker && (
              <Badge variant="success" className="px-4 py-2 text-sm">
                <Briefcase size={16} className="mr-2" />
                Gig Worker Account
              </Badge>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tax Updates & Alerts */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center">
                    <Bell size={20} className="mr-2 text-primary-500" />
                    Tax Updates & Reminders
                  </h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* News Updates */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Latest News</span>
                      <Badge variant="warning">{taxNews.length} new</Badge>
                    </div>
                    <ul className="space-y-2">
                      {taxNews.map(news => (
                        <li key={news.id} className="text-sm">
                          <span className="text-gray-700">{news.title}</span>
                          <span className="text-xs text-gray-500 block">{news.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Urgent Alert */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle size={18} className="text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800">RRSP Deadline</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">Mar 1, 2024</p>
                    <p className="text-xs text-red-600 mt-1">Only 14 days left to contribute</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Review Contributions
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Document Progress */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center">
                    <FileText size={20} className="mr-2 text-primary-500" />
                    Document Checklist
                  </h2>
                  <Link to="/tax-checklist">
                    <Button variant="ghost" size="sm">View Full Checklist</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{documentStats.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success-600">{documentStats.uploaded}</p>
                    <p className="text-xs text-gray-500">Uploaded</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning-600">{documentStats.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-info-600">{documentStats.completion}%</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${documentStats.completion}%` }}
                  ></div>
                </div>

                {/* Missing Documents Alert */}
                {documentStats.pending > 0 && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-700">
                        {documentStats.pending} documents still needed
                      </span>
                    </div>
                    <Link to="/tax-checklist" className="text-sm text-primary-600 hover:underline">
                      Upload Now
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Gig Worker Guide - Only for gig workers */}
            {isGigWorker && <GigWorkerDocumentGuide />}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/upload-receipt" className="bg-primary-50 p-4 rounded-lg hover:bg-primary-100 transition-colors text-center">
                <Upload size={24} className="mx-auto text-primary-600 mb-2" />
                <h3 className="font-semibold text-sm">Upload Receipt</h3>
                <p className="text-xs text-gray-500">Scan or upload</p>
              </Link>
              <Link to="/mileage" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors text-center">
                <MapPin size={24} className="mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold text-sm">Log Mileage</h3>
                <p className="text-xs text-gray-500">Track trips</p>
              </Link>
              <Link to="/tax-checklist" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors text-center">
                <FileText size={24} className="mx-auto text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm">Checklist</h3>
                <p className="text-xs text-gray-500">View progress</p>
              </Link>
              <Link to="/find-ca" className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors text-center">
                <MessageCircle size={24} className="mx-auto text-orange-600 mb-2" />
                <h3 className="font-semibold text-sm">Find a CA</h3>
                <p className="text-xs text-gray-500">Get help</p>
              </Link>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Gig Worker Specific Cards */}
            {isGigWorker && (
              <>
                {/* <GSTDashboard /> */} {/* Commented out - Quarterly breakdown removed */}
                <VehicleExpenseTracker />
              </>
            )}

            {/* Estimated Tax Savings */}
            <Card className="bg-gradient-to-br from-green-50 to-white border border-green-200">
              <Card.Body>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center text-lg">
                    <TrendingUp size={20} className="mr-2 text-green-600" />
                    Estimated Tax Savings
                  </h3>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">$2,450</p>
                <p className="text-xs text-gray-600 mb-4">Based on uploaded documents</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">RRSP/FHSA</span>
                    <span className="font-medium">$1,250</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Donations</span>
                    <span className="font-medium">$375</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Medical</span>
                    <span className="font-medium">$225</span>
                  </div>
                  {isGigWorker && (
                    <div className="flex justify-between p-2 bg-green-100 rounded">
                      <span className="font-medium">Business Expenses</span>
                      <span className="font-bold text-green-700">$600</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-green-200">
                  <div className="flex justify-between font-bold">
                    <span>Total Savings</span>
                    <span className="text-green-700 text-xl">$2,450</span>
                  </div>
                </div>

                <Button variant="primary" fullWidth className="mt-4">
                  View Breakdown
                </Button>
              </Card.Body>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="bg-warning-50 border-warning-200">
              <Card.Header>
                <h3 className="font-bold flex items-center text-lg">
                  <Clock size={20} className="mr-2 text-warning-600" />
                  Upcoming Deadlines
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {upcomingDeadlines.map(deadline => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{deadline.task}</p>
                        <p className="text-xs text-gray-500">Due: {deadline.date}</p>
                      </div>
                      <Badge 
                        variant={
                          deadline.priority === 'urgent' ? 'error' : 
                          deadline.priority === 'high' ? 'warning' : 'info'
                        }
                      >
                        {deadline.daysLeft > 0 ? `${deadline.daysLeft}d left` : 'Today'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Quick Links */}
            <Card>
              <Card.Body>
                <h3 className="font-bold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/profile" className="block p-2 hover:bg-gray-50 rounded transition-colors">
                    👤 Profile Settings
                  </Link>
                  <Link to="/documents" className="block p-2 hover:bg-gray-50 rounded transition-colors">
                    📁 All Documents
                  </Link>
                  <Link to="/notifications" className="block p-2 hover:bg-gray-50 rounded transition-colors">
                    🔔 Notification Settings
                  </Link>
                  <Link to="/support" className="block p-2 hover:bg-gray-50 rounded transition-colors">
                    💬 Help & Support
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Tax Year Info */}
            <Card className="bg-primary-50 border-primary-200">
              <Card.Body>
                <div className="flex items-center">
                  <Calendar size={20} className="text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">Tax Year 2023</p>
                    <p className="text-xs text-primary-600">Filing deadline: Apr 30, 2024</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




