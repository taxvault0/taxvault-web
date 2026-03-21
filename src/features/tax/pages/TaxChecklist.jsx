// user/TaxChecklist.jsx
import React, { useMemo, useState } from 'react';
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
  Calendar,
  Flame,
  Wrench,
  Shield,
  Smartphone,
  Hammer,
  Receipt,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';
import { PROVINCES } from 'constants/provinces';

const getDocumentRoute = (doc) => {
  const map = {
    t4: '/documents',
    t4a: '/gig/documents/income-records',
    t5: '/documents',
    t3: '/documents',
    t5008: '/documents',

    'rrsp-contributions': '/documents',
    'fhsa-contributions': '/documents',
    t4fhsa: '/documents',
    t4rsp: '/documents',
    t4rif: '/documents',
    'resp-contributions': '/documents',

    'fuel-receipts': '/gig/documents/fuel-receipts',
    'maintenance-receipts': '/gig/documents/maintenance',
    'insurance-receipts': '/gig/documents/insurance',
    'service-receipts': '/gig/documents/mobile-bills',
    'equipment-receipts': '/gig/documents/other-deductions',
    'parking-receipts': '/gig/documents/other-deductions',
    'meals-receipts': '/gig/documents/other-deductions',
    'supplies-receipts': '/gig/documents/other-deductions',

    'medical-expenses': '/documents',
    'charitable-donations': '/documents',
    'child-care-expenses': '/documents',
    'moving-expenses': '/documents',
    'home-office-expenses': '/documents',
    'tuition-slips': '/documents',
    'ccb-notice': '/documents',
    'rent-receipts': '/documents',
  };

  return map[doc.id] || '/documents';
};

const ProvinceChangeModal = ({ onClose, currentProvince, onUpdate }) => {
  const [selectedProvince, setSelectedProvince] = useState(currentProvince);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
          &#8203;
        </span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Change Province</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Select your province of residence for tax purposes
            </p>
            <select
              className="mb-4 w-full rounded-lg border p-3"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onUpdate(selectedProvince);
                  onClose();
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentStatusBadge = ({ status }) => {
  const statusConfig = {
    uploaded: { color: 'success', icon: CheckCircle, text: 'Uploaded' },
    pending: { color: 'warning', icon: Clock, text: 'Pending' },
    notRequired: { color: 'default', icon: AlertCircle, text: 'Not Required' },
    missing: { color: 'error', icon: AlertTriangle, text: 'Missing' },
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

const DocumentRow = ({ document }) => {
  const Icon = document.icon;

  const getStatus = () => {
    if (document.uploaded) return 'uploaded';
    if (document.notRequired) return 'notRequired';
    return 'pending';
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

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex flex-1 items-start space-x-3">
        <div
          className={`rounded-lg p-2 ${
            document.uploaded
              ? 'bg-success-100'
              : document.notRequired
              ? 'bg-gray-100'
              : 'bg-warning-100'
          }`}
        >
          <Icon
            size={18}
            className={
              document.uploaded
                ? 'text-success-600'
                : document.notRequired
                ? 'text-gray-400'
                : 'text-warning-600'
            }
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-medium">{document.name}</h4>
            {document.taxSlip && (
              <Badge variant="info" size="sm">
                Tax Slip
              </Badge>
            )}
            {document.estimatedValue > 0 && (
              <Badge variant="success" size="sm">
                Est. ${document.estimatedValue}
              </Badge>
            )}
            <DocumentStatusBadge status={getStatus()} />
          </div>

          <p className="mt-1 text-xs text-gray-500">{document.description}</p>

          <div className="mt-2 flex items-center text-xs">
            <Calendar size={12} className="mr-1 text-gray-400" />
            <span className="text-gray-500">Due: {document.deadline}</span>
            {document.taxImpact && (
              <>
                <span className="mx-2 text-gray-300">•</span>
                <Info size={12} className="mr-1 text-primary-400" />
                <span className="text-primary-600">{document.taxImpact}</span>
              </>
            )}
          </div>

          <p className={`mt-2 text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="ml-4 flex items-center space-x-3">
        {document.uploaded ? (
          <Link to={getDocumentRoute(document)}>
            <Button size="sm" variant="outline">
              <Eye size={14} className="mr-1" />
              Review
            </Button>
          </Link>
        ) : !document.notRequired ? (
          <Link to={getDocumentRoute(document)}>
            <Button size="sm" variant="outline">
              <Upload size={14} className="mr-1" />
              Upload
            </Button>
          </Link>
        ) : (
          <div className="w-20"></div>
        )}
      </div>
    </div>
  );
};

const CategoryTabs = ({ categories, activeCategory, setActiveCategory, documents }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(categories).map(([key, category]) => {
        const Icon = category.icon;
        const total = documents.filter((d) => d.category === key).length;
        if (total === 0) return null;

        const uploaded = documents.filter((d) => d.category === key && d.uploaded).length;
        const isActive = activeCategory === key;

        return (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            <span>{category.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {uploaded}/{total}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const TaxChecklist = () => {
  const { user } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState(
    user?.province || user?.businessInfo?.province || 'ON'
  );
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('income');
  const [taxNews] = useState([
    {
      id: 1,
      title: '2024 Tax Rates Announced',
      date: '2024-03-15',
      content:
        'CRA has announced new tax brackets and rates for 2024. The basic personal amount has increased to $15,705.',
      priority: 'high',
      read: false,
    },
    {
      id: 2,
      title: 'First Home Savings Account (FHSA) Updates',
      date: '2024-03-10',
      content:
        'Remember that FHSA contributions are tax-deductible up to $8,000 annually. First-time home buyers can now combine FHSA with HBP.',
      priority: 'medium',
      read: false,
    },
    {
      id: 3,
      title: 'RRSP Deadline Approaching',
      date: '2024-02-28',
      content:
        'The RRSP contribution deadline for the 2023 tax year is March 1, 2024. Contributions made between March 2, 2023 and March 1, 2024 can be deducted.',
      priority: 'high',
      read: true,
    },
  ]);

  const getDocumentChecklist = () => {
    const hasGigWork =
      user?.userType === 'gig-worker' ||
      user?.userType === 'self-employed' ||
      user?.taxProfile?.gigWork ||
      user?.taxProfile?.selfEmployment;

    return [
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
        icon: FileText,
      },
      {
        id: 't4a',
        name: 'T4A - Self-Employed / Gig Income',
        description:
          'Annual income slips or platform summaries from Uber, DoorDash, Skip, Instacart, and similar apps',
        category: 'income',
        deadline: 'February 28, 2024',
        taxSlip: true,
        estimatedValue: 12000,
        taxImpact: 'Report self-employment income',
        uploaded: false,
        notRequired: !hasGigWork,
        icon: Briefcase,
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
        icon: TrendingUp,
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
        icon: FileText,
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
        icon: TrendingUp,
      },
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
        icon: PiggyBank,
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
        icon: Home,
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
        icon: FileText,
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
        icon: PiggyBank,
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
        icon: Heart,
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
        icon: GraduationCap,
      },
      ...(hasGigWork
        ? [
            {
              id: 'fuel-receipts',
              name: 'Fuel Receipts',
              description:
                'Recurring fuel receipts for work-related driving. You may upload many throughout the year.',
              category: 'business',
              deadline: 'December 31, 2024',
              taxSlip: false,
              estimatedValue: 3200,
              taxImpact: 'Deduct business use portion',
              uploaded: true,
              notRequired: false,
              icon: Flame,
            },
            {
              id: 'maintenance-receipts',
              name: 'Maintenance & Parts Receipts',
              description:
                'Oil changes, repairs, tires, and vehicle maintenance. Multiple uploads allowed.',
              category: 'business',
              deadline: 'December 31, 2024',
              taxSlip: false,
              estimatedValue: 850,
              taxImpact: 'Deduct business use portion',
              uploaded: true,
              notRequired: false,
              icon: Wrench,
            },
            {
              id: 'insurance-receipts',
              name: 'Vehicle Insurance',
              description:
                'Usually one main policy or annual renewal document each year.',
              category: 'business',
              deadline: 'December 31, 2024',
              taxSlip: false,
              estimatedValue: 1200,
              taxImpact: 'Deduct business use portion',
              uploaded: false,
              notRequired: false,
              icon: Shield,
            },
            {
              id: 'service-receipts',
              name: 'Mobile / Service Bills',
              description:
                'Monthly phone or service bills used for gig work. Usually recurring through the year.',
              category: 'business',
              deadline: 'December 31, 2024',
              taxSlip: false,
              estimatedValue: 1800,
              taxImpact: 'Deduct business expenses',
              uploaded: false,
              notRequired: false,
              icon: Smartphone,
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
              icon: Hammer,
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
              icon: MapPin,
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
              icon: Receipt,
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
              icon: Receipt,
            },
          ]
        : []),
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
        icon: Heart,
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
        icon: Gift,
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
        icon: Baby,
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
        icon: Car,
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
        icon: Home,
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
        icon: GraduationCap,
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
        icon: Baby,
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
        icon: Home,
      },
    ];
  };

  const documents = getDocumentChecklist();

  const totalDocs = documents.filter((d) => !d.notRequired).length;
  const uploadedDocs = documents.filter((d) => d.uploaded && !d.notRequired).length;
  const pendingDocs = documents.filter((d) => !d.uploaded && !d.notRequired).length;
  const completionPercentage = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

  const categories = useMemo(
    () => ({
      income: { id: 'income', name: 'Income', icon: DollarSign },
      investment: { id: 'investment', name: 'Investment', icon: TrendingUp },
      savings: { id: 'savings', name: 'Savings', icon: PiggyBank },
      business: { id: 'business', name: 'Gig Work', icon: Briefcase },
      deductions: { id: 'deductions', name: 'Deductions', icon: Percent },
      education: { id: 'education', name: 'Education', icon: GraduationCap },
      benefits: { id: 'benefits', name: 'Benefits', icon: Baby },
      retirement: { id: 'retirement', name: 'Retirement', icon: Heart },
      credits: { id: 'credits', name: 'Credits', icon: MapPin },
    }),
    []
  );

  const activeDocuments = documents.filter((d) => d.category === activeCategory);

  const calculateTaxSavings = () => {
    const provinceInfo = PROVINCES.find((p) => p.id === selectedProvince);
    const taxRate = provinceInfo?.hst || provinceInfo?.gst || 5;

    const rrspSavings = 5000 * (taxRate / 100);
    const fhsaSavings = 8000 * (taxRate / 100);
    const donationSavings = 500 * 0.25;
    const medicalSavings = 1500 * 0.15;
    const businessSavings =
      user?.userType === 'gig-worker' || user?.userType === 'self-employed'
        ? 1250
        : 0;

    return {
      rrsp: rrspSavings,
      fhsa: fhsaSavings,
      donations: donationSavings,
      medical: medicalSavings,
      business: businessSavings,
      total:
        rrspSavings + fhsaSavings + donationSavings + medicalSavings + businessSavings,
    };
  };

  const taxSavings = calculateTaxSavings();

  const TaxNewsBar = () => {
    const unreadNews = taxNews.filter((n) => !n.read).length;

    return (
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <AlertTriangle className="text-primary-600" size={24} />
              {unreadNews > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning-500 text-xs text-white">
                  {unreadNews}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-primary-800">
                Tax Updates & Reminders
              </h3>
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TaxNewsBar />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Document Checklist</h1>
          <p className="mt-1 text-gray-500">
            Track your documents and maximize your tax savings
          </p>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <Card.Body>
          <p className="text-sm text-blue-800">
            This checklist shows what you need. Click <strong>Upload</strong> to
            open the correct page and manage documents.
          </p>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
            <p className="text-2xl font-bold text-info-600">
              {Math.round(completionPercentage)}%
            </p>
            <p className="text-xs text-gray-500">Complete</p>
          </Card.Body>
        </Card>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-primary-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <Card>
        <Card.Body className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Document Categories</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a category to view and manage the related documents.
            </p>
          </div>

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            documents={documents}
          />

          <div className="space-y-3">
            {activeDocuments.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
          </div>
        </Card.Body>
      </Card>

<div className="flex flex-col gap-4 md:flex-row">
  <div className="min-w-0 flex-1">
    <Card className="h-full border-green-200 bg-gradient-to-br from-green-50 to-white">
      <Card.Body className="p-4">
        <div className="mb-3 flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={18} />
          <h3 className="text-sm font-semibold text-green-800">
            Estimated Tax Savings
          </h3>
        </div>

        <p className="mb-3 text-2xl font-bold text-green-700">
          ${taxSavings.total.toFixed(2)}
        </p>

        <div className="space-y-1.5 text-xs">
          <SavingsItem
            label="RRSP/FHSA"
            amount={taxSavings.rrsp + taxSavings.fhsa}
          />
          <SavingsItem label="Donations" amount={taxSavings.donations} />
          <SavingsItem label="Medical" amount={taxSavings.medical} />

          {(user?.userType === 'gig-worker' ||
            user?.userType === 'self-employed' ||
            user?.taxProfile?.gigWork ||
            user?.taxProfile?.selfEmployment) && (
            <SavingsItem
              label="Business Expenses"
              amount={taxSavings.business}
              isHighlighted
            />
          )}

          <div className="mt-2 border-t border-green-200 pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className="text-green-700">
                ${taxSavings.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  </div>

  <div className="min-w-0 flex-1">
    <Card className="h-full border-orange-200 bg-orange-50">
      <Card.Body className="p-4">
        <div className="mb-3 flex items-center">
          <Calendar size={18} className="mr-2 text-orange-600" />
          <h3 className="text-sm font-semibold text-orange-800">
            Upcoming Deadlines
          </h3>
        </div>

        <div className="space-y-2">
          <div className="rounded-lg bg-white p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium">RRSP Contribution</p>
                <p className="text-[11px] text-gray-500">March 1, 2024</p>
              </div>
              <Badge variant="warning">14 days</Badge>
            </div>
          </div>

          <div className="rounded-lg bg-white p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium">Tax Filing Deadline</p>
                <p className="text-[11px] text-gray-500">April 30, 2024</p>
              </div>
              <Badge variant="info">45 days</Badge>
            </div>
          </div>

          <div className="rounded-lg bg-white p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium">GST/HST Filing</p>
                <p className="text-[11px] text-gray-500">April 30, 2024</p>
              </div>
              <Badge variant="info">45 days</Badge>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  </div>

  <div className="min-w-0 flex-1">
    <Card className="h-full border-blue-200 bg-blue-50">
      <Card.Body className="p-4">
        <div className="mb-3 flex items-center">
          <Info size={18} className="mr-2 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">
            Did you know?
          </h3>
        </div>

        <p className="text-sm leading-6 text-blue-700">
          This checklist is your progress page. Upload and review happen in the
          linked document pages, so both flows stay connected and easy to understand.
        </p>
      </Card.Body>
    </Card>
  </div>
</div>

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

const SavingsItem = ({ label, amount, isHighlighted }) => (
  <div
    className={`flex justify-between ${
      isHighlighted ? 'font-medium text-green-600' : 'text-gray-700'
    }`}
  >
    <span className="text-sm">{label}</span>
    <span className="font-medium">${amount.toFixed(2)}</span>
  </div>
);

export default TaxChecklist;