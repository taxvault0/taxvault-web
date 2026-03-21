import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  DollarSign,
  Download,
  Printer,
  Copy,
  CheckCircle,
  Briefcase,
  Home,
  Car,
  TrendingUp,
  CreditCard,
  Receipt,
  Building,
  Calendar,
  Hash,
  AlertCircle,
  ChevronLeft,
  Share2,
  FileSpreadsheet
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const ClientTaxSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Mock client data - in real app, this would come from API
  const clientData = {
    personal: {
      name: 'John Doe',
      sin: '123-456-789',
      email: 'john.doe@email.com',
      phone: '(416) 555-0123',
      dob: '1985-06-15',
      maritalStatus: 'Married',
      spouseName: 'Jane Doe',
      spouseSin: '987-654-321',
      address: '123 Main St, Toronto, ON M5V 2H1',
    },
    income: {
      t4: [
        { employer: 'ABC Corp', box14: 65000, box16: 3250, box18: 950, box22: 1200 },
        { employer: 'XYZ Ltd', box14: 12000, box16: 600, box18: 175, box22: 220 }
      ],
      t4a: { amount: 5000, type: 'Pension' },
      t5: { amount: 1250.75, type: 'Interest' },
      t3: { amount: 850.50, type: 'Trust' },
      t5008: { total: 3200, gains: 450, losses: 120 },
      selfEmployment: { income: 15000, expenses: 5200, net: 9800 },
      rental: { income: 24000, expenses: 8900, net: 15100 },
      foreignIncome: { amount: 2000, country: 'USA' },
      otherIncome: 1200,
    },
    deductions: {
      rrsp: 8500,
      fhsa: 2000,
      tuition: 3200,
      medical: 1250,
      charity: 500,
      childCare: 2400,
      moving: 800,
      unionDues: 450,
      professionalDues: 600,
      homeOffice: 1200,
      vehicleExpenses: 3400,
      interestPaid: 1800,
    },
    taxCredits: {
      basic: 15000,
      age: 0,
      spouse: 12000,
      dependent: 5000,
      disability: 0,
      tuition: 3200,
      medical: 1250,
      charitable: 500,
      pension: 1000,
      canadaEmployment: 1350,
    },
    previousYears: {
      noticeOfAssessment: true,
      rrspDeductionLimit: 18500,
      tuitionCarryForward: 2800,
      capitalLosses: 1200,
    },
    documents: {
      t4: 'uploaded',
      t4a: 'missing',
      t5: 'uploaded',
      t3: 'pending',
      rental: 'uploaded',
      medical: 'uploaded',
      charity: 'uploaded',
    },
    summary: {
      totalIncome: 121250.75,
      netIncome: 98500.50,
      taxableIncome: 92300.00,
      federalTax: 15420.00,
      provincialTax: 7230.00,
      totalTax: 22650.00,
      credits: 3250.00,
      balanceDue: 19400.00,
      refund: 0,
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToCRAFormat = () => {
    // Generate formatted text for CRA software
    const exportText = `
TAXVAULT EXPORT - CLIENT TAX SUMMARY
====================================
Client: ${clientData.personal.name}
SIN: ${clientData.personal.sin}
Tax Year: 2024

--- PERSONAL INFORMATION ---
Name: ${clientData.personal.name}
SIN: ${clientData.personal.sin}
Email: ${clientData.personal.email}
Phone: ${clientData.personal.phone}
DOB: ${clientData.personal.dob}
Marital Status: ${clientData.personal.maritalStatus}
Spouse: ${clientData.personal.spouseName}
Spouse SIN: ${clientData.personal.spouseSin}
Address: ${clientData.personal.address}

--- INCOME SUMMARY ---
Total Income: $${clientData.summary.totalIncome.toFixed(2)}
Net Income: $${clientData.summary.netIncome.toFixed(2)}
Taxable Income: $${clientData.summary.taxableIncome.toFixed(2)}

T4 Employment Income:
${clientData.income.t4.map(job => 
  `  - ${job.employer}: $${job.box14.toFixed(2)} (CPP: $${job.box16}, EI: $${job.box18})`
).join('\n')}

Self-Employment: $${clientData.income.selfEmployment.net.toFixed(2)}
Rental Income: $${clientData.income.rental.net.toFixed(2)}
Investment Income: $${(clientData.income.t5.amount + clientData.income.t3.amount).toFixed(2)}
Capital Gains: $${clientData.income.t5008.gains.toFixed(2)}

--- DEDUCTIONS ---
RRSP: $${clientData.deductions.rrsp.toFixed(2)}
FHSA: $${clientData.deductions.fhsa.toFixed(2)}
Tuition: $${clientData.deductions.tuition.toFixed(2)}
Medical: $${clientData.deductions.medical.toFixed(2)}
Charity: $${clientData.deductions.charity.toFixed(2)}
Child Care: $${clientData.deductions.childCare.toFixed(2)}
Moving: $${clientData.deductions.moving.toFixed(2)}
Union/Professional: $${(clientData.deductions.unionDues + clientData.deductions.professionalDues).toFixed(2)}
Home Office: $${clientData.deductions.homeOffice.toFixed(2)}
Vehicle: $${clientData.deductions.vehicleExpenses.toFixed(2)}

--- TAX SUMMARY ---
Federal Tax: $${clientData.summary.federalTax.toFixed(2)}
Provincial Tax: $${clientData.summary.provincialTax.toFixed(2)}
Total Tax: $${clientData.summary.totalTax.toFixed(2)}
Credits: $${clientData.summary.credits.toFixed(2)}
Balance Due/Refund: $${clientData.summary.balanceDue.toFixed(2)}
    `;
    
    // Create download link
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientData.personal.name.replace(' ', '_')}_tax_summary.txt`;
    a.click();
  };

  const InfoRow = ({ label, value, important = false }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className={`text-sm ${important ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${important ? 'text-primary-600' : 'text-gray-900'}`}>
          {value}
        </span>
        {important && (
          <button 
            onClick={() => copyToClipboard(value.toString())}
            className="text-gray-400 hover:text-primary-500"
          >
            {copied ? <CheckCircle size={14} className="text-success-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, action }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/ca/clients/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Client Tax Summary</h1>
            <Badge variant="gold">2024 Tax Year</Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={exportToCRAFormat}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button variant="primary" size="sm">
              <FileSpreadsheet size={16} className="mr-2" />
              Generate CRA File
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-primary-500 to-primary-600">
            <p className="text-primary-100 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-white">
              ${clientData.summary.totalIncome.toLocaleString()}
            </p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-gray-500 text-sm">Net Income</p>
            <p className="text-2xl font-bold text-gray-900">
              ${clientData.summary.netIncome.toLocaleString()}
            </p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-gray-500 text-sm">Taxable Income</p>
            <p className="text-2xl font-bold text-gray-900">
              ${clientData.summary.taxableIncome.toLocaleString()}
            </p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-gray-500 text-sm">Balance Due</p>
            <p className={`text-2xl font-bold ${clientData.summary.balanceDue > 0 ? 'text-warning-500' : 'text-success-500'}`}>
              ${clientData.summary.balanceDue.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal & Important Info */}
          <div className="space-y-6">
            {/* Personal Information - Most Important */}
            <Card>
              <Card.Header>
                <SectionHeader icon={User} title="Personal Information" />
              </Card.Header>
              <Card.Body>
                <InfoRow label="Full Name" value={clientData.personal.name} important />
                <InfoRow label="SIN" value={clientData.personal.sin} important />
                <InfoRow label="Email" value={clientData.personal.email} important />
                <InfoRow label="Phone" value={clientData.personal.phone} important />
                <InfoRow label="Date of Birth" value={clientData.personal.dob} />
                <InfoRow label="Marital Status" value={clientData.personal.maritalStatus} />
                <InfoRow label="Spouse Name" value={clientData.personal.spouseName} />
                <InfoRow label="Spouse SIN" value={clientData.personal.spouseSin} important />
                <InfoRow label="Address" value={clientData.personal.address} />
              </Card.Body>
            </Card>

            {/* Previous Year Info */}
            <Card>
              <Card.Header>
                <SectionHeader icon={Calendar} title="Previous Year (2023)" />
              </Card.Header>
              <Card.Body>
                <InfoRow label="Notice of Assessment" value={clientData.previousYears.noticeOfAssessment ? 'Received' : 'Pending'} />
                <InfoRow label="RRSP Deduction Limit" value={`$${clientData.previousYears.rrspDeductionLimit}`} important />
                <InfoRow label="Tuition Carry Forward" value={`$${clientData.previousYears.tuitionCarryForward}`} />
                <InfoRow label="Capital Losses" value={`$${clientData.previousYears.capitalLosses}`} />
              </Card.Body>
            </Card>
          </div>

          {/* Middle Column - Income & Deductions */}
          <div className="space-y-6">
            {/* Income Summary - Most Important for T1 */}
            <Card>
              <Card.Header>
                <SectionHeader icon={DollarSign} title="Income (Line 15000)" />
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-700 mb-2">T4 Employment</h4>
                  {clientData.income.t4.map((job, idx) => (
                    <div key={idx} className="ml-2 mb-2">
                      <InfoRow label={job.employer} value={`$${job.box14.toLocaleString()}`} important />
                      <div className="grid grid-cols-2 ml-4 text-xs text-gray-500">
                        <span>CPP: ${job.box16}</span>
                        <span>EI: ${job.box18}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <InfoRow label="Self-Employment" value={`$${clientData.income.selfEmployment.net.toLocaleString()}`} />
                <InfoRow label="Rental Income" value={`$${clientData.income.rental.net.toLocaleString()}`} />
                <InfoRow label="T5 Investment" value={`$${clientData.income.t5.amount}`} />
                <InfoRow label="T3 Trust" value={`$${clientData.income.t3.amount}`} />
                <InfoRow label="Capital Gains" value={`$${clientData.income.t5008.gains}`} />
                <InfoRow label="Foreign Income" value={`$${clientData.income.foreignIncome.amount}`} />
                <InfoRow label="Other Income" value={`$${clientData.income.otherIncome}`} />
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <InfoRow label="TOTAL INCOME" value={`$${clientData.summary.totalIncome.toLocaleString()}`} important />
                </div>
              </Card.Body>
            </Card>

            {/* Deductions */}
            <Card>
              <Card.Header>
                <SectionHeader icon={Receipt} title="Deductions" />
              </Card.Header>
              <Card.Body>
                <InfoRow label="RRSP" value={`$${clientData.deductions.rrsp}`} />
                <InfoRow label="FHSA" value={`$${clientData.deductions.fhsa}`} />
                <InfoRow label="Tuition" value={`$${clientData.deductions.tuition}`} />
                <InfoRow label="Medical" value={`$${clientData.deductions.medical}`} />
                <InfoRow label="Charitable" value={`$${clientData.deductions.charity}`} />
                <InfoRow label="Child Care" value={`$${clientData.deductions.childCare}`} />
                <InfoRow label="Moving" value={`$${clientData.deductions.moving}`} />
                <InfoRow label="Union/Professional" value={`$${clientData.deductions.unionDues + clientData.deductions.professionalDues}`} />
                <InfoRow label="Home Office" value={`$${clientData.deductions.homeOffice}`} />
                <InfoRow label="Vehicle" value={`$${clientData.deductions.vehicleExpenses}`} />
              </Card.Body>
            </Card>
          </div>

          {/* Right Column - Tax Summary */}
          <div className="space-y-6">
            {/* Tax Calculation Summary */}
            <Card className="bg-primary-50 border-primary-200">
              <Card.Header>
                <SectionHeader icon={FileText} title="Tax Summary" />
              </Card.Header>
              <Card.Body>
                <InfoRow label="Federal Tax" value={`$${clientData.summary.federalTax.toLocaleString()}`} important />
                <InfoRow label="Provincial Tax" value={`$${clientData.summary.provincialTax.toLocaleString()}`} important />
                <div className="border-t border-primary-200 my-2"></div>
                <InfoRow label="Total Tax" value={`$${clientData.summary.totalTax.toLocaleString()}`} important />
                <InfoRow label="Non-Refundable Credits" value={`$${clientData.summary.credits.toLocaleString()}`} />
                <div className="border-t border-primary-200 my-2"></div>
                <InfoRow 
                  label="BALANCE DUE" 
                  value={`$${clientData.summary.balanceDue.toLocaleString()}`} 
                  important 
                />
              </Card.Body>
            </Card>

            {/* Document Status */}
            <Card>
              <Card.Header>
                <SectionHeader icon={FileText} title="Document Status" />
              </Card.Header>
              <Card.Body>
                {Object.entries(clientData.documents).map(([doc, status]) => (
                  <div key={doc} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 uppercase">{doc}</span>
                    <Badge 
                      variant={
                        status === 'uploaded' ? 'success' : 
                        status === 'pending' ? 'warning' : 'info'
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Body>
                <Button variant="primary" fullWidth className="mb-3">
                  <FileSpreadsheet size={16} className="mr-2" />
                  Generate T1 Return
                </Button>
                <Button variant="outline" fullWidth className="mb-3">
                  <Share2 size={16} className="mr-2" />
                  Share with Client
                </Button>
                <Button variant="outline" fullWidth>
                  <AlertCircle size={16} className="mr-2" />
                  Flag for Review
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTaxSummary;







