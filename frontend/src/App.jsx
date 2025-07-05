import './index.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Login from './pages/Login';
import React from 'react';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;