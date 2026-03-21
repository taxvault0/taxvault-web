import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  History,
  Landmark,
  Lock,
  PiggyBank,
  Receipt,
  Search,
  Settings2,
  Shield,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';
import { buildHouseholdProfile } from 'utils/taxProfile';

const CATEGORY_META = {
  all: {
    label: 'All',
    icon: FileText,
    pillClass: 'bg-gray-100 text-gray-700',
  },
  employment: {
    label: 'Employment',
    icon: Briefcase,
    pillClass: 'bg-blue-100 text-blue-700',
  },
  t4: {
    label: 'T4',
    icon: Briefcase,
    pillClass: 'bg-blue-100 text-blue-700',
  },
  'gig-income': {
    label: 'Gig Income',
    icon: Receipt,
    pillClass: 'bg-amber-100 text-amber-700',
  },
  investments: {
    label: 'Investments',
    icon: Landmark,
    pillClass: 'bg-purple-100 text-purple-700',
  },
  savings: {
    label: 'Savings',
    icon: PiggyBank,
    pillClass: 'bg-green-100 text-green-700',
  },
  insurance: {
    label: 'Insurance',
    icon: Shield,
    pillClass: 'bg-indigo-100 text-indigo-700',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    pillClass: 'bg-teal-100 text-teal-700',
  },
  'medical-donations': {
    label: 'Medical / Donations',
    icon: HeartPulse,
    pillClass: 'bg-rose-100 text-rose-700',
  },

  // New spouse-aware categories
  'spouse-t4': {
    label: 'Spouse T4',
    icon: HeartHandshake,
    pillClass: 'bg-sky-100 text-sky-700',
  },
  'spouse-gig': {
    label: 'Spouse Gig Income',
    icon: HeartHandshake,
    pillClass: 'bg-teal-100 text-teal-700',
  },
  'spouse-gig-expenses': {
    label: 'Spouse Gig Expenses',
    icon: Receipt,
    pillClass: 'bg-cyan-100 text-cyan-700',
  },
  'spouse-business': {
    label: 'Spouse Business',
    icon: Building2,
    pillClass: 'bg-fuchsia-100 text-fuchsia-700',
  },
  'spouse-optional': {
    label: 'Spouse Optional',
    icon: Wallet,
    pillClass: 'bg-violet-100 text-violet-700',
  },
};

const TABS = [
  'all',
  'employment',
  'gig-income',
  'investments',
  'savings',
  'insurance',
  'education',
  'medical-donations',
  'spouse-t4',
  'spouse-gig',
  'spouse-gig-expenses',
  'spouse-business',
  'spouse-optional',
];

const normalizeQueryCategory = (value) => {
  const category = String(value || '').trim().toLowerCase();
  return TABS.includes(category) ? category : 'all';
};

const Documents = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const household = useMemo(() => buildHouseholdProfile(user), [user]);

  const initialCategory = normalizeQueryCategory(searchParams.get('category'));

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccessLogModal, setShowAccessLogModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEffect(() => {
    const queryCategory = normalizeQueryCategory(searchParams.get('category'));
    if (queryCategory !== activeCategory) {
      setActiveCategory(queryCategory);
    }
  }, [searchParams, activeCategory]);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setDocuments(generateMockDocuments(user));
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  const visibleTabs = useMemo(() => {
    const tabs = [
      'all',
      'employment',
      'gig-income',
      'investments',
      'savings',
      'insurance',
      'education',
      'medical-donations',
    ];

    if (household.hasSpouse && household.spouse?.employment) {
      tabs.push('spouse-t4');
    }

    if (household.hasSpouse && household.spouse?.gigWork) {
      tabs.push('spouse-gig', 'spouse-gig-expenses');
    }

    if (household.hasSpouse && household.spouse?.business) {
      tabs.push('spouse-business');
    }

    if (household.hasSpouse) {
      const spouseHasOptional =
        household.spouse?.tfsa ||
        household.spouse?.rrsp ||
        household.spouse?.fhsa ||
        household.spouse?.ccb ||
        household.spouse?.investments ||
        household.spouse?.donations ||
        household.spouse?.unemployed;

      if (spouseHasOptional) {
        tabs.push('spouse-optional');
      }
    }

    return tabs;
  }, [household]);

  const counts = useMemo(() => {
    const result = TABS.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    result.all = documents.length;

    documents.forEach((doc) => {
      if (result[doc.category] !== undefined) {
        result[doc.category] += 1;
      }
    });

    return result;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    return documents
      .filter((doc) => {
        if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
        if (!value) return true;

        return (
          doc.name.toLowerCase().includes(value) ||
          doc.fileName.toLowerCase().includes(value) ||
          doc.issuer.toLowerCase().includes(value) ||
          doc.documentType.toLowerCase().includes(value) ||
          String(doc.taxYear).includes(value)
        );
      })
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [documents, activeCategory, searchTerm]);

  const summary = useMemo(() => {
    const usedCategories = new Set(documents.map((doc) => doc.category)).size;

    const latestUpload = documents.length
      ? [...documents].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0]
          .uploadDate
      : null;

    return {
      total: documents.length,
      categoriesUsed: usedCategories,
      lastUpload: latestUpload,
    };
  }, [documents]);

  const accessLogs = useMemo(() => {
    return documents
      .flatMap((doc) =>
        (doc.viewedBy || []).map((viewer, index) => ({
          id: `${doc.id}-${viewer}-${index}`,
          viewer,
          document: doc.name,
          timestamp: doc.lastViewed,
        }))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [documents]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const setCategory = (category) => {
    const normalized = normalizeQueryCategory(category);
    setActiveCategory(normalized);

    if (normalized === 'all') {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: normalized });
  };

  const EmptyState = () => (
    <Card>
      <Card.Body className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <FileText size={24} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No tax documents yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Upload formal slips, annual statements, and official tax records.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>

          <Link to="/receipts">
            <Button variant="outline">Open Receipts</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );

  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upload document</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a formal tax slip, annual statement, or official record.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Document category
              </label>
              <select
                defaultValue={activeCategory === 'all' ? 'employment' : activeCategory}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-500"
              >
                {visibleTabs
                  .filter((tab) => tab !== 'all')
                  .map((tab) => (
                    <option key={tab} value={tab}>
                      {CATEGORY_META[tab].label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">File</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <Upload size={20} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Upload PDF, JPG, JPEG, or PNG</p>
                <p className="mt-1 text-xs text-gray-500">
                  Best for official tax slips and annual records
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadModal(false)}>Upload Document</Button>
          </div>
        </div>
      </div>
    );
  };

  const AccessLogModal = () => {
    if (!showAccessLogModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Document access log</h3>
              <p className="mt-1 text-sm text-gray-500">
                Recent viewing activity for stored documents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAccessLogModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-5">
            {accessLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No access history yet.</p>
            ) : (
              accessLogs.map((log) => (
                <div key={log.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {log.viewer} viewed {log.document}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{log.timestamp}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowAccessLogModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const PermissionsModal = () => {
    if (!showPermissionsModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sharing permissions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Control how your CA can access document categories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPermissionsModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3 px-6 py-5">
            {visibleTabs
              .filter((tab) => tab !== 'all')
              .map((tab) => {
                const meta = CATEGORY_META[tab];
                const Icon = meta.icon;

                return (
                  <div
                    key={tab}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 p-2">
                        <Icon size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meta.label}</p>
                        <p className="text-xs text-gray-500">{counts[tab] || 0} docs</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        View Only
                      </button>
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Downloadable
                      </button>
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Restricted
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPermissionsModal(false)}>Save Permissions</Button>
          </div>
        </div>
      </div>
    );
  };

  const DocumentDetailModal = ({ document, onClose }) => {
    if (!document) return null;

    const category = CATEGORY_META[document.category] || CATEGORY_META.all;
    const Icon = category.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-start justify-between border-b px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Icon size={18} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{document.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{document.fileName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
            <InfoItem label="Document Type" value={document.documentType} />
            <InfoItem label="Issuer" value={document.issuer} />
            <InfoItem label="Tax Year" value={document.taxYear} />
            <InfoItem label="Upload Date" value={formatDate(document.uploadDate)} />
            <InfoItem label="File Size" value={document.size} />
            <InfoItem label="Category" value={category.label} />
          </div>

          {document.notes && (
            <div className="px-6 pb-2">
              <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
              <p className="mt-1 text-sm text-gray-600">{document.notes}</p>
            </div>
          )}

          <div className="px-6 pb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Access History</h4>
            <div className="space-y-2">
              {(document.viewedBy || []).map((viewer, index) => (
                <div key={`${viewer}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  {viewer} • {document.lastViewed}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              View Document
            </Button>
            <Button>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 lg:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Document
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tax Year
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Uploaded
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredDocuments.map((document) => {
            const category = CATEGORY_META[document.category] || CATEGORY_META.all;
            const Icon = category.icon;

            return (
              <tr key={document.id}>
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <Icon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{document.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {document.issuer} • {document.documentType}
                      </p>
                      {document.notes && (
                        <p className="mt-1 text-xs text-gray-400">{document.notes}</p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${category.pillClass}`}
                  >
                    {category.label}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm text-gray-700">{document.taxYear}</td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {formatDate(document.uploadDate)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                      View
                    </Button>
                    <Button size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="space-y-3 lg:hidden">
      {filteredDocuments.map((document) => {
        const category = CATEGORY_META[document.category] || CATEGORY_META.all;
        const Icon = category.icon;

        return (
          <Card key={document.id}>
            <Card.Body>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <Icon size={16} className="text-gray-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{document.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {document.issuer} • {document.documentType} • {document.taxYear}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${category.pillClass}`}
                    >
                      {category.label}
                    </span>

                    <span className="text-xs text-gray-400">
                      Uploaded {formatDate(document.uploadDate)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                      View
                    </Button>
                    <Button size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Documents & Statements</h1>
          <p className="mt-2 text-gray-600">
            Store official tax slips, annual statements, and supporting records for filing.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/receipts">
            <Button variant="outline">Open Receipts</Button>
          </Link>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActionsMenu((prev) => !prev)}
            >
              <Settings2 size={16} className="mr-2" />
              More
              <ChevronDown size={16} className="ml-2" />
            </Button>

            {showActionsMenu && (
              <div className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <button
                  onClick={() => {
                    setShowAccessLogModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <History size={15} className="mr-2" />
                  Access Log
                </button>

                <button
                  onClick={() => {
                    setShowPermissionsModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Lock size={15} className="mr-2" />
                  Permissions
                </button>
              </div>
            )}
          </div>

          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Documents</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">{summary.total}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Categories Used</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.categoriesUsed}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Last Upload</p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {summary.lastUpload ? formatDate(summary.lastUpload) : '—'}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Current Filter</p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {CATEGORY_META[activeCategory]?.label || 'All'}
            </p>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Body>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by document name, issuer, type, or tax year"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTabs.map((tab) => {
              const meta = CATEGORY_META[tab];
              const isActive = activeCategory === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCategory(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {meta.label} ({counts[tab] || 0})
                </button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <Card>
          <Card.Body className="py-12 text-center text-gray-500">
            Loading tax documents...
          </Card.Body>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {renderDesktopTable()}
          {renderMobileCards()}
        </>
      )}

      <UploadModal />
      <AccessLogModal />
      <PermissionsModal />
      <DocumentDetailModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value || '—'}</p>
  </div>
);

function generateMockDocuments(user) {
  const household = buildHouseholdProfile(user);
  const profile = household.user;
  const spouse = household.spouse;

  let id = 1;
  const nextId = () => id++;

  const docs = [
    {
      id: nextId(),
      category: 'employment',
      documentType: 'T4',
      name: 'T4 - ABC Logistics Inc.',
      fileName: 't4_abc_logistics_2025.pdf',
      issuer: 'ABC Logistics Inc.',
      taxYear: 2025,
      uploadDate: '2026-02-22',
      size: '240 KB',
      permissions: 'view-only',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-16',
      notes: 'Employment income slip for 2025.',
    },
    {
      id: nextId(),
      category: 'savings',
      documentType: 'RRSP Contribution Slip',
      name: 'RRSP Contribution Slip - RBC',
      fileName: 'rrsp_rbc_2025.pdf',
      issuer: 'RBC',
      taxYear: 2025,
      uploadDate: '2026-02-28',
      size: '182 KB',
      permissions: 'view-only',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-17',
      notes: 'First 60 days RRSP contribution record.',
    },
    {
      id: nextId(),
      category: 'investments',
      documentType: 'T5',
      name: 'T5 - TD Direct Investing',
      fileName: 't5_td_direct_2025.pdf',
      issuer: 'TD Direct Investing',
      taxYear: 2025,
      uploadDate: '2026-03-01',
      size: '196 KB',
      permissions: 'downloadable',
      viewedBy: ['You'],
      lastViewed: '2026-03-10',
      notes: 'Interest and investment income statement.',
    },
    {
      id: nextId(),
      category: 'medical-donations',
      documentType: 'Donation Receipt Summary',
      name: 'Annual Donation Summary - United Way',
      fileName: 'donation_united_way_2025.pdf',
      issuer: 'United Way',
      taxYear: 2025,
      uploadDate: '2026-02-10',
      size: '118 KB',
      permissions: 'view-only',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-14',
      notes: 'Official charitable donation receipt summary.',
    },
    {
      id: nextId(),
      category: 'insurance',
      documentType: 'Insurance Statement',
      name: 'Sun Life Annual Insurance Statement',
      fileName: 'sunlife_statement_2025.pdf',
      issuer: 'Sun Life',
      taxYear: 2025,
      uploadDate: '2026-01-30',
      size: '321 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-11',
      notes: 'Annual benefits and insurance record.',
    },
    {
      id: nextId(),
      category: 'education',
      documentType: 'RESP Statement',
      name: 'RESP Annual Statement - CIBC',
      fileName: 'resp_cibc_2025.pdf',
      issuer: 'CIBC',
      taxYear: 2025,
      uploadDate: '2026-02-14',
      size: '274 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-09',
      notes: 'Annual RESP contribution and balance statement.',
    },
    {
      id: nextId(),
      category: 'savings',
      documentType: 'FHSA Contribution Record',
      name: 'FHSA Record - Wealthsimple',
      fileName: 'fhsa_wealthsimple_2025.pdf',
      issuer: 'Wealthsimple',
      taxYear: 2025,
      uploadDate: '2026-02-26',
      size: '164 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-18',
      notes: 'FHSA annual contribution summary.',
    },
  ];

  if (profile.employment) {
    docs.push({
      id: nextId(),
      category: 't4',
      documentType: 'T4 Slip',
      name: 'My T4 - Employment Slip',
      fileName: 'my_t4_2025.pdf',
      issuer: user?.employerName || 'Primary Employer',
      taxYear: 2025,
      uploadDate: '2026-02-25',
      size: '150 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-15',
      notes: 'Primary employment slip.',
    });
  }

  if (profile.gigWork) {
    docs.push(
      {
        id: nextId(),
        category: 'gig-income',
        documentType: 'Annual Platform Summary',
        name: 'Uber Annual Summary 2025',
        fileName: 'uber_annual_summary_2025.pdf',
        issuer: 'Uber',
        taxYear: 2025,
        uploadDate: '2026-02-18',
        size: '387 KB',
        permissions: 'view-only',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2026-03-15',
        notes: 'Annual platform earnings summary for gig income reporting.',
      },
      {
        id: nextId(),
        category: 'gig-income',
        documentType: 'Tax Statement',
        name: 'DoorDash Tax Statement 2025',
        fileName: 'doordash_tax_statement_2025.pdf',
        issuer: 'DoorDash',
        taxYear: 2025,
        uploadDate: '2026-02-20',
        size: '225 KB',
        permissions: 'downloadable',
        viewedBy: ['You'],
        lastViewed: '2026-03-13',
        notes: 'Platform-issued annual tax summary.',
      }
    );
  }

  if (household.hasSpouse && spouse?.employment) {
    docs.push({
      id: nextId(),
      category: 'spouse-t4',
      documentType: 'T4 Slip',
      name: 'Spouse T4 - Employment Slip',
      fileName: 'spouse_t4_2025.pdf',
      issuer: spouse?.employerName || 'Spouse Employer',
      taxYear: 2025,
      uploadDate: '2026-02-27',
      size: '148 KB',
      permissions: 'view-only',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-18',
      notes: 'Spouse employment income slip.',
    });
  }

  if (household.hasSpouse && spouse?.gigWork) {
    docs.push(
      {
        id: nextId(),
        category: 'spouse-gig',
        documentType: 'T4A / Platform Income',
        name: 'Spouse Gig Income Summary',
        fileName: 'spouse_gig_income_2025.pdf',
        issuer: 'Gig Platform',
        taxYear: 2025,
        uploadDate: '2026-02-23',
        size: '232 KB',
        permissions: 'view-only',
        viewedBy: ['You'],
        lastViewed: '2026-03-17',
        notes: 'Spouse annual gig income record.',
      },
      {
        id: nextId(),
        category: 'spouse-gig-expenses',
        documentType: 'Expense Summary',
        name: 'Spouse Gig Expense Bundle',
        fileName: 'spouse_gig_expenses_2025.pdf',
        issuer: 'Uploaded by user',
        taxYear: 2025,
        uploadDate: '2026-03-02',
        size: '410 KB',
        permissions: 'view-only',
        viewedBy: ['You'],
        lastViewed: '2026-03-19',
        notes: 'Fuel, maintenance, phone, and insurance for spouse gig work.',
      }
    );
  }

  if (household.hasSpouse && spouse?.business) {
    docs.push({
      id: nextId(),
      category: 'spouse-business',
      documentType: 'Business Records',
      name: 'Spouse Business Record Package',
      fileName: 'spouse_business_records_2025.pdf',
      issuer: spouse?.businessInfo?.businessName || 'Spouse Business',
      taxYear: 2025,
      uploadDate: '2026-03-03',
      size: '520 KB',
      permissions: 'downloadable',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-20',
      notes: 'Spouse business income, expenses, and related records.',
    });
  }

  if (
    household.hasSpouse &&
    (spouse?.unemployed ||
      spouse?.rrsp ||
      spouse?.tfsa ||
      spouse?.fhsa ||
      spouse?.ccb ||
      spouse?.investments ||
      spouse?.donations)
  ) {
    docs.push({
      id: nextId(),
      category: 'spouse-optional',
      documentType: 'Optional Tax Records',
      name: 'Spouse RRSP / TFSA / FHSA Bundle',
      fileName: 'spouse_optional_records_2025.pdf',
      issuer: 'Multiple issuers',
      taxYear: 2025,
      uploadDate: '2026-03-05',
      size: '290 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-20',
      notes: 'Optional spouse tax account records and supporting slips.',
    });
  }

  return docs;
}

export default Documents;