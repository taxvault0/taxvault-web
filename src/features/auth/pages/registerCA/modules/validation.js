import {
  isStrongPassword,
  isValidPhone,
  isValidCALicense,
  isValidPolicyNumber,
} from 'utils/validators';

export const validateStep = (step, formData) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  switch (step) {
    case 1: {
      if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';

      if (!formData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (!isStrongPassword(formData.password)) {
        errors.password =
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.phone?.trim()) {
        errors.phone = 'Phone is required';
      } else if (!isValidPhone(formData.phone)) {
        errors.phone = 'Phone must be in format (###) ###-####';
      }

      if (formData.alternatePhone && !isValidPhone(formData.alternatePhone)) {
        errors.alternatePhone = 'Phone must be in format (###) ###-####';
      }

      break;
    }

    case 2: {
      if (!formData.caDesignation) errors.caDesignation = 'Required';

      if (!formData.caNumber?.trim()) {
        errors.caNumber = 'Required';
      } else if (!isValidCALicense(formData.caNumber)) {
        errors.caNumber = 'Invalid CA / license number format';
      }

      if (!formData.provinceOfRegistration) errors.provinceOfRegistration = 'Required';

      if (!formData.yearAdmitted) {
        errors.yearAdmitted = 'Required';
      } else if (!/^\d{4}$/.test(formData.yearAdmitted)) {
        errors.yearAdmitted = 'Year admitted must be 4 digits';
      } else if (
        Number(formData.yearAdmitted) < 1950 ||
        Number(formData.yearAdmitted) > currentYear
      ) {
        errors.yearAdmitted = `Year must be between 1950 and ${currentYear}`;
      }

      if (
        formData.yearsOfExperience === '' ||
        formData.yearsOfExperience === null ||
        formData.yearsOfExperience === undefined
      ) {
        errors.yearsOfExperience = 'Required';
      } else {
        const yearAdmitted = Number(formData.yearAdmitted);
        const yearsOfExperience = Number(formData.yearsOfExperience);

        if (Number.isNaN(yearsOfExperience) || yearsOfExperience < 0) {
          errors.yearsOfExperience = 'Invalid years of experience';
        } else if (!Number.isNaN(yearAdmitted)) {
          const maxExperience = currentYear - yearAdmitted;
          if (yearsOfExperience > maxExperience) {
            errors.yearsOfExperience =
              'Years of experience cannot be more than years since admitted';
          }
        }
      }

      if (!formData.firmName?.trim()) errors.firmName = 'Required';

      if (formData.languages?.includes('Other') && !formData.otherLanguage?.trim()) {
        errors.otherLanguage = 'Please enter the other language';
      }

      break;
    }

    case 3: {
      if (!formData.firmAddress?.trim()) errors.firmAddress = 'Required';
      if (!formData.firmCity?.trim()) errors.firmCity = 'Required';
      if (!formData.firmProvince?.trim()) errors.firmProvince = 'Required';
      if (!formData.firmPostalCode?.trim()) errors.firmPostalCode = 'Required';

      if (!formData.firmPhone?.trim()) {
        errors.firmPhone = 'Required';
      } else if (!isValidPhone(formData.firmPhone)) {
        errors.firmPhone = 'Phone must be in format (###) ###-####';
      }

      if (!formData.firmEmail?.trim()) {
        errors.firmEmail = 'Required';
      } else if (!/\S+@\S+\.\S+/.test(formData.firmEmail)) {
        errors.firmEmail = 'Invalid email';
      }

      break;
    }

    case 4: {
      if (formData.professionalLiabilityInsurance) {
        if (!formData.insuranceProvider?.trim()) {
          errors.insuranceProvider = 'Required';
        }

        if (!formData.policyNumber?.trim()) {
          errors.policyNumber = 'Required';
        } else if (!isValidPolicyNumber(formData.policyNumber)) {
          errors.policyNumber = 'Invalid policy number format';
        }

        if (!formData.expiryDate) {
          errors.expiryDate = 'Required';
        }
      }

      if (formData.peerReviewCompleted && !formData.peerReviewDate) {
        errors.peerReviewDate = 'Peer review date is required';
      }

      break;
    }

    case 5: {
      if (formData.hoursOfOperation && typeof formData.hoursOfOperation === 'object') {
        for (const [day, value] of Object.entries(formData.hoursOfOperation)) {
          if (!value?.closed) {
            if (!value?.start || !value?.end) {
              errors.hoursOfOperation = `${day}: start and end time required`;
              break;
            }

            if (value.start >= value.end) {
              errors.hoursOfOperation = `${day}: end time must be after start time`;
              break;
            }
          }
        }
      }
      break;
    }

    case 8:
      break;

    default:
      break;
  }

  return errors;
};