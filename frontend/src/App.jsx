import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
const AddDelivery = lazy(() => import('./pages/AddDelivery.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Deliveries = lazy(() => import('./pages/Deliveries.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const RouteOptimizer = lazy(() => import('./pages/RouteOptimizer.jsx'));
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));

function PageLoader() {
  return <div className="flex min-h-[50vh] items-center justify-center" role="status"><div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" /><span className="sr-only">Loading page</span></div>;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}><Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/deliveries/new" element={<AddDelivery />} />
        <Route path="/routes/optimize" element={<RouteOptimizer />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></Suspense>
  );
}

export default App;
