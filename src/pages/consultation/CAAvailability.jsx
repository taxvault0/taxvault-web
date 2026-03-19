import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, Phone, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CAAvailability = () => {
  const { caId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Mock CA data
  const caData = {
    id: caId,
    name: 'Jane Smith, CA',
    firm: 'Smith & Associates',
    rating: 4.9,
    reviews: 127,
    specialties: ['Small Business', 'Gig Workers', 'Rental Income'],
    hourlyRate: 150,
    location: 'Toronto, ON',
    virtualAvailable: true,
    inPersonAvailable: true
  };

  // Mock availability data
  const availability = {
    '2024-03-20': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '2024-03-21': ['09:00', '10:00', '13:00', '14:00', '16:00'],
    '2024-03-22': ['10:00', '11:00', '14:00', '15:00'],
    '2024-03-23': ['09:00', '10:00', '11:00'],
  };

  const dates = Object.keys(availability);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookConsultation = () => {
    if (selectedDate && selectedTime) {
      navigate(`/consultations/request/${caId}`, {
        state: { date: selectedDate, time: selectedTime }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to search results
      </button>

      {/* CA Info Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-white border border-primary-100">
        <Card.Body>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{caData.name}</h1>
              <p className="text-gray-600 mt-1">{caData.firm}</p>
              
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm font-medium">{caData.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({caData.reviews} reviews)</span>
                </div>
                <div className="text-sm text-gray-500">
                  <MapPin size={14} className="inline mr-1" />
                  {caData.location}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {caData.specialties.map((specialty, index) => (
                  <Badge key={index} variant="info">{specialty}</Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 mt-4">
                {caData.virtualAvailable && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Video size={16} className="text-primary-500 mr-1" />
                    Virtual consultations available
                  </div>
                )}
                {caData.inPersonAvailable && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="text-primary-500 mr-1" />
                    In-person available
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">${caData.hourlyRate}</p>
              <p className="text-sm text-gray-500">per hour</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Availability Calendar */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary-500" />
            Select a Date & Time
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Available Dates</h3>
              <div className="space-y-2">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedDate === date
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString('en-CA', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-sm text-gray-500">
                        {availability[date].length} slots
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Available Times</h3>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-2">
                  {availability[selectedDate]?.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                      }`}
                    >
                      <Clock size={14} className="inline mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-400">Select a date first</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking summary */}
          {selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected appointment:</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-CA', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    with {caData.name} • ${caData.hourlyRate}/hour
                  </p>
                </div>
                <Button
                  onClick={handleBookConsultation}
                  className="ml-4"
                >
                  Continue to Book
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Consultation Info */}
      <Card className="bg-gray-50">
        <Card.Body>
          <h3 className="font-medium text-gray-900 mb-2">What to expect</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
              Initial consultation lasts 60 minutes
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
              Discuss your tax situation and ask questions
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
              Receive a summary of recommendations
            </li>
            <li className="flex items-start">
              <XCircle size={16} className="text-warning-500 mr-2 mt-0.5" />
              Free cancellation up to 24 hours before
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CAAvailability;