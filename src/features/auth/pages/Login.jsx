import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Checkbox from 'components/ui/Checkbox';

const Login = () => {
  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [userId, setUserId] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      mfaToken: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      mfaToken: Yup.string()
        .when('$mfaRequired', {
          is: true,
          then: (schema) => schema
            .required('MFA token is required')
            .matches(/^\d+$/, 'MFA token must contain only digits')
            .length(6, 'MFA token must be 6 digits')
        })
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
    }
  });

  const handleDemoFill = (type) => {
    if (type === 'user') {
      formik.setValues({ 
        email: 'user@example.com', 
        password: 'password123',
        mfaToken: '' 
      });
    } else {
      formik.setValues({ 
        email: 'ca@example.com', 
        password: 'password123',
        mfaToken: '' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to role selection</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600">TaxVault</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {mfaRequired ? 'Two-Factor Authentication' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mfaRequired 
              ? 'Enter the verification code from your authenticator app' 
              : 'Sign in to access your tax documents and receipts'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {!mfaRequired ? (
              <>
                {/* Email field */}
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

                {/* Password field with show/hide */}
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

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    label="Remember me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              /* MFA Token Input */
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
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from Google Authenticator, Authy, or similar app
                </p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={formik.isSubmitting}
            >
              {formik.isSubmitting 
                ? (mfaRequired ? 'Verifying...' : 'Signing in...')
                : (mfaRequired ? 'Verify Code' : 'Sign In')
              }
            </Button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mfaRequired ? (
                <>
                  Having trouble?{' '}
                  <button
                    onClick={() => {
                      setMfaRequired(false);
                      setUserId(null);
                      formik.setFieldValue('mfaToken', '');
                    }}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Back to login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Link
                    to="/register/user"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Register here
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Demo credentials (only show on initial login) */}
          {!mfaRequired && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Demo credentials (for testing)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoFill('user')}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 px-3 rounded-lg transition-colors"
                >
                  Fill as User
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('ca')}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 px-3 rounded-lg transition-colors"
                >
                  Fill as CA
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Security badges */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 Bank-level encryption</span>
            <span>•</span>
            <span>🇨🇦 Canadian data residency</span>
            <span>•</span>
            <span>✓ PIPEDA compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;







