 import React from 'react';
import { Lock } from 'lucide-react';

export default function SettingsTab({
  settingsForm,
  setSettingsForm,
  handleUpdatePassword,
}) {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto text-right">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إعدادات النظام</h1>
        <p className="text-gray-400 text-xs font-semibold">تحكم في تفضيلات حسابك، الأمان، وتغيير كلمة المرور.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 space-y-6">

        <h3 className="text-xs font-extrabold text-gray-800 pb-2 border-b border-gray-50 flex items-center gap-2">
          <Lock className="h-4.5 w-4.5 text-brand-purple" />
          تغيير كلمة المرور
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md mx-auto">
          <div className="text-right space-y-1">
            <label className="text-[10px] font-bold text-gray-500">كلمة المرور الحالية *</label>
            <input
              type="password"
              value={settingsForm.currentPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
            />
          </div>

          <div className="text-right space-y-1">
            <label className="text-[10px] font-bold text-gray-500">كلمة المرور الجديدة *</label>
            <input
              type="password"
              value={settingsForm.newPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
            />
          </div>

          <div className="text-right space-y-1">
            <label className="text-[10px] font-bold text-gray-500">تأكيد كلمة المرور الجديدة *</label>
            <input
              type="password"
              value={settingsForm.confirmPassword}
              onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
            />
            <span className="text-[9px] text-gray-400 block pt-1 leading-normal">* يجب أن تحتوي على 8 أحرف على الأقل، تشمل أرقاماً ورموزاً.</span>
          </div>

          <div className="flex gap-2.5 pt-4">
            <button type="button" onClick={() => setSettingsForm({ currentPassword: '', newPassword: '', confirmPassword: '' })} className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition">
              إلغاء
            </button>
            <button type="submit" className="flex-1 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-md shadow-purple-50">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}