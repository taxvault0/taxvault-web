// user/TaxChecklist.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  TrendingUp,
  DollarSign,
  Percent,
  MapPin,
  Briefcase,
  Home,
  Car,
  Baby,
  GraduationCap,
  Heart,
  PiggyBank,
  Gift,
  AlertTriangle,
  Info,
  X,
  ChevronRight,
  Calendar,
  Flame,
  Wrench,
  Shield,
  Smartphone,
  Hammer,
  Receipt,
  CreditCard,
  BookOpen,
  Plane,
  Coffee,
  ShoppingBag,
  Tool,
  Phone,
  Users,
  Building,
  Award,
  Zap,
  Sun,
  Cloud,
  Wind,
  Leaf,
  Droplet,
  TreePine,
  Mountain,
  Compass
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { PROVINCES, getTaxRateDisplay } from '../../constants/provinces';

// Province Change Modal
const ProvinceChangeModal = ({ onClose, currentProvince, onUpdate }) => {
  const [selectedProvince, setSelectedProvince] = useState(currentProvince);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Change Province</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select your province of residence for tax purposes
            </p>
            <select 
              className="w-full p-3 border rounded-lg mb-4"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              {PROVINCES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={() => { onUpdate(selectedProvince); onClose(); }}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Status Badge Component
const DocumentStatusBadge = ({ status }) => {
  const statusConfig = {
    uploaded: { color: 'success', icon: CheckCircle, text: 'Uploaded' },
    pending: { color: 'warning', icon: Clock, text: 'Pending' },
    notRequired: { color: 'default', icon: AlertCircle, text: 'Not Required' },
    missing: { color: 'error', icon: AlertTriangle, text: 'Missing' }
  };

  const config = statusConfig[status] || statusConfig.missing;
  const Icon = config.icon;

  return (
    <Badge variant={config.color} className="flex items-center gap-1">
      <Icon size={12} />
      <span>{config.text}</span>
    </Badge>
  );
};

// Document Row Component
const DocumentRow = ({ document, onUpload }) => {
  const getStatusIcon = () => {
    if (document.uploaded) {
      return <CheckCircle size={18} className="text-success-500" />;
    }
    if (document.notRequired) {
      return <AlertCircle size={18} className="text-gray-400" />;
    }
    return <Clock size={18} className="text-warning-500" />;
  };

  const getStatusText = () => {
    if (document.uploaded) return 'Uploaded';
    if (document.notRequired) return 'Not Required';
    return 'Pending';
  };

  const getStatusColor = () => {
    if (document.uploaded) return 'text-success-600';
    if (document.notRequired) return 'text-gray-400';
    return 'text-warning-600';
  };

  const Icon = document.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`p-2 rounded-lg ${
          document.uploaded ? 'bg-success-100' : 
          document.notRequired ? 'bg-gray-100' : 'bg-warning-100'
        }`}>
          <Icon size={18} className={
            document.uploaded ? 'text-success-600' : 
            document.notRequired ? 'text-gray-400' : 'text-warning-600'
          } />
        </div>
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <h4 className="font-medium text-sm">{document.name}</h4>
            {document.taxSlip && (
              <Badge variant="info" size="sm">Tax Slip</Badge>
            )}
            {document.estimatedValue > 0 && (
              <Badge variant="success" size="sm">Est. ${document.estimatedValue}</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{document.description}</p>
          <div className="flex items-center mt-2 text-xs">
            <Calendar size={12} className="text-gray-400 mr-1" />
            <span className="text-gray-500">Due: {document.deadline}</span>
            {document.taxImpact && (
              <>
                <span className="mx-2 text-gray-300">•</span>
                <Info size={12} className="text-primary-400 mr-1" />
                <span className="text-primary-600">{document.taxImpact}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <div className="text-right">
          <div className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
        
        {document.uploaded ? (
          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
            <Eye size={18} />
          </button>
        ) : !document.notRequired ? (
          <Button size="sm" variant="outline" onClick={() => onUpload(document)}>
            <Upload size={14} className="mr-1" />
            Upload
          </Button>
        ) : (
          <div className="w-20"></div>
        )}
      </div>
    </div>
  );
};

// Category Section Component
const CategorySection = ({ category, documents, onUpload, isExpanded, onToggle }) => {
  const uploaded = documents.filter(d => d.uploaded).length;
  const total = documents.length;
  const progress = (uploaded / total) * 100;
  const Icon = category.icon;

  return (
    <Card className="overflow-hidden">
      <div 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(category.id)}
      >
        <Card.Body className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                <Icon size={20} className={`text-${category.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-xs text-gray-500">
                  {uploaded} of {total} documents uploaded
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={uploaded === total ? 'success' : uploaded > 0 ? 'warning' : 'error'}>
                {uploaded}/{total}
              </Badge>
              <ChevronRight 
                size={18} 
                className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`bg-${category.color}-600 h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </Card.Body>
      </div>

      {/* Expanded Documents List */}
      {isExpanded && (
        <div className="border-t bg-gray-50 p-4 space-y-3">
          {documents.map(doc => (
            <DocumentRow 
              key={doc.id} 
              document={doc} 
              onUpload={onUpload}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

const TaxChecklist = () => {
  const { user } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState(user?.businessInfo?.province || 'ON');
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(['income', 'savings', 'business', 'deductions']);
  const [taxNews, setTaxNews] = useState([
    {
      id: 1,
      title: '2024 Tax Rates Announced',
      date: '2024-03-15',
      content: 'CRA has announced new tax brackets and rates for 2024. The basic personal amount has increased to $15,705.',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      title: 'First Home Savings Account (FHSA) Updates',
      date: '2024-03-10',
      content: 'Remember that FHSA contributions are tax-deductible up to $8,000 annually. First-time home buyers can now combine FHSA with HBP.',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      title: 'RRSP Deadline Approaching',
      date: '2024-02-28',
      content: 'The RRSP contribution deadline for the 2023 tax year is March 1, 2024. Contributions made between March 2, 2023 and March 1, 2024 can be deducted.',
      priority: 'high',
      read: true
    }
  ]);

  // Document checklist based on user type and province
  const getDocumentChecklist = () => {
    const isGigWorker = user?.userType === 'gig-worker' || user?.userType === 'self-employed';
    
    return [
      // Income Documents
      {
        id: 't4',
        name: 'T4 - Employment Income',
        description: 'Statement of remuneration from employer',
        category: 'income',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 45000,
        taxImpact: 'Report employment income',
        uploaded: true,
        notRequired: false,
        icon: FileText
      },
      {
        id: 't4a',
        name: 'T4A - Self-Employed/Gig Income',
        description: 'Income from gig platforms, contracts',
        category: 'income',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 12000,
        taxImpact: 'Report self-employment income',
        uploaded: false,
        notRequired: !isGigWorker,
        icon: Briefcase
      },
      {
        id: 't5',
        name: 'T5 - Investment Income',
        description: 'Dividends, interest from investments',
        category: 'income',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 3500,
        taxImpact: 'Report dividends and interest',
        uploaded: false,
        notRequired: false,
        icon: TrendingUp
      },
      {
        id: 't3',
        name: 'T3 - Trust Income',
        description: 'Income from trusts, mutual funds',
        category: 'investment',
        deadline: 'March 31, 2024',
        taxSlip: true,
        estimatedValue: 1200,
        taxImpact: 'Report trust income',
        uploaded: false,
        notRequired: true,
        icon: FileText
      },
      {
        id: 't5008',
        name: 'T5008 - Securities Transactions',
        description: 'Stock sales, capital gains/losses',
        category: 'investment',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 5000,
        taxImpact: 'Report capital gains/losses',
        uploaded: false,
        notRequired: false,
        icon: TrendingUp
      },

      // Savings & Retirement
      {
        id: 'rrsp-contributions',
        name: 'RRSP Contribution Receipts',
        description: 'Receipts for RRSP contributions',
        category: 'savings',
        deadline: 'March 1, 2024',
        taxSlip: true,
        estimatedValue: 5000,
        taxImpact: 'Reduce taxable income',
        uploaded: true,
        notRequired: false,
        icon: PiggyBank
      },
      {
        id: 'fhsa-contributions',
        name: 'FHSA Contribution Receipts',
        description: 'First Home Savings Account contributions',
        category: 'savings',
        deadline: 'December 31, 2024',
        taxSlip: true,
        estimatedValue: 8000,
        taxImpact: 'Reduce taxable income',
        uploaded: false,
        notRequired: false,
        icon: Home
      },
      {
        id: 't4fhsa',
        name: 'T4FHSA - FHSA Statement',
        description: 'Annual FHSA statement',
        category: 'savings',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report FHSA activity',
        uploaded: false,
        notRequired: true,
        icon: FileText
      },
      {
        id: 't4rsp',
        name: 'T4RSP - RRSP Withdrawal',
        description: 'RRSP withdrawal statement',
        category: 'savings',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Taxable withdrawal',
        uploaded: false,
        notRequired: true,
        icon: PiggyBank
      },
      {
        id: 't4rif',
        name: 'T4RIF - RRIF Income',
        description: 'RRIF income statement',
        category: 'retirement',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Taxable retirement income',
        uploaded: false,
        notRequired: true,
        icon: Heart
      },
      {
        id: 'resp-contributions',
        name: 'RESP Contribution Receipts',
        description: 'Registered Education Savings Plan contributions',
        category: 'education',
        deadline: 'December 31, 2024',
        taxSlip: true,
        estimatedValue: 2500,
        taxImpact: 'CESG grants available',
        uploaded: false,
        notRequired: !user?.hasChildren,
        icon: GraduationCap
      },

      // Business Expenses (Gig Worker specific)
      ...(isGigWorker ? [
        {
          id: 'fuel-receipts',
          name: 'Fuel Receipts',
          description: 'Gas receipts for business travel',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 3200,
          taxImpact: 'Deduct business use portion',
          uploaded: true,
          notRequired: false,
          icon: Flame
        },
        {
          id: 'maintenance-receipts',
          name: 'Maintenance & Parts Receipts',
          description: 'Oil changes, repairs, tires',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 850,
          taxImpact: 'Deduct business use portion',
          uploaded: true,
          notRequired: false,
          icon: Wrench
        },
        {
          id: 'insurance-receipts',
          name: 'Vehicle Insurance',
          description: 'Insurance payments for business vehicle',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 1200,
          taxImpact: 'Deduct business use portion',
          uploaded: false,
          notRequired: false,
          icon: Shield
        },
        {
          id: 'service-receipts',
          name: 'Service Receipts',
          description: 'Phone, internet, software subscriptions',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 1800,
          taxImpact: 'Deduct business expenses',
          uploaded: false,
          notRequired: false,
          icon: Smartphone
        },
        {
          id: 'equipment-receipts',
          name: 'Equipment Purchases',
          description: 'Tools, devices, work equipment',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 950,
          taxImpact: 'Capital cost allowance',
          uploaded: false,
          notRequired: false,
          icon: Hammer
        },
        {
          id: 'parking-receipts',
          name: 'Parking & Tolls',
          description: 'Business parking, highway tolls',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 450,
          taxImpact: 'Fully deductible',
          uploaded: false,
          notRequired: false,
          icon: MapPin
        },
        {
          id: 'meals-receipts',
          name: 'Meals & Entertainment',
          description: 'Client meetings, business meals',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 600,
          taxImpact: '50% deductible',
          uploaded: false,
          notRequired: false,
          icon: Coffee
        },
        {
          id: 'supplies-receipts',
          name: 'Office Supplies',
          description: 'Paper, ink, office expenses',
          category: 'business',
          deadline: 'December 31, 2024',
          taxSlip: false,
          estimatedValue: 350,
          taxImpact: 'Fully deductible',
          uploaded: false,
          notRequired: false,
          icon: ShoppingBag
        }
      ] : []),

      // Deductions & Credits
      {
        id: 'medical-expenses',
        name: 'Medical Expense Receipts',
        description: 'Eligible medical expenses',
        category: 'deductions',
        deadline: 'December 31, 2024',
        taxSlip: false,
        estimatedValue: 1500,
        taxImpact: 'Tax credit (15% of eligible amount)',
        uploaded: false,
        notRequired: false,
        icon: Heart
      },
      {
        id: 'charitable-donations',
        name: 'Charitable Donation Receipts',
        description: 'Donations to registered charities',
        category: 'deductions',
        deadline: 'December 31, 2024',
        taxSlip: true,
        estimatedValue: 500,
        taxImpact: 'Tax credit (15-29%)',
        uploaded: false,
        notRequired: false,
        icon: Gift
      },
      {
        id: 'child-care-expenses',
        name: 'Child Care Expense Receipts',
        description: 'Daycare, babysitting, camps',
        category: 'deductions',
        deadline: 'December 31, 2024',
        taxSlip: false,
        estimatedValue: 5000,
        taxImpact: 'Deduct from income (lower earner)',
        uploaded: false,
        notRequired: !user?.hasChildren,
        icon: Baby
      },
      {
        id: 'moving-expenses',
        name: 'Moving Expense Receipts',
        description: 'Expenses for work/school move (40km+)',
        category: 'deductions',
        deadline: 'December 31, 2024',
        taxSlip: false,
        estimatedValue: 2000,
        taxImpact: 'Deduct from income',
        uploaded: false,
        notRequired: true,
        icon: Car
      },
      {
        id: 'home-office-expenses',
        name: 'Home Office Expense Form',
        description: 'T2200 or T777 for home office',
        category: 'deductions',
        deadline: 'December 31, 2024',
        taxSlip: false,
        estimatedValue: 500,
        taxImpact: 'Deduct home office costs',
        uploaded: false,
        notRequired: !user?.worksFromHome,
        icon: Home
      },
      {
        id: 'tuition-slips',
        name: 'Tuition Slips (T2202)',
        description: 'Post-secondary education amounts',
        category: 'education',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 5000,
        taxImpact: 'Tax credit (15%)',
        uploaded: false,
        notRequired: user?.userType !== 'student',
        icon: GraduationCap
      },
      {
        id: 'ccb-notice',
        name: 'Canada Child Benefit Notice',
        description: 'CCB annual notice from CRA',
        category: 'benefits',
        deadline: 'July 2024',
        taxSlip: true,
        estimatedValue: 7200,
        taxImpact: 'Tax-free benefit',
        uploaded: false,
        notRequired: !user?.hasChildren,
        icon: Baby
      },
      {
        id: 'rent-receipts',
        name: 'Rent Receipts',
        description: 'Rent paid for principal residence',
        category: 'credits',
        deadline: 'December 31, 2024',
        taxSlip: false,
        estimatedValue: 12000,
        taxImpact: 'Provincial tax credit',
        uploaded: false,
        notRequired: !(selectedProvince === 'QC' || selectedProvince === 'MB'),
        icon: Home
      }
    ];
  };

  const documents = getDocumentChecklist();
  
  // Calculate document statistics
  const totalDocs = documents.filter(d => !d.notRequired).length;
  const uploadedDocs = documents.filter(d => d.uploaded && !d.notRequired).length;
  const pendingDocs = documents.filter(d => !d.uploaded && !d.notRequired).length;
  const completionPercentage = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

  // Group documents by category
  const categories = {
    income: { id: 'income', name: 'Income Documents', icon: DollarSign, color: 'blue' },
    investment: { id: 'investment', name: 'Investment Income', icon: TrendingUp, color: 'green' },
    savings: { id: 'savings', name: 'Savings & Retirement', icon: PiggyBank, color: 'purple' },
    business: { id: 'business', name: 'Business Expenses', icon: Briefcase, color: 'orange' },
    deductions: { id: 'deductions', name: 'Deductions & Credits', icon: Percent, color: 'red' },
    education: { id: 'education', name: 'Education', icon: GraduationCap, color: 'indigo' },
    benefits: { id: 'benefits', name: 'Benefits', icon: Baby, color: 'pink' },
    retirement: { id: 'retirement', name: 'Retirement Income', icon: Heart, color: 'rose' },
    credits: { id: 'credits', name: 'Provincial Credits', icon: MapPin, color: 'cyan' }
  };

  // Calculate estimated tax savings
  const calculateTaxSavings = () => {
    const provinceInfo = PROVINCES.find(p => p.id === selectedProvince);
    const taxRate = provinceInfo?.hst || provinceInfo?.gst || 5;
    
    const rrspSavings = 5000 * (taxRate / 100);
    const fhsaSavings = 8000 * (taxRate / 100);
    const donationSavings = 500 * 0.25;
    const medicalSavings = 1500 * 0.15;
    const businessSavings = user?.userType === 'gig-worker' ? 1250 : 0;
    
    return {
      rrsp: rrspSavings,
      fhsa: fhsaSavings,
      donations: donationSavings,
      medical: medicalSavings,
      business: businessSavings,
      total: rrspSavings + fhsaSavings + donationSavings + medicalSavings + businessSavings
    };
  };

  const taxSavings = calculateTaxSavings();

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleUpload = (document) => {
    console.log('Uploading:', document);
  };

  // Tax News Bar Component
  const TaxNewsBar = () => {
    const unreadNews = taxNews.filter(n => !n.read).length;
    
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <AlertTriangle className="text-primary-600" size={24} />
              {unreadNews > 0 && (
                <span className="absolute -top-1 -right-1 bg-warning-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNews}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-primary-800">Tax Updates & Reminders</h3>
              <p className="text-sm text-primary-600">
                {unreadNews} new update{unreadNews !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            View All Updates
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tax News Bar */}
      <TaxNewsBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Document Checklist</h1>
          <p className="text-gray-500 mt-1">
            Track your documents and maximize your tax savings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center">
            <MapPin size={16} className="text-blue-600 mr-2" />
            <span className="font-medium">{selectedProvince}</span>
            <span className="text-sm text-gray-500 ml-2">
              {getTaxRateDisplay(selectedProvince)}
            </span>
            <button 
              onClick={() => setShowProvinceModal(true)}
              className="ml-3 text-blue-600 text-sm hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Province Info Banner */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center">
            <MapPin className="text-primary-600 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-primary-800">
                {PROVINCES.find(p => p.id === selectedProvince)?.name} Tax Information
              </h3>
              <p className="text-sm text-primary-600">
                Tax System: {PROVINCES.find(p => p.id === selectedProvince)?.taxSystem} | 
                Rates: {getTaxRateDisplay(selectedProvince)}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-2xl font-bold text-primary-600">{totalDocs}</p>
            <p className="text-xs text-gray-500">Total Required</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-2xl font-bold text-success-600">{uploadedDocs}</p>
            <p className="text-xs text-gray-500">Uploaded</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-2xl font-bold text-warning-600">{pendingDocs}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <p className="text-2xl font-bold text-info-600">{Math.round(completionPercentage)}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </Card.Body>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-primary-600">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Document Categories */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(categories).map(([key, category]) => {
            const categoryDocs = documents.filter(d => d.category === key);
            if (categoryDocs.length === 0) return null;
            
            return (
              <CategorySection
                key={key}
                category={category}
                documents={categoryDocs}
                isExpanded={expandedCategories.includes(category.id)}
                onToggle={toggleCategory}
                onUpload={handleUpload}
              />
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Estimated Tax Savings */}
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <Card.Body>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className="text-green-600 mr-2" size={20} />
                  <h3 className="font-semibold text-green-800">Estimated Tax Savings</h3>
                </div>
              </div>
              
              <p className="text-3xl font-bold text-green-700 mb-4">${taxSavings.total.toFixed(2)}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">RRSP/FHSA</span>
                  <span className="font-medium">${(taxSavings.rrsp + taxSavings.fhsa).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Donations</span>
                  <span className="font-medium">${taxSavings.donations.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Medical</span>
                  <span className="font-medium">${taxSavings.medical.toFixed(2)}</span>
                </div>
                {(user?.userType === 'gig-worker' || user?.userType === 'self-employed') && (
                  <div className="flex justify-between py-1 text-green-600 font-medium">
                    <span>Business Expenses</span>
                    <span>${taxSavings.business.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 mt-2 border-t border-green-200">
                  <div className="flex justify-between font-bold">
                    <span>Total Savings</span>
                    <span className="text-green-700">${taxSavings.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-orange-50 border-orange-200">
            <Card.Header>
              <h3 className="font-semibold text-orange-800 flex items-center">
                <Calendar size={18} className="mr-2" />
                Upcoming Deadlines
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">RRSP Contribution</p>
                    <p className="text-xs text-gray-500">March 1, 2024</p>
                  </div>
                  <Badge variant="warning">14 days left</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Tax Filing Deadline</p>
                    <p className="text-xs text-gray-500">April 30, 2024</p>
                  </div>
                  <Badge variant="info">45 days left</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">GST/HST Filing (Q1)</p>
                    <p className="text-xs text-gray-500">April 30, 2024</p>
                  </div>
                  <Badge variant="info">45 days left</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Links */}
          <Card>
            <Card.Body>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/upload-receipt" className="block p-3 hover:bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <Upload size={16} className="text-primary-600 mr-2" />
                    <span>Upload Receipt</span>
                  </div>
                </Link>
                <Link to="/mileage" className="block p-3 hover:bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-green-600 mr-2" />
                    <span>Log Mileage</span>
                  </div>
                </Link>
                <Link to="/find-ca" className="block p-3 hover:bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <Briefcase size={16} className="text-purple-600 mr-2" />
                    <span>Find a CA</span>
                  </div>
                </Link>
                <Link to="/documents" className="block p-3 hover:bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <FileText size={16} className="text-orange-600 mr-2" />
                    <span>All Documents</span>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Tax Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <Card.Body>
              <div className="flex items-start">
                <Info size={18} className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Did you know?</h4>
                  <p className="text-sm text-blue-700">
                    You can carry forward unused RRSP contribution room indefinitely. 
                    The FHSA allows up to $8,000 in annual contributions (max $40,000 lifetime).
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Province Change Modal */}
      {showProvinceModal && (
        <ProvinceChangeModal
          currentProvince={selectedProvince}
          onUpdate={(newProvince) => setSelectedProvince(newProvince)}
          onClose={() => setShowProvinceModal(false)}
        />
      )}
    </div>
  );
};

// Helper Components
const SavingsItem = ({ label, amount, isHighlighted }) => (
  <div className={`flex justify-between ${isHighlighted ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
    <span className="text-sm">{label}</span>
    <span className="font-medium">${amount.toFixed(2)}</span>
  </div>
);

const DeadlineItem = ({ task, daysLeft, variant }) => {
  const colors = {
    warning: 'bg-warning-100 text-warning-700',
    info: 'bg-info-100 text-info-700',
    success: 'bg-success-100 text-success-700'
  };
  
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
      <div className="flex items-center">
        <Calendar size={16} className={`text-${variant}-600 mr-2`} />
        <span className="text-sm font-medium">{task}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${colors[variant]}`}>
        {daysLeft} days left
      </span>
    </div>
  );
};

export default TaxChecklist;