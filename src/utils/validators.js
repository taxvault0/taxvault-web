import * as Yup from 'yup';

// Login validation
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

// User registration validation
export const userRegisterSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string().required('Phone number is required'),
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



