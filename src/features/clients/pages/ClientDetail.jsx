import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowLeftIcon,
  DocumentIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  EnvelopeIcon,
  CloudArrowDownIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  TruckIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { caAPI } from 'services/api';
import StatsCard from 'components/shared/StatsCard';
import DocumentCard from 'components/shared/DocumentCard';

const normalizeTaxProfile = (client) => {
  if (client?.taxProfile) {
    return {
      employment: !!client.taxProfile.employment,
      gigWork: !!client.taxProfile.gigWork,
      selfEmployment: !!client.taxProfile.selfEmployment,
      incorporatedBusiness: !!client.taxProfile.incorporatedBusiness,
    };
  }

  return {
    employment:
      client?.userType === 'employee' ||
      client?.userType === 'regular' ||
      !client?.userType,
    gigWork: client?.userType === 'gig-worker',
    selfEmployment:
      client?.userType === 'self-employed' || client?.userType === 'contractor',
    incorporatedBusiness:
      client?.userType === 'Business-owner' ||
      client?.userType === 'small-business' ||
      client?.userType === 'business',
  };
};

const getProfileBadges = (client) => {
  const taxProfile = normalizeTaxProfile(client);
  const badges = [];

  if (taxProfile.employment) {
    badges.push({
      key: 'employment',
      label: 'Employment',
      icon: BriefcaseIcon,
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
    });
  }

  if (taxProfile.gigWork) {
    badges.push({
      key: 'gigWork',
      label: 'Gig Work',
      icon: TruckIcon,
      classes: 'bg-green-50 text-green-700 border-green-200',
    });
  }

  if (taxProfile.selfEmployment) {
    badges.push({
      key: 'selfEmployment',
      label: 'Self-Employment',
      icon: CurrencyDollarIcon,
      classes: 'bg-purple-50 text-purple-700 border-purple-200',
    });
  }

  if (taxProfile.incorporatedBusiness) {
    badges.push({
      key: 'incorporatedBusiness',
      label: 'Corporation / Business',
      icon: BuildingOffice2Icon,
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    });
  }

  return badges;
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  const { data: client, isLoading } = useQuery(
    ['client', id, taxYear],
    async () => {
      try {
        const res = await caAPI.getClientDashboard(id, taxYear);
        return res.data;
      } catch (error) {
        return {
          id,
          name: 'John Doe',
          email: 'john@example.com',
          status: 'in-review',
          userType: 'employee',
          taxProfile: {
            employment: true,
            gigWork: true,
            selfEmployment: false,
            incorporatedBusiness: true,
          },
          documentsUploaded: 8,
          documentsRequired: 15,
          receiptCount: 36,
          mileageKm: 1240,
          totalIncome: 72500,
          totalExpenses: 11200,
          netIncome: 61300,
          gstOwing: 1450,
          businessName: 'Doe Consulting Inc.',
          assignedCAName: 'Jane Smith, CA',
          recentDocuments: [
            {
              id: 'doc-1',
              name: 'T4 Slip',
              type: 'Tax Slip',
              createdAt: '2026-03-10',
              status: 'uploaded',
            },
            {
              id: 'doc-2',
              name: 'RRSP Contribution Receipt',
              type: 'Receipt',
              createdAt: '2026-03-08',
              status: 'uploaded',
            },
          ],
        };
      }
    }
  );

  const tabs = [
    { name: 'Overview', id: 'overview' },
    { name: 'Receipts', id: 'receipts' },
    { name: 'Documents', id: 'documents' },
    { name: 'Mileage', id: 'mileage' },
    { name: 'Reports', id: 'reports' },
  ];

  const profileBadges = useMemo(() => getProfileBadges(client), [client]);
  const taxProfile = useMemo(() => normalizeTaxProfile(client), [client]);

  const incomeSummary = useMemo(() => {
    const items = [];
    if (taxProfile.employment) items.push('Employment income');
    if (taxProfile.gigWork) items.push('Gig income');
    if (taxProfile.selfEmployment) items.push('Self-employment income');
    if (taxProfile.incorporatedBusiness) items.push('Business / corporate activity');
    return items;
  }, [taxProfile]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          to="/ca/clients"
          className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Clients
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              {client?.name ? (
                <span className="text-2xl font-medium text-primary-700">
                  {client.name.charAt(0)}
                </span>
              ) : (
                <UserCircleIcon className="h-10 w-10 text-primary-500" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client?.name}</h1>
              <p className="text-sm text-gray-500">{client?.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {profileBadges.length > 0 ? (
                  profileBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <span
                        key={badge.key}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badge.classes}`}
                      >
                        <Icon className="mr-1 h-4 w-4" />
                        {badge.label}
                      </span>
                    );
                  })
                ) : (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    General client
                  </span>
                )}

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    client?.status === 'ready'
                      ? 'bg-green-50 text-green-700'
                      : client?.status === 'in-review'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {client?.status || 'active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="input-field w-32"
              value={taxYear}
              onChange={(e) => setTaxYear(parseInt(e.target.value, 10))}
            >
              {[2026, 2025, 2024, 2023, 2022].map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>

            <button
              className="btn-outline"
              onClick={() => navigate(`/ca/messages/${id}`)}
            >
              <EnvelopeIcon className="mr-2 h-4 w-4" />
              Message
            </button>

            <button className="btn-primary">
              <CloudArrowDownIcon className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Client Status / Snapshot */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2">
              <DocumentIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="text-lg font-semibold">
                {client?.documentsUploaded ?? 0}/{client?.documentsRequired ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ReceiptPercentIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receipts</p>
              <p className="text-lg font-semibold">{client?.receiptCount ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="text-lg font-semibold">{client?.mileageKm ?? 0} km</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`rounded-lg p-2 ${
                client?.status === 'ready' ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full ${
                  client?.status === 'ready' ? 'bg-green-600' : 'bg-yellow-600'
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold capitalize">
                {client?.status || 'active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CA visibility section */}
      <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              CA View
            </h2>
            <p className="mt-1 text-sm text-primary-900">
              This client currently has the following active tax profiles:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-primary-700">
              {incomeSummary.length > 0 ? (
                incomeSummary.map((item) => <li key={item}>• {item}</li>)
              ) : (
                <li>• No tax profile details available</li>
              )}
            </ul>
          </div>

          {client?.businessName && (
            <div className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm">
              <p className="text-gray-500">Business Name</p>
              <p className="font-medium text-gray-900">{client.businessName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Income"
                value={`$${(client?.totalIncome ?? 0).toLocaleString()}`}
                icon={ChartBarIcon}
              />
              <StatsCard
                title="Total Expenses"
                value={`$${(client?.totalExpenses ?? 0).toLocaleString()}`}
                icon={ReceiptPercentIcon}
              />
              <StatsCard
                title="Net Income"
                value={`$${(client?.netIncome ?? 0).toLocaleString()}`}
                icon={CurrencyDollarIcon}
              />
              <StatsCard
                title="GST / HST Owing"
                value={`$${(client?.gstOwing ?? 0).toLocaleString()}`}
                icon={DocumentIcon}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Recent Documents
                </h3>
                <div className="space-y-3">
                  {client?.recentDocuments?.length ? (
                    client.recentDocuments.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                      No recent documents found for this client.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Filing Summary
                  </h4>
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Client</span>
                      <span className="font-medium text-gray-900">
                        {client?.name || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax Year</span>
                      <span className="font-medium text-gray-900">{taxYear}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Profiles</span>
                      <span className="font-medium text-gray-900">
                        {profileBadges.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Assigned CA</span>
                      <span className="font-medium text-gray-900">
                        {client?.assignedCAName || 'Current account'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Recommendations
                  </h4>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {taxProfile.gigWork || taxProfile.selfEmployment ? (
                      <p>• Review mileage and vehicle expense support.</p>
                    ) : null}
                    {taxProfile.incorporatedBusiness ? (
                      <p>• Verify corporate records, payroll, and GST/HST filings.</p>
                    ) : null}
                    {taxProfile.employment ? (
                      <p>• Confirm all T4/T4A slips and employment deductions.</p>
                    ) : null}
                    <p>• Check missing documents before final filing review.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
            {tabs.find((tab) => tab.id === activeTab)?.name} view can be added next.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;

