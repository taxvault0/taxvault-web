export const initialValues = {
  // Account Information
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  alternatePhone: '',

  // Professional Information
  caDesignation: '',
  caNumber: '',
  provinceOfRegistration: '',
  yearAdmitted: '',
  firmName: '',
  firmWebsite: '',
  yearsOfExperience: '',
  areasOfExpertise: [],
  languages: [],
  professionalDesignations: [],

  // Firm Information
  firmAddress: '',
  firmCity: '',
  firmProvince: '',
  firmPostalCode: '',
  firmCountry: 'Canada',
  firmPhone: '',
  firmEmail: '',
  firmSize: '',
  numberOfPartners: '',
  numberOfStaff: '',
  yearEstablished: '',

  // Professional Credentials
  professionalLiabilityInsurance: false,
  insuranceProvider: '',
  policyNumber: '',
  coverageAmount: '',
  expiryDate: '',
  peerReviewCompleted: false,
  peerReviewDate: '',
  peerReviewOutcome: '',
  peerReviewBody: '',

  // Regulatory Compliance
  cpaMemberInGoodStanding: false,
  licenseVerification: '',
  disciplinaryHistory: false,
  disciplinaryDetails: '',
  criminalRecordCheck: false,
  backgroundCheckConsent: false,

  // Practice Information
  practiceType: '',
  clientIndustries: [],
  averageClientsPerYear: '',
  minimumFee: '',
  maximumFee: '',
  acceptsCRA: false,
  offersVirtualServices: false,
  offersInPersonServices: true,
  serviceRadius: '',
  hoursOfOperation: '',
  weekendAvailability: false,
  emergencyContact: false,

  // Tax Specialties
  taxSpecialties: [],
  provincialSpecialties: [],
  internationalTax: false,
  usTax: false,
  crossBorder: false,
  estatePlanning: false,
  corporateRestructuring: false,
  mergersAcquisitions: false,

  // Client Demographics
  primaryClientType: [],
  averageClientSize: '',
  smallestClientRevenue: '',
  largestClientRevenue: '',
  nonprofitClients: false,
  indigenousClients: false,
  newcomerClients: false,

  // Technology & Tools
  accountingSoftware: [],
  taxSoftware: [],
  practiceManagementSoftware: '',
  offersPortalAccess: true,
  acceptsDigitalDocuments: true,
  usesEncryption: true,
  twoFactorAuth: true,

  // Billing & Payment
  billingMethod: '',
  acceptsCreditCard: false,
  acceptsInterac: false,
  acceptsCheque: true,
  paymentPlans: false,
  flatFees: false,
  hourlyRates: false,
  contingencyFees: false,

  // Professional Memberships
  professionalMemberships: [],
  localChapter: '',
  committeeMemberships: [],
  conferenceAttendance: false,
  continuingEducation: true,
  cpdHours: '',

  // References
  professionalReferences: [
    { name: '', email: '', phone: '', relationship: '', yearsKnown: '' }
  ],
  clientReferences: [
    { name: '', email: '', phone: '', company: '', yearsServed: '' }
  ],

  // Marketing Preferences
  profilePublic: true,
  acceptNewClients: true,
  featuredProfessional: false,
  receiveReferrals: true,
  newsletterSubscribed: true,

  // Verification Documents
  caCertificate: null,
  insuranceCertificate: null,
  peerReviewReport: null,
  criminalRecordCheck: null,
  professionalHeadshot: null,
  firmLogo: null,

  // Terms
  agreeToTerms: false,
  agreeToPrivacy: false,
  confirmAccuracy: false,
  authorizeVerification: false
};