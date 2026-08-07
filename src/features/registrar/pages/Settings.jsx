import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Megaphone, 
  Calendar, 
  Bell, 
  Shield, 
  Send, 
  Save,
  Clock,
  CheckCircle2,
  Lock,
  ChevronLeft
} from 'lucide-react';

export default function Settings() {
  const { triggerToast } = useOutletContext();
  const [activeSection, setActiveSection] = useState('announcements'); // 'announcements' | 'periods' | 'notifications' | 'security'

  // Form States
  const [announcement, setAnnouncement] = useState({
    target: 'students',
    channelSystem: true,
    channelEmail: true,
    title: '',
    content: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!announcement.title || !announcement.content) {
      triggerToast('يرجى ملء عنوان ومحتوى التعميم', 'error');
      return;
    }
    triggerToast('تم إرسال التعميم بنجاح لجميع الطلاب والمشرفين!');
    setAnnouncement({ target: 'students', channelSystem: true, channelEmail: true, title: '', content: '' });
  };

  const handleSaveDraft = () => {
    triggerToast('تم حفظ التعميم كمسودة بنجاح', 'info');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    triggerToast('تم تحديث كلمة المرور بنجاح');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo select-none" dir="rtl">
      
      {/* Header */}
      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">اعدادات النظام والاشعارات</h1>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Content Section (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Announcements & Notifications Section */}
          {activeSection === 'announcements' && (
            <>
              {/* Send announcement card */}
              <form onSubmit={handleSendAnnouncement} className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="flex items-center gap-3.5 pb-2">
                  <div className="h-10 w-10 bg-purple-50 text-brand-purple rounded-full flex items-center justify-center shrink-0">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-800">إرسال تعميم جديد</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">أرسل رسائل هامة لجميع الطلاب أو المشرفين المسجلين في النظام.</p>
                  </div>
                </div>

                {/* Filters / targets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700 items-end">
                  <div className="space-y-1">
                    <label className="text-gray-650 flex items-center gap-1">
                      <span>الفئة المستهدفة</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={announcement.target}
                      onChange={e => setAnnouncement({...announcement, target: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 rounded-2xl border-none font-bold text-gray-750 focus:outline-none cursor-pointer font-cairo"
                    >
                      <option value="students">جميع الطلاب</option>
                      <option value="supervisors">جميع المشرفين</option>
                      <option value="all">الكل (طلاب ومشرفين)</option>
                    </select>
                  </div>

                  {/* Channels checkboxes */}
                  <div className="space-y-2 pb-2 text-[10px]">
                    <span className="block text-gray-400 font-bold mb-1">قناة الإرسال</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={announcement.channelSystem}
                          onChange={e => setAnnouncement({...announcement, channelSystem: e.target.checked})}
                          className="h-4 w-4 rounded text-brand-purple focus:ring-purple-400 cursor-pointer"
                        />
                        <span className="text-gray-700 font-bold">إشعار نظام</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={announcement.channelEmail}
                          onChange={e => setAnnouncement({...announcement, channelEmail: e.target.checked})}
                          className="h-4 w-4 rounded text-brand-purple focus:ring-purple-400 cursor-pointer"
                        />
                        <span className="text-gray-700 font-bold">بريد إلكتروني</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Announcement Title */}
                <div className="space-y-1 text-xs font-bold text-gray-750">
                  <label className="flex items-center gap-1">
                    <span>عنوان التعميم</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: هام بخصوص مواعيد تسليم التقارير النهائية"
                    value={announcement.title}
                    onChange={e => setAnnouncement({...announcement, title: e.target.value})}
                    className="w-full p-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right border-none font-semibold font-cairo"
                  />
                </div>

                {/* Message Content */}
                <div className="space-y-1 text-xs font-bold text-gray-750">
                  <label className="flex items-center gap-1">
                    <span>محتوى الرسالة</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="اكتب محتوى التعميم هنا..."
                    value={announcement.content}
                    onChange={e => setAnnouncement({...announcement, content: e.target.value})}
                    className="w-full p-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200/50 text-right border-none font-semibold font-cairo"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button 
                    type="submit"
                    className="flex items-center gap-1 px-5 py-2.5 bg-brand-purple hover:bg-[#5249c4] text-white rounded-xl font-bold transition active:scale-95 duration-200 border-none font-cairo cursor-pointer shadow"
                  >
                    <Send className="h-4 w-4 rotate-180" /> إرسال التعميم
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2.5 border border-brand-purple text-brand-purple hover:bg-purple-50 font-bold rounded-xl transition active:scale-95 duration-200 bg-white cursor-pointer"
                  >
                    حفظ كمسودة
                  </button>
                </div>

              </form>

              {/* Current registration periods card (at the bottom) */}
              <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <h3 className="text-xs font-extrabold text-gray-800">فترات التسجيل الحالية</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => triggerToast('شاشة تعديل الفترات قريباً')}
                    className="text-[10px] font-bold text-brand-purple hover:underline bg-transparent border-none cursor-pointer"
                  >
                    تعديل التواريخ
                  </button>
                </div>

                {/* Period details container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 bg-gray-50/50 rounded-2xl space-y-3 flex flex-col justify-between border-none">
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold block">الفصل الدراسي الأول 2024</span>
                      <h4 className="text-xs font-extrabold text-gray-800">تسجيل الطلاب للتدريب الميداني</h4>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 gap-3 pt-2">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> 01 سبتمبر 2024</span>
                      <span className="text-gray-400">إلى</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-gray-700" /> 15 سبتمبر 2024</span>
                    </div>

                    <div className="pt-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold">نشط حالياً</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Section 2: Registration Periods Edit */}
          {activeSection === 'periods' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800">فترات التسجيل والتقويم</h3>
              <p className="text-xs text-gray-400">تعديل وضبط فترات التقديم للفصل الدراسي القادم.</p>
            </div>
          )}

          {/* Section 3: Notification Toggles */}
          {activeSection === 'notifications' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800">تفضيلات الإشعارات</h3>
              <p className="text-xs text-gray-400">تعديل قنوات وتنبيهات الرسائل النصية التلقائية.</p>
            </div>
          )}

          {/* Section 4: Security and Password */}
          {activeSection === 'security' && (
            <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-gray-800">تغيير كلمة المرور</h3>
              <div className="space-y-3 max-w-sm text-xs font-bold text-gray-700">
                <div className="space-y-1">
                  <label>كلمة المرور الحالية</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-150 rounded-2xl border-none text-right font-mono focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label>كلمة المرور الجديدة</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-150 rounded-2xl border-none text-right font-mono focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="px-5 py-2 bg-brand-purple text-white rounded-xl text-[10px] font-bold border-none cursor-pointer">حفظ كلمة المرور</button>
            </form>
          )}

        </div>

        {/* Right Column: Menu Options Selection (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl shadow-sm space-y-3">
          
          <button
            onClick={() => setActiveSection('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition duration-200 border-none cursor-pointer ${
              activeSection === 'announcements'
                ? 'bg-purple-50/40 text-brand-purple font-extrabold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-semibold'
            }`}
          >
            <Megaphone className="h-4.5 w-4.5" />
            <span>التعميمات والإشعارات</span>
          </button>

          <button
            onClick={() => setActiveSection('periods')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition duration-200 border-none cursor-pointer ${
              activeSection === 'periods'
                ? 'bg-purple-50/40 text-brand-purple font-extrabold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-semibold'
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            <span>فترات التسجيل</span>
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition duration-200 border-none cursor-pointer ${
              activeSection === 'notifications'
                ? 'bg-purple-50/40 text-brand-purple font-extrabold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-semibold'
            }`}
          >
            <Bell className="h-4.5 w-4.5" />
            <span>تفضيلات التنبيهات</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition duration-200 border-none cursor-pointer ${
              activeSection === 'security'
                ? 'bg-purple-50/40 text-brand-purple font-extrabold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-semibold'
            }`}
          >
            <Shield className="h-4.5 w-4.5" />
            <span>إعدادات الأمان</span>
          </button>

        </div>

      </div>

    </div>
  );
}
