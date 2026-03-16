import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  ArrowLeftIcon,
  DocumentIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  EnvelopeIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';
import { caAPI } from '../../services/api';
import StatsCard from '../../components/Common/StatsCard';
import DocumentCard from '../../components/Common/DocumentCard';

const ClientDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  const { data: client, isLoading } = useQuery(
    ['client', id, taxYear],
    () => caAPI.getClientDashboard(id, taxYear).then(res => res.data)
  );

  const tabs = [
    { name: 'Overview', id: 'overview' },
    { name: 'Receipts', id: 'receipts' },
    { name: 'Documents', id: 'documents' },
    { name: 'Mileage', id: 'mileage' },
    { name: 'Reports', id: 'reports' },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div>
        <Link to="/ca/clients" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Clients
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-medium text-primary-700">
                {client?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client?.name}</h1>
              <p className="text-sm text-gray-500">{client?.email} • {client?.userType}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              className="input-field w-32"
              value={taxYear}
              onChange={(e) => setTaxYear(parseInt(e.target.value))}
            >
              {[2025, 2024, 2023, 2022].map(year => (
                <option key={year}>{year}</option>
              ))}
            </select>
            <button className="btn-outline">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Message
            </button>
            <button className="btn-primary">
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Client Status */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="text-lg font-semibold">{client?.documentsUploaded}/{client?.documentsRequired}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ReceiptPercentIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receipts</p>
              <p className="text-lg font-semibold">{client?.receiptCount}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="text-lg font-semibold">{client?.mileageKm} km</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              client?.status === 'ready' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <div className={`h-5 w-5 rounded-full ${
                client?.status === 'ready' ? 'bg-green-600' : 'bg-yellow-600'
              }`}></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold capitalize">{client?.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Income"
                value={`$${client?.totalIncome?.toLocaleString()}`}
                icon={ChartBarIcon}
              />
              <StatsCard
                title="Total Expenses"
                value={`$${client?.totalExpenses?.toLocaleString()}`}
                icon={ReceiptPercentIcon}
              />
              <StatsCard
                title="Net Income"
                value={`$${client?.netIncome?.toLocaleString()}`}
                icon={ChartBarIcon}
              />
              <StatsCard
                title="GST Owing"
                value={`$${client?.gstOwing?.toLocaleString()}`}
                icon={DocumentIcon}
              />
            </div>

            {/* Recent Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {client?.recentDocuments?.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
      </div>
    </div>
  );
};

export default ClientDetail;