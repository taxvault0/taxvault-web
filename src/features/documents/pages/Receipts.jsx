import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  DollarSign,
  Eye,
  FileUp,
  Folder,
  List,
  Plus,
  Search,
  Tag,
  Trash2,
  Wrench,
  Fuel,
  Car,
  Smartphone,
  ShoppingBag,
  Shield,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Gift,
  PiggyBank,
  Baby,
  Truck,
  Home,
  MoreHorizontal,
  X,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';

const CATEGORY_META = {
  all: {
    label: 'All Receipts',
    description: 'All recurring expense uploads and frequent receipts.',
    icon: Folder,
    iconWrap: 'bg-gray-100',
    iconColor: 'text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
  },
  fuel: {
    label: 'Fuel',
    description: 'Gas, diesel, EV charging, and fuel-related receipts.',
    icon: Fuel,
    iconWrap: 'bg-orange-100',
    iconColor: 'text-orange-700',
    chip: 'bg-orange-100 text-orange-700',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Repairs, oil changes, parts, tires, and service receipts.',
    icon: Wrench,
    iconWrap: 'bg-red-100',
    iconColor: 'text-red-700',
    chip: 'bg-red-100 text-red-700',
  },
  parking: {
    label: 'Parking',
    description: 'Parking fees, tolls, meters, and trip-related road charges.',
    icon: Car,
    iconWrap: 'bg-purple-100',
    iconColor: 'text-purple-700',
    chip: 'bg-purple-100 text-purple-700',
  },
  mobile: {
    label: 'Mobile/Internet',
    description: 'Phone, data, mobile plans, and internet bills.',
    icon: Smartphone,
    iconWrap: 'bg-blue-100',
    iconColor: 'text-blue-700',
    chip: 'bg-blue-100 text-blue-700',
  },
  supplies: {
    label: 'Supplies',
    description: 'Supplies, tools, small equipment, and frequent purchases.',
    icon: ShoppingBag,
    iconWrap: 'bg-green-100',
    iconColor: 'text-green-700',
    chip: 'bg-green-100 text-green-700',
  },
  insurance: {
    label: 'Insurance',
    description: 'Recurring insurance premium receipts or payment confirmations.',
    icon: Shield,
    iconWrap: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    chip: 'bg-indigo-100 text-indigo-700',
  },
  meals: {
    label: 'Meals',
    description: 'Business meals and food receipts where applicable.',
    icon: UtensilsCrossed,
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-700',
  },
  medical: {
    label: 'Medical',
    description: 'Medical expense receipts and recurring health-related payments.',
    icon: HeartPulse,
    iconWrap: 'bg-rose-100',
    iconColor: 'text-rose-700',
    chip: 'bg-rose-100 text-rose-700',
  },
  tuition: {
    label: 'Tuition',
    description: 'Tuition and education-related receipt uploads.',
    icon: GraduationCap,
    iconWrap: 'bg-teal-100',
    iconColor: 'text-teal-700',
    chip: 'bg-teal-100 text-teal-700',
  },
  donations: {
    label: 'Donations',
    description: 'Donation receipts you upload frequently before annual packaging.',
    icon: Gift,
    iconWrap: 'bg-pink-100',
    iconColor: 'text-pink-700',
    chip: 'bg-pink-100 text-pink-700',
  },
  rrsp: {
    label: 'RRSP',
    description: 'Contribution confirmations you want to track quickly.',
    icon: PiggyBank,
    iconWrap: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-700',
  },
  childcare: {
    label: 'Child Care',
    description: 'Daycare, babysitting, and child care payment receipts.',
    icon: Baby,
    iconWrap: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    chip: 'bg-cyan-100 text-cyan-700',
  },
  moving: {
    label: 'Moving',
    description: 'Moving expenses and relocation-related receipts.',
    icon: Truck,
    iconWrap: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
    chip: 'bg-yellow-100 text-yellow-700',
  },
  'home-office': {
    label: 'Home Office',
    description: 'Home office supplies, internet, utilities, and workspace expenses.',
    icon: Home,
    iconWrap: 'bg-slate-100',
    iconColor: 'text-slate-700',
    chip: 'bg-slate-100 text-slate-700',
  },
  other: {
    label: 'Other',
    description: 'Other recurring expenses not covered above.',
    icon: MoreHorizontal,
    iconWrap: 'bg-gray-100',
    iconColor: 'text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
  },
};

const Receipts = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('folders');
  const [dateRange, setDateRange] = useState('year');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const activeProfile = useMemo(() => {
    const userType = (user?.userType || '').toLowerCase();

    if (user?.hasMultipleIncomes || userType === 'hybrid') return 'hybrid';
    if (userType.includes('gig')) return 'gig';
    if (userType.includes('business')) return 'hybrid';
    if (userType.includes('contractor')) return 'hybrid';
    return 'employee';
  }, [user]);

  const visibleCategories = useMemo(() => {
    const base = ['all'];

    if (activeProfile === 'gig') {
      return [
        ...base,
        'fuel',
        'maintenance',
        'parking',
        'mobile',
        'supplies',
        'insurance',
        'meals',
        'other',
      ];
    }

    if (activeProfile === 'employee') {
      return [
        ...base,
        'medical',
        'tuition',
        'donations',
        'rrsp',
        'childcare',
        'moving',
        'home-office',
        'other',
      ];
    }

    return [
      ...base,
      'fuel',
      'maintenance',
      'parking',
      'mobile',
      'supplies',
      'insurance',
      'meals',
      'medical',
      'home-office',
      'other',
    ];
  }, [activeProfile]);

  useEffect(() => {
    const loadReceipts = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setReceipts(generateMockReceipts(activeProfile));
      } catch (error) {
        console.error('Error loading receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [activeProfile, dateRange, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts = visibleCategories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    counts.all = receipts.length;

    receipts.forEach((receipt) => {
      if (counts[receipt.category] !== undefined) {
        counts[receipt.category] += 1;
      }
    });

    return counts;
  }, [receipts, visibleCategories]);

  const filteredReceipts = useMemo(() => {
    const list = receipts.filter((receipt) => {
      if (selectedCategory !== 'all' && receipt.category !== selectedCategory) return false;

      if (!searchTerm.trim()) return true;

      const value = searchTerm.toLowerCase();
      return (
        receipt.vendor.toLowerCase().includes(value) ||
        receipt.notes.toLowerCase().includes(value) ||
        receipt.category.toLowerCase().includes(value) ||
        receipt.paymentMethod.toLowerCase().includes(value)
      );
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [receipts, selectedCategory, searchTerm, sortBy]);

  const totalAmount = filteredReceipts.reduce((sum, item) => sum + item.amount, 0);
  const totalGST = filteredReceipts.reduce((sum, item) => sum + (item.gst || 0), 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const DeleteModal = () => {
    if (!showDeleteModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="fixed inset-0 bg-gray-900/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete receipt</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Delete {selectedReceipt.vendor} from your receipt uploads. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <button
                className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 transition hover:bg-red-100"
                onClick={() => {
                  setReceipts((current) =>
                    current.filter((receipt) => receipt.id !== selectedReceipt.id)
                  );
                  setShowDeleteModal(false);
                  setSelectedReceipt(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptCard = ({ receipt }) => {
    const meta = CATEGORY_META[receipt.category] || CATEGORY_META.other;
    const Icon = meta.icon;

    return (
      <Card className="transition hover:shadow-md">
        <Card.Body>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 gap-4">
              <div className={`mt-1 rounded-xl p-3 ${meta.iconWrap}`}>
                <Icon size={20} className={meta.iconColor} />
              </div>

              <div className="flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{receipt.vendor}</h3>
                  <p className="text-sm text-gray-500">
                    Frequent expense upload • {formatDate(receipt.date)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${meta.chip}`}>
                    <Tag size={12} className="mr-1" />
                    {meta.label}
                  </span>
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <DollarSign size={12} className="mr-1" />
                    {receipt.amount.toFixed(2)}
                  </span>
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    GST/HST {receipt.gst.toFixed(2)}
                  </span>
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {receipt.paymentMethod}
                  </span>
                </div>

                {receipt.notes && <p className="mt-3 text-sm text-gray-600">{receipt.notes}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link to={`/receipts/${receipt.id}`}>
                <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-500 hover:text-primary-600">
                  <Eye size={16} className="mr-2" />
                  View
                </button>
              </Link>

              <button
                className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                onClick={() => {
                  setSelectedReceipt(receipt);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const EmptyState = () => (
    <Card>
      <Card.Body>
        <div className="py-10 text-center">
          <FileUp size={40} className="mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No receipts found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start adding recurring expense receipts so they are ready for tax filing.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/receipts/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Add Receipt
              </Button>
            </Link>
            <Link to="/documents">
              <Button variant="outline">Open Tax Documents</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">Receipts &amp; Expense Uploads</h1>
          <p className="mt-2 text-gray-600">
            Store recurring expense receipts and day-to-day tax proof such as fuel, maintenance,
            parking, mobile bills, supplies, meals, and other frequent uploads.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/documents">
            <Button variant="outline">Open Tax Documents</Button>
          </Link>
          <Link to="/receipts/new">
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              Add Receipt
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <Card.Body>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search receipts by vendor, category, note, or payment method..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters((prev) => !prev)}>
                Filters
              </Button>

              <button
                onClick={() => setViewMode('folders')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  viewMode === 'folders'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Folder size={16} className="mr-2" />
                Folders
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={16} className="mr-2" />
                List
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="year">This Year</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="flex flex-wrap gap-2">
        {visibleCategories.map((categoryKey) => {
          const meta = CATEGORY_META[categoryKey];
          const isActive = selectedCategory === categoryKey;

          return (
            <button
              key={categoryKey}
              onClick={() => {
                setSelectedCategory(categoryKey);
                setViewMode('list');
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {meta.label} ({categoryCounts[categoryKey] || 0})
            </button>
          );
        })}
      </div>

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Visible Receipts</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{filteredReceipts.length}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="mt-1 text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">GST/HST Paid</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">${totalGST.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="mt-4 text-sm text-gray-500">Loading receipts...</p>
        </div>
      ) : viewMode === 'folders' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((categoryKey) => {
            const meta = CATEGORY_META[categoryKey];
            const Icon = meta.icon;

            return (
              <Card
                key={categoryKey}
                className={`cursor-pointer transition hover:shadow-md ${
                  selectedCategory === categoryKey ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => {
                  setSelectedCategory(categoryKey);
                  setViewMode('list');
                }}
              >
                <Card.Body>
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${meta.iconWrap}`}>
                      <Icon size={22} className={meta.iconColor} />
                    </div>
                    <Badge variant="info">{categoryCounts[categoryKey] || 0}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                  <p className="mt-2 text-sm text-gray-500">{meta.description}</p>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ) : filteredReceipts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      )}

      <DeleteModal />
    </div>
  );
};

function generateMockReceipts(profile) {
  const today = new Date();

  const buildReceipt = (
    id,
    vendor,
    category,
    amount,
    daysAgo,
    notes,
    paymentMethod = 'Credit Card'
  ) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    return {
      id,
      vendor,
      category,
      amount,
      date: date.toISOString().split('T')[0],
      gst: Math.round(amount * 0.05 * 100) / 100,
      paymentMethod,
      notes,
    };
  };

  if (profile === 'gig') {
    return [
      buildReceipt(1, 'Shell', 'fuel', 62.48, 2, 'Fuel receipt for delivery shift.'),
      buildReceipt(2, 'Canadian Tire', 'maintenance', 138.79, 7, 'Oil change and wiper replacement.'),
      buildReceipt(3, 'Green P', 'parking', 18.0, 4, 'Downtown pickup parking.'),
      buildReceipt(4, 'Rogers', 'mobile', 96.5, 10, 'Monthly phone and data bill.'),
      buildReceipt(5, 'Staples', 'supplies', 34.29, 14, 'Phone mount and organizers.'),
      buildReceipt(6, 'Intact Insurance', 'insurance', 172.35, 20, 'Monthly vehicle insurance payment.'),
      buildReceipt(7, 'Tim Hortons', 'meals', 11.42, 1, 'Meal during work shift.'),
      buildReceipt(8, 'Petro-Canada', 'fuel', 58.17, 12, 'Fuel refill before evening run.'),
      buildReceipt(9, '407 ETR', 'parking', 24.6, 16, 'Road toll payment.'),
      buildReceipt(10, 'Amazon', 'other', 29.99, 22, 'Miscellaneous delivery supplies.'),
    ];
  }

  if (profile === 'employee') {
    return [
      buildReceipt(1, 'Shoppers Drug Mart', 'medical', 42.33, 3, 'Prescription and health items.'),
      buildReceipt(2, 'BrightPath', 'childcare', 780.0, 5, 'Monthly daycare fee.'),
      buildReceipt(3, 'University of Alberta', 'tuition', 640.0, 9, 'Course fee installment.'),
      buildReceipt(4, 'United Way', 'donations', 50.0, 12, 'Monthly donation receipt.'),
      buildReceipt(5, 'RBC', 'rrsp', 300.0, 15, 'Recurring RRSP contribution.'),
      buildReceipt(6, 'U-Haul', 'moving', 129.99, 28, 'Moving truck expense.'),
      buildReceipt(7, 'Staples', 'home-office', 45.22, 8, 'Printer paper and office items.'),
      buildReceipt(8, 'Telus', 'home-office', 105.0, 18, 'Internet bill for home office use.'),
      buildReceipt(9, 'Dental Clinic', 'medical', 89.5, 25, 'Dental cleaning payment.'),
      buildReceipt(10, 'Other Expense', 'other', 22.0, 32, 'Small tax-related expense.'),
    ];
  }

  return [
    buildReceipt(1, 'Shell', 'fuel', 61.2, 2, 'Fuel for mixed gig and business use.'),
    buildReceipt(2, 'Midas', 'maintenance', 220.75, 6, 'Brake service and inspection.'),
    buildReceipt(3, 'Green P', 'parking', 16.0, 4, 'Parking during client meeting.'),
    buildReceipt(4, 'Bell', 'mobile', 109.5, 10, 'Phone and internet bill.'),
    buildReceipt(5, 'Costco', 'supplies', 88.35, 9, 'Office and delivery supplies.'),
    buildReceipt(6, 'Aviva', 'insurance', 210.0, 13, 'Insurance premium payment.'),
    buildReceipt(7, 'A&W', 'meals', 14.4, 5, 'Meal during delivery hours.'),
    buildReceipt(8, 'Pharmacy', 'medical', 37.8, 11, 'Medical expense receipt.'),
    buildReceipt(9, 'Staples', 'home-office', 64.1, 17, 'Desk accessories and printer ink.'),
    buildReceipt(10, 'Other Expense', 'other', 26.75, 24, 'General recurring expense.'),
  ];
}

export default Receipts;