import { lazy, Suspense } from 'react';
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import TrackingPage from './pages/public/Tracking';
import Branches from './pages/public/Branches';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Architecture from './pages/public/Architecture';
// Loaded on demand so the map engine is not part of the main bundle.
const Explorer = lazy(() => import('./pages/public/Explorer'));

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User portal
import UserDashboard from './pages/user/Dashboard';
import SendShipment from './pages/user/SendShipment';
import ShipmentHistory from './pages/user/ShipmentHistory';
import Profile from './pages/user/Profile';

// Business portal
import BusinessDashboard from './pages/business/BusinessDashboard';
import BulkUpload from './pages/business/BulkUpload';
import Reports from './pages/business/Reports';
import CompanyProfile from './pages/business/CompanyProfile';

// Government portal
import GovDashboard from './pages/government/GovDashboard';
import DocumentShipment from './pages/government/DocumentShipment';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageShipments from './pages/admin/ManageShipments';
import ManageBranches from './pages/admin/ManageBranches';
import SupportTickets from './pages/admin/SupportTickets';
import AdminPerformance from './pages/admin/Performance';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function TrackInPortal() {
  return (
    <div className="page-enter">
      <TrackingPage />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/architecture" element={<Architecture />} />
      </Route>

      {/* Iraq map explorer: full-screen, outside the public layout */}
      <Route
        path="/explorer"
        element={
          <Suspense fallback={<div className="fixed inset-0 bg-[#06080f]" aria-busy="true" />}>
            <Explorer />
          </Suspense>
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Citizen portal */}
      <Route path="/portal" element={
        <ProtectedRoute roles={['citizen', 'admin']}>
          <DashboardLayout><UserDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/portal/send" element={
        <ProtectedRoute>
          <DashboardLayout><SendShipment /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/portal/track" element={
        <ProtectedRoute>
          <DashboardLayout><TrackInPortal /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/portal/history" element={
        <ProtectedRoute>
          <DashboardLayout><ShipmentHistory /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/portal/profile" element={
        <ProtectedRoute>
          <DashboardLayout><Profile /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Business portal */}
      <Route path="/business" element={
        <ProtectedRoute roles={['business', 'admin']}>
          <DashboardLayout><BusinessDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/business/bulk" element={
        <ProtectedRoute roles={['business', 'admin']}>
          <DashboardLayout><BulkUpload /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/business/reports" element={
        <ProtectedRoute roles={['business', 'admin']}>
          <DashboardLayout><Reports /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/business/company" element={
        <ProtectedRoute roles={['business', 'admin']}>
          <DashboardLayout><CompanyProfile /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Government portal */}
      <Route path="/government" element={
        <ProtectedRoute roles={['government', 'admin']}>
          <DashboardLayout><GovDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/government/document" element={
        <ProtectedRoute roles={['government', 'admin']}>
          <DashboardLayout><DocumentShipment /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><AdminDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><ManageUsers /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/shipments" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><ManageShipments /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/branches" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><ManageBranches /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><SupportTickets /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/performance" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><AdminPerformance /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
