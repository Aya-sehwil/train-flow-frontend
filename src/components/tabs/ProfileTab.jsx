 import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function ProfileTab({
  profileData,
  setEditProfileForm,
  setShowEditProfileModal,
}) {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-right font-cairo">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">الملف الشخصي الأكاديمي</h1>
        <p className="text-gray-400 text-xs font-semibold">يمكنك هنا إدارة بياناتك الأكاديمية وجدول ساعاتك المكتبية المتاحة للطلاب.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="h-16 w-16 bg-gray-100 border border-gray-200/60 text-brand-purple text-3xl font-extrabold rounded-3xl flex items-center justify-center shadow-sm">
              {profileData.name ? profileData.name.charAt(0) : 'A'}
            </div>
            <div className="text-center sm:text-right space-y-1">
              <h2 className="text-lg font-extrabold text-gray-800">{profileData.name}</h2>
              <p className="text-xs text-gray-400 font-semibold">{profileData.role}</p>
              <span className="text-[10px] font-bold text-brand-purple block">{profileData.college}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditProfileForm({
                full_name: profileData.name,
                phone: profileData.phone === '—' ? '' : profileData.phone,
                office: profileData.office === '—' ? '' : profileData.office,
                bio: profileData.bio === 'لا توجد نبذة مهنية مضافة بعد.' ? '' : profileData.bio
              });
              setShowEditProfileModal(true);
            }}
            className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm shrink-0"
          >
            تعديل الملف الشخصي
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-extrabold text-gray-800 pb-2 border-b border-gray-50">التواصل الأكاديمي الرسمي</h3>

          <div className="space-y-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0"><Mail className="h-4.5 w-4.5" /></div>
              <div className="overflow-hidden">
                <span className="text-[9px] text-gray-400 block">البريد الأكاديمي الرسمي</span>
                <span className="font-bold text-gray-700 truncate block">{profileData.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0"><Phone className="h-4.5 w-4.5" /></div>
              <div>
                <span className="text-[9px] text-gray-400 block">رقم الهاتف</span>
                <span className="font-bold text-gray-700">{profileData.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0"><MapPin className="h-4.5 w-4.5" /></div>
              <div>
                <span className="text-[9px] text-gray-400 block">مقر المكتب</span>
                <span className="font-bold text-gray-700">{profileData.office}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100/50 shadow-sm text-center flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-green-600 block mb-1">{profileData.partners}</span>
            <span className="text-[10px] font-bold text-green-600">مؤسسة شريكة</span>
          </div>

          <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100/50 shadow-sm text-center flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-amber-600 block mb-1">{profileData.students}</span>
            <span className="text-[10px] font-bold text-amber-600">طالب تحت الإشراف</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5 pb-2 border-b border-gray-50">
            <FileText className="h-4.5 w-4.5 text-brand-purple" />
            نبذة مهنية
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-semibold">
            {profileData.bio}
          </p>
        </div>

      </div>
    </div>
  );
}