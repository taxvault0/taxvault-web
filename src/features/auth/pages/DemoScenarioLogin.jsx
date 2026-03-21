import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Car,
  Building2,
  FileText,
  Layers3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const scenarios = [
  {
    id: 't4-only',
    title: 'T4 Only',
    subtitle: 'Employee with employment income only',
    icon: FileText,
    tone: 'blue',
    user: {
      id: 'scenario-t4-only',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'user',
      userType: 'employee',
      incomeSources: ['employment'],
      taxProfile: {
        employment: true,
        gigWork: false,
        selfEmployment: false,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-T4-1001',
    },
  },
  {
    id: 'gig-only',
    title: 'Gig Only',
    subtitle: 'Gig worker / contractor only',
    icon: Car,
    tone: 'green',
    user: {
      id: 'scenario-gig-only',
      name: 'Sarah Lee',
      email: 'sarah@example.com',
      role: 'user',
      userType: 'gig-worker',
      incomeSources: ['gig_work'],
      taxProfile: {
        employment: false,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-GIG-1001',
    },
  },
  {
    id: 'business-only',
    title: 'Business Only',
    subtitle: 'Business owner without T4 or gig income',
    icon: Building2,
    tone: 'purple',
    user: {
      id: 'scenario-business-only',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['self_employed'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Brown Consulting',
        businessType: 'Sole Proprietor',
        gstRegistered: false,
        hasEmployees: false,
        hasInventory: false,
      },
      clientId: 'TV-BIZ-1001',
    },
  },
  {
    id: 'gig-t4',
    title: 'Gig + T4',
    subtitle: 'Employee with side gig income',
    icon: Layers3,
    tone: 'amber',
    user: {
      id: 'scenario-gig-t4',
      name: 'Emily Clark',
      email: 'emily@example.com',
      role: 'user',
      userType: 'gig-worker',
      incomeSources: ['employment', 'gig_work'],
      taxProfile: {
        employment: true,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: false,
      },
      businessInfo: {},
      clientId: 'TV-MIX-1001',
    },
  },
  {
    id: 'gig-business',
    title: 'Gig + Business',
    subtitle: 'Gig work plus business setup',
    icon: Layers3,
    tone: 'indigo',
    user: {
      id: 'scenario-gig-business',
      name: 'Jason King',
      email: 'jason@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['gig_work', 'self_employed'],
      taxProfile: {
        employment: false,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'King Services',
        businessType: 'Sole Proprietor',
        gstRegistered: true,
        hasEmployees: false,
        hasInventory: false,
      },
      clientId: 'TV-GB-1001',
    },
  },
  {
    id: 't4-business',
    title: 'T4 + Business',
    subtitle: 'Employee who also runs a business',
    icon: Layers3,
    tone: 'blue',
    user: {
      id: 'scenario-t4-business',
      name: 'Anna Patel',
      email: 'anna@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['employment', 'self_employed'],
      taxProfile: {
        employment: true,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Patel Studio',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: false,
      },
      clientId: 'TV-T4B-1001',
    },
  },
  {
    id: 'all-incomes',
    title: 'T4 + Gig + Business',
    subtitle: 'Full mixed-income scenario',
    icon: Layers3,
    tone: 'purple',
    user: {
      id: 'scenario-all-incomes',
      name: 'Olivia Martin',
      email: 'olivia@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['employment', 'gig_work', 'self_employed'],
      taxProfile: {
        employment: true,
        gigWork: true,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Martin Group',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: true,
      },
      clientId: 'TV-ALL-1001',
    },
  },
  {
    id: 'business-payroll',
    title: 'Business + Payroll',
    subtitle: 'Business owner with employees',
    icon: Briefcase,
    tone: 'amber',
    user: {
      id: 'scenario-business-payroll',
      name: 'Robert Green',
      email: 'robert@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['self_employed'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Green Logistics',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: true,
        hasInventory: false,
      },
      clientId: 'TV-PAY-1001',
    },
  },
  {
    id: 'business-inventory',
    title: 'Business + Inventory',
    subtitle: 'Business owner with stock/inventory',
    icon: Building2,
    tone: 'green',
    user: {
      id: 'scenario-business-inventory',
      name: 'Sophia Adams',
      email: 'sophia@example.com',
      role: 'business_owner',
      userType: 'business_owner',
      incomeSources: ['self_employed'],
      taxProfile: {
        employment: false,
        gigWork: false,
        selfEmployment: true,
        incorporatedBusiness: true,
      },
      businessInfo: {
        businessName: 'Adams Retail',
        businessType: 'Corporation',
        gstRegistered: true,
        hasEmployees: false,
        hasInventory: true,
      },
      clientId: 'TV-INV-1001',
    },
  },
];

const toneClasses = {
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
  green: 'border-green-200 bg-green-50 hover:bg-green-100',
  purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
  amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
  indigo: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
};

export default function DemoScenarioLogin() {
  const navigate = useNavigate();
  const { loginDemoUser } = useAuth();

  const handleScenarioLogin = (scenario) => {
    if (typeof loginDemoUser === 'function') {
      loginDemoUser(scenario.user);
      navigate('/dashboard');
      return;
    }

    localStorage.setItem('user', JSON.stringify(scenario.user));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-primary-700">TaxVault</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Demo Scenario Login</h2>
          <p className="mt-3 text-lg text-gray-600">
            Log in as different tax profiles to test dashboards, profile pages, and flows.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-center text-2xl font-semibold text-gray-700">
            Test All Scenarios
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;

              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioLogin(scenario)}
                  className={`rounded-2xl border p-5 text-left transition ${toneClasses[scenario.tone]}`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <Icon size={20} className="text-gray-800" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{scenario.title}</p>
                      <p className="text-sm text-gray-600">{scenario.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scenario.user.incomeSources?.map((source) => (
                      <span
                        key={source}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}