import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Compass,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Award,
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  MessageSquare,
  Bell,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import logo from '../../logo.png';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const studentMenu = [
    { id: 'dashboard', text: 'الرئيسية', icon: Home, path: '/dashboard/student' },
    { id: 'opportunities', text: 'فرص التدريب', icon: Compass, path: '/dashboard/student/opportunities' },
    { id: 'applied', text: 'الفرص المقدم عليها', icon: CheckSquare, path: '/dashboard/student/applied' },
    { id: 'attendance', text: 'سجل الحضور', icon: ClipboardList, path: '/dashboard/student/attendance' },
    { id: 'reports', text: 'التقارير الدورية', icon: BarChart3, path: '/dashboard/student/reports' },
    { id: 'certificates', text: 'التقييم والشهادات', icon: Award, path: '/dashboard/student/certificates' },
    { id: 'communication', text: 'التواصل', icon: MessageSquare, path: '/dashboard/student/communication' },
    { id: 'profile', text: 'الملف الشخصي', icon: User, path: '/dashboard/student/profile' },
    { id: 'settings', text: 'الاعدادات', icon: Settings, path: '/dashboard/student/settings' }
  ];

const supervisorMenu = [
  { id: 'dashboard', text: 'الرئيسية', icon: Home, path: '/dashboard/supervisor' },
  { id: 'students', text: 'طلبات الطلاب', icon: Users, path: '/dashboard/supervisor/applications' },
  { id: 'institutions', text: 'إدارة المؤسسات', icon: Building2, path: '/dashboard/supervisor/institutions' },
  { id: 'reports', text: 'التقارير', icon: BarChart3, path: '/dashboard/supervisor/reports' },
  { id: 'communication', text: 'التواصل', icon: MessageSquare, path: '/dashboard/supervisor/communication' },
  { id: 'evaluation', text: 'التقييم النهائي', icon: Award, path: '/dashboard/supervisor/evaluation' },
  { id: 'profile', text: 'الملف الشخصي', icon: User, path: '/dashboard/supervisor/profile' },
  { id: 'notifications', text: 'الاشعارات', icon: Bell, path: '/dashboard/supervisor/notifications' },
  { id: 'student-reports', text: 'بحث عن طالب', icon: Search, path: '/dashboard/supervisor/student-reports' },
  { id: 'settings', text: 'الاعدادات', icon: Settings, path: '/dashboard/supervisor/settings' }
];

  const institutionMenu = [
    { id: 'dashboard', text: 'الرئيسية', icon: Home, path: '/dashboard/institution' },
    { id: 'applications', text: 'طلبات الطلاب', icon: Users, path: '/dashboard/institution/applications' },
    { id: 'opportunities', text: 'الفرص التدريبية', icon: Briefcase, path: '/dashboard/institution/opportunities' },
    { id: 'attendance', text: 'سجل الحضور', icon: ClipboardList, path: '/dashboard/institution/attendance' },
    { id: 'evaluations', text: 'التقييمات', icon: Award, path: '/dashboard/institution/evaluations' },
    { id: 'profile', text: 'الملف الشخصي', icon: User, path: '/dashboard/institution/profile' },
    { id: 'settings', text: 'الاعدادات', icon: Settings, path: '/dashboard/institution/settings' }
  ];

  const registrarMenu = [
    { id: 'dashboard', text: 'لوحة القيادة', icon: Home, path: '/dashboard/registrar' },
    { id: 'applications', text: 'طلبات التسجيل', icon: Users, path: '/dashboard/registrar/applications' },
    { id: 'institutions', text: 'إدارة جهات التدريب', icon: Building2, path: '/dashboard/registrar/institutions' },
    { id: 'letters', text: 'الخطابات الرسمية', icon: Briefcase, path: '/dashboard/registrar/letters' },
    { id: 'users', text: 'إدارة المستخدمين', icon: ClipboardList, path: '/dashboard/registrar/users' },
    { id: 'communications', text: 'التواصل', icon: MessageSquare, path: '/dashboard/registrar/communications' },
    { id: 'grades', text: 'اعتماد الدرجات', icon: ShieldCheck, path: '/dashboard/registrar/grades' },
    { id: 'reports', text: 'التقارير', icon: BarChart3, path: '/dashboard/registrar/reports' },
    { id: 'settings', text: 'الاعدادات العام', icon: Settings, path: '/dashboard/registrar/settings' }
     
  ];

  const menuItems =
    user?.role === 'student' ? studentMenu :
    user?.role === 'supervisor' ? supervisorMenu :
    user?.role === 'institution' ? institutionMenu :
    registrarMenu;

  const handleLogout = () => {
    logout();
  };

  return (
    // Desktop: visible (md and up). Mobile: render as drawer when `isOpen`.
    <>
      <div className="hidden md:flex md:w-64 md:h-screen bg-white flex-col justify-between py-4 px-3 shrink-0 select-none font-cairo sticky top-0">

        {/* Brand logo at the top */}
        <div>
          <div className="mb-4 flex justify-center">
            <img
              src={logo}
              alt="Train Flow"
              className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* User Info card (Sleek design) */}
          {user && (
            <div className="mb-4 px-3 py-2 bg-gray-50 rounded-2xl flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-sm shrink-0">
                {user.name.substring(0, 1)}
              </div>
              <div className="overflow-hidden text-right">
                <h4 className="text-xs font-bold text-gray-800 truncate">{user.name}</h4>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all duration-200 ${isActive
                      ? 'bg-brand-purple text-white shadow-lg shadow-purple-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                >
                  <item.icon className={`h-4 w-4 ml-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200"
          >
            <LogOut className="h-4 w-4 ml-3.5 text-red-400 rotate-180" />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-4 shadow-lg overflow-auto flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <img src={logo} alt="Train Flow" className="h-8 w-auto object-contain" />
              <button onClick={onClose} className="text-gray-500 px-2 py-1 rounded hover:bg-gray-50">إغلاق</button>
            </div>

            {/* Mobile menu content (reuse desktop content) */}
            {user && (
              <div className="mb-4 px-3 py-2 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100/50">
                <div className="h-8 w-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name.substring(0, 1)}
                </div>
                <div className="overflow-hidden text-right">
                  <h4 className="text-xs font-bold text-gray-800 truncate">{user.name}</h4>
                </div>
              </div>
            )}

            <nav className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => { navigate(item.path); onClose && onClose(); }}
                    className={`w-full flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all duration-200 ${isActive
                        ? 'bg-brand-purple text-white shadow-lg shadow-purple-100'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <item.icon className={`h-4 w-4 ml-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout button - mobile */}
          <div className="pt-2 mt-2 border-t border-gray-50">
            <button
              onClick={() => { handleLogout(); onClose && onClose(); }}
              className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4 ml-3.5 text-red-400 rotate-180" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}