import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Percent, 
  Calendar, 
  Download, 
  Send,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const GSTDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  const gstData = {
    gstNumber: '123456789RT0001',
    filingFrequency: 'quarterly',
    nextFilingDate: '2024-04-30',
    lastFiledDate: '2024-01-31',
    collectedYTD: 1250.75,
    paidYTD: 450.50,
    netPayable: 800.25,
    quarters: [
      { period: 'Q1 2024', collected: 1250.75, paid: 450.50, status: 'pending', dueDate: '2024-04-30' },
      { period: 'Q4 2023', collected: 980.25, paid: 320.75, status: 'filed', filedDate: '2024-01-15' },
      { period: 'Q3 2023', collected: 1120.50, paid: 380.25, status: 'filed', filedDate: '2023-10-12' },
      { period: 'Q2 2023', collected: 1050.30, paid: 340.20, status: 'filed', filedDate: '2023-07-18' },
    ]
  };

  const years = [2024, 2023, 2022, 2021];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST/HST Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and file your GST/HST returns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Send size={16} className="mr-2" />
            File Return
          </Button>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center space-x-2">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedYear === year
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* GST Registration Card */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <Percent className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">GST/HST Number</p>
                <p className="text-xl font-bold text-primary-600">{gstData.gstNumber}</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Filing Frequency</p>
              <p className="font-medium capitalize">{gstData.filingFrequency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Next Filing</p>
              <p className="font-medium text-warning-600">{gstData.nextFilingDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Filed</p>
              <p className="font-medium">{gstData.lastFiledDate}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">GST Collected (YTD)</p>
            <p className="text-2xl font-bold text-success-600 mt-1">
              ${gstData.collectedYTD.toFixed(2)}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">ITCs Claimed (YTD)</p>
            <p className="text-2xl font-bold text-info-600 mt-1">
              ${gstData.paidYTD.toFixed(2)}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Net Payable (YTD)</p>
            <p className="text-2xl font-bold text-warning-600 mt-1">
              ${gstData.netPayable.toFixed(2)}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Quarterly Breakdown */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Quarterly Breakdown</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {gstData.quarters.map((quarter, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <h4 className="font-medium">{quarter.period}</h4>
                  </div>
                  <Badge variant={quarter.status === 'filed' ? 'success' : 'warning'}>
                    {quarter.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Collected</p>
                    <p className="font-semibold">${quarter.collected.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ITCs</p>
                    <p className="font-semibold">${quarter.paid.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Net</p>
                    <p className="font-semibold text-warning-600">
                      ${(quarter.collected - quarter.paid).toFixed(2)}
                    </p>
                  </div>
                </div>

                {quarter.status === 'pending' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-warning-600">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">Due: {quarter.dueDate}</span>
                    </div>
                    <Button size="sm">File Now</Button>
                  </div>
                ) : (
                  <div className="flex items-center text-success-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">Filed on {quarter.filedDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Resources */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">GST/HST Filing Requirements</h4>
              <p className="text-sm text-info-600 mt-1">
                As a gig worker, you must file GST/HST returns quarterly if you're registered. 
                Returns are due within one month after the end of each quarter.
              </p>
              <a 
                href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-info-700 font-medium mt-2 hover:underline"
              >
                Learn more on CRA website
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GSTDashboard;