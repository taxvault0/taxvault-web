// src/pages/user/ConsultationRequest.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  Check,
  ChevronLeft,
  Video,
  MessageCircle,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { consultationService } from '../services/consultationService';
import { documentAPI } from 'services/api';
import { useAuth } from '../../auth/context/AuthContext';

const ConsultationRequest = () => {
  const navigate = useNavigate();
  const { caId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [caProfile, setCaProfile] = useState(null);
  const [step, setStep] = useState(1);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    duration: 30,
    urgency: 'medium',
    topic: '',
    description: '',
    preferredDates: [],
    attachments: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  useEffect(() => {
    loadCAProfile();
    loadDocuments();
  }, [caId]);

  const loadCAProfile = async () => {
    try {
      // Mock CA data - replace with API call
      setCaProfile({
        id: caId,
        name: 'David Chen, CPA',
        firm: 'Chen & Associates',
        rating: 4.9,
        reviewCount: 124,
        rates: {
          'tax-planning': 150,
          'audit-support': 200,
          'business-structure': 175,
          'gst-hst-advice': 120,
          'payroll-support': 130,
          'investment-tax': 160,
          'estate-planning': 180,
          'cross-border': 220,
          'general-advice': 100
        }
      });
    } catch (error) {
      console.error('Error loading CA profile:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.getDocuments();
      setAvailableDocs(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const consultationTypes = [
    { value: 'tax-planning', label: 'Tax Planning & Strategy', icon: '💰' },
    { value: 'audit-support', label: 'Audit Support', icon: '🔍' },
    { value: 'business-structure', label: 'Business Structure Advice', icon: '🏢' },
    { value: 'gst-hst-advice', label: 'GST/HST Advice', icon: '📊' },
    { value: 'payroll-support', label: 'Payroll Support', icon: '👥' },
    { value: 'investment-tax', label: 'Investment Tax Planning', icon: '📈' },
    { value: 'estate-planning', label: 'Estate Planning', icon: '📜' },
    { value: 'cross-border', label: 'Cross-Border Taxation', icon: '🌍' },
    { value: 'general-advice', label: 'General Tax Advice', icon: '💬' }
  ];

  const durations = [15, 30, 45, 60, 90];

  const calculateTotal = () => {
    if (!caProfile || !formData.type) return 0;
    const rate = caProfile.rates[formData.type] || 100;
    const durationRate = rate * (formData.duration / 60);
    const platformFee = durationRate * 0.10; // 10% platform fee
    return {
      subtotal: durationRate,
      fee: platformFee,
      total: durationRate + platformFee
    };
  };

  const pricing = calculateTotal();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...formData,
        caId,
        estimatedTotal: pricing.total
      };
      
      const response = await consultationService.createRequest(requestData);
      navigate(`/consultations/${response.data.id}`);
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Consultation Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consultationTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFormData({ ...formData, type: type.value })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              formData.type === type.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <span className="text-2xl mb-2 block">{type.icon}</span>
            <h4 className="font-medium">{type.label}</h4>
            {caProfile?.rates[type.value] && (
              <p className="text-sm text-gray-600 mt-1">
                ${caProfile.rates[type.value]}/hour
              </p>
            )}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setFormData({ ...formData, duration: d })}
              className={`px-4 py-2 rounded-lg font-medium ${
                formData.duration === d
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency
        </label>
        <div className="flex space-x-2">
          {[
            { value: 'low', label: 'Low', icon: '😊' },
            { value: 'medium', label: 'Medium', icon: '😐' },
            { value: 'high', label: 'High', icon: '😟' },
            { value: 'urgent', label: 'Urgent', icon: '🚨' }
          ].map((u) => (
            <button
              key={u.value}
              onClick={() => setFormData({ ...formData, urgency: u.value })}
              className={`flex-1 p-3 rounded-lg border-2 ${
                formData.urgency === u.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block text-center mb-1">{u.icon}</span>
              <span className="text-sm font-medium">{u.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Describe Your Question</h3>
      
      <Input
        label="Topic / Subject"
        placeholder="e.g., 2024 Tax Planning for Gig Income"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Provide details about what you'd like to discuss..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attach Relevant Documents (Optional)
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableDocs.map((doc) => (
            <label
              key={doc.id}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                className="mr-3"
                checked={formData.attachments.includes(doc.id)}
                onChange={(e) => {
                  const newAttachments = e.target.checked
                    ? [...formData.attachments, doc.id]
                    : formData.attachments.filter(id => id !== doc.id);
                  setFormData({ ...formData, attachments: newAttachments });
                }}
              />
              <FileText size={16} className="text-gray-400 mr-2" />
              <span className="text-sm">{doc.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review & Confirm</h3>

      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600">
                  {caProfile?.name?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">{caProfile?.name}</h4>
                <p className="text-sm text-gray-600">{caProfile?.firm}</p>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-gold fill-current" />
                  <span className="text-xs ml-1">{caProfile?.rating} ({caProfile?.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <Badge variant="info">Verified CA</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consultation Type:</span>
              <span className="font-medium">
                {consultationTypes.find(t => t.value === formData.type)?.label}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formData.duration} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Urgency:</span>
              <span className="font-medium capitalize">{formData.urgency}</span>
            </div>
            {formData.topic && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{formData.topic}</span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Pricing Breakdown */}
      <Card>
        <Card.Header>
          <h4 className="font-medium">Price Breakdown</h4>
        </Card.Header>
        <Card.Body className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">CA Fee ({formData.duration} min @ ${caProfile?.rates[formData.type]}/hr)</span>
            <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee (10%)</span>
            <span className="font-medium">${pricing.fee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary-600">${pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Shield className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={18} />
          <div>
            <p className="text-sm font-medium text-blue-700">Secure Payment</p>
            <p className="text-xs text-blue-600 mt-1">
              You won't be charged yet. Payment is only processed after the CA accepts your request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-4"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold">Request Consultation</h2>
          <p className="text-gray-500 mt-1">
            Schedule a paid consultation with {caProfile?.name}
          </p>
        </Card.Header>

        <Card.Body>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.type}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                loading={loading}
                disabled={!formData.topic}
              >
                Submit Request
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConsultationRequest;





