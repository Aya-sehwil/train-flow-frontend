import React from 'react';

export default function Settings({ triggerToast = () => {} }) {
  return (
    <div className="space-y-6 animate-fade-in text-right">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إعدادات الحساب والنظام</h1>
        <p className="text-gray-400 text-xs font-semibold">تخصيص خيارات الأمان والاشعارات للنظام.</p>
      </div>

      <div className="max-w-3xl bg-white rounded-3xl border border-gray-150/40 shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 border-b border-gray-50 pb-2">خيارات الأمان وحماية البيانات</h3>
          
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-800">تغيير كلمة المرور</h4>
              <p className="text-[10px] text-gray-400 font-semibold">لتأمين حساب المؤسسة وتحديث بيانات تسجيل الدخول.</p>
            </div>
            <button 
              onClick={() => triggerToast('تغيير كلمة المرور متاح قريباً', 'info')}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-[10px] font-bold hover:bg-gray-100 transition font-cairo bg-white"
            >
              تحديث كلمة المرور
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-800">التحقق بخطوتين (2FA)</h4>
              <p className="text-[10px] text-gray-400 font-semibold font-cairo">إضافة طبقة حماية إضافية عبر تطبيق الهاتف.</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-1 after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h3 className="text-xs font-bold text-gray-400 border-b border-gray-50 pb-2">الإشعارات والتنبيهات المباشرة</h3>
          
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-800">تنبيهات البريد الإلكتروني</h4>
              <p className="text-[10px] text-gray-400 font-semibold font-cairo">إرسال بريد إلكتروني عند تقديم طالب لطلب انضمام جديد.</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-1 after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
