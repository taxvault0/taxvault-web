import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
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
  Square,
  Briefcase,
  FileText,
  TrendingUp,
  Building2,
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',

    dateOfBirth: '',
    sin: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',

    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
    },

    employmentStatus: '',
    taxFilingStatus: '',
    maritalStatus: '',
    hasSpouse: false,
    numberOfDependents: 0,

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

    platforms: [],
    vehicleType: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleLicensePlate: '',
    primaryUse: '',
    averageWeeklyKm: '',

    employerName: '',
    employerBusinessNumber: '',
    employerAddress: '',
    employeeId: '',
    t4Expected: true,
    commissionBased: false,

    contractType: '',
    clientIndustries: [],
    hasHstNumber: false,
    quarterlyFiling: false,
    annualFiling: true,

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

    spouseName: '',
    spouseSin: '',
    spouseDob: '',
    spouseIncome: '',
    shareWithSpouse: false,
    children: [],

    priorYearNoticeOfAssessment: false,
    priorYearBalance: '',
    priorYearRRSPDeductionLimit: '',

    preferredLanguage: 'en',
    notificationEmail: true,
    notificationSMS: false,
    twoFactorAuth: false,
    dataSharingConsent: false,

    agreeToTerms: false,
    agreeToPrivacy: false,
    confirmAccuracy: false,
  });

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  const profileOptions = [
    {
      key: 'employment',
      label: 'Employment Income',
      description: 'T4 salary, wages, payroll income',
      icon: Briefcase,
      color: 'primary',
    },
    {
      key: 'gigWork',
      label: 'Gig Work / Platform Income',
      description: 'Uber, DoorDash, Instacart, delivery apps',
      icon: Car,
      color: 'success',
    },
    {
      key: 'selfEmployment',
      label: 'Self-Employment / Contract Work',
      description: 'Freelance, consulting, contract income',
      icon: Coffee,
      color: 'secondary',
    },
    {
      key: 'incorporatedBusiness',
      label: 'Corporation / Business Owner',
      description: 'Own a corporation or active business',
      icon: Building2,
      color: 'info',
    },
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTaxProfileToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      taxProfile: {
        ...prev.taxProfile,
        [key]: !prev.taxProfile[key],
      },
    }));

    if (errors.taxProfile) {
      setErrors((prev) => ({ ...prev, taxProfile: '' }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const hasEmployment = !!formData.taxProfile.employment;
  const hasGigWork = !!formData.taxProfile.gigWork;
  const hasSelfEmployment = !!formData.taxProfile.selfEmployment;
  const hasBusiness = !!formData.taxProfile.incorporatedBusiness;

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
      else if (!/^\d{9}$/.test(formData.sin.replace(/\s/g, ''))) {
        newErrors.sin = 'SIN must be 9 digits';
      }
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.province) newErrors.province = 'Province is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    }

    if (currentStep === 3) {
      const selectedProfiles = Object.values(formData.taxProfile).some(Boolean);
      if (!selectedProfiles) newErrors.taxProfile = 'Select at least one tax profile';
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.taxFilingStatus) newErrors.taxFilingStatus = 'Tax filing status is required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';

      if (
        formData.maritalStatus === 'Married' ||
        formData.maritalStatus === 'Common-Law'
      ) {
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
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const getLegacyUserType = () => {
    if (hasBusiness) return 'business';
    if (hasGigWork) return 'gig-worker';
    if (hasSelfEmployment) return 'self-employed';
    return 'employee';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setLoading(true);
    try {
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,

        // backward compatibility
        userType: getLegacyUserType(),

        // new structure
        taxProfile: formData.taxProfile,

        maritalStatus: formData.maritalStatus,
        spouseInfo:
          formData.maritalStatus === 'Married' ||
          formData.maritalStatus === 'Common-Law'
            ? {
                name: formData.spouseName,
                sin: formData.spouseSin,
                dateOfBirth: formData.spouseDob,
                income: formData.spouseIncome,
                shareAccess: formData.shareWithSpouse || false,
              }
            : null,
        dependents: formData.children,
        profile: formData,
        termsAccepted: true,
        privacyAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
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
    { number: 7, title: 'Review', icon: Check },
  ];

  const getIconColor = (type) => {
    const colors = {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      success: 'text-success-500',
      warning: 'text-warning-500',
      info: 'text-blue-500',
      gold: 'text-gold',
    };
    return colors[type] || 'text-primary-500';
  };

  const selectedProfiles = profileOptions.filter(
    (option) => formData.taxProfile[option.key]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12">
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 flex items-center text-gray-600 transition-colors hover:text-primary-500"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to role selection</span>
      </button>

      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">TaxVault</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join thousands of Canadians who organize their taxes year-round
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
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
                  <span className="mt-2 text-xs text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 transition-colors ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="shadow-xl">
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Account Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                          size={18}
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full rounded-lg border py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                          size={18}
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full rounded-lg border py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.confirmPassword
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.confirmPassword}
                        </p>
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

                  <div className="rounded-lg bg-primary-50 p-4">
                    <div className="flex items-start">
                      <Shield
                        className="mr-3 mt-1 flex-shrink-0 text-primary-500"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-medium text-primary-700">
                          Secure & Encrypted
                        </p>
                        <p className="mt-1 text-xs text-primary-600">
                          Your information is protected with bank-level AES-256 encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      required
                    />
                  </div>

                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-start">
                      <AlertCircle
                        className="mr-3 mt-1 flex-shrink-0 text-yellow-600"
                        size={20}
                      />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Your SIN is encrypted
                        </p>
                        <p className="mt-1 text-xs text-yellow-600">
                          It is required for tax filing and stored securely.
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

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                      className={`rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Province</option>
                      {provinces.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>

                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      error={errors.postalCode}
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

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Tax Profile
                  </h3>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      Select all income types that apply to you
                    </label>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {profileOptions.map((option) => {
                        const selected = formData.taxProfile[option.key];
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => handleTaxProfileToggle(option.key)}
                            className={`rounded-xl border p-4 text-left transition ${
                              selected
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-white p-2 shadow-sm">
                                  <option.icon
                                    size={20}
                                    className={selected ? getIconColor(option.color) : 'text-gray-400'}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{option.label}</p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {option.description}
                                  </p>
                                </div>
                              </div>

                              {selected ? (
                                <CheckSquare className="text-primary-600" size={20} />
                              ) : (
                                <Square className="text-gray-300" size={20} />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {errors.taxProfile && (
                      <p className="mt-2 text-xs text-red-500">{errors.taxProfile}</p>
                    )}

                    {selectedProfiles.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedProfiles.map((profile) => (
                          <Badge key={profile.key} variant="info">
                            {profile.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Employment Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select status</option>
                        {employmentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tax Filing Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="taxFilingStatus"
                        value={formData.taxFilingStatus}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.taxFilingStatus ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select status</option>
                        {taxFilingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="mb-3 font-medium text-gray-700">Family Status</h4>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {taxFilingStatuses.map((status) => (
                        <label
                          key={status}
                          className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-all ${
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
                      <p className="mt-2 text-xs text-red-500">{errors.maritalStatus}</p>
                    )}
                  </div>

                  {(formData.maritalStatus === 'Married' ||
                    formData.maritalStatus === 'Common-Law') && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="mb-3 flex items-center font-medium text-gray-700">
                        <Heart size={16} className="mr-2 text-pink-500" />
                        Spouse / Partner Information
                      </h4>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          label="Spouse's Full Name"
                          name="spouseName"
                          value={formData.spouseName}
                          onChange={handleChange}
                          error={errors.spouseName}
                        />
                        <Input
                          label="Spouse's SIN"
                          name="spouseSin"
                          value={formData.spouseSin}
                          onChange={handleChange}
                          error={errors.spouseSin}
                        />
                        <Input
                          label="Spouse's Date of Birth"
                          type="date"
                          name="spouseDob"
                          value={formData.spouseDob}
                          onChange={handleChange}
                          error={errors.spouseDob}
                        />
                        <Input
                          label="Spouse's Annual Income (approx)"
                          name="spouseIncome"
                          value={formData.spouseIncome}
                          onChange={handleChange}
                          icon={<DollarSign size={18} />}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Income Information
                  </h3>

                  {hasEmployment && (
                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-700">Employment Income</h4>
                      <Input
                        label="Employer Name"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        icon={<Building size={18} />}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          label="Employer Business Number"
                          name="employerBusinessNumber"
                          value={formData.employerBusinessNumber}
                          onChange={handleChange}
                        />
                        <Input
                          label="Employee ID"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {hasGigWork && (
                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-700">Gig Work</h4>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Platforms you work with
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {platforms.map((platform) => (
                            <label key={platform} className="flex items-center">
                              <input
                                type="checkbox"
                                value={platform}
                                checked={formData.platforms.includes(platform)}
                                onChange={() => handleArrayChange('platforms', platform)}
                                className="h-4 w-4 rounded text-primary-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{platform}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Vehicle Type
                          </label>
                          <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                          >
                            <option value="">Select vehicle type</option>
                            {vehicleTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Input
                          label="Average Weekly KM"
                          name="averageWeeklyKm"
                          value={formData.averageWeeklyKm}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {hasSelfEmployment && (
                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-700">
                        Self-Employment / Contract Work
                      </h4>
                      <Input
                        label="Contract Type / Service"
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleChange}
                        placeholder="Consulting, design, software, etc."
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="quarterlyFiling"
                          checked={formData.quarterlyFiling}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I expect quarterly filing needs
                        </span>
                      </label>
                    </div>
                  )}

                  {hasBusiness && (
                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-700">
                        Corporation / Business Information
                      </h4>
                      <Input
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        icon={<Building size={18} />}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="rounded-lg border border-gray-300 px-3 py-2"
                        >
                          <option value="">Business Type</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <Input
                          label="Business Number (BN)"
                          name="businessNumber"
                          value={formData.businessNumber}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          label="Year Established"
                          name="yearEstablished"
                          value={formData.yearEstablished}
                          onChange={handleChange}
                        />
                        <Input
                          label="Number of Employees"
                          type="number"
                          name="numberOfEmployees"
                          value={formData.numberOfEmployees}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h4 className="mb-4 font-medium text-gray-700">Other Income Sources</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasInvestments"
                          checked={formData.hasInvestments}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Investments
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasRentalIncome"
                          checked={formData.hasRentalIncome}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Rental Income
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasForeignIncome"
                          checked={formData.hasForeignIncome}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Foreign Income
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasCrypto"
                          checked={formData.hasCrypto}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Cryptocurrency
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Deductions & Credits
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['hasRRSP', 'RRSP Contributions'],
                      ['hasFHSA', 'FHSA Contributions'],
                      ['hasTFSA', 'TFSA Contributions'],
                      ['hasTuition', 'Tuition & Education'],
                      ['hasMedicalExpenses', 'Medical Expenses'],
                      ['hasCharitableDonations', 'Charitable Donations'],
                      ['hasChildCareExpenses', 'Child Care Expenses'],
                      ['hasMovingExpenses', 'Moving Expenses'],
                      ['hasUnionDues', 'Union / Professional Dues'],
                      ['hasToolExpenses', 'Tool Expenses'],
                      ['hasHomeOffice', 'Home Office Expenses'],
                      ['hasVehicleExpenses', 'Vehicle Expenses'],
                    ].map(([name, label]) => (
                      <label
                        key={name}
                        className="flex items-center rounded-lg border p-3 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          name={name}
                          checked={formData[name]}
                          onChange={handleChange}
                          className="h-4 w-4 rounded text-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Children & Dependents
                  </h3>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newChildren = [
                        ...(formData.children || []),
                        { name: '', dob: '', sin: '' },
                      ];
                      setFormData((prev) => ({ ...prev, children: newChildren }));
                    }}
                  >
                    <Baby size={16} className="mr-2" />
                    Add Dependent
                  </Button>

                  {formData.children?.map((child, index) => (
                    <div
                      key={index}
                      className="relative mt-4 rounded-lg bg-gray-50 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newChildren = formData.children.filter(
                            (_, i) => i !== index
                          );
                          setFormData((prev) => ({ ...prev, children: newChildren }));
                        }}
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                          label="Full Name"
                          value={child.name}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].name = e.target.value;
                            setFormData((prev) => ({ ...prev, children: newChildren }));
                          }}
                        />
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={child.dob}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].dob = e.target.value;
                            setFormData((prev) => ({ ...prev, children: newChildren }));
                          }}
                        />
                        <Input
                          label="SIN (if applicable)"
                          value={child.sin}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index].sin = e.target.value;
                            setFormData((prev) => ({ ...prev, children: newChildren }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="mb-6 text-xl font-semibold text-gray-800">
                    Review & Submit
                  </h3>

                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex items-center">
                      <Check className="mr-3 text-green-500" size={24} />
                      <div>
                        <p className="font-medium text-green-700">Almost done!</p>
                        <p className="text-sm text-green-600">
                          Review your information before creating your account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Account Information</h4>
                      </Card.Header>
                      <Card.Body className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Name:</span>{' '}
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          <span className="text-gray-500">Email:</span> {formData.email}
                        </p>
                        <p>
                          <span className="text-gray-500">Phone:</span> {formData.phone}
                        </p>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4 className="font-medium">Tax Profiles</h4>
                      </Card.Header>
                      <Card.Body className="space-y-2 text-sm">
                        {selectedProfiles.map((profile) => (
                          <Badge key={profile.key} variant="info">
                            {profile.label}
                          </Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h4 className="font-medium text-gray-800">Terms & Agreements</h4>

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
                          className="font-medium text-primary-600 hover:underline"
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </div>
                    {errors.terms && (
                      <p className="ml-7 text-xs text-red-500">{errors.terms}</p>
                    )}

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
                          className="font-medium text-primary-600 hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </div>
                    {errors.privacy && (
                      <p className="ml-7 text-xs text-red-500">{errors.privacy}</p>
                    )}

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="confirmAccuracy"
                        checked={formData.confirmAccuracy}
                        onChange={handleChange}
                        className="h-4 w-4 rounded text-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I confirm that all information provided is accurate.
                      </span>
                    </label>
                    {errors.confirmAccuracy && (
                      <p className="ml-7 text-xs text-red-500">
                        {errors.confirmAccuracy}
                      </p>
                    )}
                  </div>

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
                </div>
              )}

              <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    <ChevronLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep < steps.length ? (
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Next Step
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" loading={loading}>
                    <Check size={16} className="mr-2" />
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;