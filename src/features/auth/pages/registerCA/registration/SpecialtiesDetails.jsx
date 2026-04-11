import ErrorField from './ErrorField';

const TAX_SPECIALTIES = [
  'Personal Income Tax',
  'Corporate Tax Planning',
  'GST/HST Returns',
  'PST Returns',
  'QST Returns',
  'Payroll Remittances',
  'T2 Corporation Returns',
  'T1 Personal Returns',
  'T3 Trust Returns',
  'T4/T4A Preparation',
  'T5013 Partnership Returns',
  'Scientific Research & Experimental Development (SR&ED)',
  'Capital Gains Planning',
  'Estate Planning',
  'Tax Litigation',
  'Voluntary Disclosures',
  'Tax Audits',
  'CRA Representation',
];

const PROVINCIAL_SPECIALTIES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
  'Multiple Provinces',
  'All Provinces',
];

const ACCOUNTING_SOFTWARE = [
  'QuickBooks Online',
  'QuickBooks Desktop',
  'Xero',
  'Sage 50',
  'Sage Intacct',
  'FreshBooks',
  'Wave',
  'Oracle NetSuite',
  'Microsoft Dynamics',
  'SAP',
  'Other',
];

const TAX_SOFTWARE = [
  'Profile',
  'TaxPrep',
  'DT Max',
  'CanTax',
  'QuickTax',
  'TurboTax',
  'UFile',
  'TaxCycle',
  'CCH iFirm',
  'Other',
];

const SpecialtiesDetails = ({
  formData,
  errors,
  handleChange,
  handleArrayChange,
}) => {
  const toggleCheckboxArray = (field, value) => {
    handleArrayChange(field, value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Specialties & Technology
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Specialties
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TAX_SPECIALTIES.map((item) => (
            <label key={item} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={(formData.taxSpecialties || []).includes(item)}
                onChange={() => toggleCheckboxArray('taxSpecialties', item)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
        <ErrorField error={errors.taxSpecialties} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provincial Specialties
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PROVINCIAL_SPECIALTIES.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.provincialSpecialties || []).includes(item)}
                onChange={() =>
                  toggleCheckboxArray('provincialSpecialties', item)
                }
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-800">
          International & Advanced Specialties
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="internationalTax"
              checked={!!formData.internationalTax}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">International Tax</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="usTax"
              checked={!!formData.usTax}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">US Tax</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="crossBorder"
              checked={!!formData.crossBorder}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">Cross-Border</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="estatePlanning"
              checked={!!formData.estatePlanning}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">Estate Planning</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="corporateRestructuring"
              checked={!!formData.corporateRestructuring}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">
              Corporate Restructuring
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="mergersAcquisitions"
              checked={!!formData.mergersAcquisitions}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">
              Mergers & Acquisitions
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accounting Software
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ACCOUNTING_SOFTWARE.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.accountingSoftware || []).includes(item)}
                onChange={() => toggleCheckboxArray('accountingSoftware', item)}
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Software
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TAX_SOFTWARE.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.taxSoftware || []).includes(item)}
                onChange={() => toggleCheckboxArray('taxSoftware', item)}
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Practice Management Software
        </label>
        <input
          type="text"
          name="practiceManagementSoftware"
          value={formData.practiceManagementSoftware || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          placeholder="e.g. Karbon, Jetpack Workflow, Canopy"
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-800">Client Experience & Security</h4>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="offersPortalAccess"
            checked={!!formData.offersPortalAccess}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">Offers client portal access</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptsDigitalDocuments"
            checked={!!formData.acceptsDigitalDocuments}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            Accepts digital documents / e-signatures
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="usesEncryption"
            checked={!!formData.usesEncryption}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">Uses end-to-end encryption</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="twoFactorAuth"
            checked={!!formData.twoFactorAuth}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">Uses two-factor authentication</span>
        </label>
      </div>
    </div>
  );
};

export default SpecialtiesDetails;