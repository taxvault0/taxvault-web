import ErrorField from './ErrorField';

const DAYS = [
  'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
];

const PracticeDetails = ({ formData, errors, handleChange }) => {
  const hoursOfOperation = formData.hoursOfOperation || {};

  const updateHours = (day, field, value) => {
    handleChange({
      target: {
        name: 'hoursOfOperation',
        value: {
          ...hoursOfOperation,
          [day]: {
            ...(hoursOfOperation[day] || { closed: false, start: '', end: '' }),
            [field]: value,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Practice Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours of Operation
        </label>

        <div className="space-y-3 border rounded-lg p-4">
          {DAYS.map((day) => {
            const config = hoursOfOperation[day] || {
              closed: false,
              start: '',
              end: '',
            };

            return (
              <div key={day} className="grid grid-cols-4 gap-3 items-center">
                <div>{day}</div>

                <label>
                  <input
                    type="checkbox"
                    checked={config.closed}
                    onChange={(e) =>
                      updateHours(day, 'closed', e.target.checked)
                    }
                  />
                  Closed
                </label>

                <input
                  type="time"
                  value={config.start}
                  disabled={config.closed}
                  onChange={(e) =>
                    updateHours(day, 'start', e.target.value)
                  }
                />

                <input
                  type="time"
                  value={config.end}
                  disabled={config.closed}
                  onChange={(e) =>
                    updateHours(day, 'end', e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>

        <ErrorField error={errors.hoursOfOperation} />
      </div>
    </div>
  );
};

export default PracticeDetails;