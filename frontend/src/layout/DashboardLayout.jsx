import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Modal />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col" style={{ background: '#e6f0fa' }}>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="m-2 p-2 rounded bg-[#e4f0f6] text-[#172b4d] shadow hover:bg-blue-200 self-start"
              style={{ color: '#172b4d' }}
            >
              ☰
            </button>
          )}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 