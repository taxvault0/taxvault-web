import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Briefcase,
  Car,
  Building2,
  FileText,
  Layers3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Checkbox from 'components/ui/Checkbox';

const scenarios = [
  {
    id: 't4-only',
    title: 'T4 Employment',
    subtitle: 'Employee with employment income only',
    icon: FileText,
    tone: 'blue',
    user: {
      id: 'scenario-t4-only',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'user',
      userType: 'employee',
      incomeSources: ['employment'],
      taxProfile: {
        employment: true,
        gigWork: false,
        selfEmployment: false,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-T4-1001',
    },
  },
  {
    id: 'self-employed-only',
    title: 'Self-Employed',
    subtitle: 'Contractor / self-employed income only',
    icon: Car,
    tone: 'green',
    user: {
      id: 'scenario-self-employed-only',
      name: 'Sarah Lee',
      email: 'sarah@example.com',
      role: 'user',
      userType: 'self-employed',
      incomeSources: ['self_employed'],
      taxProfile: {
        employment: false,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-SE-1001',
    },
  },
  {
    id: 'business-only',
    title: 'Business',
    subtitle: 'Business owner only',
    icon: Building2,
    tone: 'purple',
    user: {
      id: 'scenario-business-only',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['business'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Brown Consulting',
        businessType: 'Sole Proprietor',
        gstRegistered: false,
        hasEmployees: false,
        hasInventory: false,
      },
      clientId: 'TV-BIZ-1001',
    },
  },
  {
    id: 'self-employed-t4',
    title: 'T4 Employment + Self-Employed',
    subtitle: 'Employee with side self-employed income',
    icon: Layers3,
    tone: 'amber',
    user: {
      id: 'scenario-self-employed-t4',
      name: 'Emily Clark',
      email: 'emily@example.com',
      role: 'user',
      userType: 'self-employed',
      incomeSources: ['employment', 'self_employed'],
      taxProfile: {
        employment: true,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-MIX-1001',
    },
  },
  {
    id: 't4-business',
    title: 'T4 Employment + Business',
    subtitle: 'Employee who also runs a business',
    icon: Layers3,
    tone: 'blue',
    user: {
      id: 'scenario-t4-business',
      name: 'Anna Patel',
      email: 'anna@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['employment', 'business'],
      taxProfile: {
        employment: true,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Patel Studio',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: false,
      },
      clientId: 'TV-T4B-1001',
    },
  },
  {
    id: 'all-incomes',
    title: 'T4 Employment + Self-Employed + Business',
    subtitle: 'Full mixed-income scenario',
    icon: Layers3,
    tone: 'purple',
    user: {
      id: 'scenario-all-incomes',
      name: 'Olivia Martin',
      email: 'olivia@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['employment', 'self_employed', 'business'],
      taxProfile: {
        employment: true,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Martin Group',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: true,
      },
      clientId: 'TV-ALL-1001',
    },
  },
  {
    id: 'business-payroll',
    title: 'Business + Payroll',
    subtitle: 'Business owner with employees',
    icon: Briefcase,
    tone: 'amber',
    user: {
      id: 'scenario-business-payroll',
      name: 'Robert Green',
      email: 'robert@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['business'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Green Logistics',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: false,
      },
      clientId: 'TV-PAY-1001',
    },
  },
  {
    id: 'business-inventory',
    title: 'Business + Inventory',
    subtitle: 'Business owner with stock/inventory',
    icon: Building2,
    tone: 'green',
    user: {
      id: 'scenario-business-inventory',
      name: 'Sophia Adams',
      email: 'sophia@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['business'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Adams Retail',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: false,
        hasInventory: true,
      },
      clientId: 'TV-INV-1001',
    },
  },
];

const toneClasses = {
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
  green: 'border-green-200 bg-green-50 hover:bg-green-100',
  purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
  amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
};

const sourceLabelMap = {
  employment: 'T4 Employment',
  self_employed: 'Self-Employed',
  gig_work: 'Self-Employed',
  business: 'Business',
};

const Login = () => {
  const { login, verifyMfa, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [userId, setUserId] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      mfaToken: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      mfaToken: Yup.string().when('$mfaRequired', {
        is: true,
        then: (schema) =>
          schema
            .required('Verification code is required')
            .matches(/^\d+$/, 'Verification code must contain only digits')
            .length(6, 'Verification code must be 6 digits'),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (mfaRequired) {
        const result = await verifyMfa(userId, values.mfaToken);

        if (result.success) {
          navigate('/dashboard');
        } else {
          setFieldError('mfaToken', 'Invalid verification code');
        }
      } else {
        const result = await login(values.email, values.password, rememberMe);

        if (result.success) {
          navigate('/dashboard');
        } else if (result.requiresMfa) {
          setMfaRequired(true);
          setUserId(result.userId);
        } else {
          setFieldError('password', 'Invalid email or password');
        }
      }

      setSubmitting(false);
    },
    context: { mfaRequired },
  });

  const handleScenarioLogin = (scenario) => {
    if (typeof loginDemoUser === 'function') {
      loginDemoUser(scenario.user);
      navigate('/dashboard');
      return;
    }

    localStorage.setItem('user', JSON.stringify(scenario.user));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 flex items-center text-gray-600 transition-colors hover:text-primary-500"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to role selection</span>
      </button>

      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600">TaxVault</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {mfaRequired ? 'Two-Factor Authentication' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mfaRequired
              ? 'Enter the verification code from your authenticator app'
              : 'Sign in to access your tax documents, receipts, and dashboards'}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-md xl:mx-0">
            <Card className="px-4 py-8 sm:px-10">
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                {!mfaRequired ? (
                  <>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email ? formik.errors.email : ''}
                      icon={<Mail size={18} />}
                      required
                    />

                    <div className="relative">
                      <Input
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password ? formik.errors.password : ''}
                        icon={<Lock size={18} />}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <Checkbox
                        label="Remember me"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary-500 hover:text-primary-600"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Verification Code"
                      name="mfaToken"
                      type="text"
                      placeholder="000000"
                      value={formik.values.mfaToken}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.mfaToken ? formik.errors.mfaToken : ''}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      required
                    />
                    <p className="text-center text-xs text-gray-500">
                      Enter the 6-digit code from Google Authenticator, Authy, or similar app
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? mfaRequired
                      ? 'Verifying...'
                      : 'Signing in...'
                    : mfaRequired
                    ? 'Verify Code'
                    : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mfaRequired ? (
                    <>
                      Having trouble?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMfaRequired(false);
                          setUserId(null);
                          formik.setFieldValue('mfaToken', '');
                        }}
                        className="font-medium text-primary-500 hover:text-primary-600"
                      >
                        Back to login
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{' '}
                      <Link
                        to="/register/user"
                        className="font-medium text-primary-500 hover:text-primary-600"
                      >
                        Register here
                      </Link>
                    </>
                  )}
                </p>
              </div>

              {!mfaRequired && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <p className="mb-3 text-center text-xs text-gray-500">
                    Demo credentials and scenario testing
                  </p>
                  <div className="rounded-xl bg-blue-50 p-3 text-center text-sm text-blue-800">
                    Use the demo scenarios on the right to test all user combinations directly from this page.
                  </div>
                </div>
              )}
            </Card>

            <div className="mt-6 space-y-2 text-center">
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                <span>🔒 Bank-level encryption</span>
                <span>•</span>
                <span>🇨🇦 Canadian data residency</span>
                <span>•</span>
                <span>✓ PIPEDA compliant</span>
              </div>
            </div>
          </div>

          {!mfaRequired && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-center text-2xl font-semibold text-gray-800">
                Demo Scenario Login
              </h3>
              <p className="mt-2 text-center text-sm text-gray-600">
                Log in as different tax profiles to test dashboards, profile pages, and flows.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {scenarios.map((scenario) => {
                  const Icon = scenario.icon;

                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => handleScenarioLogin(scenario)}
                      className={`rounded-2xl border p-5 text-left transition ${toneClasses[scenario.tone]}`}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <Icon size={20} className="text-gray-800" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {scenario.title}
                          </p>
                          <p className="text-sm text-gray-600">{scenario.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {scenario.user.incomeSources?.map((source) => (
                          <span
                            key={source}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            {sourceLabelMap[source] || source}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;