export const validateStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1:
      if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';

      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.phone) errors.phone = 'Phone is required';
      break;

    case 2:
      if (!formData.caDesignation) errors.caDesignation = 'Required';
      if (!formData.caNumber) errors.caNumber = 'Required';
      if (!formData.provinceOfRegistration) errors.provinceOfRegistration = 'Required';
      if (!formData.yearAdmitted) errors.yearAdmitted = 'Required';
      if (!formData.yearsOfExperience) errors.yearsOfExperience = 'Required';
      if (!formData.firmName) errors.firmName = 'Required';
      break;

    case 3:
      if (!formData.firmAddress) errors.firmAddress = 'Required';
      if (!formData.firmCity) errors.firmCity = 'Required';
      if (!formData.firmProvince) errors.firmProvince = 'Required';
      if (!formData.firmPostalCode) errors.firmPostalCode = 'Required';
      if (!formData.firmPhone) errors.firmPhone = 'Required';

      if (!formData.firmEmail) {
        errors.firmEmail = 'Required';
      } else if (!/\S+@\S+\.\S+/.test(formData.firmEmail)) {
        errors.firmEmail = 'Invalid email';
      }
      break;

    case 8:
      // 🔥 IMPORTANT FIX (your current bug)
      // You're NOT using formData for these — you're using state
      // so this check will NOT work

      // we will handle this in RegisterCA instead
      break;

    default:
      break;
  }

  return errors;
};