import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Requirements from './pages/Requirements';
import RequirementDetail from './pages/RequirementDetail';
import Approvals from './pages/Approvals';
import Candidates from './pages/Candidates';
import JobPostings from './pages/JobPostings';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Careers from './pages/Careers';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/careers" element={<Careers />} />

      {/* Protected Routes - Wrapped in Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requirements" element={<Requirements />} />
                <Route path="/requirements/:id" element={<RequirementDetail />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/postings" element={<JobPostings />} />
                <Route path="/users" element={<Users />} />
                <Route path="/reports" element={<div>Reports Page (Coming Soon)</div>} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
    </NotificationProvider>
  );
}

export default App;
