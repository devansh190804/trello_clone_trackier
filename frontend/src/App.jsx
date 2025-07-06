import './index.css';

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';
import Login from './pages/Login';
import OpenRoute from './components/auth/OpenRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import Tasks from './pages/Tasks';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
         <Route path="/signup" element={<OpenRoute><Register /></OpenRoute>} />  
        <Route path="/dashboard/*" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="project/:projectId" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;