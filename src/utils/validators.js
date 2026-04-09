import * as Yup from 'yup';

const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
const caLicenseRegex = /^[A-Z0-9][A-Z0-9-]{4,14}$/;
const policyNumberRegex = /^[A-Z0-9][A-Z0-9/-]{5,19}$/;

const currentYear = new Date().getFullYear();

const strongPassword = Yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
  .matches(/\d/, 'Password must contain at least 1 number')
  .matches(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character');

const phoneField = Yup.string()
  .required('Phone number is required')
  .matches(phoneRegex, 'Phone must be in format (###) ###-####');

const optionalPhoneField = Yup.string()
  .nullable()
  .test(
    'valid-phone',
    'Phone must be in format (###) ###-####',
    (value) => !value || phoneRegex.test(value)
  );

// Login validation
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

// User registration validation
export const userRegisterSchema = Yup.object({
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: strongPassword,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone: phoneField,
  userType: Yup.string().required('User type is required')
});

// Receipt validation
export const receiptSchema = Yup.object({
  vendor: Yup.string().required('Vendor is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date().required('Date is required'),
  category: Yup.string().required('Category is required'),
  gst: Yup.number().min(0, 'GST cannot be negative')
});

// Mileage trip validation
export const tripSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  distance: Yup.number()
    .positive('Distance must be positive')
    .required('Distance is required'),
  purpose: Yup.string()
    .oneOf(['business', 'commute', 'personal'])
    .required('Purpose is required'),
  startLocation: Yup.string().required('Start location is required'),
  endLocation: Yup.string().required('End location is required')
});

// =========================
// CA REGISTRATION SCHEMAS
// =========================

// Step 1 - Account
export const caRegisterStep1Schema = Yup.object({
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: strongPassword,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm your password'),
  phone: phoneField,
  alternatePhone: optionalPhoneField
});

// Step 2 - Professional
export const caRegisterStep2Schema = Yup.object({
  caDesignation: Yup.string().required('Required'),
  caNumber: Yup.string()
    .trim()
    .uppercase()
    .matches(caLicenseRegex, 'Invalid CA / license number format')
    .required('Required'),
  provinceOfRegistration: Yup.string().required('Required'),
  yearAdmitted: Yup.string()
    .required('Required')
    .matches(/^\d{4}$/, 'Year admitted must be 4 digits')
    .test(
      'year-range',
      `Year must be between 1950 and ${currentYear}`,
      (value) => {
        const year = Number(value);
        return year >= 1950 && year <= currentYear;
      }
    ),
  yearsOfExperience: Yup.number()
    .typeError('Required')
    .required('Required')
    .min(0, 'Years of experience cannot be negative')
    .test(
      'experience-vs-admitted',
      'Years of experience cannot be more than years since admitted',
      function (value) {
        const { yearAdmitted } = this.parent;
        if (value === undefined || value === null || !yearAdmitted) return true;
        const maxExperience = currentYear - Number(yearAdmitted);
        return value <= maxExperience;
      }
    ),
  firmName: Yup.string().trim().required('Required'),
  otherLanguage: Yup.string().when('languages', {
    is: (languages) => Array.isArray(languages) && languages.includes('Other'),
    then: (schema) => schema.trim().required('Please enter the other language'),
    otherwise: (schema) => schema.notRequired()
  })
});

// Step 3 - Firm
export const caRegisterStep3Schema = Yup.object({
  firmAddress: Yup.string().trim().required('Required'),
  firmCity: Yup.string().trim().required('Required'),
  firmProvince: Yup.string().trim().required('Required'),
  firmPostalCode: Yup.string().trim().required('Required'),
  firmPhone: phoneField,
  firmEmail: Yup.string()
    .email('Invalid email')
    .required('Required')
});

// Step 4 - Credentials
export const caRegisterStep4Schema = Yup.object({
  insuranceProvider: Yup.string().when('professionalLiabilityInsurance', {
    is: true,
    then: (schema) => schema.trim().required('Required'),
    otherwise: (schema) => schema.notRequired()
  }),
  policyNumber: Yup.string().when('professionalLiabilityInsurance', {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .uppercase()
        .matches(policyNumberRegex, 'Invalid policy number format')
        .required('Required'),
    otherwise: (schema) => schema.notRequired()
  }),
  expiryDate: Yup.string().when('professionalLiabilityInsurance', {
    is: true,
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired()
  }),
  peerReviewDate: Yup.string().when('peerReviewCompleted', {
    is: true,
    then: (schema) => schema.required('Peer review date is required'),
    otherwise: (schema) => schema.notRequired()
  })
});

// Step 5 - Practice
export const caRegisterStep5Schema = Yup.object({
  hoursOfOperation: Yup.object().test(
    'valid-hours',
    'Each open day must have a valid start and end time',
    (value) => {
      if (!value || typeof value !== 'object') return true;

      return Object.values(value).every((day) => {
        if (!day?.closed) {
          if (!day?.start || !day?.end) return false;
          if (day.start >= day.end) return false;
        }
        return true;
      });
    }
  )
});

// Step 6 - optional / specialties
export const caRegisterStep6Schema = Yup.object({});

// Step 7 - verification
export const caRegisterStep7Schema = Yup.object({
  authorizeVerification: Yup.boolean().oneOf(
    [true],
    'You must authorize verification of your credentials'
  )
});

// Step 8 terms usually live outside formData state,
// so keep that validation in component logic unless you move them into form values.
export const caRegisterStep8Schema = Yup.object({});

export const caRegisterSchemas = {
  1: caRegisterStep1Schema,
  2: caRegisterStep2Schema,
  3: caRegisterStep3Schema,
  4: caRegisterStep4Schema,
  5: caRegisterStep5Schema,
  6: caRegisterStep6Schema,
  7: caRegisterStep7Schema,
  8: caRegisterStep8Schema,
};