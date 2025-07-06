import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => (
  <div
    className={`h-[calc(100vh-56px)] shadow-lg flex flex-col transition-all duration-300 ${isOpen ? 'w-60' : 'w-0'} overflow-hidden`}
    style={{ minWidth: isOpen ? 240 : 0, background: '#fff', borderRight: '1px solid #dfe1e6', marginTop: 0 }}
  >
    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#dfe1e6', background: '#f4f5f7' }}>
      <span className="font-bold text-base" style={{ color: '#172b4d' }}>Boards</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
    </div>
    <nav className="flex-1 p-2">
      <Link
        to="/dashboard"
        className="block py-2 px-3 rounded hover:bg-[#e4f0f6] text-[#172b4d] font-medium"
        style={{ color: '#172b4d' }}
      >
        Dashboard
      </Link>
    </nav>
  </div>
);

export default Sidebar; 