import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ChevronDown,
  Download,
  Eye,
  FileText,
  GraduationCap,
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
  X,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';

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
];

const Documents = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccessLogModal, setShowAccessLogModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setDocuments(generateMockDocuments(user));
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

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
      ? [...documents].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0].uploadDate
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

  const EmptyState = () => (
    <Card>
      <Card.Body>
        <div className="py-12 text-center">
          <FileText size={42} className="mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No tax documents yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Upload formal slips, annual statements, and official tax records.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
              <Upload size={16} className="mr-2" />
              Upload Document
            </Button>
            <Link to="/receipts">
              <Button variant="outline">Open Receipts</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload document</h3>
                <p className="text-sm text-gray-500">
                  Add a formal tax slip, annual statement, or official record.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Document category
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {TABS.filter((tab) => tab !== 'all').map((tab) => (
                    <option key={tab} value={tab}>
                      {CATEGORY_META[tab].label}
                    </option>
                  ))}
                </select>
              </div>

              <Input label="Document name" placeholder="e.g. T4 - ABC Logistics Inc." />
              <Input label="Tax year" placeholder="e.g. 2025" />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">File</label>
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                  <Upload className="mx-auto mb-3 text-gray-400" size={24} />
                  <p className="text-sm font-medium text-gray-700">
                    Upload PDF, JPG, JPEG, or PNG
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Best for official tax slips and annual records
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="mt-4 block w-full text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AccessLogModal = () => {
    if (!showAccessLogModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setShowAccessLogModal(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document access log</h3>
                <p className="text-sm text-gray-500">Recent viewing activity for stored documents.</p>
              </div>
              <button
                onClick={() => setShowAccessLogModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-5">
              {accessLogs.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">No access history yet.</p>
              ) : (
                accessLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{log.viewer}</span> viewed{' '}
                      <span className="font-medium">{log.document}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t px-6 py-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowAccessLogModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PermissionsModal = () => {
    if (!showPermissionsModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setShowPermissionsModal(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sharing permissions</h3>
                <p className="text-sm text-gray-500">
                  Control how your CA can access document categories.
                </p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[460px] space-y-4 overflow-y-auto px-6 py-5">
              {TABS.filter((tab) => tab !== 'all').map((tab) => {
                const meta = CATEGORY_META[tab];
                const Icon = meta.icon;

                return (
                  <div key={tab} className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gray-100 p-2">
                          <Icon size={16} className="text-gray-700" />
                        </div>
                        <span className="font-medium text-gray-900">{meta.label}</span>
                      </div>
                      <Badge variant="info">{counts[tab] || 0} docs</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`perm-${tab}`} defaultChecked />
                        View Only
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`perm-${tab}`} />
                        Downloadable
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`perm-${tab}`} />
                        Restricted
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPermissionsModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Save Permissions
              </Button>
            </div>
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
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gray-100 p-3">
                  <Icon size={22} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{document.name}</h3>
                  <p className="text-sm text-gray-500">{document.fileName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Document Type</p>
                <p className="mt-1 font-medium text-gray-900">{document.documentType}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Issuer</p>
                <p className="mt-1 font-medium text-gray-900">{document.issuer}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Tax Year</p>
                <p className="mt-1 font-medium text-gray-900">{document.taxYear}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Upload Date</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(document.uploadDate)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">File Size</p>
                <p className="mt-1 font-medium text-gray-900">{document.size}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Category</p>
                <p className="mt-1 font-medium text-gray-900">{category.label}</p>
              </div>
            </div>

            {document.notes && (
              <div className="px-6 pb-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">Notes</p>
                  <p className="mt-1 text-sm text-gray-600">{document.notes}</p>
                </div>
              </div>
            )}

            <div className="px-6 pb-6 pt-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <History size={16} className="text-gray-500" />
                  <p className="font-medium text-gray-900">Access History</p>
                </div>
                <div className="space-y-2">
                  {(document.viewedBy || []).map((viewer, index) => (
                    <div
                      key={`${viewer}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700">{viewer}</span>
                      <span className="text-gray-500">{document.lastViewed}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row">
              <Button variant="primary" className="flex-1">
                <Eye size={16} className="mr-2" />
                View Document
              </Button>
              <Button variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopTable = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Document
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tax Year
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Uploaded
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredDocuments.map((document) => {
              const category = CATEGORY_META[document.category] || CATEGORY_META.all;
              const Icon = category.icon;

              return (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-gray-100 p-3">
                        <Icon size={18} className="text-gray-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{document.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {document.issuer} • {document.documentType}
                        </p>
                        {document.notes && (
                          <p className="mt-2 line-clamp-1 text-sm text-gray-500">
                            {document.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${category.pillClass}`}
                    >
                      {category.label}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-sm text-gray-600">{document.taxYear}</td>

                  <td className="px-4 py-5 text-sm text-gray-600">
                    <div>{formatDate(document.uploadDate)}</div>
                    <div className="mt-1 text-xs text-gray-400">{document.size}</div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedDocument(document)}>
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
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
    </Card>
  );

  const renderMobileCards = () => (
    <div className="space-y-4 lg:hidden">
      {filteredDocuments.map((document) => {
        const category = CATEGORY_META[document.category] || CATEGORY_META.all;
        const Icon = category.icon;

        return (
          <Card key={document.id}>
            <Card.Body>
              <div className="flex gap-4">
                <div className="rounded-xl bg-gray-100 p-3">
                  <Icon size={18} className="text-gray-700" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{document.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {document.issuer} • {document.documentType} • {document.taxYear}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${category.pillClass}`}
                    >
                      {category.label}
                    </span>
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Uploaded {formatDate(document.uploadDate)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedDocument(document)}>
                      <Eye size={16} className="mr-2" />
                      View
                    </Button>
                    <Button variant="outline">
                      <Download size={16} className="mr-2" />
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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">Tax Documents &amp; Statements</h1>
          <p className="mt-2 text-gray-600">
            Store official tax slips, annual statements, and supporting records for filing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <button
                  onClick={() => {
                    setShowAccessLogModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <History size={16} className="mr-2" />
                  Access Log
                </button>
                <button
                  onClick={() => {
                    setShowPermissionsModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Lock size={16} className="mr-2" />
                  Permissions
                </button>
              </div>
            )}
          </div>

          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Documents</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{summary.total}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Categories Used</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{summary.categoriesUsed}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Last Upload</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {summary.lastUpload ? formatDate(summary.lastUpload) : '—'}
            </p>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Body>
          <div className="flex flex-col gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by document name, type, issuer, or tax year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const meta = CATEGORY_META[tab];
                const isActive = activeCategory === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab)}
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
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="mt-4 text-sm text-gray-500">Loading tax documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden lg:block">{renderDesktopTable()}</div>
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

function generateMockDocuments(user) {
  const isGig =
    user?.userType === 'gig-worker' ||
    user?.userType === 'contractor' ||
    user?.hasMultipleIncomes;

  const isEmployee =
    user?.userType === 'employee' ||
    user?.hasEmployment ||
    user?.hasMultipleIncomes;

  const docs = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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

  if (isGig) {
    docs.push(
      {
        id: 8,
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
        id: 9,
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

  if (isEmployee) {
    docs.push({
      id: 10,
      category: 'employment',
      documentType: 'T4A',
      name: 'T4A - Contract Bonus Payment',
      fileName: 't4a_bonus_2025.pdf',
      issuer: 'Northside Projects Ltd.',
      taxYear: 2025,
      uploadDate: '2026-02-24',
      size: '154 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-12',
      notes: 'Additional income slip reported separately from T4.',
    });
  }

  return docs;
}

export default Documents;