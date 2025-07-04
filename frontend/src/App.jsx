import { useState } from 'react'
import './App.css'
import Navbar from './components/global/Navbar'
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App;
