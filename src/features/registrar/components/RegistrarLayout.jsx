import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/common/Sidebar';
import TopHeader from '../../../components/common/TopHeader';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Check, X, Eye, EyeOff } from 'lucide-react';

// نفس شروط الباسورد المطبقة بالباك اند وبباقي الفورمات
const passwordChecks = [
  { id: 'length', label: '8 أحرف على الأقل', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'حرف كبير واحد على الأقل (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'حرف صغير واحد على الأقل (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'رقم واحد على الأقل (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'رمز خاص واحد على الأقل (!@#$%...)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];
const isPasswordStrong = (pw) => passwordChecks.every((check) => check.test(pw));

const emptyStaff = { name: '', email: '', password: '', role: 'supervisor', department: '', contact_phone: '', address: '' };

export default function RegistrarDashboard() {
  const { addStudent } = useData();
  const { user, token } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', idNum: '', college: '', major: '' });

  // --- حالة Modal إضافة موظف جديد (مشرف / قبول وتسجيل / جهة تدريب) ---
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState(emptyStaff);
  const [staffErrors, setStaffErrors] = useState({});
  const [staffPasswordTouched, setStaffPasswordTouched] = useState(false);
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffSubmitting, setStaffSubmitting] = useState(false);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const handleOpenModal = () => {
      setShowAddStudentModal(true);
    };
    const handleOpenStaffModal = () => {
      setShowAddStaffModal(true);
    };
    window.addEventListener('open-add-student-modal', handleOpenModal);
    window.addEventListener('open-add-staff-modal', handleOpenStaffModal);
    return () => {
      window.removeEventListener('open-add-student-modal', handleOpenModal);
      window.removeEventListener('open-add-staff-modal', handleOpenStaffModal);
    };
  }, []);

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.idNum) {
      triggerToast('يرجى ملء الاسم والرقم الأكاديمي', 'error');
      return;
    }
    addStudent(newStudent);
    triggerToast(`تم إضافة الطالب ${newStudent.name} بنجاح!`);
    setShowAddStudentModal(false);
    setNewStudent({ name: '', idNum: '', college: '', major: '' });
  };

  const closeStaffModal = () => {
    setShowAddStaffModal(false);
    setNewStaff(emptyStaff);
    setStaffErrors({});
    setStaffPasswordTouched(false);
    setShowStaffPassword(false);
  };

  const validateStaffForm = () => {
    const errs = {};
    if (!newStaff.name || newStaff.name.trim().length < 3) {
      errs.name = 'الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل';
    }
    if (!newStaff.email) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(newStaff.email)) {
      errs.email = 'البريد الإلكتروني غير صالح';
    }
    if (!newStaff.password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (!isPasswordStrong(newStaff.password)) {
      errs.password = 'كلمة المرور لا تحقق كل الشروط الموضحة أدناه';
    }
    setStaffErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!validateStaffForm()) return;

    setStaffSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/create-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStaff),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        triggerToast(`تم إنشاء حساب "${newStaff.name}" بنجاح!`);
        closeStaffModal();
      } else {
        triggerToast(result.message || 'فشل إنشاء الحساب.', 'error');
      }
    } catch (err) {
      triggerToast('تعذر الاتصال بالسيرفر. حاول مرة أخرى.', 'error');
    } finally {
      setStaffSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fd] font-cairo select-none" dir="rtl">
      
      {/* Toast Alert */}
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
          <span className="text-xs font-bold text-right w-full">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopHeader onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Pages Area */}
        <div className="flex-1 p-4 lg:p-6 bg-[#f8f9fd]">
          <Outlet context={{ triggerToast, user, token }} />
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleAddStudentSubmit} className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border-none overflow-hidden text-right animate-fade-in">
            <div className="p-5 bg-gray-50 flex items-center justify-between border-none">
              <h3 className="text-xs font-extrabold text-gray-800">إضافة طالب جديد للبرنامج</h3>
              <button type="button" onClick={() => setShowAddStudentModal(false)} className="h-6 w-6 text-gray-400 hover:text-gray-700 flex items-center justify-center text-sm border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <div className="p-5 space-y-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label>اسم الطالب *</label>
                <input 
                  type="text" 
                  required
                  placeholder="الاسم الكامل"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                />
              </div>
              <div className="space-y-1">
                <label>الرقم الجامعي/الأكاديمي *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: 441005555"
                  value={newStudent.idNum}
                  onChange={e => setNewStudent({...newStudent, idNum: e.target.value})}
                  className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>الكلية</label>
                  <input 
                    type="text" 
                    placeholder="كلية الحاسب"
                    value={newStudent.college}
                    onChange={e => setNewStudent({...newStudent, college: e.target.value})}
                    className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right border-none font-cairo"
                  />
                </div>
                <div className="space-y-1">
                  <label>التخصص</label>
                  <input 
                    type="text" 
                    placeholder="علوم حاسب"
                    value={newStudent.major}
                    onChange={e => setNewStudent({...newStudent, major: e.target.value})}
                    className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right border-none font-cairo"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-end gap-2 border-none">
              <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 bg-white text-gray-650 hover:bg-gray-100 rounded-xl text-[10px] font-semibold border-none">إلغاء</button>
              <button type="submit" className="px-5 py-2 bg-brand-purple text-white rounded-xl text-[10px] font-bold hover:bg-[#5249c4] transition active:scale-95 shadow font-cairo border-none">إضافة</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Staff Modal (مشرف أكاديمي / موظف قبول وتسجيل / جهة تدريب) */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleAddStaffSubmit} className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border-none overflow-hidden text-right animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-5 bg-gray-50 flex items-center justify-between border-none sticky top-0">
              <h3 className="text-xs font-extrabold text-gray-800">إضافة موظف / جهة جديدة</h3>
              <button type="button" onClick={closeStaffModal} className="h-6 w-6 text-gray-400 hover:text-gray-700 flex items-center justify-center text-sm border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <div className="p-5 space-y-4 text-xs font-bold text-gray-700">

              {/* نوع الحساب */}
              <div className="space-y-1">
                <label>نوع الحساب *</label>
                <select
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo cursor-pointer"
                >
                  <option value="supervisor">مشرف أكاديمي</option>
                  <option value="registrar">موظف قبول وتسجيل</option>
                  <option value="institution">جهة تدريب (شركة)</option>
                </select>
              </div>

              {/* الاسم */}
              <div className="space-y-1">
                <label>{newStaff.role === 'institution' ? 'اسم الجهة *' : 'الاسم الكامل *'}</label>
                <input
                  type="text"
                  required
                  placeholder={newStaff.role === 'institution' ? 'شركة الاتصالات السعودية' : 'الاسم الكامل'}
                  value={newStaff.name}
                  onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                />
                {staffErrors.name && <p className="text-red-500 font-normal mt-1">{staffErrors.name}</p>}
                {newStaff.role === 'supervisor' && (
                  <p className="text-gray-400 font-normal mt-1">ملاحظة: الاسم لازم يكون فريد، ما بيقدر يتكرر مع مشرف آخر.</p>
                )}
              </div>

              {/* حقول إضافية خاصة بجهة التدريب بس */}
              {newStaff.role === 'institution' && (
                <>
                  <div className="space-y-1">
                    <label>القسم / المجال</label>
                    <input
                      type="text"
                      placeholder="مثال: تقنية المعلومات"
                      value={newStaff.department}
                      onChange={e => setNewStaff({ ...newStaff, department: e.target.value })}
                      className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>رقم الهاتف</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="05xxxxxxxx"
                      value={newStaff.contact_phone}
                      onChange={e => setNewStaff({ ...newStaff, contact_phone: e.target.value })}
                      className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>العنوان</label>
                    <input
                      type="text"
                      placeholder="المدينة، الحي، الشارع"
                      value={newStaff.address}
                      onChange={e => setNewStaff({ ...newStaff, address: e.target.value })}
                      className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                    />
                  </div>
                </>
              )}

              {/* الإيميل */}
              <div className="space-y-1">
                <label>البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  dir="ltr"
                  value={newStaff.email}
                  onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full p-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                />
                {staffErrors.email && <p className="text-red-500 font-normal mt-1">{staffErrors.email}</p>}
              </div>

              {/* الباسورد */}
              <div className="space-y-1">
                <label>كلمة المرور المؤقتة *</label>
                <div className="relative">
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    dir="ltr"
                    value={newStaff.password}
                    onFocus={() => setStaffPasswordTouched(true)}
                    onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full p-2.5 pl-9 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right font-semibold border-none font-cairo"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 bg-transparent border-none"
                  >
                    {showStaffPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {staffPasswordTouched && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                    <ul className="space-y-1">
                      {passwordChecks.map((check) => {
                        const passed = check.test(newStaff.password);
                        return (
                          <li key={check.id} className={`flex items-center justify-end gap-1.5 font-normal ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                            <span>{check.label}</span>
                            {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {staffErrors.password && <p className="text-red-500 font-normal mt-1">{staffErrors.password}</p>}
              </div>

              <p className="text-gray-400 font-normal">
                سيتم إنشاء الحساب مباشرة، وننصح بإبلاغ الجهة/الموظف بكلمة المرور المؤقتة ليقوم بتغييرها بعد أول دخول.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-end gap-2 border-none sticky bottom-0">
              <button type="button" onClick={closeStaffModal} className="px-4 py-2 bg-white text-gray-650 hover:bg-gray-100 rounded-xl text-[10px] font-semibold border-none">إلغاء</button>
              <button
                type="submit"
                disabled={staffSubmitting}
                className="px-5 py-2 bg-brand-purple text-white rounded-xl text-[10px] font-bold hover:bg-[#5249c4] transition active:scale-95 shadow font-cairo border-none disabled:opacity-60"
              >
                {staffSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}