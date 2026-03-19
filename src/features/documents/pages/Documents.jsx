import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  User,
  Briefcase,
  Building,
  Store,
  Car,
  GraduationCap,
  FileSignature,
  Scroll,
  Award,
  IdCard,
  Lock,
  History,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  X
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';

const Documents = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccessLogModal, setShowAccessLogModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Mock data - replace with API call
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock documents based on user type
      const mockDocuments = generateMockDocuments(user?.userType || 'employee');
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define folder structures based on user type
  const getFolderStructure = () => {
    const baseFolders = [
      { 
        id: 'identity', 
        label: 'Identity Documents', 
        icon: IdCard, 
        color: 'blue',
        description: 'Government-issued ID, passport, driver\'s license',
        required: true,
        priority: 1
      },
      { 
        id: 'sin', 
        label: 'SIN Confirmation', 
        icon: FileText, 
        color: 'green',
        description: 'Social Insurance Number card or confirmation letter',
        required: true,
        priority: 2
      },
    ];

    const userTypeFolders = {
      'gig-worker': [
        { 
          id: 'gst-hst', 
          label: 'GST/HST Registration', 
          icon: FileSignature, 
          color: 'purple',
          description: 'GST/HST registration certificate (required for rideshare)',
          required: true,
          priority: 3,
          expiryAlert: true
        },
        { 
          id: 'vehicle-registration', 
          label: 'Vehicle Registration', 
          icon: Car, 
          color: 'orange',
          description: 'Vehicle ownership and registration documents',
          required: true,
          priority: 4,
          expiryAlert: true
        },
        { 
          id: 'insurance', 
          label: 'Commercial Insurance', 
          icon: Shield, 
          color: 'red',
          description: 'Commercial auto insurance policy',
          required: true,
          priority: 5,
          expiryAlert: true
        },
        { 
          id: 'background-check', 
          label: 'Background Check', 
          icon: User, 
          color: 'indigo',
          description: 'Police background check for gig platforms',
          required: false,
          priority: 6,
          expiryAlert: true
        },
      ],
      'shop-owner': [
        { 
          id: 'business-registration', 
          label: 'Business Registration', 
          icon: Building, 
          color: 'green',
          description: 'Master business license or articles of incorporation',
          required: true,
          priority: 3,
          expiryAlert: true
        },
        { 
          id: 'bn-confirmation', 
          label: 'Business Number (BN)', 
          icon: FileText, 
          color: 'blue',
          description: 'CRA-issued Business Number confirmation',
          required: true,
          priority: 4
        },
        { 
          id: 'gst-hst', 
          label: 'GST/HST Certificate', 
          icon: FileSignature, 
          color: 'purple',
          description: 'GST/HST registration certificate',
          required: true,
          priority: 5
        },
        { 
          id: 'lease', 
          label: 'Lease Agreement', 
          icon: Scroll, 
          color: 'amber',
          description: 'Commercial lease agreement for your business location',
          required: true,
          priority: 6,
          expiryAlert: true
        },
        { 
          id: 'permits', 
          label: 'Permits & Licenses', 
          icon: Award, 
          color: 'orange',
          description: 'Municipal business licenses, health permits, liquor licenses',
          required: true,
          priority: 7,
          expiryAlert: true
        },
        { 
          id: 'payroll-program', 
          label: 'Payroll Program', 
          icon: Briefcase, 
          color: 'indigo',
          description: 'CRA payroll deductions account information',
          required: false,
          priority: 8
        },
        { 
          id: 'insurance', 
          label: 'Business Insurance', 
          icon: Shield, 
          color: 'red',
          description: 'General liability and property insurance',
          required: false,
          priority: 9,
          expiryAlert: true
        },
      ],
      'franchise': [
        { 
          id: 'business-registration', 
          label: 'Business Registration', 
          icon: Building, 
          color: 'green',
          description: 'Articles of incorporation or business registration',
          required: true,
          priority: 3
        },
        { 
          id: 'franchise-agreement', 
          label: 'Franchise Agreement', 
          icon: FileSignature, 
          color: 'purple',
          description: 'Executed franchise contract (essential for tax treatment)',
          required: true,
          priority: 4,
          expiryAlert: true
        },
        { 
          id: 'franchise-disclosure', 
          label: 'Franchise Disclosure', 
          icon: FileText, 
          color: 'blue',
          description: 'Franchise Disclosure Document (FDD)',
          required: true,
          priority: 5
        },
        { 
          id: 'gst-hst', 
          label: 'GST/HST Certificate', 
          icon: FileSignature, 
          color: 'green',
          description: 'GST/HST registration certificate',
          required: true,
          priority: 6
        },
        { 
          id: 'lease', 
          label: 'Lease Agreement', 
          icon: Scroll, 
          color: 'amber',
          description: 'Commercial lease agreement',
          required: true,
          priority: 7,
          expiryAlert: true
        },
        { 
          id: 'permits', 
          label: 'Permits & Licenses', 
          icon: Award, 
          color: 'orange',
          description: 'Municipal and industry-specific licenses',
          required: true,
          priority: 8,
          expiryAlert: true
        },
      ],
      'contractor': [
        { 
          id: 'professional-certifications', 
          label: 'Professional Certifications', 
          icon: Award, 
          color: 'purple',
          description: 'Professional designations, trade certificates',
          required: false,
          priority: 3,
          expiryAlert: true
        },
        { 
          id: 'business-registration', 
          label: 'Business Registration', 
          icon: Building, 
          color: 'green',
          description: 'Business name registration (if applicable)',
          required: false,
          priority: 4
        },
        { 
          id: 'gst-hst', 
          label: 'GST/HST Registration', 
          icon: FileSignature, 
          color: 'blue',
          description: 'GST/HST registration if over $30k',
          required: false,
          priority: 5
        },
        { 
          id: 'insurance', 
          label: 'Professional Insurance', 
          icon: Shield, 
          color: 'red',
          description: 'Professional liability insurance',
          required: false,
          priority: 6,
          expiryAlert: true
        },
      ],
      'employee': [
        { 
          id: 'previous-noa', 
          label: 'Previous Year NOA', 
          icon: FileText, 
          color: 'green',
          description: 'Most recent Notice of Assessment from CRA',
          required: false,
          priority: 3
        },
        { 
          id: 'tuition-slips', 
          label: 'Tuition Slips', 
          icon: GraduationCap, 
          color: 'purple',
          description: 'T2202 tuition and education certificates',
          required: false,
          priority: 4
        },
        { 
          id: 'medical-records', 
          label: 'Medical Records', 
          icon: FileText, 
          color: 'blue',
          description: 'Medical expense receipts for tax credits',
          required: false,
          priority: 5
        },
      ],
    };

    // Combine base folders with user-type specific folders
    const userFolders = userTypeFolders[user?.userType] || userTypeFolders['employee'];
    
    // Sort by priority
    return [...baseFolders, ...userFolders].sort((a, b) => a.priority - b.priority);
  };

  const folders = getFolderStructure();

  // Generate mock documents
  const generateMockDocuments = (userType) => {
    const docs = [];
    let id = 1;

    // Identity documents (for all users)
    docs.push({
      id: id++,
      folderId: 'identity',
      name: 'Driver\'s License - Front',
      fileName: 'drivers_license_front.pdf',
      uploadDate: '2024-01-15',
      expiryDate: '2027-03-21',
      status: 'verified',
      size: '245 KB',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2024-03-10',
      permissions: 'view-only',
      notes: 'Ontario driver\'s license'
    });

    docs.push({
      id: id++,
      folderId: 'identity',
      name: 'Driver\'s License - Back',
      fileName: 'drivers_license_back.pdf',
      uploadDate: '2024-01-15',
      expiryDate: '2027-03-21',
      status: 'verified',
      size: '189 KB',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2024-03-10',
      permissions: 'view-only'
    });

    docs.push({
      id: id++,
      folderId: 'sin',
      name: 'SIN Confirmation Letter',
      fileName: 'sin_letter.pdf',
      uploadDate: '2024-01-15',
      status: 'verified',
      size: '312 KB',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2024-02-28',
      permissions: 'view-only',
      notes: 'Confirmation of SIN from Service Canada'
    });

    // User-type specific documents
    if (userType === 'gig-worker') {
      docs.push({
        id: id++,
        folderId: 'gst-hst',
        name: 'GST/HST Registration Certificate',
        fileName: 'gst_certificate.pdf',
        uploadDate: '2024-01-20',
        status: 'verified',
        size: '156 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-05',
        permissions: 'view-only',
        gstNumber: '123456789RT0001',
        notes: 'Registered for GST/HST effective Jan 1, 2024'
      });

      docs.push({
        id: id++,
        folderId: 'vehicle-registration',
        name: 'Vehicle Registration',
        fileName: 'vehicle_registration.pdf',
        uploadDate: '2024-01-18',
        expiryDate: '2024-12-31',
        status: 'verified',
        size: '234 KB',
        viewedBy: ['You'],
        lastViewed: '2024-01-18',
        permissions: 'downloadable',
        vehicleInfo: '2022 Toyota Corolla - Plate: ABC 123'
      });

      docs.push({
        id: id++,
        folderId: 'insurance',
        name: 'Commercial Auto Insurance',
        fileName: 'insurance_certificate.pdf',
        uploadDate: '2024-01-16',
        expiryDate: '2024-12-31',
        status: 'verified',
        size: '345 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-01',
        permissions: 'view-only',
        policyNumber: 'INS-987654',
        notes: 'Includes coverage for ridesharing activities'
      });

      docs.push({
        id: id++,
        folderId: 'background-check',
        name: 'Police Background Check',
        fileName: 'background_check.pdf',
        uploadDate: '2024-01-10',
        expiryDate: '2024-07-10',
        status: 'action-required',
        size: '178 KB',
        viewedBy: ['You'],
        lastViewed: '2024-01-10',
        permissions: 'view-only',
        alert: 'Expires in 3 months',
        notes: 'Vulnerable sector check for Uber'
      });

    } else if (userType === 'shop-owner') {
      docs.push({
        id: id++,
        folderId: 'business-registration',
        name: 'Articles of Incorporation',
        fileName: 'articles_incorporation.pdf',
        uploadDate: '2024-01-05',
        status: 'verified',
        size: '456 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-02-15',
        permissions: 'view-only',
        corporationNumber: '1234567-8'
      });

      docs.push({
        id: id++,
        folderId: 'bn-confirmation',
        name: 'Business Number Confirmation',
        fileName: 'bn_confirmation.pdf',
        uploadDate: '2024-01-05',
        status: 'verified',
        size: '234 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-02-15',
        permissions: 'view-only',
        businessNumber: '123456789'
      });

      docs.push({
        id: id++,
        folderId: 'lease',
        name: 'Commercial Lease Agreement',
        fileName: 'lease_agreement.pdf',
        uploadDate: '2024-01-08',
        expiryDate: '2025-12-31',
        status: 'verified',
        size: '1.2 MB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-12',
        permissions: 'view-only',
        notes: '123 Main St, Unit 4 - Monthly rent: $3,500'
      });

      docs.push({
        id: id++,
        folderId: 'permits',
        name: 'Business License',
        fileName: 'business_license.pdf',
        uploadDate: '2024-01-10',
        expiryDate: '2024-12-31',
        status: 'verified',
        size: '189 KB',
        viewedBy: ['You'],
        lastViewed: '2024-01-10',
        permissions: 'downloadable',
        licenseNumber: 'BL-2024-12345'
      });

      docs.push({
        id: id++,
        folderId: 'permits',
        name: 'Health Department Permit',
        fileName: 'health_permit.pdf',
        uploadDate: '2024-01-12',
        expiryDate: '2024-06-30',
        status: 'action-required',
        size: '156 KB',
        viewedBy: ['You'],
        lastViewed: '2024-01-12',
        permissions: 'view-only',
        alert: 'Expires in 3 months'
      });

    } else if (userType === 'franchise') {
      docs.push({
        id: id++,
        folderId: 'franchise-agreement',
        name: 'Franchise Agreement',
        fileName: 'franchise_agreement.pdf',
        uploadDate: '2024-01-03',
        expiryDate: '2030-01-02',
        status: 'verified',
        size: '3.4 MB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-01',
        permissions: 'view-only',
        franchiseName: '7-Eleven',
        storeNumber: '#12345'
      });

      docs.push({
        id: id++,
        folderId: 'franchise-disclosure',
        name: 'Franchise Disclosure Document',
        fileName: 'fdd_2024.pdf',
        uploadDate: '2024-01-03',
        status: 'verified',
        size: '2.8 MB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-01',
        permissions: 'view-only'
      });

    } else if (userType === 'contractor') {
      docs.push({
        id: id++,
        folderId: 'professional-certifications',
        name: 'CPA Designation Certificate',
        fileName: 'cpa_certificate.pdf',
        uploadDate: '2024-01-07',
        status: 'verified',
        size: '345 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-02-20',
        permissions: 'view-only',
        designationNumber: 'CPA-12345'
      });

      docs.push({
        id: id++,
        folderId: 'insurance',
        name: 'Professional Liability Insurance',
        fileName: 'professional_insurance.pdf',
        uploadDate: '2024-01-09',
        expiryDate: '2024-12-31',
        status: 'verified',
        size: '267 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-02-20',
        permissions: 'view-only',
        policyNumber: 'PLI-54321'
      });

    } else if (userType === 'employee') {
      docs.push({
        id: id++,
        folderId: 'previous-noa',
        name: '2023 Notice of Assessment',
        fileName: 'noa_2023.pdf',
        uploadDate: '2024-02-15',
        status: 'verified',
        size: '423 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-15',
        permissions: 'view-only'
      });

      docs.push({
        id: id++,
        folderId: 'tuition-slips',
        name: 'T2202 - University of Toronto',
        fileName: 't2202_2023.pdf',
        uploadDate: '2024-02-28',
        status: 'verified',
        size: '189 KB',
        viewedBy: ['You', 'David Chen (CA)'],
        lastViewed: '2024-03-15',
        permissions: 'view-only',
        amount: '$5,450'
      });
    }

    return docs;
  };

  // Group documents by folder
  const documentsByFolder = folders.reduce((acc, folder) => {
    acc[folder.id] = documents.filter(doc => doc.folderId === folder.id);
    return acc;
  }, {});

  // Calculate folder statistics
  const folderStats = folders.map(folder => {
    const folderDocs = documentsByFolder[folder.id] || [];
    const verified = folderDocs.filter(d => d.status === 'verified').length;
    const pending = folderDocs.filter(d => d.status === 'pending').length;
    const actionRequired = folderDocs.filter(d => d.status === 'action-required').length;
    const expiring = folderDocs.filter(d => {
      if (!d.expiryDate) return false;
      const daysUntilExpiry = Math.floor((new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry < 60;
    }).length;

    return {
      ...folder,
      total: folderDocs.length,
      verified,
      pending,
      actionRequired,
      expiring
    };
  });

  const filteredFolders = searchTerm
    ? folderStats.filter(f => 
        f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : folderStats;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'action-required':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'action-required':
        return <Badge variant="error">Action Required</Badge>;
      default:
        return null;
    }
  };

  const getFolderIcon = (color) => {
    const icons = {
      blue: <Folder className="text-blue-500" size={24} />,
      green: <Folder className="text-green-500" size={24} />,
      purple: <Folder className="text-purple-500" size={24} />,
      orange: <Folder className="text-orange-500" size={24} />,
      red: <Folder className="text-red-500" size={24} />,
      indigo: <Folder className="text-indigo-500" size={24} />,
      amber: <Folder className="text-amber-500" size={24} />,
    };
    return icons[color] || <Folder className="text-gray-500" size={24} />;
  };

  const FolderCard = ({ folder }) => {
    const Icon = folder.icon;
    const completionPercentage = folder.total > 0 
      ? Math.round((folder.verified / folder.total) * 100) 
      : 0;

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Card.Body>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-${folder.color}-100 rounded-lg`}>
              <Icon size={24} className={`text-${folder.color}-600`} />
            </div>
            {folder.required && (
              <Badge variant="info" size="sm">Required</Badge>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{folder.label}</h3>
          <p className="text-sm text-gray-500 mb-3">{folder.description}</p>

          {/* Document Stats */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Documents</span>
              <span className="font-medium">{folder.verified}/{folder.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${folder.color}-600 h-2 rounded-full`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 mt-2">
            {folder.actionRequired > 0 && (
              <Badge variant="error" size="sm">
                {folder.actionRequired} Action Required
              </Badge>
            )}
            {folder.expiring > 0 && (
              <Badge variant="warning" size="sm">
                {folder.expiring} Expiring Soon
              </Badge>
            )}
            {folder.pending > 0 && (
              <Badge variant="warning" size="sm">
                {folder.pending} Pending
              </Badge>
            )}
          </div>

          {/* Document List Preview */}
          {documentsByFolder[folder.id]?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Recent uploads:</p>
              {documentsByFolder[folder.id].slice(0, 2).map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center">
                    {getStatusIcon(doc.status)}
                    <span className="ml-2 text-gray-700 truncate max-w-[120px]">
                      {doc.name}
                    </span>
                  </div>
                  {doc.expiryDate && (
                    <span className="text-gray-400 text-[10px]">
                      Exp: {new Date(doc.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const DocumentDetailModal = ({ document, onClose }) => {
    if (!document) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 bg-${folders.find(f => f.id === document.folderId)?.color}-100 rounded-lg mr-4`}>
                    <FileText size={24} className={`text-${folders.find(f => f.id === document.folderId)?.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-500">{document.fileName}</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Upload Date</p>
                  <p className="font-medium">{new Date(document.uploadDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="font-medium">{document.size}</p>
                </div>
                {document.expiryDate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className={`font-medium ${new Date(document.expiryDate) < new Date() ? 'text-red-600' : ''}`}>
                      {new Date(document.expiryDate).toLocaleDateString()}
                      {new Date(document.expiryDate) < new Date() && ' (Expired)'}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(document.status)}</div>
                </div>
              </div>

              {document.gstNumber && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">GST/HST Number</p>
                  <p className="text-lg font-mono">{document.gstNumber}</p>
                </div>
              )}

              {document.businessNumber && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Business Number</p>
                  <p className="text-lg font-mono">{document.businessNumber}</p>
                </div>
              )}

              {document.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-gray-600">{document.notes}</p>
                </div>
              )}

              {/* Access Log */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <History size={16} className="mr-2" />
                  Access History
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  {document.viewedBy?.map((viewer, index) => (
                    <div key={index} className="flex items-center justify-between text-sm py-1">
                      <span>{viewer}</span>
                      <span className="text-gray-500">{document.lastViewed}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Lock size={16} className="mr-2" />
                  Sharing Permissions
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current setting:</span>
                    <Badge variant={document.permissions === 'view-only' ? 'info' : 'success'}>
                      {document.permissions === 'view-only' ? 'View Only' : 'Downloadable'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button variant="primary" className="flex-1">
                  <Eye size={16} className="mr-2" />
                  View Document
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowUploadModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                <Input
                  label="Document Name (Optional)"
                  placeholder="e.g., Driver's License Front"
                />

                <Input
                  label="Expiry Date (if applicable)"
                  type="date"
                />

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Uploaded documents are encrypted and stored securely on Canadian servers.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Upload Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AccessLogModal = () => {
    if (!showAccessLogModal) return null;

    const allAccessLogs = documents.flatMap(doc => 
      doc.viewedBy?.map(viewer => ({
        document: doc.name,
        viewer,
        timestamp: doc.lastViewed,
        action: 'viewed'
      })) || []
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAccessLogModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Document Access Log</h3>
                <button onClick={() => setShowAccessLogModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {allAccessLogs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No access logs available</p>
                ) : (
                  <div className="space-y-3">
                    {allAccessLogs.map((log, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <History size={16} className="text-gray-400 mr-3 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{log.viewer}</span> {log.action} "{log.document}"
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button variant="primary" className="w-full" onClick={() => setShowAccessLogModal(false)}>
                  Close
                </Button>
              </div>
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
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPermissionsModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sharing Permissions</h3>
                <button onClick={() => setShowPermissionsModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Control how your CA can access your documents. These settings apply folder-by-folder.
              </p>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {folders.map(folder => {
                  const Icon = folder.icon;
                  return (
                    <div key={folder.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-2 bg-${folder.color}-100 rounded-lg mr-3`}>
                            <Icon size={16} className={`text-${folder.color}-600`} />
                          </div>
                          <span className="font-medium">{folder.label}</span>
                        </div>
                        <Badge variant="info">{folder.total} docs</Badge>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`permission-${folder.id}`}
                            className="mr-2"
                            defaultChecked
                          />
                          <span className="text-sm">View Only - CA can view but not download</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`permission-${folder.id}`}
                            className="mr-2"
                          />
                          <span className="text-sm">Downloadable - CA can view and download</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`permission-${folder.id}`}
                            className="mr-2"
                          />
                          <span className="text-sm">Restricted - CA cannot access this folder</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPermissionsModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Save Permissions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VerificationChecklist = () => {
    const incompleteRequired = folderStats.filter(f => f.required && f.verified === 0);
    
    if (incompleteRequired.length === 0) return null;

    return (
      <Card className="bg-amber-50 border-amber-200 mb-6">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-amber-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Verification Checklist</h3>
              <p className="text-sm text-amber-700 mt-1">
                Complete your profile by uploading these required documents:
              </p>
              <ul className="mt-2 space-y-1">
                {incompleteRequired.map(folder => (
                  <li key={folder.id} className="flex items-center text-sm text-amber-700">
                    <span className="mr-2">•</span>
                    {folder.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">
            Store and manage your identification and business verification documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowAccessLogModal(true)}>
            <History size={16} className="mr-2" />
            Access Log
          </Button>
          <Button variant="outline" onClick={() => setShowPermissionsModal(true)}>
            <Lock size={16} className="mr-2" />
            Permissions
          </Button>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Verification Checklist */}
      <VerificationChecklist />

      {/* Search Bar */}
      <Card>
        <Card.Body>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search folders or document descriptions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Document Folders Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading documents...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      )}

      {/* Modals */}
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

export default Documents;





