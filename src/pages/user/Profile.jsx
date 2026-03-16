import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  QrCode,
  Share2,
  Download,
  Eye,
  Camera,
  Settings,
  LogOut
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data (replace with actual user data from context)
  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phoneNumber || '+1 (416) 555-0123',
    address: user?.address || '123 Main St, Toronto, ON M5V 2H1',
    clientId: user?.clientId || 'TV-2024-1A2B3C',
    accountType: user?.role === 'ca' ? 'CA Professional' : 'Individual Taxpayer',
    memberSince: '2024',
    stats: {
      documents: 24,
      receipts: 156,
      mileageTrips: 89
    }
  };

  const copyClientId = () => {
    navigator.clipboard.writeText(userData.clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `client-${userData.clientId}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
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

      {/* Client ID Card - Prominent Display */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <Card.Body>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm opacity-90">Your Unique Client ID</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Show QR Code"
                  >
                    <QrCode size={18} />
                  </button>
                  <button
                    onClick={copyClientId}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Copy Client ID"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <span className="text-3xl font-mono font-bold tracking-wider">
                    {userData.clientId}
                  </span>
                </div>
              </div>
              
              <p className="text-xs opacity-75 mt-3">
                Share this ID with your CA to securely connect your account. They can use it to access your tax documents.
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
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
              <div className="flex items-center justify-center bg-white p-6 rounded-xl">
                <QRCodeCanvas
                  value={userData.clientId}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-center mt-3 opacity-75">
                Your CA can scan this QR code to instantly add you as a client
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-primary-600">{userData.stats.documents}</p>
          <p className="text-sm text-gray-500">Documents</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-primary-600">{userData.stats.receipts}</p>
          <p className="text-sm text-gray-500">Receipts</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-primary-600">{userData.stats.mileageTrips}</p>
          <p className="text-sm text-gray-500">Mileage Trips</p>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
            <User size={20} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{userData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
            <Mail size={20} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
            <Phone size={20} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{userData.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
            <MapPin size={20} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{userData.address}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-primary-600">{userData.accountType}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{userData.memberSince}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Camera size={16} />
          Upload Photo
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Eye size={16} />
          View Activity Log
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-400 pt-4">
        <p>🔒 Your information is encrypted and secure. Client ID is unique to your account.</p>
      </div>
    </div>
  );
};

export default Profile;