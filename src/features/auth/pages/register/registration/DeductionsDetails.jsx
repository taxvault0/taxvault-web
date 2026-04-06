import React from 'react';
import FormField from './FormField';

const deductionOptions = [
  'RRSP',
  'FHSA',
  'TFSA',
  'Tuition',
  'Medical Expenses',
  'Charitable Donations',
  'Child Care Expenses',
  'Moving Expenses',
  'Union Dues',
  'Tool Expenses',
  'Home Office',
  'Vehicle Expenses',
];

const receiptOptions = [
  'Fuel',
  'Maintenance',
  'Parking / Tolls',
  'Meals',
  'Mobile / Internet',
  'Supplies',
  'Equipment',
  'Insurance',
  'Rent / Utilities',
  'Home Office',
  'Vehicle Expenses',
  'Professional Fees',
  'Other Receipts',
];

const ownerOptions = ['Primary Taxpayer', 'Spouse', 'Joint'];
const ownershipOptions = ['Owned', 'Financed', 'Leased'];
const mainUseOptions = ['Employment', 'Gig Work', 'Self-Employment', 'Business'];

const CardCheckbox = ({ checked, onChange, title }) => (
  <label className="cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="peer hidden" />
    <div
      className={`rounded-2xl border p-4 shadow-sm transition-colors duration-150 ${
        checked
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
    </div>
  </label>
);

const createVehicle = () => ({
  ownerPerson: '',
  ownershipType: '',
  mainUse: '',
  purchaseDate: '',
  purchasePrice: '',
  gstHstPaid: '',
});

const DeductionsDetails = ({ formData, setFormData, errors, handleChange }) => {
  const deductions = formData.deductions || {};
  const receiptTypes = formData.receiptTypes || {};
  const vehicles = formData.vehicles?.length ? formData.vehicles : [createVehicle()];

  const toggleDeduction = (key) => {
    setFormData((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [key]: !prev.deductions?.[key],
      },
    }));
  };

  const toggleReceiptType = (key) => {
    setFormData((prev) => ({
      ...prev,
      receiptTypes: {
        ...prev.receiptTypes,
        [key]: !prev.receiptTypes?.[key],
      },
    }));
  };

  const handleVehicleToggle = () => {
    setFormData((prev) => {
      const nextEnabled = !prev.vehiclePurchasedForWork;

      return {
        ...prev,
        vehiclePurchasedForWork: nextEnabled,
        vehicles: nextEnabled
          ? prev.vehicles?.length
            ? prev.vehicles
            : [createVehicle()]
          : [],
      };
    });
  };

  const handleVehicleFieldChange = (index, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nextVehicles = [...(prev.vehicles || [createVehicle()])];
      nextVehicles[index] = {
        ...nextVehicles[index],
        [name]: value,
      };

      return {
        ...prev,
        vehicles: nextVehicles,
      };
    });
  };

  const addVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [...(prev.vehicles || []), createVehicle()],
    }));
  };

  const removeVehicle = (index) => {
    setFormData((prev) => {
      const nextVehicles = [...(prev.vehicles || [])].filter((_, i) => i !== index);

      return {
        ...prev,
        vehicles: nextVehicles.length ? nextVehicles : [createVehicle()],
      };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Deductions & Credits
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {deductionOptions.map((item) => (
            <CardCheckbox
              key={item}
              checked={!!deductions[item]}
              onChange={() => toggleDeduction(item)}
              title={item}
            />
          ))}
        </div>
        {errors.deductions && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.deductions}</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Receipt Types</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {receiptOptions.map((item) => (
            <CardCheckbox
              key={item}
              checked={!!receiptTypes[item]}
              onChange={() => toggleReceiptType(item)}
              title={item}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-base font-semibold text-slate-900">Vehicle Use Details</h3>
        <p className="mb-4 text-sm text-slate-500">
          Vehicle purchased for work / business use
        </p>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={!!formData.vehiclePurchasedForWork}
            onChange={handleVehicleToggle}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">
              Vehicle purchased for work / business use
            </div>
            <div className="text-xs text-slate-500">
              Check this if the vehicle was purchased primarily for work, gig, or
              business-related use.
            </div>
          </div>
        </label>

        {formData.vehiclePurchasedForWork && (
          <div className="mt-5 space-y-5">
            {vehicles.map((vehicle, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Vehicle {index + 1}
                  </h4>

                  {vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label="Vehicle Owner"
                    name="ownerPerson"
                    value={vehicle.ownerPerson}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.ownerPerson`]}
                    isSelect
                    options={ownerOptions}
                  />

                  <FormField
                    label="Ownership Type"
                    name="ownershipType"
                    value={vehicle.ownershipType}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.ownershipType`]}
                    isSelect
                    options={ownershipOptions}
                  />

                  <FormField
                    label="Main Use"
                    name="mainUse"
                    value={vehicle.mainUse}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.mainUse`]}
                    isSelect
                    options={mainUseOptions}
                  />

                  <FormField
                    label="Purchase Date"
                    name="purchaseDate"
                    type="date"
                    value={vehicle.purchaseDate}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.purchaseDate`]}
                    maxDate={new Date()}
                  />

                  <FormField
                    label="Purchase Price"
                    name="purchasePrice"
                    value={vehicle.purchasePrice}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.purchasePrice`]}
                    placeholder="0.00"
                  />

                  <FormField
                    label="GST / HST Paid"
                    name="gstHstPaid"
                    value={vehicle.gstHstPaid}
                    onChange={(e) => handleVehicleFieldChange(index, e)}
                    error={errors[`vehicles.${index}.gstHstPaid`]}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVehicle}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              + Add Another Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeductionsDetails;