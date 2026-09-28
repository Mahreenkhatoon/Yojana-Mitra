import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import Disclaimer  from './components/Disclaimer';

// Pages
import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import EligibilityForm from './pages/EligibilityForm';
import Results        from './pages/Results';
import SchemeDetail   from './pages/SchemeDetail';
import Explore        from './pages/Explore';
import Dashboard      from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound       from './pages/NotFound';

// ── Route guards ──────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuth, isAdmin } = useAuth();
  if (!isAuth)   return <Navigate to="/login"  replace />;
  if (!isAdmin)  return <Navigate to="/"       replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

// ── App Shell ─────────────────────────────────────────────────────────────────
const AppShell = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }} className="page-enter">
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/eligibility" element={<EligibilityForm />} />
        <Route path="/results"     element={<Results />} />
        <Route path="/schemes"     element={<Explore />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />

        {/* Guest-only */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Disclaimer />
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
