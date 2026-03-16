import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  Download,
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
  Calendar
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { PROVINCES, getTaxRateDisplay } from '../../constants/provinces';

const TaxChecklist = () => {
  const { user } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState(user?.businessInfo?.province || 'ON');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    const baseDocuments = [
      {
        id: 't4',
        name: 'T4 - Employment Income',
        required: user?.userType === 'employee',
        description: 'Statement of remuneration paid',
        category: 'income',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report employment income'
      },
      {
        id: 't4a',
        name: 'T4A - Self-Employed/Gig Income',
        required: user?.userType === 'gig-worker' || user?.userType === 'self-employed',
        description: 'Statement of pension, retirement, annuity, and other income',
        category: 'income',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report self-employment income'
      },
      {
        id: 't5',
        name: 'T5 - Investment Income',
        required: true,
        description: 'Statement of investment income',
        category: 'investment',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report dividends and interest'
      },
      {
        id: 't3',
        name: 'T3 - Trust Income',
        required: false,
        description: 'Statement of trust income allocations',
        category: 'investment',
        deadline: 'March 31',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report trust income'
      },
      {
        id: 't5008',
        name: 'T5008 - Securities Transactions',
        required: false,
        description: 'Statement of securities transactions',
        category: 'investment',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report capital gains/losses'
      },
      {
        id: 'rrsp-contributions',
        name: 'RRSP Contribution Receipts',
        required: true,
        description: 'Receipts for RRSP contributions',
        category: 'savings',
        deadline: 'March 1',
        taxSlip: true,
        estimatedValue: 5000,
        taxImpact: 'Reduce taxable income'
      },
      {
        id: 'fhsa-contributions',
        name: 'FHSA Contribution Receipts',
        required: true,
        description: 'First Home Savings Account contributions',
        category: 'savings',
        deadline: 'December 31',
        taxSlip: true,
        estimatedValue: 8000,
        taxImpact: 'Reduce taxable income'
      },
      {
        id: 't4fhsa',
        name: 'T4FHSA - FHSA Statement',
        required: true,
        description: 'Annual FHSA statement',
        category: 'savings',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Report FHSA activity'
      },
      {
        id: 't4rsp',
        name: 'T4RSP - RRSP Withdrawal',
        required: false,
        description: 'RRSP withdrawal statement',
        category: 'savings',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Taxable withdrawal'
      },
      {
        id: 't4rif',
        name: 'T4RIF - RRIF Income',
        required: false,
        description: 'RRIF income statement',
        category: 'retirement',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Taxable retirement income'
      },
      {
        id: 'resp-contributions',
        name: 'RESP Contribution Receipts',
        required: user?.hasChildren || false,
        description: 'Registered Education Savings Plan contributions',
        category: 'education',
        deadline: 'December 31',
        taxSlip: true,
        estimatedValue: 2500,
        taxImpact: 'CESG grants available'
      },
      {
        id: 't4a-resp',
        name: 'T4A - RESP Withdrawal',
        required: false,
        description: 'Educational assistance payments',
        category: 'education',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: null,
        taxImpact: 'Taxable in student\'s hands'
      },
      {
        id: 'medical-expenses',
        name: 'Medical Expense Receipts',
        required: false,
        description: 'Eligible medical expenses',
        category: 'deductions',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 1500,
        taxImpact: 'Tax credit (15% of eligible amount)'
      },
      {
        id: 'charitable-donations',
        name: 'Charitable Donation Receipts',
        required: false,
        description: 'Donations to registered charities',
        category: 'deductions',
        deadline: 'December 31',
        taxSlip: true,
        estimatedValue: 500,
        taxImpact: 'Tax credit (15-29%)'
      },
      {
        id: 'child-care-expenses',
        name: 'Child Care Expense Receipts',
        required: user?.hasChildren || false,
        description: 'Daycare, babysitting, camps',
        category: 'deductions',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 5000,
        taxImpact: 'Deduct from income (lower earner)'
      },
      {
        id: 'tuition-slips',
        name: 'Tuition Slips (T2202)',
        required: user?.userType === 'student' || false,
        description: 'Post-secondary education amounts',
        category: 'education',
        deadline: 'February 28',
        taxSlip: true,
        estimatedValue: 5000,
        taxImpact: 'Tax credit (15%)'
      },
      {
        id: 'moving-expenses',
        name: 'Moving Expense Receipts',
        required: false,
        description: 'Expenses for work/school move (40km+)',
        category: 'deductions',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 2000,
        taxImpact: 'Deduct from income'
      },
      {
        id: 'home-office-expenses',
        name: 'Home Office Expense Form',
        required: user?.userType === 'employee' && user?.worksFromHome,
        description: 'T2200 or T777 for home office',
        category: 'deductions',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 500,
        taxImpact: 'Deduct home office costs'
      },
      {
        id: 'vehicle-expenses',
        name: 'Vehicle Expense Log',
        required: user?.userType === 'gig-worker' || user?.userType === 'self-employed',
        description: 'Mileage log and vehicle expenses',
        category: 'business',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 5000,
        taxImpact: 'Deduct business use portion'
      },
      {
        id: 'gst-returns',
        name: 'GST/HST Returns',
        required: user?.businessInfo?.gstRegistered || false,
        description: 'Quarterly GST/HST filings',
        category: 'business',
        deadline: 'Quarterly',
        taxSlip: false,
        estimatedValue: null,
        taxImpact: 'Track tax collected/paid'
      },
      {
        id: 'ccb-notice',
        name: 'Canada Child Benefit Notice',
        required: user?.hasChildren || false,
        description: 'CCB annual notice from CRA',
        category: 'benefits',
        deadline: 'July',
        taxSlip: true,
        estimatedValue: 7200,
        taxImpact: 'Tax-free benefit'
      },
      {
        id: 'rent-receipts',
        name: 'Rent Receipts',
        required: user?.province === 'QC' || user?.province === 'MB',
        description: 'Rent paid for principal residence',
        category: 'credits',
        deadline: 'December 31',
        taxSlip: false,
        estimatedValue: 12000,
        taxImpact: 'Provincial tax credit'
      }
    ];

    // Filter based on user type and province
    return baseDocuments.filter(doc => {
      if (doc.required === false) return false;
      if (doc.required === true) return true;
      
      // Handle conditional requirements
      if (doc.id === 'rent-receipts') {
        return selectedProvince === 'QC' || selectedProvince === 'MB';
      }
      
      return true;
    });
  };

  const documents = getDocumentChecklist();
  
  // Calculate document statistics
  const totalDocs = documents.length;
  const uploadedDocs = documents.filter(d => d.uploaded).length;
  const pendingDocs = documents.filter(d => !d.uploaded).length;
  const completionPercentage = (uploadedDocs / totalDocs) * 100;

  // Group documents by category
  const categories = {
    income: { name: 'Income Documents', icon: DollarSign, color: 'primary' },
    investment: { name: 'Investment Income', icon: TrendingUp, color: 'success' },
    savings: { name: 'Savings & Retirement', icon: PiggyBank, color: 'info' },
    deductions: { name: 'Deductions & Credits', icon: Percent, color: 'warning' },
    business: { name: 'Business Expenses', icon: Briefcase, color: 'secondary' },
    education: { name: 'Education', icon: GraduationCap, color: 'gold' },
    benefits: { name: 'Benefits', icon: Baby, color: 'success' },
    retirement: { name: 'Retirement Income', icon: Heart, color: 'primary' },
    credits: { name: 'Provincial Credits', icon: MapPin, color: 'info' }
  };

  // Calculate estimated tax savings
  const calculateTaxSavings = () => {
    const provinceInfo = PROVINCES.find(p => p.id === selectedProvince);
    const taxRate = provinceInfo?.hst || provinceInfo?.gst || 0;
    
    // Simple estimation - in real app, this would be more sophisticated
    const rrspSavings = 5000 * (taxRate / 100);
    const fhsaSavings = 8000 * (taxRate / 100);
    const donationSavings = 500 * 0.25; // 25% credit
    const medicalSavings = 1500 * 0.15; // 15% credit
    
    return {
      rrsp: rrspSavings,
      fhsa: fhsaSavings,
      donations: donationSavings,
      medical: medicalSavings,
      total: rrspSavings + fhsaSavings + donationSavings + medicalSavings
    };
  };

  const taxSavings = calculateTaxSavings();

  // Document Modal Component
  const DocumentModal = ({ category, onClose }) => {
    const categoryDocs = documents.filter(d => d.category === category);
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {categories[category]?.name} Documents
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                {categoryDocs.map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{doc.name}</h4>
                          {doc.taxSlip && (
                            <Badge variant="info" className="ml-2">Tax Slip</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-500">Deadline:</span>{' '}
                            <span className="font-medium">{doc.deadline}</span>
                          </div>
                          {doc.estimatedValue > 0 && (
                            <div>
                              <span className="text-gray-500">Est. Value:</span>{' '}
                              <span className="font-medium text-success-600">
                                ${doc.estimatedValue}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-primary-600 mt-2">
                          <Info size={12} className="inline mr-1" />
                          {doc.taxImpact}
                        </p>
                      </div>
                      
                      <div className="ml-4">
                        {doc.uploaded ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={20} className="text-success-500" />
                            <button className="text-primary-600 hover:text-primary-700">
                              <Eye size={18} />
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Upload size={14} className="mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tax News Suggestion Bar Component
  const TaxNewsBar = () => {
    const unreadNews = taxNews.filter(n => !n.read).length;
    
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
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
        
        {/* Scrolling news ticker */}
        <div className="mt-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {taxNews.map(news => (
              <span key={news.id} className={`inline-flex items-center mx-4 text-sm ${
                news.priority === 'high' ? 'text-warning-600 font-medium' : 'text-gray-600'
              }`}>
                <span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
                {news.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tax News Bar */}
      <TaxNewsBar />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Document Checklist</h1>
          <p className="text-gray-500 mt-1">
            Track your documents and maximize your tax savings based on your profile
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {PROVINCES.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Province Info Banner */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center">
            <MapPin className="text-primary-600 mr-3" size={24} />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Documents</p>
            <p className="text-2xl font-bold text-primary-600">{totalDocs}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Uploaded</p>
            <p className="text-2xl font-bold text-success-600">{uploadedDocs}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-warning-600">{pendingDocs}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Completion</p>
            <p className="text-2xl font-bold text-info-600">{Math.round(completionPercentage)}%</p>
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

      {/* Estimated Tax Savings */}
      <Card className="bg-success-50 border-success-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="text-success-600 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-success-800">Estimated Tax Savings</h3>
                <p className="text-sm text-success-600">
                  Based on your uploaded documents and profile
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold text-success-700">
              ${taxSavings.total.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">RRSP/FHSA</p>
              <p className="text-lg font-semibold text-primary-600">
                ${(taxSavings.rrsp + taxSavings.fhsa).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Donations</p>
              <p className="text-lg font-semibold text-warning-600">
                ${taxSavings.donations.toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Medical</p>
              <p className="text-lg font-semibold text-info-600">
                ${taxSavings.medical.toFixed(2)}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Document Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, category]) => {
          const categoryDocs = documents.filter(d => d.category === key);
          if (categoryDocs.length === 0) return null;
          
          const uploaded = categoryDocs.filter(d => d.uploaded).length;
          const total = categoryDocs.length;
          const progress = (uploaded / total) * 100;
          const Icon = category.icon;
          
          return (
            <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(key);
                    setShowDocumentModal(true);
                  }}>
              <Card.Body>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                    <Icon size={20} className={`text-${category.color}-600`} />
                  </div>
                  <Badge variant={uploaded === total ? 'success' : uploaded > 0 ? 'warning' : 'error'}>
                    {uploaded}/{total}
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-2">{category.name}</h3>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                  <div
                    className={`bg-${category.color}-600 h-1.5 rounded-full`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {total - uploaded} document{total - uploaded !== 1 ? 's' : ''} remaining
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Urgent Deadlines */}
      <Card className="bg-warning-50 border-warning-200">
        <Card.Header>
          <h3 className="font-semibold text-warning-800 flex items-center">
            <Clock size={18} className="mr-2" />
            Upcoming Deadlines
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={16} className="text-warning-600 mr-2" />
                <span className="font-medium">RRSP Contribution Deadline</span>
              </div>
              <Badge variant="warning">14 days left</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={16} className="text-warning-600 mr-2" />
                <span className="font-medium">T4/T4A Slips Due from Employers</span>
              </div>
              <Badge variant="info">28 days left</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={16} className="text-warning-600 mr-2" />
                <span className="font-medium">GST/HST Filing (Q1)</span>
              </div>
              <Badge variant="success">45 days left</Badge>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Document Modal */}
      {showDocumentModal && selectedCategory && (
        <DocumentModal
          category={selectedCategory}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default TaxChecklist;