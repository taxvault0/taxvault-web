import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Folder, 
  List,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';

const Receipts = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState('folders'); // 'folders' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('year');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - replace with API call
  const [receipts, setReceipts] = useState([]);

  // Define folder structures based on user type
  const getFolderStructure = () => {
    const baseFolders = [
      { id: 'all', label: 'All Receipts', icon: '📄', count: 0, color: 'gray' },
    ];

    const userTypeFolders = {
      'gig-worker': [
        { id: 'fuel', label: 'Fuel Receipts', icon: '⛽', color: 'orange', description: 'Gas, diesel, charging' },
        { id: 'maintenance', label: 'Maintenance & Repairs', icon: '🔧', color: 'red', description: 'Oil changes, repairs, parts' },
        { id: 'tolls', label: 'Tolls & Parking', icon: '🛣️', color: 'purple', description: 'Highway tolls, parking fees' },
        { id: 'phone', label: 'Cell Phone & Data', icon: '📱', color: 'blue', description: 'Monthly bills, devices' },
        { id: 'supplies', label: 'Supplies & Equipment', icon: '🧰', color: 'green', description: 'Dash cams, mounts, bags' },
        { id: 'insurance', label: 'Vehicle Insurance', icon: '🛡️', color: 'indigo', description: 'Monthly/ yearly premiums' },
        { id: 'meals', label: 'Meals & Entertainment', icon: '🍔', color: 'amber', description: 'Business meals (50% deductible)' },
        { id: 'other', label: 'Other Expenses', icon: '📌', color: 'gray', description: 'Miscellaneous expenses' },
      ],
      'shop-owner': [
        { id: 'inventory', label: 'Inventory Purchases', icon: '📦', color: 'green', description: 'Products, stock, supplies' },
        { id: 'rent', label: 'Rent & Utilities', icon: '🏢', color: 'blue', description: 'Monthly rent, hydro, water' },
        { id: 'payroll', label: 'Employee Wages', icon: '👥', color: 'purple', description: 'Salaries, bonuses, benefits' },
        { id: 'franchise', label: 'Franchise Fees', icon: '📋', color: 'amber', description: 'Royalties, marketing fees' },
        { id: 'office', label: 'Office Supplies', icon: '📎', color: 'indigo', description: 'Paper, pens, equipment' },
        { id: 'marketing', label: 'Marketing & Ads', icon: '📢', color: 'orange', description: 'Advertising, promotions' },
        { id: 'insurance', label: 'Business Insurance', icon: '🛡️', color: 'red', description: 'Liability, property insurance' },
        { id: 'other', label: 'Other Expenses', icon: '📌', color: 'gray', description: 'Miscellaneous expenses' },
      ],
      'employee': [
        { id: 'medical', label: 'Medical Expenses', icon: '🏥', color: 'blue', description: 'Prescriptions, dental, vision' },
        { id: 'tuition', label: 'Tuition & Education', icon: '🎓', color: 'green', description: 'Courses, textbooks, fees' },
        { id: 'donations', label: 'Charitable Donations', icon: '❤️', color: 'red', description: 'Charity receipts' },
        { id: 'rrsp', label: 'RRSP Contributions', icon: '💰', color: 'indigo', description: 'Retirement savings' },
        { id: 'childcare', label: 'Child Care Expenses', icon: '👶', color: 'orange', description: 'Daycare, babysitting' },
        { id: 'moving', label: 'Moving Expenses', icon: '🚚', color: 'purple', description: 'Moving for work (40km+)' },
        { id: 'home-office', label: 'Home Office', icon: '🏠', color: 'amber', description: 'Office supplies, equipment' },
        { id: 'other', label: 'Other Receipts', icon: '📌', color: 'gray', description: 'Miscellaneous receipts' },
      ],
      'contractor': [
        { id: 'professional-dev', label: 'Professional Development', icon: '📚', color: 'green', description: 'Courses, certifications' },
        { id: 'software', label: 'Software Subscriptions', icon: '💻', color: 'blue', description: 'Monthly/ annual software' },
        { id: 'home-office', label: 'Home Office', icon: '🏠', color: 'amber', description: 'Office expenses' },
        { id: 'marketing', label: 'Marketing & Advertising', icon: '📢', color: 'orange', description: 'Website, ads' },
        { id: 'travel', label: 'Business Travel', icon: '✈️', color: 'purple', description: 'Flights, hotels, meals' },
        { id: 'meals', label: 'Meals & Entertainment', icon: '🍔', color: 'red', description: 'Client meetings' },
        { id: 'insurance', label: 'Professional Insurance', icon: '🛡️', color: 'indigo', description: 'Liability insurance' },
        { id: 'other', label: 'Other Expenses', icon: '📌', color: 'gray', description: 'Miscellaneous' },
      ],
    };

    // Handle hybrid users (multiple income sources)
    if (user?.userType === 'hybrid' || user?.hasMultipleIncomes) {
      return [
        ...baseFolders,
        ...userTypeFolders['gig-worker'],
        ...userTypeFolders['employee'],
      ];
    }

    return [
      ...baseFolders,
      ...(userTypeFolders[user?.userType] || userTypeFolders['employee']),
    ];
  };

  const folders = getFolderStructure();

  // Load receipts
  useEffect(() => {
    loadReceipts();
  }, [dateRange, sortBy]);

  const loadReceipts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock receipts
      const mockReceipts = generateMockReceipts(user?.userType || 'employee');
      setReceipts(mockReceipts);

      // Update folder counts
      updateFolderCounts(mockReceipts);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReceipts = (userType) => {
    const vendors = {
      'gig-worker': [
        { name: 'Shell', category: 'fuel', amount: 45.23 },
        { name: 'Petro-Canada', category: 'fuel', amount: 67.89 },
        { name: 'Canadian Tire', category: 'maintenance', amount: 123.45 },
        { name: 'Midas', category: 'maintenance', amount: 234.56 },
        { name: 'Bell', category: 'phone', amount: 89.99 },
        { name: 'Rogers', category: 'phone', amount: 95.50 },
        { name: 'Uber Eats', category: 'meals', amount: 23.45 },
        { name: 'Tim Hortons', category: 'meals', amount: 4.50 },
        { name: 'Green P', category: 'tolls', amount: 15.00 },
        { name: 'GO Transit', category: 'tolls', amount: 12.50 },
      ],
      'shop-owner': [
        { name: 'Sysco', category: 'inventory', amount: 456.78 },
        { name: 'GFS', category: 'inventory', amount: 345.67 },
        { name: 'Hydro One', category: 'rent', amount: 234.56 },
        { name: 'Enbridge', category: 'rent', amount: 123.45 },
        { name: 'Staples', category: 'office', amount: 67.89 },
        { name: 'Grand & Toy', category: 'office', amount: 45.67 },
        { name: 'Facebook Ads', category: 'marketing', amount: 150.00 },
        { name: 'Google Ads', category: 'marketing', amount: 200.00 },
      ],
      'employee': [
        { name: 'Shoppers Drug Mart', category: 'medical', amount: 45.67 },
        { name: 'Rexall', category: 'medical', amount: 23.45 },
        { name: 'University of Toronto', category: 'tuition', amount: 567.89 },
        { name: 'Ryerson University', category: 'tuition', amount: 456.78 },
        { name: 'Salvation Army', category: 'donations', amount: 100.00 },
        { name: 'United Way', category: 'donations', amount: 50.00 },
        { name: 'RBC', category: 'rrsp', amount: 500.00 },
        { name: 'TD Bank', category: 'rrsp', amount: 250.00 },
        { name: 'KinderCare', category: 'childcare', amount: 800.00 },
        { name: 'BrightPath', category: 'childcare', amount: 750.00 },
      ],
      'contractor': [
        { name: 'Coursera', category: 'professional-dev', amount: 59.99 },
        { name: 'Udemy', category: 'professional-dev', amount: 89.99 },
        { name: 'Adobe', category: 'software', amount: 52.99 },
        { name: 'Microsoft', category: 'software', amount: 99.99 },
        { name: 'IKEA', category: 'home-office', amount: 234.56 },
        { name: 'Wayfair', category: 'home-office', amount: 123.45 },
        { name: 'Google Ads', category: 'marketing', amount: 150.00 },
        { name: 'Air Canada', category: 'travel', amount: 450.00 },
      ],
    };

    const userVendors = vendors[userType] || vendors['employee'];
    const receipts = [];
    
    for (let i = 1; i <= 30; i++) {
      const vendor = userVendors[Math.floor(Math.random() * userVendors.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      receipts.push({
        id: i,
        vendor: vendor.name,
        amount: vendor.amount || Math.round(Math.random() * 200 * 100) / 100 + 10,
        date: date.toISOString().split('T')[0],
        category: vendor.category,
        gst: Math.round((vendor.amount || 0) * 0.05 * 100) / 100,
        status: Math.random() > 0.2 ? 'verified' : 'pending',
        paymentMethod: ['Credit Card', 'Debit', 'Cash', 'Cheque'][Math.floor(Math.random() * 4)],
        notes: Math.random() > 0.7 ? 'Business expense - keep for records' : '',
        merchantAddress: `${Math.floor(Math.random() * 1000)} Main St, Toronto, ON`,
        merchantNumber: `BN${Math.floor(Math.random() * 100000000)}`,
      });
    }
    
    return receipts.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const updateFolderCounts = (receiptsData) => {
    folders.forEach(folder => {
      if (folder.id === 'all') {
        folder.count = receiptsData.length;
      } else {
        folder.count = receiptsData.filter(r => r.category === folder.id).length;
      }
    });
  };

  const filteredReceipts = receipts.filter(receipt => {
    // Filter by folder
    if (selectedFolder !== 'all' && receipt.category !== selectedFolder) {
      return false;
    }

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        receipt.vendor.toLowerCase().includes(search) ||
        receipt.notes?.toLowerCase().includes(search) ||
        receipt.amount.toString().includes(search) ||
        receipt.paymentMethod?.toLowerCase().includes(search)
      );
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalGST = filteredReceipts.reduce((sum, r) => sum + (r.gst || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const getFolderIcon = (category) => {
    const folder = folders.find(f => f.id === category);
    return folder?.icon || '📄';
  };

  const getFolderColor = (category) => {
    const folder = folders.find(f => f.id === category);
    return folder?.color || 'gray';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const MoveModal = () => {
    if (!showMoveModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowMoveModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Folder className="h-6 w-6 text-primary-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Move Receipt
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Select a new category for receipt from <span className="font-medium">{selectedReceipt.vendor}</span>
                    </p>
                  </div>
                  
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {folders.filter(f => f.id !== 'all').map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => {
                          // Update receipt category
                          const updatedReceipts = receipts.map(r => 
                            r.id === selectedReceipt.id ? { ...r, category: folder.id } : r
                          );
                          setReceipts(updatedReceipts);
                          updateFolderCounts(updatedReceipts);
                          setShowMoveModal(false);
                          setSelectedReceipt(null);
                        }}
                        className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-2xl mr-3">{folder.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{folder.label}</p>
                          <p className="text-xs text-gray-500">
                            {folder.count} receipt{folder.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {selectedReceipt.category === folder.id && (
                          <Check size={16} className="text-green-500 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setShowMoveModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteModal = () => {
    if (!showDeleteModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Receipt
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this receipt from <span className="font-medium">{selectedReceipt.vendor}</span>? 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  // Delete receipt
                  const updatedReceipts = receipts.filter(r => r.id !== selectedReceipt.id);
                  setReceipts(updatedReceipts);
                  updateFolderCounts(updatedReceipts);
                  setShowDeleteModal(false);
                  setSelectedReceipt(null);
                }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptCard = ({ receipt }) => (
    <Card className="hover:shadow-md transition-shadow">
      <Card.Body>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getFolderIcon(receipt.category)}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{receipt.vendor}</h3>
                  {getStatusBadge(receipt.status)}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(receipt.date)}
                  <span className="mx-2">•</span>
                  <DollarSign size={14} className="mr-1" />
                  ${receipt.amount.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2 py-1 bg-${getFolderColor(receipt.category)}-100 text-${getFolderColor(receipt.category)}-700 text-xs rounded-full`}>
                <Tag size={10} className="mr-1" />
                {folders.find(f => f.id === receipt.category)?.label || receipt.category}
              </span>
              {receipt.gst > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  GST: ${receipt.gst.toFixed(2)}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {receipt.paymentMethod}
              </span>
            </div>

            {receipt.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">"{receipt.notes}"</p>
            )}
          </div>

          <div className="ml-4 flex flex-col space-y-2">
            <Link to={`/receipts/${receipt.id}`}>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                <Eye size={18} className="text-gray-600" />
              </button>
            </Link>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Move"
              onClick={() => {
                setSelectedReceipt(receipt);
                setShowMoveModal(true);
              }}
            >
              <Folder size={18} className="text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete"
              onClick={() => {
                setSelectedReceipt(receipt);
                setShowDeleteModal(true);
              }}
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-500 mt-1">
            Organize and manage all your receipts for tax season
          </p>
        </div>
        <Link to="/receipts/new">
          <Button variant="primary">
            <Plus size={16} className="mr-2" />
            Add Receipt
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search receipts by vendor, amount, or notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter size={16} />}
            >
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="year">This Year</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  View Mode
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('folders')}
                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'folders'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Folder size={16} className="mr-2" />
                    Folders
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <List size={16} className="mr-2" />
                    List
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Summary Stats (shown in list view) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Total Receipts</p>
              <p className="text-2xl font-bold text-primary-600">{filteredReceipts.length}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-success-600">${totalAmount.toFixed(2)}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">GST/HST Paid</p>
              <p className="text-2xl font-bold text-info-600">${totalGST.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading receipts...</p>
        </div>
      ) : (
        <>
          {viewMode === 'folders' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {folders.map((folder) => (
                <Card
                  key={folder.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedFolder === folder.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setViewMode('list');
                  }}
                >
                  <Card.Body>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{folder.icon}</span>
                      <Badge variant="info">{folder.count}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{folder.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {folder.count} receipt{folder.count !== 1 ? 's' : ''}
                    </p>
                    {folder.description && (
                      <p className="text-xs text-gray-400 mt-2">{folder.description}</p>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReceipts.length === 0 ? (
                <Card className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search or filters' : 'Start by adding your first receipt'}
                  </p>
                  {!searchTerm && (
                    <Link to="/receipts/new">
                      <Button variant="primary" className="mt-4">
                        <Plus size={16} className="mr-2" />
                        Add Receipt
                      </Button>
                    </Link>
                  )}
                </Card>
              ) : (
                filteredReceipts.map((receipt) => (
                  <ReceiptCard key={receipt.id} receipt={receipt} />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <MoveModal />
      <DeleteModal />
    </div>
  );
};

export default Receipts;




