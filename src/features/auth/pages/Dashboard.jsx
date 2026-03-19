import { Link } from 'react-router-dom';
import { MapPin, Star, ChevronRight, UserPlus } from 'lucide-react';

// Add this after Quick Actions section, before Recent Receipts
{/* Find a CA Section */}
<Card className="border-primary-200 bg-primary-50">
  <Card.Body>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <UserPlus className="text-primary-600 mr-2" size={24} />
        <h3 className="font-semibold text-primary-800">Find a Chartered Accountant</h3>
      </div>
      <Link to="/find-ca" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
        View All
        <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
    
    <p className="text-sm text-primary-600 mb-4">
      Connect with verified CAs who specialize in your industry
    </p>
    
    {/* Nearby CAs Preview */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CA Card 1 */}
      <Link to="/find-ca/1" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600">DC</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">David Chen, CPA</p>
            <p className="text-xs text-gray-500">Chen & Associates</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>2.3 km away</span>
          <div className="flex items-center ml-3">
            <Star size={14} className="text-gold fill-current" />
            <span className="ml-1">4.8 (124)</span>
          </div>
        </div>
        <Badge variant="success" size="sm">Accepting Clients</Badge>
      </Link>

      {/* CA Card 2 */}
      <Link to="/find-ca/2" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600">ST</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">Sarah Thompson, CA</p>
            <p className="text-xs text-gray-500">Thompson Tax Solutions</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>3.7 km away</span>
          <div className="flex items-center ml-3">
            <Star size={14} className="text-gold fill-current" />
            <span className="ml-1">4.9 (89)</span>
          </div>
        </div>
        <Badge variant="success" size="sm">Accepting Clients</Badge>
      </Link>

      {/* CA Card 3 */}
      <Link to="/find-ca/3" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600">MP</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">Michael Patel, CPA</p>
            <p className="text-xs text-gray-500">Patel Professional Corp</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>5.1 km away</span>
          <div className="flex items-center ml-3">
            <Star size={14} className="text-gold fill-current" />
            <span className="ml-1">4.7 (156)</span>
          </div>
        </div>
        <Badge variant="success" size="sm">Accepting Clients</Badge>
      </Link>
    </div>
  </Card.Body>
</Card>






