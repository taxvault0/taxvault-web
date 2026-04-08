import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'components/ui/Card';
import { useAuth } from '../context/AuthContext';

import { initialValues, validateStep } from './modules';
import {
  ErrorAlert,
  VerificationNotice,
  ProgressSteps,
  AccountDetails,
  ProfessionalDetails,
  FirmDetails,
  CredentialsDetails,
  PracticeDetails,
  SpecialtiesDetails,
  VerificationDetails,
  ReviewDetails,
} from './registration';

const RegisterCA = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formError, setFormError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [professionalTermsAccepted, setProfessionalTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialValues);

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

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleFileUpload = (field, file) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file }));
    setFormData((prev) => ({ ...prev, [field]: file?.name || '' }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setFormError('Please fix the errors before continuing.');
      return;
    }

    setErrors({});
    setFormError('');
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    setFormError('');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepErrors = validateStep(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setFormError('Please fix the errors before submitting.');
      return;
    }

    setErrors({});
    setFormError('');
    setLoading(true);

    try {
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: 'ca',
        profile: formData,
        termsAccepted: true,
        privacyAccepted: true,
        professionalTermsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
      });

      if (result.success) {
        navigate('/ca/verification-pending');
      }
    } catch (error) {
      setFormError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );

      case 2:
        return (
          <ProfessionalDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 3:
        return (
          <FirmDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );

      case 4:
        return (
          <CredentialsDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        );

      case 5:
        return (
          <PracticeDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 6:
        return (
          <SpecialtiesDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 7:
        return (
          <VerificationDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        );

      case 8:
        return (
          <ReviewDetails
            formData={formData}
            errors={errors}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            privacyAccepted={privacyAccepted}
            setPrivacyAccepted={setPrivacyAccepted}
            professionalTermsAccepted={professionalTermsAccepted}
            setProfessionalTermsAccepted={setProfessionalTermsAccepted}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12'>
      <div className='container max-w-4xl mx-auto px-4'>
        <div className='text-center mb-8'>
          <Link to='/' className='inline-block'>
            <h1 className='text-3xl font-bold text-primary-600'>TaxVault</h1>
          </Link>
          <h2 className='text-2xl font-semibold text-gray-800 mt-4'>CA Registration</h2>
          <p className='text-gray-600 mt-2'>Join as a Chartered Accountant and grow your practice</p>
        </div>

        <VerificationNotice />
        <ProgressSteps currentStep={currentStep} />

        <Card className='shadow-xl'>
          <Card.Body className='p-8'>
            <form onSubmit={handleSubmit}>
              <ErrorAlert message={formError} />
              {renderStep()}

              <div className='flex justify-between mt-8'>
                {currentStep > 1 ? (
                  <button
                    type='button'
                    onClick={handlePrevious}
                    className='px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50'
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 8 ? (
                  <button
                    type='button'
                    onClick={handleNext}
                    className='ml-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600'
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type='submit'
                    disabled={loading}
                    className='ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RegisterCA;