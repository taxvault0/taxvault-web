import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { caRegistrationAPI } from 'services/api';
import {
  formatPhoneNumber,
  formatYear,
  formatCanadianPostalCode,
} from 'utils/validators';

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

const LOCAL_DRAFT_KEY = 'caRegistrationDraft';

const RegisterCA = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    ...initialValues,
    termsAccepted: initialValues?.termsAccepted || false,
    privacyAccepted: initialValues?.privacyAccepted || false,
    professionalTermsAccepted:
      initialValues?.professionalTermsAccepted || false,
  });

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData((prev) => ({
          ...prev,
          ...parsedDraft,
        }));
      }
    } catch (error) {
      console.error('Failed to load local CA draft:', error);
    }
  }, []);

  const saveLocalDraft = (data) => {
    try {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save local CA draft:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (['phone', 'alternatePhone', 'firmPhone'].includes(name)) {
      newValue = formatPhoneNumber(value);
    }

    if (name === 'yearAdmitted' || name === 'yearEstablished') {
      newValue = formatYear(value);
    }

    if (name === 'firmPostalCode') {
      newValue = formatCanadianPostalCode(value);
    }

    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : newValue,
      };
      saveLocalDraft(nextData);
      return nextData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => {
      const nextData = {
        ...prev,
        [field]:
          Array.isArray(prev[field]) && prev[field].includes(value)
            ? prev[field].filter((item) => item !== value)
            : [...(Array.isArray(prev[field]) ? prev[field] : []), value],
      };
      saveLocalDraft(nextData);
      return nextData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field, file) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file }));

    setFormData((prev) => {
      const nextData = {
        ...prev,
        [field]: file?.name || '',
      };
      saveLocalDraft(nextData);
      return nextData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const buildStepPayload = (step, data) => {
    switch (step) {
      case 1:
        return {
          accountInformation: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            primaryPhone: data.phone,
            alternatePhone: data.alternatePhone,
          },
        };

      case 2:
        return {
          professionalInformation: {
            caDesignation: data.caDesignation,
            caNumber: data.caNumber,
            provinceOfRegistration: data.provinceOfRegistration,
            yearAdmitted: data.yearAdmitted,
            yearsOfExperience: data.yearsOfExperience,
            firmName: data.firmName,
            firmWebsite: data.firmWebsite,
            areasOfExpertise: data.areasOfExpertise || [],
            languagesSpoken: data.languages || [],
            otherLanguage: data.otherLanguage || '',
          },
        };

      case 3:
        return {
          firmDetails: {
            firmAddress: data.firmAddress,
            city: data.firmCity,
            province: data.firmProvince,
            postalCode: data.firmPostalCode,
            country: data.firmCountry,
            firmPhone: data.firmPhone,
            firmEmail: data.firmEmail,
            firmSize: data.firmSize,
            numberOfPartners: data.numberOfPartners,
            numberOfStaff: data.numberOfStaff,
            yearEstablished: data.yearEstablished,
          },
        };

      case 4:
        return {
          professionalCredentials: {
            professionalLiabilityInsurance: {
              hasInsurance: data.professionalLiabilityInsurance,
              provider: data.insuranceProvider,
              policyNumber: data.policyNumber,
              coverageAmount: data.coverageAmount,
              expiryDate: data.expiryDate,
            },
            cpaMembership: {
              isMemberInGoodStanding: data.cpaMemberInGoodStanding,
              licenseVerificationNumber: data.licenseVerification || '',
            },
            peerReview: {
              completedWithinLast3Years: data.peerReviewCompleted,
              reviewDate: data.peerReviewDate,
              outcome: data.peerReviewOutcome,
            },
            disciplinaryHistory: {
              hasHistory: data.disciplinaryHistory,
              details: data.disciplinaryDetails,
            },
            criminalRecordCheck: {
              consentGiven: data.backgroundCheckConsent,
            },
          },
        };

      case 5:
        return {
          practiceInformation: {
            practiceType: data.practiceType,
            acceptingNewClients: data.acceptNewClients ?? true,
            primaryClientTypes: data.primaryClientType
              ? [data.primaryClientType]
              : [],
            averageClientsPerYear: data.averageClientsPerYear,
            minimumFee: data.minimumFee,
            maximumFee: data.maximumFee,
            serviceOfferings: [
              ...(data.offersVirtualServices ? ['virtual'] : []),
              ...(data.offersInPersonServices ? ['in_person'] : []),
            ],
            serviceRadiusKm: data.serviceRadius,
            hoursOfOperation: data.hoursOfOperation || {},
          },
        };

      case 6:
        return {
          specialtiesAndTechnology: {
            taxSpecialties: data.taxSpecialties || [],
            provincialSpecialties: data.provincialSpecialties || [],
            internationalSpecialties: [
              ...(data.internationalTax ? ['international_tax'] : []),
              ...(data.usTax ? ['us_tax'] : []),
              ...(data.crossBorder ? ['cross_border'] : []),
              ...(data.estatePlanning ? ['estate_planning'] : []),
              ...(data.corporateRestructuring
                ? ['corporate_restructuring']
                : []),
              ...(data.mergersAcquisitions ? ['mergers_acquisitions'] : []),
            ],
            accountingSoftware: data.accountingSoftware || [],
            taxSoftware: data.taxSoftware || [],
            practiceManagementSoftware:
              data.practiceManagementSoftware || '',
            clientPortalAccess: data.offersPortalAccess || false,
            digitalDocumentSigning: data.acceptsDigitalDocuments || false,
            endToEndEncryption: data.usesEncryption || false,
            twoFactorAuthentication: data.twoFactorAuth || false,
          },
        };

      case 7:
        return {
          verificationAndDocuments: {
            professionalReferences: data.professionalReferences || [],
            authorizeTaxVaultVerification:
              data.authorizeVerification || false,
            consentBackgroundCheck: data.backgroundCheckConsent || false,
          },
        };

      case 8:
        return {
          reviewAndSubmit: {
            agreedTermsAndConditions: data.termsAccepted || false,
            agreedPrivacyPolicy: data.privacyAccepted || false,
            agreedProfessionalTerms:
              data.professionalTermsAccepted || false,
            confirmAccuracy: true,
          },
        };

      default:
        return {};
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
      saveLocalDraft(formData);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to continue:', error);
      setFormError('Failed to continue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    saveLocalDraft(formData);
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
      const registrationResult = await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'ca',
        userType: 'professional',
        phoneNumber: formData.phone,
        province:
          formData.firmProvince ||
          formData.provinceOfRegistration ||
          'ON',
        firmName: formData.firmName,
        caNumber: formData.caNumber,
      });

      if (!registrationResult?.success) {
        throw new Error(
          registrationResult?.error ||
            'Unable to create account before submission'
        );
      }

      const stepPayloads = [
        buildStepPayload(1, formData),
        buildStepPayload(2, formData),
        buildStepPayload(3, formData),
        buildStepPayload(4, formData),
        buildStepPayload(5, formData),
        buildStepPayload(6, formData),
        buildStepPayload(7, formData),
      ];

      for (const payload of stepPayloads) {
        await caRegistrationAPI.saveDraft(payload);
      }

      const finalPayload = buildStepPayload(8, formData);
      await caRegistrationAPI.submit(finalPayload);

      localStorage.removeItem(LOCAL_DRAFT_KEY);
      navigate('/ca/verification-pending');
    } catch (error) {
      console.error('Registration failed:', error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.'
      );
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
            termsAccepted={formData.termsAccepted}
            setTermsAccepted={(value) =>
              setFormData((prev) => {
                const nextData = { ...prev, termsAccepted: value };
                saveLocalDraft(nextData);
                return nextData;
              })
            }
            privacyAccepted={formData.privacyAccepted}
            setPrivacyAccepted={(value) =>
              setFormData((prev) => {
                const nextData = { ...prev, privacyAccepted: value };
                saveLocalDraft(nextData);
                return nextData;
              })
            }
            professionalTermsAccepted={formData.professionalTermsAccepted}
            setProfessionalTermsAccepted={(value) =>
              setFormData((prev) => {
                const nextData = {
                  ...prev,
                  professionalTermsAccepted: value,
                };
                saveLocalDraft(nextData);
                return nextData;
              })
            }
            setConfirmAccuracy={(value) =>
              setFormData((prev) => {
                const nextData = { ...prev, confirmAccuracy: value };
                saveLocalDraft(nextData);
                return nextData;
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">
              TaxVault
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            CA Registration
          </h2>
          <p className="text-gray-600 mt-2">
            Join as a Chartered Accountant and grow your practice
          </p>
        </div>

        <VerificationNotice />
        <ProgressSteps currentStep={currentStep} />

        <Card className="shadow-xl">
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit}>
              <ErrorAlert message={formError} />
              {renderStep()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="ml-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Next'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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