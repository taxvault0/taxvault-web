import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  DollarSign,
  Car,
  Home,
  Building,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  CreditCard,
  FileText,
  TrendingUp,
  Shield,
  Globe,
  Users,
  Baby,
  Heart,
  GraduationCap,
  Coffee,
  Wrench,
  ArrowLeft,
  CheckSquare,
  Square
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import TermsModal from 'components/shared/TermsModal';
import { USER_TERMS, PRIVACY_POLICY } from 'constants/terms';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Account Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Personal Information
    dateOfBirth: '',
    sin: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    
    // Tax Profile
    userType: '',
    employmentStatus: '',
    taxFilingStatus: '',
    hasSpouse: false,
    numberOfDependents: 0,
    
    // Business Information
    businessName: '',
    businessType: '',
    businessNumber: '',
    gstRegistered: false,
    gstNumber: '',
    hstRegistered: false,
    hstNumber: '',
    qstRegistered: false,
    qstNumber: '',
    businessAddress: '',
    yearEstablished: '',
    numberOfEmployees: 0,
    annualRevenue: '',
    
    // Gig Worker Specific
    platforms: [],
    vehicleType: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleLicensePlate: '',
    primaryUse: '',
    averageWeeklyKm: '',
    
    // T4 Employee Specific
    employerName: '',
    employerBusinessNumber: '',
    employerAddress: '',
    employeeId: '',
    t4Expected: true,
    commissionBased: false,
    
    // Self-Employed/Contractor
    contractType: '',
    clientIndustries: [],
    hasHstNumber: false,
    quarterlyFiling: false,
    annualFiling: true,
    
    // Investment Income
    hasInvestments: false,
    hasT5: false,
    hasT3: false,
    hasT5008: false,
    hasRentalIncome: false,
    rentalProperties: 0,
    hasForeignIncome: false,
    foreignCountry: '',
    hasCrypto: false,
    cryptoExchanges: [],
    
    // Deductions & Credits
    hasRRSP: false,
    rrspContribution: '',
    hasFHSA: false,
    fhsaContribution: '',
    hasTFSA: false,
    tfsaContribution: '',
    hasTuition: false,
    tuitionAmount: '',
    hasMedicalExpenses: false,
    medicalExpenses: '',
    hasCharitableDonations: false,
    donationAmount: '',
    hasChildCareExpenses: false,
    childCareExpenses: '',
    hasMovingExpenses: false,
    hasUnionDues: false,
    hasProfessionalDues: false,
    hasToolExpenses: false,
    hasHomeOffice: false,
    homeOfficeExpenses: '',
    hasVehicleExpenses: false,
    vehicleExpenses: '',
    
    // Family Information
    maritalStatus: '',
    spouseName: '',
    spouseSin: '',
    spouseDob: '',
    spouseIncome: '',
    shareWithSpouse: false,
    children: [],
    
    // Previous Tax Year
    priorYearNoticeOfAssessment: false,
    priorYearBalance: '',
    priorYearRRSPDeductionLimit: '',
    
    // Preferences
    preferredLanguage: 'en',
    notificationEmail: true,
    notificationSMS: false,
    twoFactorAuth: false,
    dataSharingConsent: false,
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
    confirmAccuracy: false
  });

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  const userTypes = [
    { value: 'employee', label: 'T4 Employee', icon: Briefcase, color: 'primary' },
    { value: 'self-employed', label: 'Self-Employed', icon: User, color: 'secondary' },
    { value: 'gig-worker', label: 'Gig Worker', icon: Car, color: 'success' },
    { value: 'contractor', label: 'IT Contractor', icon: Coffee, color: 'gold' },
    { value: 'small-business', label: 'Small Business Owner', icon: Building, color: 'info' },
    { value: 'trades', label: 'Trades Person', icon: Wrench, color: 'warning' },
    { value: 'professional', label: 'Professional', icon: Briefcase, color: 'primary' },
    { value: 'investor', label: 'Investor', icon: TrendingUp, color: 'success' },
    { value: 'student', label: 'Student', icon: GraduationCap, color: 'info' },
    { value: 'retired', label: 'Retired', icon: Users, color: 'secondary' },
    { value: 'multiple', label: 'Multiple Income Sources', icon: DollarSign, color: 'gold' }
  ];

  const employmentStatuses = [
    'Full-time', 'Part-time', 'Contract', 'Seasonal', 'Self-employed', 'Unemployed', 'Retired'
  ];

  const taxFilingStatuses = [
    'Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed'
  ];

  const businessTypes = [
    'Sole Proprietorship', 'Partnership', 'Corporation', 'Cooperative', 'Non-profit'
  ];

  const platforms = [
    'Uber', 'DoorDash', 'SkipTheDishes', 'Instacart', 'Amazon Flex', 
    'Lyft', 'TaskRabbit', 'Fiverr', 'Upwork', 'Other'
  ];

  const vehicleTypes = [
    'Car', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Bicycle', 'Scooter'
  ];

  const industries = [
    'Technology', 'Construction', 'Healthcare', 'Education', 'Retail',
    'Professional Services', 'Real Estate', 'Transportation', 'Manufacturing'
  ];

  const maritalStatuses = [
    'Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    if (currentStep === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.sin) newErrors.sin = 'SIN is required';
      else if (!/^\d{9}$/.test(formData.sin.replace(/\s/g, ''))) newErrors.sin = 'SIN must be 9 digits';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.province) newErrors.province = 'Province is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    }

    if (currentStep === 3) {
      if (!formData.userType) newErrors.userType = 'User type is required';
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.taxFilingStatus) newErrors.taxFilingStatus = 'Tax filing status is required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
      
      // Validate spouse info if married/common-law
      if (formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law') {
        if (!formData.spouseName) newErrors.spouseName = 'Spouse name is required';
        if (!formData.spouseSin) newErrors.spouseSin = 'Spouse SIN is required';
        if (!formData.spouseDob) newErrors.spouseDob = 'Spouse date of birth is required';
      }
    }

    if (currentStep === 7) {
      if (!termsAccepted) newErrors.terms = 'You must agree to the Terms and Conditions';
      if (!privacyAccepted) newErrors.privacy = 'You must agree to the Privacy Policy';
      if (!formData.confirmAccuracy) newErrors.confirmAccuracy = 'You must confirm accuracy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Register user with all form data including life events
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        // Add life events data
        maritalStatus: formData.maritalStatus,
        spouseInfo: (formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law') ? {
          name: formData.spouseName,
          sin: formData.spouseSin,
          dateOfBirth: formData.spouseDob,
          income: formData.spouseIncome,
          shareAccess: formData.shareWithSpouse || false
        } : null,
        dependents: formData.children,
        profile: formData,
        termsAccepted: true,
        privacyAccepted: true,
        termsAcceptedAt: new Date().toISOString()
      });
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account', icon: User },
    { number: 2, title: 'Personal', icon: User },
    { number: 3, title: 'Tax Profile', icon: FileText },
    { number: 4, title: 'Income', icon: DollarSign },
    { number: 5, title: 'Deductions', icon: Heart },
    { number: 6, title: 'Family', icon: Users },
    { number: 7, title: 'Review', icon: Check }
  ];

  const getIconColor = (type) => {
    const colors = {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      success: 'text-success-500',
      warning: 'text-warning-500',
      info: 'text-blue-500',
      gold: 'text-gold'
    };
    return colors[type] || 'text-primary-500';
  };

  const getSelectedUserType = () => {
    return userTypes.find(t => t.value === formData.userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to role selection</span>
      </button>

      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">TaxVault</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Create Your Account</h2>
          <p className="text-gray-600 mt-2">Join thousands of Canadians who organize their taxes year-round</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      icon={<User size={18} />}
                      required
                    />
                    
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      icon={<User size={18} />}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail size={18} />}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters with at least one letter and one number
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    icon={<Phone size={18} />}
                    placeholder="(416) 555-0123"
                    required
                  />

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-primary-700">Secure & Encrypted</p>
                        <p className="text-xs text-primary-600 mt-1">
                          Your information is protected with bank-level AES-256 encryption and stored on Canadian servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      error={errors.dateOfBirth}
                      icon={<Calendar size={18} />}
                      required
                    />
                    
                    <Input
                      label="Social Insurance Number (SIN)"
                      type="password"
                      name="sin"
                      value={formData.sin}
                      onChange={handleChange}
                      error={errors.sin}
                      icon={<Lock size={18} />}
                      placeholder="123 456 789"
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Your SIN is encrypted</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Your SIN is required for tax filing and will be encrypted using AES-256. 
                          We never store it in plain text and only share with your CA if you authorize access.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    icon={<Home size={18} />}
                    required
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      className="col-span-2"
                      required
                    />
                    
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Province</option>
                      {provinces.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                    
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      error={errors.postalCode}
                      placeholder="A1A 1A1"
                      required
                    />
                  </div>

                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    disabled
                    icon={<Globe size={18} />}
                  />
                </div>
              )}

              {/* Step 3: Tax Profile */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Tax Profile</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am a: <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {userTypes.map(type => (
                        <label
                          key={type.value}
                          className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.userType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={type.value}
                            checked={formData.userType === type.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <type.icon size={24} className={formData.userType === type.value ? getIconColor(type.color) : 'text-gray-400'} />
                          <span className="text-sm mt-2 text-center">{type.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.userType && (
                      <p className="text-xs text-red-500 mt-2">{errors.userType}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employment Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select status</option>
                        {employmentStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {errors.employmentStatus && (
                        <p className="text-xs text-red-500 mt-1">{errors.employmentStatus}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Filing Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="taxFilingStatus"
                        value={formData.taxFilingStatus}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.taxFilingStatus ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select status</option>
                        {taxFilingStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {errors.taxFilingStatus && (
                        <p className="text-xs text-red-500 mt-1">{errors.taxFilingStatus}</p>
                      )}
                    </div>
                  </div>

                  {/* Marital Status - MOVED HERE FROM STEP 6 */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-3">Family Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed'].map((status) => (
                        <label
                          key={status}
                          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.maritalStatus === status
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="maritalStatus"
                            value={status}
                            checked={formData.maritalStatus === status}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                    {errors.maritalStatus && (
                      <p className="text-xs text-red-500 mt-2">{errors.maritalStatus}</p>
                    )}
                  </div>

                  {/* Spouse Information - Show only if Married or Common-Law */}
                  {(formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law') && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <Heart size={16} className="text-pink-500 mr-2" />
                        Spouse/Partner Information
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Spouse's Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              errors.spouseName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Full legal name"
                          />
                          {errors.spouseName && <p className="text-xs text-red-500 mt-1">{errors.spouseName}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Spouse's SIN <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            name="spouseSin"
                            value={formData.spouseSin}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              errors.spouseSin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="123 456 789"
                          />
                          {errors.spouseSin && <p className="text-xs text-red-500 mt-1">{errors.spouseSin}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Spouse's Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="spouseDob"
                            value={formData.spouseDob}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              errors.spouseDob ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {errors.spouseDob && <p className="text-xs text-red-500 mt-1">{errors.spouseDob}</p>}
                        </div>
                        
                        <Input
                          label="Spouse's Annual Income (approx)"
                          name="spouseIncome"
                          value={formData.spouseIncome}
                          onChange={handleChange}
                          icon={<DollarSign size={18} />}
                          placeholder="0.00"
                        />
                      </div>
                      
                      {/* Privacy Setting for Spouse Access */}
                      <div className="mt-4 pt-3 border-t">
                        <label className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Share access with spouse</p>
                            <p className="text-xs text-gray-500">Allow spouse to view your tax documents</p>
                          </div>
                          <input
                            type="checkbox"
                            name="shareWithSpouse"
                            checked={formData.shareWithSpouse || false}
                            onChange={handleChange}
                            className="ml-4 w-5 h-5 text-primary-600 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasSpouse"
                        checked={formData.hasSpouse}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">I have a spouse/common-law partner</span>
                    </label>

                    {formData.hasSpouse && (
                      <Input
                        type="number"
                        name="numberOfDependents"
                        value={formData.numberOfDependents}
                        onChange={handleChange}
                        label="Number of dependents"
                        min="0"
                        className="w-32"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Income Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Income Information</h3>
                  
                  {/* Show different fields based on user type */}
                  {formData.userType === 'employee' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">T4 Employment Information</h4>
                      <Input
                        label="Employer Name"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        icon={<Building size={18} />}
                      />
                      <Input
                        label="Employer Business Number"
                        name="employerBusinessNumber"
                        value={formData.employerBusinessNumber}
                        onChange={handleChange}
                        placeholder="123456789"
                      />
                      <Input
                        label="Employee ID (if applicable)"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="commissionBased"
                          checked={formData.commissionBased}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">I earn commission/bonuses</span>
                      </label>
                    </div>
                  )}

                  {formData.userType === 'gig-worker' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Gig Work Information</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platforms you work with
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {platforms.map(platform => (
                            <label key={platform} className="flex items-center">
                              <input
                                type="checkbox"
                                value={platform}
                                checked={formData.platforms.includes(platform)}
                                onChange={() => handleArrayChange('platforms', platform)}
                                className="w-4 h-4 text-primary-500 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{platform}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Type
                          </label>
                          <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select vehicle type</option>
                            {vehicleTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <Input
                          label="Average Weekly KM"
                          name="averageWeeklyKm"
                          value={formData.averageWeeklyKm}
                          onChange={handleChange}
                          placeholder="e.g., 500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Vehicle Year"
                          name="vehicleYear"
                          value={formData.vehicleYear}
                          onChange={handleChange}
                          placeholder="2024"
                        />
                        <Input
                          label="Make"
                          name="vehicleMake"
                          value={formData.vehicleMake}
                          onChange={handleChange}
                          placeholder="Toyota"
                        />
                        <Input
                          label="Model"
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleChange}
                          placeholder="Corolla"
                        />
                      </div>

                      <Input
                        label="License Plate"
                        name="vehicleLicensePlate"
                        value={formData.vehicleLicensePlate}
                        onChange={handleChange}
                        placeholder="ABC 123"
                      />
                    </div>
                  )}

                  {formData.userType === 'small-business' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Business Information</h4>
                      <Input
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        icon={<Building size={18} />}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Business Type</option>
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>

                        <Input
                          label="Year Established"
                          type="number"
                          name="yearEstablished"
                          value={formData.yearEstablished}
                          onChange={handleChange}
                          placeholder="2020"
                        />
                      </div>

                      <Input
                        label="Business Number (BN)"
                        name="businessNumber"
                        value={formData.businessNumber}
                        onChange={handleChange}
                        placeholder="123456789"
                      />

                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">GST/HST Registration</h5>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="gstRegistered"
                            checked={formData.gstRegistered}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">GST Registered</span>
                        </label>

                        {formData.gstRegistered && (
                          <Input
                            label="GST Number"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="123456789RT0001"
                          />
                        )}

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="hstRegistered"
                            checked={formData.hstRegistered}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">HST Registered</span>
                        </label>

                        {formData.hstRegistered && (
                          <Input
                            label="HST Number"
                            name="hstNumber"
                            value={formData.hstNumber}
                            onChange={handleChange}
                            placeholder="123456789RT0001"
                          />
                        )}

                        {formData.province === 'Quebec' && (
                          <>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="qstRegistered"
                                checked={formData.qstRegistered}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-500 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">QST Registered</span>
                            </label>

                            {formData.qstRegistered && (
                              <Input
                                label="QST Number"
                                name="qstNumber"
                                value={formData.qstNumber}
                                onChange={handleChange}
                                placeholder="1234567890"
                              />
                            )}
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Number of Employees"
                          type="number"
                          name="numberOfEmployees"
                          value={formData.numberOfEmployees}
                          onChange={handleChange}
                          min="0"
                        />
                        
                        <select
                          name="annualRevenue"
                          value={formData.annualRevenue}
                          onChange={handleChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Annual Revenue Range</option>
                          <option value="under-50k">Under $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="100k-250k">$100,000 - $250,000</option>
                          <option value="250k-500k">$250,000 - $500,000</option>
                          <option value="500k-1m">$500,000 - $1,000,000</option>
                          <option value="over-1m">Over $1,000,000</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Investment Income Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">Investment Income</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasInvestments"
                          checked={formData.hasInvestments}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">I have investments</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasT5"
                          checked={formData.hasT5}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">T5 - Investment Income</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasT3"
                          checked={formData.hasT3}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">T3 - Trust Income</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasT5008"
                          checked={formData.hasT5008}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">T5008 - Securities</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasRentalIncome"
                          checked={formData.hasRentalIncome}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Rental Income</span>
                      </label>

                      {formData.hasRentalIncome && (
                        <Input
                          type="number"
                          name="rentalProperties"
                          value={formData.rentalProperties}
                          onChange={handleChange}
                          placeholder="Number of properties"
                          min="1"
                          className="mt-2"
                        />
                      )}

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasForeignIncome"
                          checked={formData.hasForeignIncome}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Foreign Income</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasCrypto"
                          checked={formData.hasCrypto}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Cryptocurrency</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Deductions & Credits */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Deductions & Credits</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasRRSP"
                        checked={formData.hasRRSP}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">RRSP Contributions</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasFHSA"
                        checked={formData.hasFHSA}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">FHSA Contributions</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasTFSA"
                        checked={formData.hasTFSA}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">TFSA Contributions</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasTuition"
                        checked={formData.hasTuition}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Tuition & Education</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasMedicalExpenses"
                        checked={formData.hasMedicalExpenses}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Medical Expenses</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasCharitableDonations"
                        checked={formData.hasCharitableDonations}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Charitable Donations</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasChildCareExpenses"
                        checked={formData.hasChildCareExpenses}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Child Care Expenses</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasMovingExpenses"
                        checked={formData.hasMovingExpenses}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Moving Expenses</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasUnionDues"
                        checked={formData.hasUnionDues}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Union/Professional Dues</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasToolExpenses"
                        checked={formData.hasToolExpenses}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Tool Expenses</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasHomeOffice"
                        checked={formData.hasHomeOffice}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Home Office Expenses</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="hasVehicleExpenses"
                        checked={formData.hasVehicleExpenses}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Vehicle Expenses</span>
                    </label>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg mt-4">
                    <div className="flex items-start">
                      <Heart className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-primary-700">Maximize Your Refund</p>
                        <p className="text-xs text-primary-600 mt-1">
                          We'll help you claim all eligible deductions and credits based on your profile.
                          The more information you provide, the more we can save you!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Family Information (Now only Children/Dependents) */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Children & Dependents</h3>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-700 mb-4">Children/Dependents</h4>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newChildren = [...(formData.children || []), { name: '', dob: '', sin: '' }];
                        setFormData(prev => ({ ...prev, children: newChildren }));
                      }}
                    >
                      <Baby size={16} className="mr-2" />
                      Add Dependent
                    </Button>

                    {formData.children?.map((child, index) => (
                      <div key={index} className="mt-4 p-4 bg-gray-50 rounded-lg relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newChildren = formData.children.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, children: newChildren }));
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="Full Name"
                            value={child.name}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[index].name = e.target.value;
                              setFormData(prev => ({ ...prev, children: newChildren }));
                            }}
                          />
                          <Input
                            label="Date of Birth"
                            type="date"
                            value={child.dob}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[index].dob = e.target.value;
                              setFormData(prev => ({ ...prev, children: newChildren }));
                            }}
                          />
                          <Input
                            label="SIN (if applicable)"
                            value={child.sin}
                            onChange={(e) => {
                              const newChildren = [...formData.children];
                              newChildren[index].sin = e.target.value;
                              setFormData(prev => ({ ...prev, children: newChildren }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Review & Submit */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Review & Submit</h3>
                  
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <Check className="text-green-500 mr-3" size={24} />
                      <div>
                        <p className="font-medium text-green-700">Almost done!</p>
                        <p className="text-sm text-green-600">
                          Please review your information before creating your account.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Account Information</h4>
                      </Card.Header>
                      <Card.Body className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</p>
                        <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                        <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Personal Information</h4>
                      </Card.Header>
                      <Card.Body className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Date of Birth:</span> {formData.dateOfBirth}</p>
                        <p><span className="text-gray-500">Address:</span> {formData.address}, {formData.city}, {formData.province} {formData.postalCode}</p>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Tax Profile</h4>
                      </Card.Header>
                      <Card.Body className="space-y-2 text-sm">
                        <p><span className="text-gray-500">User Type:</span> {getSelectedUserType()?.label}</p>
                        <p><span className="text-gray-500">Employment Status:</span> {formData.employmentStatus}</p>
                        <p><span className="text-gray-500">Filing Status:</span> {formData.taxFilingStatus}</p>
                        <p><span className="text-gray-500">Marital Status:</span> {formData.maritalStatus}</p>
                        {formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law' ? (
                          <p><span className="text-gray-500">Spouse:</span> {formData.spouseName}</p>
                        ) : null}
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Deductions Selected</h4>
                      </Card.Header>
                      <Card.Body>
                        <div className="flex flex-wrap gap-2">
                          {formData.hasRRSP && <Badge variant="info">RRSP</Badge>}
                          {formData.hasFHSA && <Badge variant="info">FHSA</Badge>}
                          {formData.hasTuition && <Badge variant="info">Tuition</Badge>}
                          {formData.hasMedicalExpenses && <Badge variant="info">Medical</Badge>}
                          {formData.hasCharitableDonations && <Badge variant="info">Charity</Badge>}
                          {formData.hasHomeOffice && <Badge variant="info">Home Office</Badge>}
                          {!formData.hasRRSP && !formData.hasFHSA && !formData.hasTuition && 
                           !formData.hasMedicalExpenses && !formData.hasCharitableDonations && !formData.hasHomeOffice && (
                            <span className="text-sm text-gray-500">None selected</span>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4 mt-6 border-t pt-6">
                    <h4 className="font-medium text-gray-800">Terms & Agreements</h4>
                    
                    {/* Terms of Service */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setTermsAccepted(!termsAccepted)}
                        className="flex items-center focus:outline-none"
                      >
                        {termsAccepted ? (
                          <CheckSquare className="text-primary-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </div>
                    {errors.terms && <p className="text-xs text-red-500 ml-7">{errors.terms}</p>}

                    {/* Privacy Policy */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPrivacyAccepted(!privacyAccepted)}
                        className="flex items-center focus:outline-none"
                      >
                        {privacyAccepted ? (
                          <CheckSquare className="text-primary-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </div>
                    {errors.privacy && <p className="text-xs text-red-500 ml-7">{errors.privacy}</p>}

                    {/* Accuracy Confirmation */}
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="confirmAccuracy"
                        checked={formData.confirmAccuracy}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I confirm that all information provided is accurate and complete to the best of my knowledge
                      </span>
                    </label>
                    {errors.confirmAccuracy && (
                      <p className="text-xs text-red-500 ml-7">{errors.confirmAccuracy}</p>
                    )}
                  </div>

                  {/* Terms Modal */}
                  <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    title={USER_TERMS.title}
                    content={USER_TERMS.content}
                    onAccept={() => {
                      setTermsAccepted(true);
                      setShowTermsModal(false);
                    }}
                  />

                  {/* Privacy Modal */}
                  <TermsModal
                    isOpen={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                    title={PRIVACY_POLICY.title}
                    content={PRIVACY_POLICY.content}
                    onAccept={() => {
                      setPrivacyAccepted(true);
                      setShowPrivacyModal(false);
                    }}
                  />

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-primary-700">Your data is protected</p>
                        <p className="text-xs text-primary-600 mt-1">
                          All information is encrypted using AES-256 and stored on Canadian servers. 
                          We never share your data without your explicit consent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                  >
                    Next Step
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                  >
                    <Check size={16} className="mr-2" />
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign In
          </Link>
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center mt-6 text-xs text-gray-400">
          <Shield size={14} className="mr-1" />
          <span>Bank-level encryption • Canadian data residency • PIPEDA compliant</span>
        </div>
      </div>
    </div>
  );
};

export default Register;







