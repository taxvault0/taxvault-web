import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'features/auth/context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Layout
import AppShell from 'components/layout/AppShell';

// Chat
import ChatButton from 'features/chat/components/ChatButton';
import ChatDrawer from 'features/chat/components/ChatDrawer';
import CAMessages from 'features/chat/pages/CAMessages';
import CAConversation from 'features/chat/pages/CAConversation';
import UserMessages from 'features/chat/pages/UserMessages';
import UserConversation from 'features/chat/pages/UserConversation';

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

const ProtectedRoutes = ({ user, chatOpen, setChatOpen }) => {
  const location = useLocation();

  const isMessagePage =
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/ca/messages');

  const renderWithShell = (element, options = {}) => (
    <AppShell
      showRightPanel={options.showRightPanel || false}
      rightPanel={options.rightPanel || null}
      contentClassName={options.contentClassName || ''}
      containerClassName={options.containerClassName || ''}
    >
      {element}
    </AppShell>
  );

  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<Dashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<Receipts />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/receipts/:id"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ReceiptDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<AccountDocuments />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/tax-checklist"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<TaxChecklist />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/find-ca"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<FindCA />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<Mileage />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage/track"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<MileageTracker />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage/:id"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<TripDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<Documents />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<UserMessages />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/messages/:caId"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<UserConversation />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<Profile />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<Settings />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<LifeEventsHub />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/marriage"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<MaritalStatusUpdate />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/separation"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<SeparationDivorce />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/add-dependent"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<AddDependent />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/change-address"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<ChangeAddress />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/legacy-contact"
          element={
            <PrivateRoute allowedRoles={['user', 'ca']}>
              {renderWithShell(<LegacyContact />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/gst-dashboard"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<GSTDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business-use-calculator"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<BusinessUseCalculator />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/t2125-form"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<T2125Form />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/dashboard"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/business-info"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopBusinessInfo />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/sales-income"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopSalesIncome />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/rent-utilities"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopRentUtilities />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/payroll"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopPayroll />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/franchise"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopFranchise />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/inventory"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopInventory />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/shop/gst-records"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ShopGSTRecords />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<Consultations />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations/request/:caId"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ConsultationRequest />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations/:id"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<ConsultationDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca-availability/:caId"
          element={
            <PrivateRoute allowedRoles={['user']}>
              {renderWithShell(<CAAvailability />)}
            </PrivateRoute>
          }
        />

        <Route
          path="/ca/dashboard"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CADashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<Clients />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id/documents"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientDocuments />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id/tax-summary"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientTaxSummary />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/search"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientSearch />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/analytics"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAAnalyticsDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/requests"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CARequestDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/reviews"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CARequestDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/requests/:id"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CARequestDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/calendar"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CACalendar />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/earnings"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAEarnings />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/messages"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAMessages />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/messages/:clientId"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAConversation />)}
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

      {chatOpen && !isMessagePage && (
        <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
};

const AppRoutes = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <>
      <ProtectedRoutes user={user} chatOpen={chatOpen} setChatOpen={setChatOpen} />
      <ChatButton />
    </>
  );
};

export default AppRoutes;