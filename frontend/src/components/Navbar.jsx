import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-full flex items-center px-4 h-14 shadow bg-white" style={{ minHeight: 56 }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded bg-[#0052cc]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#0052cc"/><rect x="5" y="5" width="5" height="14" rx="1" fill="#fff"/><rect x="14" y="5" width="5" height="9" rx="1" fill="#fff"/></svg>
        </div>
        <span className="font-bold text-lg text-[#172b4d] ml-1">Trello</span>
        <span className="ml-6 text-[#172b4d] text-sm font-medium cursor-pointer">Workspaces</span>
        <span className="ml-4 text-[#172b4d] text-sm font-medium cursor-pointer">Recent</span>
        <span className="ml-4 text-[#172b4d] text-sm font-medium cursor-pointer">Starred</span>
        <span className="ml-4 text-[#172b4d] text-sm font-medium cursor-pointer">Templates</span>
        <button className="ml-4 px-4 py-1 rounded bg-[#0c66e4] text-white font-medium text-sm shadow hover:bg-[#0052cc]">Create</button>
      </div>
      <div className="flex-1 flex justify-end items-center gap-4">
        <input type="text" placeholder="Search" className="px-3 py-1 rounded border border-[#dfe1e6] bg-[#f4f5f7] text-sm outline-none w-56" />
        <span className="text-[#42526e] text-xl cursor-pointer"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 22a1 1 0 0 1-1-1v-1.07A8.001 8.001 0 0 1 4 12a8 8 0 1 1 16 0 8.001 8.001 0 0 1-7 7.93V21a1 1 0 0 1-1 1zm0-18a6 6 0 0 0 0 12 6 6 0 0 0 0-12z" fill="#42526e"/></svg></span>
        <span className="text-[#42526e] text-xl cursor-pointer"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#42526e" strokeWidth="2"/><path d="M12 16v-4" stroke="#42526e" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#42526e"/></svg></span>
        <div className="relative" ref={profileRef}>
          <span
            className="w-8 h-8 rounded-full bg-[#172b4d] flex items-center justify-center text-white font-bold text-sm cursor-pointer"
            onClick={() => setProfileOpen((v) => !v)}
          >
            DS
          </span>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50 border">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-[#e11d48] hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar; 