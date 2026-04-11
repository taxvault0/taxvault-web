import ErrorField from './ErrorField';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_HOURS = {
  Monday: { closed: false, start: '09:00', end: '17:00' },
  Tuesday: { closed: false, start: '09:00', end: '17:00' },
  Wednesday: { closed: false, start: '09:00', end: '17:00' },
  Thursday: { closed: false, start: '09:00', end: '17:00' },
  Friday: { closed: false, start: '09:00', end: '17:00' },
  Saturday: { closed: true, start: '', end: '' },
  Sunday: { closed: true, start: '', end: '' },
};

const PracticeDetails = ({ formData, errors, handleChange }) => {
  const hoursOfOperation = {
    ...DEFAULT_HOURS,
    ...(formData.hoursOfOperation || {}),
  };

  const updateHours = (day, field, value) => {
    const currentDay = hoursOfOperation[day] || DEFAULT_HOURS[day];

    let updatedDay = {
      ...currentDay,
      [field]: value,
    };

    if (field === 'closed' && value === true) {
      updatedDay = {
        ...updatedDay,
        start: '',
        end: '',
      };
    }

    if (field === 'closed' && value === false) {
      updatedDay = {
        ...updatedDay,
        start: currentDay.start || '09:00',
        end: currentDay.end || '17:00',
      };
    }

    handleChange({
      target: {
        name: 'hoursOfOperation',
        value: {
          ...hoursOfOperation,
          [day]: updatedDay,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Practice Information
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Set office hours clients can use to contact or book with your practice.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours of Operation
        </label>

        <div className="border rounded-xl overflow-hidden">
          <div className="hidden md:grid md:grid-cols-4 gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
            <div>Day</div>
            <div>Status</div>
            <div>Open</div>
            <div>Close</div>
          </div>

          <div className="divide-y">
            {DAYS.map((day) => {
              const config = hoursOfOperation[day] || DEFAULT_HOURS[day];

              return (
                <div
                  key={day}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 px-4 py-4 items-center"
                >
                  <div className="font-medium text-gray-800">{day}</div>

                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={config.closed}
                      onChange={(e) =>
                        updateHours(day, 'closed', e.target.checked)
                      }
                    />
                    <span>Closed</span>
                  </label>

                  <div>
                    <label className="block md:hidden text-xs font-medium text-gray-500 mb-1">
                      Open
                    </label>
                    <input
                      type="time"
                      value={config.start}
                      disabled={config.closed}
                      onChange={(e) =>
                        updateHours(day, 'start', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        config.closed
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block md:hidden text-xs font-medium text-gray-500 mb-1">
                      Close
                    </label>
                    <input
                      type="time"
                      value={config.end}
                      disabled={config.closed}
                      onChange={(e) =>
                        updateHours(day, 'end', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        config.closed
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Monday to Friday defaults to 09:00–17:00. Weekends default to closed.
        </p>

        <ErrorField error={errors.hoursOfOperation} />
      </div>
    </div>
  );
};

export default PracticeDetails;