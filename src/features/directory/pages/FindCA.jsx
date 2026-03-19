import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Phone,
  MessageCircle,
  ChevronRight,
  Navigation,
  X
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const FindCA = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    acceptingNewClients: 'all',
    specialization: 'all',
    distance: 50
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCA, setSelectedCA] = useState(null);

  // Mock data for CAs
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      firmName: 'Chen & Associates',
      user: { name: 'David Chen, CPA', id: 1 },
      rating: 4.8,
      reviewCount: 124,
      distance: 2.3,
      specializations: ['retail', 'franchise', 'small-business'],
      services: ['personal-tax', 'corporate-tax', 'gst-hst'],
      languages: ['english', 'mandarin'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Specializing in retail and franchise accounting with over 15 years of experience helping small businesses grow.',
      phone: '(416) 555-0123',
      website: 'www.chenassociates.ca'
    },
    {
      id: 2,
      firmName: 'Thompson Tax Solutions',
      user: { name: 'Sarah Thompson, CA', id: 2 },
      rating: 4.9,
      reviewCount: 89,
      distance: 3.7,
      specializations: ['restaurant', 'construction', 'payroll'],
      services: ['payroll', 'bookkeeping', 'gst-hst'],
      languages: ['english', 'french'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Former restaurant owner turned CA. I understand the unique challenges of the food industry.',
      phone: '(416) 555-0456',
      website: 'www.thompsontax.ca'
    },
    {
      id: 3,
      firmName: 'Patel Professional Corp',
      user: { name: 'Michael Patel, CPA', id: 3 },
      rating: 4.7,
      reviewCount: 156,
      distance: 5.1,
      specializations: ['gig-economy', 'rideshare', 'delivery'],
      services: ['personal-tax', 'gst-hst', 'bookkeeping'],
      languages: ['english', 'hindi'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Expert in gig economy taxes. I help Uber, Lyft, and DoorDash drivers maximize their deductions.',
      phone: '(416) 555-0789',
      website: 'www.patelcpa.ca'
    },
    {
      id: 4,
      firmName: 'Wong Financial',
      user: { name: 'Lisa Wong, CPA', id: 4 },
      rating: 4.9,
      reviewCount: 203,
      distance: 4.1,
      specializations: ['real-estate', 'property-management', 'investments'],
      services: ['corporate-tax', 'financial-planning', 'estate-planning'],
      languages: ['english', 'cantonese'],
      acceptingNewClients: false,
      verified: true,
      bio: 'Specializing in real estate investors and property managers.',
      phone: '(416) 555-0234',
      website: 'www.wongfinancial.ca'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Get user's location (optional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = () => {
    setLoading(true);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const filteredResults = searchResults.filter(ca => {
    if (filters.acceptingNewClients !== 'all') {
      const accepting = filters.acceptingNewClients === 'true';
      if (ca.acceptingNewClients !== accepting) return false;
    }
    if (filters.specialization !== 'all' && !ca.specializations.includes(filters.specialization)) return false;
    if (ca.distance > filters.distance) return false;
    return true;
  });

  const specializations = [
    { value: 'all', label: 'All Specializations' },
    { value: 'retail', label: 'Retail' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'construction', label: 'Construction' },
    { value: 'gig-economy', label: 'Gig Economy' },
    { value: 'rideshare', label: 'Rideshare' },
    { value: 'real-estate', label: 'Real Estate' }
  ];

  const getSpecializationLabel = (value) => {
    const spec = specializations.find(s => s.value === value);
    return spec ? spec.label : value;
  };

  const services = [
    { value: 'personal-tax', label: 'Personal Tax' },
    { value: 'corporate-tax', label: 'Corporate Tax' },
    { value: 'gst-hst', label: 'GST/HST' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'bookkeeping', label: 'Bookkeeping' },
    { value: 'financial-planning', label: 'Financial Planning' }
  ];

  const CADetailModal = ({ ca, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {ca.user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{ca.firmName}</h3>
                  <p className="text-gray-500">{ca.user?.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex items-center space-x-2">
              {ca.acceptingNewClients ? (
                <Badge variant="success">Accepting New Clients</Badge>
              ) : (
                <Badge variant="error">Not Accepting Clients</Badge>
              )}
              {ca.verified && <Badge variant="info">Verified</Badge>}
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= ca.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {ca.rating} ({ca.reviewCount} reviews)
              </span>
            </div>

            {/* Distance */}
            {ca.distance && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Navigation size={14} className="mr-1" />
                {ca.distance} km away
              </div>
            )}

            {/* Bio */}
            <p className="mt-4 text-gray-700">{ca.bio}</p>

            {/* Specializations */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {ca.specializations?.map(spec => (
                  <Badge key={spec} variant="info">
                    {getSpecializationLabel(spec)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {ca.services?.map(service => {
                  const s = services.find(s => s.value === service);
                  return (
                    <Badge key={service} variant="success">
                      {s ? s.label : service}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {ca.languages?.map(lang => (
                  <Badge key={lang} variant="gold">
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {ca.phone && (
                <a
                  href={`tel:${ca.phone}`}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <Phone size={18} className="text-primary-500 mr-2" />
                  <span>Call</span>
                </a>
              )}
              {ca.website && (
                <a
                  href={`https://${ca.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <Globe size={18} className="text-primary-500 mr-2" />
                  <span>Website</span>
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
              >
                <MessageCircle size={16} className="mr-2" />
                Message
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!ca.acceptingNewClients}
              >
                Request Connection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find a Chartered Accountant</h1>
          <p className="text-gray-500 mt-1">
            Connect with verified CAs who specialize in your industry
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter city or postal code"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              loading={loading}
            >
              <Search size={16} className="mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accepting Clients
                </label>
                <select
                  value={filters.acceptingNewClients}
                  onChange={(e) => setFilters({ ...filters, acceptingNewClients: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {specializations.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Distance (km)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={filters.distance}
                  onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Within {filters.distance} km</p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Searching for CAs near you...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <Card className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CAs found</h3>
            <p className="text-gray-500">Try adjusting your filters or search area</p>
          </Card>
        ) : (
          filteredResults.map((ca) => (
            <Card 
              key={ca.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCA(ca)}
            >
              <Card.Body>
                <div className="flex items-start">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary-600">
                      {ca.user?.name?.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{ca.firmName}</h3>
                        <p className="text-gray-500">{ca.user?.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {ca.acceptingNewClients ? (
                          <Badge variant="success">Accepting</Badge>
                        ) : (
                          <Badge variant="error">Not Accepting</Badge>
                        )}
                        {ca.verified && <Badge variant="info">Verified</Badge>}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= ca.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {ca.rating} ({ca.reviewCount} reviews)
                      </span>
                      {ca.distance && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{ca.distance} km away</span>
                        </>
                      )}
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ca.specializations?.slice(0, 3).map(spec => (
                        <Badge key={spec} variant="info" size="sm">
                          {getSpecializationLabel(spec)}
                        </Badge>
                      ))}
                      {ca.specializations?.length > 3 && (
                        <Badge variant="info" size="sm">+{ca.specializations.length - 3}</Badge>
                      )}
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ca.bio}</p>
                  </div>

                  <ChevronRight className="text-gray-400 ml-4" size={20} />
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* CA Detail Modal */}
      {selectedCA && (
        <CADetailModal
          ca={selectedCA}
          onClose={() => setSelectedCA(null)}
        />
      )}
    </div>
  );
};

export default FindCA;




