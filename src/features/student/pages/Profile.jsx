 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Profile() {
  const { triggerToast, user } = useOutletContext();

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [bioText, setBioText] = useState('');
  const [phoneText, setPhoneText] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    setProfileLoading(true);
    fetch(`${API}/student/profile`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setProfileData(res.data);
          setBioText(res.data.training_summary || '');
          setPhoneText(res.data.phone || '');
        } else {
          triggerToast(res.message || 'تعذر تحميل بيانات الملف الشخصي', 'error');
        }
      })
      .catch(() => triggerToast('تعذر الاتصال بالخادم', 'error'))
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API}/attendance/stats`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => { if (res.success) setTotalDays(res.data.totalDays); })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/student/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          phone: phoneText,
          address: profileData?.address || null,
          training_summary: bioText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        setProfileData(prev => prev ? { ...prev, phone: phoneText, training_summary: bioText } : prev);
        setIsEditing(false);
      } else {
        triggerToast(data.message || 'تعذر حفظ التغييرات', 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">الملف الشخصي للطالب</h1>
        <p className="text-gray-400 text-xs font-semibold">عرض وتعديل معلوماتك الشخصية وسجل التدريب الميداني.</p>
      </div>

      {profileLoading && !profileData ? (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-400 text-xs font-bold">
          جاري تحميل بيانات الملف الشخصي...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
            <div className="space-y-2">
              <div className="h-16 w-16 bg-purple-50 text-brand-purple border border-purple-100 rounded-full flex items-center justify-center font-extrabold text-xl mx-auto shadow-sm">
                {user?.name.substring(0, 1)}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-gray-800">{user?.name}</h3>
                <span className="text-gray-400 font-bold block">الرقم الجامعي: {user?.university_id || 'غير محدد'}</span>
              </div>
            </div>
            <div className="w-full text-xs space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-right">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">التخصص:</span>
                <span className="text-gray-700 font-extrabold">{profileData?.major || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">الكلية:</span>
                <span className="text-gray-700 font-extrabold">{profileData?.college || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">أيام الحضور المسجلة:</span>
                <span className="text-green-600 font-extrabold">{totalDays} يوم</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <h3 className="text-xs font-extrabold text-gray-800 border-b border-gray-50 pb-2">بيانات جهة التدريب والأكاديمية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">البريد الإلكتروني للجامعة</span>
                <span className="text-gray-700 font-extrabold">{user?.email}</span>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 block font-semibold">رقم الجوال</label>
                {isEditing ? (
                  <input type="text" value={phoneText} onChange={(e) => setPhoneText(e.target.value)}
                    placeholder="أدخل رقم جوالك"
                    className="w-full py-1.5 px-2.5 border border-gray-200 rounded-xl text-right text-xs font-extrabold text-gray-700 focus:outline-none focus:border-brand-purple/40" />
                ) : (
                  <span className="text-gray-700 font-extrabold block">{phoneText || '—'}</span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">المشرف الأكاديمي</span>
                <span className="text-[#4d44b5] font-extrabold">{profileData?.supervisor_name || 'لم يتم التعيين بعد'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">مشرف جهة التدريب</span>
                <span className="text-gray-700 font-extrabold">أ. خالد منصور</span>
              </div>
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <span className="text-gray-400 block font-semibold">جهة التدريب الحالية</span>
                <span className="text-gray-700 font-extrabold">
                  {profileData?.institution_name
                    ? `${profileData.institution_name}${profileData.institution_department ? ' - ' + profileData.institution_department : ''}`
                    : 'لم يتم تثبيت طلب تدريب بعد'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 pt-4 border-t border-gray-50">
              <label className="text-[10px] font-bold text-gray-550 block">نبذة / ملخص التدريب</label>
              {isEditing ? (
                <textarea value={bioText} onChange={(e) => setBioText(e.target.value)}
                  placeholder="اكتبي نبذة عن تدريبك..."
                  className="w-full min-h-[70px] p-3 border border-gray-200 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40" />
              ) : (
                <p className="text-xs text-gray-600 font-semibold leading-relaxed bg-gray-50/50 p-3 rounded-2xl border border-gray-100 min-h-[50px]">
                  {bioText || '—'}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-3">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition">إلغاء</button>
                  <button onClick={handleSaveProfile} disabled={savingProfile}
                    className="px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purpleDark transition shadow-sm active:scale-95 disabled:opacity-50">
                    {savingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 border border-brand-purple text-brand-purple text-xs font-bold rounded-xl hover:bg-purple-50 transition active:scale-95">
                  تعديل
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}