import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { caRegistrationAPI } from 'services/api';
import { formatPhoneNumber, formatYear } from 'utils/validators';

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
  const [saving, setSaving] = useState(false);
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

  let newValue = value;

  // 📞 Phone formatting
  if (['phone', 'alternatePhone', 'firmPhone'].includes(name)) {
    newValue = formatPhoneNumber(value);
  }

  // 📅 Limit year fields
  if (name === 'yearAdmitted' || name === 'yearEstablished') {
    newValue = formatYear(value);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : newValue,
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

  const saveDraft = async (section, data) => {
    await caRegistrationAPI.saveDraft({
      [section]: data,
    });
  };

  const getStepPayload = (step) => {
    switch (step) {
      case 1:
        return {
          section: 'accountInformation',
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            alternatePhone: formData.alternatePhone,
          },
        };

      case 2:
        return {
          section: 'professionalInformation',
          data: {
            caDesignation: formData.caDesignation,
            caNumber: formData.caNumber,
            provinceOfRegistration: formData.provinceOfRegistration,
            yearAdmitted: formData.yearAdmitted,
            firmName: formData.firmName,
            firmWebsite: formData.firmWebsite,
            yearsOfExperience: formData.yearsOfExperience,
            areasOfExpertise: formData.areasOfExpertise,
            languages: formData.languages,
            professionalDesignations: formData.professionalDesignations,
          },
        };

      case 3:
        return {
          section: 'businessInformation',
          data: {
            firmAddress: formData.firmAddress,
            firmCity: formData.firmCity,
            firmProvince: formData.firmProvince,
            firmPostalCode: formData.firmPostalCode,
            firmCountry: formData.firmCountry,
            firmPhone: formData.firmPhone,
            firmEmail: formData.firmEmail,
            firmSize: formData.firmSize,
            numberOfPartners: formData.numberOfPartners,
            numberOfStaff: formData.numberOfStaff,
            yearEstablished: formData.yearEstablished,
          },
        };

      case 4:
        return {
          section: 'documents',
          data: {
            professionalLiabilityInsurance: formData.professionalLiabilityInsurance,
            insuranceProvider: formData.insuranceProvider,
            policyNumber: formData.policyNumber,
            coverageAmount: formData.coverageAmount,
            expiryDate: formData.expiryDate,
            peerReviewCompleted: formData.peerReviewCompleted,
            peerReviewDate: formData.peerReviewDate,
            peerReviewOutcome: formData.peerReviewOutcome,
            peerReviewBody: formData.peerReviewBody,
            cpaMemberInGoodStanding: formData.cpaMemberInGoodStanding,
            licenseVerification: formData.licenseVerification,
            disciplinaryHistory: formData.disciplinaryHistory,
            disciplinaryDetails: formData.disciplinaryDetails,
            criminalRecordCheck: formData.criminalRecordCheck,
            backgroundCheckConsent: formData.backgroundCheckConsent,
            insuranceCertificate: formData.insuranceCertificate,
            peerReviewReport: formData.peerReviewReport,
          },
        };

      case 5:
        return {
          section: 'practiceInformation',
          data: {
            practiceType: formData.practiceType,
            clientIndustries: formData.clientIndustries,
            averageClientsPerYear: formData.averageClientsPerYear,
            minimumFee: formData.minimumFee,
            maximumFee: formData.maximumFee,
            acceptsCRA: formData.acceptsCRA,
            offersVirtualServices: formData.offersVirtualServices,
            offersInPersonServices: formData.offersInPersonServices,
            serviceRadius: formData.serviceRadius,
            hoursOfOperation: formData.hoursOfOperation,
            weekendAvailability: formData.weekendAvailability,
            emergencyContact: formData.emergencyContact,
            primaryClientType: formData.primaryClientType,
            averageClientSize: formData.averageClientSize,
            smallestClientRevenue: formData.smallestClientRevenue,
            largestClientRevenue: formData.largestClientRevenue,
            nonprofitClients: formData.nonprofitClients,
            indigenousClients: formData.indigenousClients,
            newcomerClients: formData.newcomerClients,
          },
        };

      case 6:
        return {
          section: 'specialties',
          data: {
            taxSpecialties: formData.taxSpecialties,
            provincialSpecialties: formData.provincialSpecialties,
            internationalTax: formData.internationalTax,
            usTax: formData.usTax,
            crossBorder: formData.crossBorder,
            estatePlanning: formData.estatePlanning,
            corporateRestructuring: formData.corporateRestructuring,
            mergersAcquisitions: formData.mergersAcquisitions,
            accountingSoftware: formData.accountingSoftware,
            taxSoftware: formData.taxSoftware,
            practiceManagementSoftware: formData.practiceManagementSoftware,
            offersPortalAccess: formData.offersPortalAccess,
            acceptsDigitalDocuments: formData.acceptsDigitalDocuments,
            usesEncryption: formData.usesEncryption,
            twoFactorAuth: formData.twoFactorAuth,
            billingMethod: formData.billingMethod,
            acceptsCreditCard: formData.acceptsCreditCard,
            acceptsInterac: formData.acceptsInterac,
            acceptsCheque: formData.acceptsCheque,
            paymentPlans: formData.paymentPlans,
            flatFees: formData.flatFees,
            hourlyRates: formData.hourlyRates,
            contingencyFees: formData.contingencyFees,
            professionalMemberships: formData.professionalMemberships,
            localChapter: formData.localChapter,
            committeeMemberships: formData.committeeMemberships,
            conferenceAttendance: formData.conferenceAttendance,
            continuingEducation: formData.continuingEducation,
            cpdHours: formData.cpdHours,
          },
        };

      case 7:
        return {
          section: 'verification',
          data: {
            professionalReferences: formData.professionalReferences,
            clientReferences: formData.clientReferences,
            authorizeVerification: formData.authorizeVerification,
            backgroundCheckConsent: formData.backgroundCheckConsent,
            profilePublic: formData.profilePublic,
            acceptNewClients: formData.acceptNewClients,
            featuredProfessional: formData.featuredProfessional,
            receiveReferrals: formData.receiveReferrals,
            newsletterSubscribed: formData.newsletterSubscribed,
            caCertificate: formData.caCertificate,
            insuranceCertificate: formData.insuranceCertificate,
            peerReviewReport: formData.peerReviewReport,
            criminalRecordCheckDocument: formData.criminalRecordCheckDocument,
            professionalHeadshot: formData.professionalHeadshot,
            firmLogo: formData.firmLogo,
          },
        };

      default:
        return null;
    }
  };

  const handleNext = async () => {
    const stepErrors = validateStep(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setFormError('Please fix the errors before continuing.');
      return;
    }

    setErrors({});
    setFormError('');

    try {
      setSaving(true);

      const payload = getStepPayload(currentStep);

      if (payload) {
        console.log('Saving draft:', payload);
        await saveDraft(payload.section, payload.data);
      }

      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to save draft:', error);
      setFormError('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
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
      console.error('Registration failed:', error);
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
                    disabled={saving}
                    className='ml-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50'
                  >
                    {saving ? 'Saving...' : 'Next'}
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