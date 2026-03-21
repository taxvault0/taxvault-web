import React, { useMemo, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  QrCode,
  Download,
  Eye,
  Camera,
  Settings,
  LogOut,
  Briefcase,
  Car,
  Building2,
  FileText,
  Shield,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import { useAuth } from '../../auth/context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

const INCOME_SOURCE_OPTIONS = [
  { id: 'employment', label: 'Employment (T4)', icon: Briefcase, classes: 'bg-blue-50 text-blue-700' },
  { id: 'self_employed', label: 'Self-Employed / Business', icon: Building2, classes: 'bg-purple-50 text-purple-700' },
  { id: 'gig_work', label: 'Gig Work', icon: Car, classes: 'bg-green-50 text-green-700' },
  { id: 'incorporated', label: 'Corporation', icon: FileText, classes: 'bg-indigo-50 text-indigo-700' },
];

const getAccountRoleLabel = (user) => {
  if (user?.role === 'ca') return 'CA Professional';
  if (user?.role === 'business_owner') return 'Business Owner';
  return 'Tax Client';
};

const getInitialIncomeSources = (user) => {
  if (Array.isArray(user?.incomeSources) && user.incomeSources.length > 0) {
    return user.incomeSources;
  }

  const taxProfile = user?.taxProfile || {};
  const sources = [];

  if (taxProfile.employment) sources.push('employment');
  if (taxProfile.selfEmployment || taxProfile.incorporatedBusiness) sources.push('self_employed');
  if (taxProfile.gigWork) sources.push('gig_work');
  if (taxProfile.incorporatedBusiness) sources.push('incorporated');

  return sources;
};

const Profile = () => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || user?.phoneNumber || '+1 (416) 555-0123',
    address:
      user?.address ||
      [user?.city, user?.province, user?.postalCode].filter(Boolean).join(', ') ||
      '123 Main St, Toronto, ON M5V 2H1',
    clientId: user?.clientId || 'TV-2024-1A2B3C',
    memberSince: user?.memberSince || '2024',
    incomeSources: getInitialIncomeSources(user),
    businessInfo: {
      businessName: user?.businessInfo?.businessName || '',
      businessType: user?.businessInfo?.businessType || 'Sole Proprietor',
      industry: user?.businessInfo?.industry || '',
      gstRegistered: Boolean(user?.businessInfo?.gstRegistered),
      hasEmployees: Boolean(user?.businessInfo?.hasEmployees),
      hasInventory: Boolean(user?.businessInfo?.hasInventory),
    },
    stats: {
      documents: 24,
      receipts: 156,
      mileageTrips: 89,
    },
    assignedCA: user?.assignedCA || 'Not Assigned',
  });

  const hasEmploymentIncome = useMemo(
    () => profile.incomeSources.includes('employment'),
    [profile.incomeSources]
  );

  const hasBusinessIncome = useMemo(
    () =>
      profile.incomeSources.includes('self_employed') ||
      profile.incomeSources.includes('gig_work') ||
      profile.incomeSources.includes('incorporated'),
    [profile.incomeSources]
  );

  const activeProfiles = useMemo(() => {
    return INCOME_SOURCE_OPTIONS.filter((item) => profile.incomeSources.includes(item.id));
  }, [profile.incomeSources]);

  const copyClientId = () => {
    navigator.clipboard.writeText(profile.clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `client-${profile.clientId}.png`;
      link.href = url;
      link.click();
    }
  };

  const toggleIncomeSource = (sourceId) => {
    setProfile((prev) => {
      const exists = prev.incomeSources.includes(sourceId);
      return {
        ...prev,
        incomeSources: exists
          ? prev.incomeSources.filter((item) => item !== sourceId)
          : [...prev.incomeSources, sourceId],
      };
    });
  };

  const updateBusinessField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal details, income sources, and tax setup up to date.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings size={16} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-warning-600 hover:text-warning-700"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <Card.Body>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm opacity-90">Your Unique Client ID</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
                    title="Show QR Code"
                  >
                    <QrCode size={18} />
                  </button>
                  <button
                    onClick={copyClientId}
                    className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
                    title="Copy Client ID"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-white/10 p-4 inline-flex">
                <span className="text-3xl font-bold tracking-wider">
                  {profile.clientId}
                </span>
              </div>

              <p className="mt-3 text-xs opacity-75">
                Share this ID with your CA to securely connect your account.
              </p>
            </div>
          </div>

          {showQR && (
            <div className="mt-6 border-t border-white/20 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">QR Code - Scan to Connect</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQR}
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  <Download size={16} className="mr-2" />
                  Download QR
                </Button>
              </div>

              <div className="flex items-center justify-center rounded-xl bg-white p-6">
                <QRCodeCanvas
                  value={profile.clientId}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin
                />
              </div>

              <p className="mt-3 text-center text-xs opacity-75">
                Your CA can scan this QR code to instantly add you as a client
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.stats.documents}</p>
          <p className="text-sm text-gray-500">Documents</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.stats.receipts}</p>
          <p className="text-sm text-gray-500">Receipts</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.stats.mileageTrips}</p>
          <p className="text-sm text-gray-500">Mileage Trips</p>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </Card.Header>
        <Card.Body className="space-y-4">
          <InfoRow icon={User} label="Full Name" value={profile.name} />
          <InfoRow icon={Mail} label="Email Address" value={profile.email} />
          <InfoRow icon={Phone} label="Phone Number" value={profile.phone} />
          <InfoRow icon={MapPin} label="Address" value={profile.address} />

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-gray-500">Account Role</p>
              <p className="font-medium text-primary-600">{getAccountRoleLabel(user)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{profile.memberSince}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Income Sources</h2>
          <p className="mt-1 text-sm text-gray-500">
            A business owner can also have a T4 job. Select all that apply.
          </p>
        </Card.Header>

        <Card.Body>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {INCOME_SOURCE_OPTIONS.map((source) => {
              const Icon = source.icon;
              const checked = profile.incomeSources.includes(source.id);

              return (
                <label
                  key={source.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    checked ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${source.classes}`}>
                      <Icon size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{source.label}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIncomeSource(source.id)}
                    disabled={!isEditing}
                    className="h-4 w-4"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            Employment documents like T4 slips and business records like receipts, mileage,
            and expenses should always stay in separate sections.
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Active Tax Profiles</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-2">
            {activeProfiles.length > 0 ? (
              activeProfiles.map((profileItem) => {
                const Icon = profileItem.icon;
                return (
                  <div
                    key={profileItem.id}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${profileItem.classes}`}
                  >
                    <Icon size={14} />
                    {profileItem.label}
                  </div>
                );
              })
            ) : (
              <p className="font-medium text-gray-700">No income source selected yet</p>
            )}
          </div>
        </Card.Body>
      </Card>

      {hasBusinessIncome && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Business Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Only shown when business-related income applies.
            </p>
          </Card.Header>

          <Card.Body className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileField
              label="Business Name"
              value={profile.businessInfo.businessName}
              editable={isEditing}
              onChange={(value) => updateBusinessField('businessName', value)}
            />

            <SelectField
              label="Business Type"
              value={profile.businessInfo.businessType}
              editable={isEditing}
              options={['Sole Proprietor', 'Corporation', 'Partnership', 'Freelancer']}
              onChange={(value) => updateBusinessField('businessType', value)}
            />

            <ProfileField
              label="Industry"
              value={profile.businessInfo.industry}
              editable={isEditing}
              onChange={(value) => updateBusinessField('industry', value)}
            />

            <SelectField
              label="GST Registered"
              value={profile.businessInfo.gstRegistered ? 'Yes' : 'No'}
              editable={isEditing}
              options={['Yes', 'No']}
              onChange={(value) => updateBusinessField('gstRegistered', value === 'Yes')}
            />

            <SelectField
              label="Has Employees"
              value={profile.businessInfo.hasEmployees ? 'Yes' : 'No'}
              editable={isEditing}
              options={['Yes', 'No']}
              onChange={(value) => updateBusinessField('hasEmployees', value === 'Yes')}
            />

            <SelectField
              label="Has Inventory"
              value={profile.businessInfo.hasInventory ? 'Yes' : 'No'}
              editable={isEditing}
              options={['Yes', 'No']}
              onChange={(value) => updateBusinessField('hasInventory', value === 'Yes')}
            />
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Tax Setup</h2>
        </Card.Header>
        <Card.Body className="space-y-3">
          {hasEmploymentIncome && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Employment (T4) enabled</p>
              <p className="mt-1 text-sm text-gray-600">
                Show T4 and other employment documents in a separate employment section.
              </p>
            </div>
          )}

          {hasBusinessIncome && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Business tracking enabled</p>
              <p className="mt-1 text-sm text-gray-600">
                Show business income, expenses, receipts, mileage, and GST tools only when relevant.
              </p>
            </div>
          )}

          {!hasEmploymentIncome && !hasBusinessIncome && (
            <div className="rounded-xl bg-red-50 p-4 text-red-800">
              Select at least one income source to personalize your dashboard and tax workflow.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Assigned Tax Professional</h2>
        </Card.Header>
        <Card.Body>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Assigned CA</p>
            <p className="mt-1 font-medium text-gray-900">{profile.assignedCA}</p>
            <div className="mt-4">
              <Button variant="outline">Open Messages</Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Camera size={16} />
          Upload Photo
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Eye size={16} />
          View Activity Log
        </Button>
      </div>

      <div className="pt-4 text-center text-xs text-gray-400">
        <p>🔒 Your information is encrypted and secure. Client ID is unique to your account.</p>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
    <Icon size={20} className="text-gray-400" />
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const ProfileField = ({ label, value, editable, onChange }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {editable ? (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      />
    ) : (
      <p className="rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900">
        {value || 'Not provided'}
      </p>
    )}
  </div>
);

const SelectField = ({ label, value, editable, options, onChange }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {editable ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <p className="rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900">
        {value}
      </p>
    )}
  </div>
);

export default Profile;