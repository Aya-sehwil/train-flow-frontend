import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// نفس فكرة getInitials يلي مستخدمة بباقي المشروع (ملف الدرجات) — أول حرفين من الاسم
function getInitials(fullName) {
  if (!fullName) return '؟';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

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

      {/* مساحة فاضية بدل خانة البحث، تخلي باقي العناصر بأقصى اليسار */}
      <div className="flex-1" />

      {/* Profile and Notification */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Registrar specific "إضافة +" button — بيفتح مودال فيه اختيار الدور (موظف/مشرف/مؤسسة) */}
        {user?.role === 'registrar' && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-add-staff-modal'))}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-brand-purple text-white rounded-2xl text-[10px] md:text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 duration-200 shadow-md shadow-purple-100/50 border-none font-cairo cursor-pointer"
        >
          إضافة عضو +
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

        {/* Profile Avatar — أفاتار بالحروف الأولى بدل صورة ثابتة */}
        <div
          onClick={() => navigate(`/dashboard/${user?.role}/profile`)}
          className="relative group cursor-pointer"
        >
          <div className="h-10 w-10 rounded-full bg-purple-100 text-brand-purple flex items-center justify-center text-sm font-bold border-2 border-brand-purple/20 group-hover:border-brand-purple transition duration-200">
            {getInitials(user?.full_name || user?.name)}
          </div>
        </div>
      </div>

    </header>
  );
}