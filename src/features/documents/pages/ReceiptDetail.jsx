import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Share2,
  Calendar,
  Tag,
  DollarSign,
  Percent,
  MapPin,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { PROVINCES, calculateTax, getTaxRateDisplay } from '../../../constants/provinces';

const ReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with API call
  const [receipt, setReceipt] = useState({
    id: id,
    vendor: 'Shell',
    amount: 45.23,
    date: '2024-03-15',
    category: 'Fuel',
    province: 'ON',
    gst: 2.26,
    pst: 0,
    hst: 0,
    qst: 0,
    total: 47.49,
    paymentMethod: 'Credit Card',
    notes: 'Business meeting fuel',
    status: 'verified',
    imageUrl: 'https://via.placeholder.com/400',
    merchantAddress: '123 Main St, Toronto, ON',
    merchantNumber: '123456789'
  });

  const taxDetails = calculateTax(receipt.amount, receipt.province);
  const provinceInfo = PROVINCES.find(p => p.id === receipt.province);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      // API call to delete
      navigate('/receipts');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Receipts
        </button>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="warning" size="sm" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Receipt Image and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Section */}
        <Card className="lg:col-span-1">
          <Card.Body className="p-0">
            <img
              src={receipt.imageUrl}
              alt="Receipt"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={receipt.status === 'verified' ? 'success' : 'pending'}>
                  {receipt.status}
                </Badge>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Share2 size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Uploaded on Mar 15, 2024</p>
            </div>
          </Card.Body>
        </Card>

        {/* Details Section */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="font-semibold">Receipt Details</h3>
          </Card.Header>
          <Card.Body className="space-y-4">
            {/* Vendor and Amount */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={receipt.vendor}
                    onChange={(e) => setReceipt({...receipt, vendor: e.target.value})}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
                  />
                ) : (
                  <p className="text-xl font-bold">{receipt.vendor}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={receipt.amount}
                    onChange={(e) => setReceipt({...receipt, amount: parseFloat(e.target.value)})}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-32 text-right"
                  />
                ) : (
                  <p className="text-2xl font-bold text-primary-600">
                    ${receipt.amount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Date</span>
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    value={receipt.date}
                    onChange={(e) => setReceipt({...receipt, date: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  />
                ) : (
                  <p className="font-medium">{receipt.date}</p>
                )}
              </div>
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <Tag size={16} className="mr-2" />
                  <span className="text-sm">Category</span>
                </div>
                {isEditing ? (
                  <select
                    value={receipt.category}
                    onChange={(e) => setReceipt({...receipt, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  >
                    <option>Fuel</option>
                    <option>Maintenance</option>
                    <option>Insurance</option>
                    <option>Office Supplies</option>
                    <option>Meals</option>
                  </select>
                ) : (
                  <p className="font-medium">{receipt.category}</p>
                )}
              </div>
            </div>

            {/* Province and Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">Province</span>
                </div>
                {isEditing ? (
                  <select
                    value={receipt.province}
                    onChange={(e) => setReceipt({...receipt, province: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  >
                    {PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium">{provinceInfo?.name}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{getTaxRateDisplay(receipt.province)}</p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <Percent size={16} className="mr-2" />
                  <span className="text-sm">Tax Breakdown</span>
                </div>
                <div className="space-y-1">
                  {taxDetails.gst > 0 && (
                    <p className="text-sm">GST: ${taxDetails.gst}</p>
                  )}
                  {taxDetails.pst > 0 && (
                    <p className="text-sm">PST: ${taxDetails.pst}</p>
                  )}
                  {taxDetails.hst > 0 && (
                    <p className="text-sm">HST: ${taxDetails.hst}</p>
                  )}
                  {taxDetails.qst > 0 && (
                    <p className="text-sm">QST: ${taxDetails.qst}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              {isEditing ? (
                <select
                  value={receipt.paymentMethod}
                  onChange={(e) => setReceipt({...receipt, paymentMethod: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                </select>
              ) : (
                <p className="font-medium">{receipt.paymentMethod}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              {isEditing ? (
                <textarea
                  value={receipt.notes}
                  onChange={(e) => setReceipt({...receipt, notes: e.target.value})}
                  rows="3"
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                />
              ) : (
                <p className="text-gray-700">{receipt.notes || 'No notes added'}</p>
              )}
            </div>

            {/* Merchant Info */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Merchant Information</p>
              <p className="text-sm">{receipt.merchantAddress}</p>
              <p className="text-sm">Business #: {receipt.merchantNumber}</p>
            </div>

            {/* Save Button (when editing) */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button variant="primary" onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptDetail;






