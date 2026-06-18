import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { AdminLogin } from './Login/AdminLogin';
import { Settings } from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import { RegisteredUsers } from './pages/Users/RegisteredUsers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<RegisteredUsers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;