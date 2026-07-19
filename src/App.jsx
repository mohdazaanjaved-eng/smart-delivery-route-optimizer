import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AddDelivery from './pages/AddDelivery.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Deliveries from './pages/Deliveries.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RouteOptimizer from './pages/RouteOptimizer.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/deliveries/new" element={<AddDelivery />} />
        <Route path="/routes/optimize" element={<RouteOptimizer />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
