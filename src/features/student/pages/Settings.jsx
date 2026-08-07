 import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Settings() {
  const { triggerToast } = useOutletContext();

  const [settingsForm, setSettingsForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!settingsForm.currentPassword || !settingsForm.newPassword || !settingsForm.confirmPassword) {
      triggerToast('يرجى تعبئة كافة الحقول المطلوبة', 'error');
      return;
    }
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      triggerToast('كلمة المرور الجديدة وتأكيدها غير متطابقين', 'error');
      return;
    }
    if (settingsForm.newPassword.length < 6) {
      triggerToast('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          currentPassword: settingsForm.currentPassword,
          newPassword: settingsForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        setSettingsForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-3xl mx-auto">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إعدادات الأمان والحساب</h1>
        <p className="text-gray-400 text-xs font-semibold">تغيير كلمة المرور وتعيين الخصائص الأمنية لحسابك.</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-550 block">كلمة المرور الحالية *</label>
            <input type="password" value={settingsForm.currentPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-550 block">كلمة المرور الجديدة *</label>
            <input type="password" value={settingsForm.newPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-550 block">تأكيد كلمة المرور الجديدة *</label>
            <input type="password" value={settingsForm.confirmPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40" required />
          </div>
          <div className="flex gap-2.5 pt-4">
            <button type="button" onClick={() => setSettingsForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}
              className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition">إلغاء</button>
            <button type="submit"
              className="flex-1 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-md shadow-purple-50">تغيير كلمة المرور</button>
          </div>
        </form>
      </div>
    </div>
  );
}