import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { caAPI } from '../../services/api';
import ClientTable from '../../components/Common/ClientTable';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  const { data: clients, isLoading } = useQuery(
    ['ca-clients', searchTerm, statusFilter, taxYear],
    () => caAPI.getClients({ search: searchTerm, status: statusFilter, taxYear }).then(res => res.data)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and review all your client tax documents.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tax Year */}
          <div>
            <select
              className="input-field"
              value={taxYear}
              onChange={(e) => setTaxYear(parseInt(e.target.value))}
            >
              {[2025, 2024, 2023, 2022, 2021].map(year => (
                <option key={year} value={year}>{year} Tax Year</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {clients?.data?.length || 0} of {clients?.total || 0} clients
              </p>
              <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <FunnelIcon className="h-4 w-4 mr-1" />
                Export List
              </button>
            </div>
            <ClientTable clients={clients?.data || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default Clients;