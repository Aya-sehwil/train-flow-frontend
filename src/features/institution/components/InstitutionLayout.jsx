import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/common/Sidebar';
import TopHeader from '../../../components/common/TopHeader';

export default function InstitutionDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fd] font-cairo select-none" dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 p-4 rounded-2xl shadow-xl transition-all duration-300 max-w-sm flex items-center gap-3 border animate-fade-in ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : toast.type === 'info'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-green-50 text-green-800 border-green-200'
        }`}>
          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <span className="text-sm font-semibold text-right w-full">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopHeader onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Dashboard Pages views */}
        <div className="flex-1 p-4 lg:p-6 bg-[#f8f9fd]">
          <Outlet context={{ triggerToast }} />
        </div>
      </div>
    </div>
  );
}