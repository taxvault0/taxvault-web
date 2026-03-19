import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'features/auth/context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Layout
import Header from 'components/layout/Header';
import Sidebar from 'components/layout/Sidebar';
import DemoNav from 'components/layout/DemoNav';

// Chat
import ChatButton from 'features/chat/components/ChatButton';
import ChatDrawer from 'features/chat/components/ChatDrawer';
import CAMessages from 'features/chat/pages/CAMessages';
import CAConversation from 'features/chat/pages/CAConversation';

// Life Events
import LifeEventsHub from 'features/life-events/pages/LifeEventsHub';
import MaritalStatusUpdate from 'features/life-events/pages/MaritalStatusUpdate';
import SeparationDivorce from 'features/life-events/pages/SeparationDivorce';
import AddDependent from 'features/life-events/pages/AddDependent';
import ChangeAddress from 'features/life-events/pages/ChangeAddress';
import LegacyContact from 'features/life-events/pages/LegacyContact';

// Auth
import Login from 'features/auth/pages/Login';
import LoginUser from 'features/auth/pages/LoginUser';
import LoginCA from 'features/auth/pages/LoginCA';
import Register from 'features/auth/pages/Register';
import RegisterCA from 'features/auth/pages/RegisterCA';
import RoleSelect from 'features/auth/pages/RoleSelect';
import ForgotPassword from 'features/auth/pages/ForgotPassword';

// User
import Dashboard from 'features/dashboard/pages/Dashboard';
import Receipts from 'features/documents/pages/Receipts';
import ReceiptDetail from 'features/documents/pages/ReceiptDetail';
import Mileage from 'features/mileage/pages/Mileage';
import MileageTracker from 'features/mileage/pages/MileageTracker';
import TripDetail from 'features/mileage/pages/TripDetail';
import Documents from 'features/documents/pages/Documents';
import Profile from 'features/profile/pages/Profile';
import Settings from 'features/profile/pages/Settings';
import AccountDocuments from 'features/documents/pages/AccountDocuments';
import TaxChecklist from 'features/tax/pages/TaxChecklist';
import FindCA from 'features/directory/pages/FindCA';

// Consultations
import Consultations from 'features/consultations/pages/Consultations';
import ConsultationRequest from 'features/consultations/pages/ConsultationRequest';
import ConsultationDetail from 'features/consultations/pages/ConsultationDetail';
import CAAvailability from 'features/consultations/pages/CAAvailability';

// Gig / Tax
import GSTDashboard from 'features/dashboard/pages/GSTDashboard';
import BusinessUseCalculator from 'features/tax/pages/BusinessUseCalculator';
import T2125Form from 'features/tax/pages/T2125Form';

// Shop
import ShopDashboard from 'features/dashboard/pages/ShopDashboard';
import ShopBusinessInfo from 'features/shop/pages/ShopBusinessInfo';
import ShopSalesIncome from 'features/shop/pages/ShopSalesIncome';
import ShopRentUtilities from 'features/shop/pages/ShopRentUtilities';
import ShopPayroll from 'features/shop/pages/ShopPayroll';
import ShopFranchise from 'features/shop/pages/ShopFranchise';
import ShopInventory from 'features/shop/pages/ShopInventory';
import ShopGSTRecords from 'features/shop/pages/ShopGSTRecords';

// CA
import CADashboard from 'features/dashboard/pages/CADashboard';
import Clients from 'features/clients/pages/Clients';
import ClientDetail from 'features/clients/pages/ClientDetail';
import ClientDocuments from 'features/clients/pages/ClientDocuments';
import ClientTaxSummary from 'features/clients/pages/ClientTaxSummary';
import ClientSearch from 'features/clients/pages/ClientSearch';
import CAAnalyticsDashboard from 'features/dashboard/pages/CAAnalyticsDashboard';
import CARequestDashboard from 'features/dashboard/pages/CARequestDashboard';
import CARequestDetail from 'features/ca/pages/CARequestDetail';
import CACalendar from 'features/ca/pages/CACalendar';
import CAEarnings from 'features/ca/pages/CAEarnings';

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<RoleSelect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/login/user" element={<LoginUser />} />
    <Route path="/login/ca" element={<LoginCA />} />
    <Route path="/register/user" element={<Register />} />
    <Route path="/register/ca" element={<RegisterCA />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/accounts" element={<AccountDocuments />} />
    <Route path="/tax-checklist" element={<TaxChecklist />} />
    <Route path="/find-ca" element={<FindCA />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const ProtectedRoutes = ({ user, sidebarOpen, setSidebarOpen, chatOpen, setChatOpen }) => (
  <div className="min-h-screen bg-gray-50 flex">
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <div className="flex-1 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} onChatClick={() => setChatOpen(true)} />

      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/receipts"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Receipts />
                </PrivateRoute>
              }
            />
            <Route
              path="/receipts/:id"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ReceiptDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <AccountDocuments />
                </PrivateRoute>
              }
            />
            <Route
              path="/tax-checklist"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <TaxChecklist />
                </PrivateRoute>
              }
            />
            <Route
              path="/find-ca"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <FindCA />
                </PrivateRoute>
              }
            />
            <Route
              path="/mileage"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Mileage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mileage/track"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <MileageTracker />
                </PrivateRoute>
              }
            />
            <Route
              path="/mileage/:id"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <TripDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <Settings />
                </PrivateRoute>
              }
            />

            <Route
              path="/life-events"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <LifeEventsHub />
                </PrivateRoute>
              }
            />
            <Route
              path="/life-events/marriage"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <MaritalStatusUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/life-events/separation"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <SeparationDivorce />
                </PrivateRoute>
              }
            />
            <Route
              path="/life-events/add-dependent"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <AddDependent />
                </PrivateRoute>
              }
            />
            <Route
              path="/life-events/change-address"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <ChangeAddress />
                </PrivateRoute>
              }
            />
            <Route
              path="/life-events/legacy-contact"
              element={
                <PrivateRoute allowedRoles={['user', 'ca']}>
                  <LegacyContact />
                </PrivateRoute>
              }
            />

            <Route
              path="/gst-dashboard"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <GSTDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/business-use-calculator"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <BusinessUseCalculator />
                </PrivateRoute>
              }
            />
            <Route
              path="/t2125-form"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <T2125Form />
                </PrivateRoute>
              }
            />

            <Route
              path="/shop/dashboard"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/business-info"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopBusinessInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/sales-income"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopSalesIncome />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/rent-utilities"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopRentUtilities />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/payroll"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopPayroll />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/franchise"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopFranchise />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/inventory"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopInventory />
                </PrivateRoute>
              }
            />
            <Route
              path="/shop/gst-records"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ShopGSTRecords />
                </PrivateRoute>
              }
            />

            <Route
              path="/ca/dashboard"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CADashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/clients"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <Clients />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/clients/:id"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/clients/:id/documents"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientDocuments />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/clients/:id/tax-summary"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientTaxSummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/search"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <ClientSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/analytics"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAAnalyticsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/consultations"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <Consultations />
                </PrivateRoute>
              }
            />
            <Route
              path="/consultations/request/:caId"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ConsultationRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/consultations/:id"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ConsultationDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca-availability/:caId"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <CAAvailability />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/requests"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CARequestDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/requests/:id"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CARequestDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/calendar"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CACalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/earnings"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAEarnings />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/messages"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAMessages />
                </PrivateRoute>
              }
            />
            <Route
              path="/ca/messages/:clientId"
              element={
                <PrivateRoute allowedRoles={['ca']}>
                  <CAConversation />
                </PrivateRoute>
              }
            />

            <Route
              path="/"
              element={<Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} replace />}
            />
            <Route
              path="*"
              element={<Navigate to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'} replace />}
            />
          </Routes>
        </div>
      </main>
    </div>

    {chatOpen && !window.location.pathname.includes('/messages') && (
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    )}

    {/* {process.env.NODE_ENV === 'development' && <DemoNav />} */}
  </div>
);

const AppRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <>
      <ProtectedRoutes
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />
      <ChatButton />
    </>
  );
};

export default AppRoutes;
