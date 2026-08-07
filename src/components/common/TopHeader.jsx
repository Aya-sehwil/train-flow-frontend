import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="w-full flex items-center justify-between py-2.5 px-4 md:px-6 bg-white border-b border-gray-50 select-none font-cairo">

      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* 1. Search Bar */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="البحث..."
          className="w-full py-2 pl-4 pr-10 border border-gray-200 bg-[#fbfbfd] rounded-2xl text-right text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-brand-purple transition duration-200"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* 2. Profile and Notification */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Registrar specific "+ اضافة طالب" button */}
        {user?.role === 'registrar' && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-add-staff-modal'))}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-brand-purple text-white rounded-2xl text-[10px] md:text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 duration-200 shadow-md shadow-purple-100/50 border-none font-cairo cursor-pointer"
        >
          إضافة موظف +
        </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => navigate(`/dashboard/${user?.role}/notifications`)}
          className="relative p-2 text-gray-400 hover:text-brand-purple hover:bg-gray-50 rounded-full transition duration-200 focus:outline-none"
          aria-label="الإشعارات"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-1.5 left-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => navigate(`/dashboard/${user?.role}/profile`)}
          className="relative group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
            alt="Youssef"
            className="h-10 w-10 rounded-full object-cover border-2 border-brand-purple/20 group-hover:border-brand-purple transition duration-200"
          />
        </div>
      </div>

    </header>
  );
}