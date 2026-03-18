import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
console.log('Checking for object rendering issues...');

// Common Components
import Header from './components/Common/Layout/Header';
import Sidebar from './components/Common/Layout/Sidebar';
import DemoNav from './components/Common/Layout/DemoNav';
import LifeEventsHub from './features/life-events/pages/LifeEventsHub';
import MaritalStatusUpdate from './features/life-events/pages/MaritalStatusUpdate';
import SeparationDivorce from './features/life-events/pages/SeparationDivorce';
import AddDependent from './features/life-events/pages/AddDependent';
import ChangeAddress from './features/life-events/pages/ChangeAddress';
import LegacyContact from './features/life-events/pages/LegacyContact';

// Auth Pages
import Login from './pages/auth/Login';
import LoginUser from './pages/auth/LoginUser';
import LoginCA from './pages/auth/LoginCA';
import Register from './pages/auth/Register';
import RegisterCA from './pages/ca/RegisterCA';
import RoleSelect from './pages/auth/RoleSelect';
import ForgotPassword from './pages/auth/ForgotPassword';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Receipts from './pages/user/Receipts';
import ReceiptDetail from './pages/user/ReceiptDetail';
import Mileage from './pages/user/Mileage';
import MileageTracker from './pages/user/MileageTracker';
import TripDetail from './pages/user/TripDetail';
import Documents from './pages/user/Documents';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import AccountDocuments from './pages/user/AccountDocuments';
import TaxChecklist from './pages/user/TaxChecklist';
import FindCA from './pages/user/FindCA';

// Gig Worker Pages
import GSTDashboard from './pages/gig/GSTDashboard';
import BusinessUseCalculator from './pages/gig/BusinessUseCalculator';
import T2125Form from './pages/gig/T2125Form';

// Shop Owner Pages
import ShopDashboard from './pages/shop/ShopDashboard';
import ShopBusinessInfo from './pages/shop/ShopBusinessInfo';
import ShopSalesIncome from './pages/shop/ShopSalesIncome';
import ShopRentUtilities from './pages/shop/ShopRentUtilities';
import ShopPayroll from './pages/shop/ShopPayroll';
import ShopFranchise from './pages/shop/ShopFranchise';
import ShopInventory from './pages/shop/ShopInventory';
import ShopGSTRecords from './pages/shop/ShopGSTRecords';

// CA Pages
import CADashboard from './pages/ca/CADashboard';
import Clients from './pages/ca/Clients';
import ClientDetail from './pages/ca/ClientDetail';
import ClientDocuments from './pages/ca/ClientDocuments';
import ClientTaxSummary from './pages/ca/ClientTaxSummary';
import ClientSearch from './pages/ca/ClientSearch';
import CAAnalyticsDashboard from './pages/ca/CAAnalyticsDashboard';

// User consultation routes
import Consultations from './pages/user/Consultations';
import ConsultationDetail from './pages/consultation/ConsultationDetail';
import ConsultationRequest from './pages/user/ConsultationRequest';
import CAAvailability from './pages/consultation/CAAvailability';

// CA consultation routes
import CARequestDashboard from './pages/ca/CARequestDashboard';
import CARequestDetail from './pages/ca/CARequestDetail';
import CACalendar from './pages/ca/CACalendar';
import CAEarnings from './pages/ca/CAEarnings';

// Styles
import './styles/globals.css';

console.log('🔍 App.js loaded');

const PrivateRoute = ({ children, allowedRoles = ['user', 'ca'] }) => {
  console.log('🔍 PrivateRoute rendering', { allowedRoles });
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    console.log('🔍 Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔍 Not authenticated, redirecting to /');
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    console.log('🔍 Role not allowed, redirecting');
    return <Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} />;
  }

  console.log('🔍 PrivateRoute rendering children');
  return children;
};

const AppContent = () => {
  console.log('🔍 AppContent rendering');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  console.log('🔍 Auth state:', { isAuthenticated, user });

  // If not authenticated, show public routes
  if (!isAuthenticated) {
    console.log('🔍 Showing public routes');
    return (
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<LoginUser />} />
        <Route path="/login/ca" element={<LoginCA />} />
        <Route path="/register/user" element={<Register />} />
        <Route path="/register/ca" element={<RegisterCA />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/accounts" element={<AccountDocuments />} />
        <Route path="/tax-checklist" element={<TaxChecklist />} />
        <Route path="/find-ca" element={<FindCA />} />
        {/* Life events routes removed from public section */}
      </Routes>
    );
  }

  console.log('🔍 Showing authenticated routes');
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Routes>
              {/* User routes */}
              <Route path="/dashboard" element={
                <PrivateRoute allowedRoles={['user']}>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/receipts" element={
                <PrivateRoute allowedRoles={['user']}>
                  <Receipts />
                </PrivateRoute>
              } />
              <Route path="/receipts/:id" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ReceiptDetail />
                </PrivateRoute>
              } />
              <Route path="/accounts" element={
                <PrivateRoute allowedRoles={['user']}>
                  <AccountDocuments />
                </PrivateRoute>
              } />
              <Route path="/tax-checklist" element={
                <PrivateRoute allowedRoles={['user']}>
                  <TaxChecklist />
                </PrivateRoute>
              } />
              <Route path="/find-ca" element={
                <PrivateRoute allowedRoles={['user']}>
                  <FindCA />
                </PrivateRoute>
              } />
              <Route path="/mileage" element={
                <PrivateRoute allowedRoles={['user']}>
                  <Mileage />
                </PrivateRoute>
              } />
              <Route path="/mileage/track" element={
                <PrivateRoute allowedRoles={['user']}>
                  <MileageTracker />
                </PrivateRoute>
              } />
              <Route path="/mileage/:id" element={
                <PrivateRoute allowedRoles={['user']}>
                  <TripDetail />
                </PrivateRoute>
              } />
              <Route path="/documents" element={
                <PrivateRoute allowedRoles={['user']}>
                  <Documents />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <Settings />
                </PrivateRoute>
              } />
              
              {/* Life Events Routes - Protected */}
              <Route path="/life-events" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <LifeEventsHub />
                </PrivateRoute>
              } />
              <Route path="/life-events/marriage" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <MaritalStatusUpdate />
                </PrivateRoute>
              } />
              <Route path="/life-events/separation" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <SeparationDivorce />
                </PrivateRoute>
              } />
              <Route path="/life-events/add-dependent" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <AddDependent />
                </PrivateRoute>
              } />
              <Route path="/life-events/change-address" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <ChangeAddress />
                </PrivateRoute>
              } />
              <Route path="/life-events/legacy-contact" element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <LegacyContact />
                </PrivateRoute>
              } />
              
              {/* Gig Worker routes */}
              <Route path="/gst-dashboard" element={
                <PrivateRoute allowedRoles={['user']}>
                  <GSTDashboard />
                </PrivateRoute>
              } />
              <Route path="/business-use-calculator" element={
                <PrivateRoute allowedRoles={['user']}>
                  <BusinessUseCalculator />
                </PrivateRoute>
              } />
              <Route path="/t2125-form" element={
                <PrivateRoute allowedRoles={['user']}>
                  <T2125Form />
                </PrivateRoute>
              } />
              
              {/* Shop Owner routes */}
              <Route path="/shop/dashboard" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopDashboard />
                </PrivateRoute>
              } />
              <Route path="/shop/business-info" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopBusinessInfo />
                </PrivateRoute>
              } />
              <Route path="/shop/sales-income" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopSalesIncome />
                </PrivateRoute>
              } />
              <Route path="/shop/rent-utilities" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopRentUtilities />
                </PrivateRoute>
              } />
              <Route path="/shop/payroll" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopPayroll />
                </PrivateRoute>
              } />
              <Route path="/shop/franchise" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopFranchise />
                </PrivateRoute>
              } />
              <Route path="/shop/inventory" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopInventory />
                </PrivateRoute>
              } />
              <Route path="/shop/gst-records" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopGSTRecords />
                </PrivateRoute>
              } />
              
              {/* CA routes */}
              <Route path="/ca/dashboard" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CADashboard />
                </PrivateRoute>
              } />
              <Route path="/ca/clients" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <Clients />
                </PrivateRoute>
              } />
              <Route path="/ca/clients/:id" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientDetail />
                </PrivateRoute>
              } />
              <Route path="/ca/clients/:id/documents" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientDocuments />
                </PrivateRoute>
              } />
              <Route path="/ca/clients/:id/tax-summary" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientTaxSummary />
                </PrivateRoute>
              } />
              <Route path="/ca/search" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientSearch />
                </PrivateRoute>
              } />
              <Route path="/ca/analytics" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAAnalyticsDashboard />
                </PrivateRoute>
              } />

              {/* User Consultation Routes */}
              <Route path="/consultations" element={
                <PrivateRoute allowedRoles={['user']}>
                  <Consultations />
                </PrivateRoute>
              } />
              <Route path="/consultations/request/:caId" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ConsultationRequest />
                </PrivateRoute>
              } />
              <Route path="/consultations/:id" element={
                <PrivateRoute allowedRoles={['user']}>
                  <ConsultationDetail />
                </PrivateRoute>
              } />
              <Route path="/ca-availability/:caId" element={
                <PrivateRoute allowedRoles={['user']}>
                  <CAAvailability />
                </PrivateRoute>
              } />

              {/* CA Consultation Routes */}
              <Route path="/ca/requests" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CARequestDashboard />
                </PrivateRoute>
              } />
              <Route path="/ca/requests/:id" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CARequestDetail />
                </PrivateRoute>
              } />
              <Route path="/ca/calendar" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CACalendar />
                </PrivateRoute>
              } />
              <Route path="/ca/earnings" element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAEarnings />
                </PrivateRoute>
              } />
              
              {/* Default redirect based on role */}
              <Route path="/" element={
                <Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} />
              } />
              <Route path="*" element={
                <Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} />
              } />
            </Routes>
          </div>
        </main>
      </div>
      
      {/* {process.env.NODE_ENV === 'development' && <DemoNav />} */}
    </div>
  );
};

function App() {
  console.log('🔍 App rendering');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;