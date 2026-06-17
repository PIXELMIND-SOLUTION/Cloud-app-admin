import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { AdminLogin } from './Login/AdminLogin';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route path='/admin' element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;