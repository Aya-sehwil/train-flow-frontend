 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Phone, MapPin, FileText, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Profile() {
  const { triggerToast, token } = useOutletContext();
  const { updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '', role: '', college: '', email: '', phone: '', office: '', partners: 0, students: 0, bio: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ full_name: '', phone: '', office: '', bio: '' });

  const fetchProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfileData({
          name: data.data.full_name || '',
          role: data.data.role_title || 'مشرف أكاديمي',
          college: data.data.college || '—',
          email: data.data.email || '',
          phone: data.data.phone || '—',
          office: data.data.office || '—',
          partners: data.data.partners_count || 0,
          students: data.data.students_count || 0,
          bio: data.data.bio || 'لا توجد نبذة مهنية مضافة بعد.'
        });
      }
    } catch (error) {
      console.error('fetchProfile error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editProfileForm),
      });
      const data = await response.json();
      if (data.success) {
        triggerToast('تم تحديث الملف الشخصي بنجاح!');
        setShowEditProfileModal(false);
        fetchProfile();
        updateUser({ name: editProfileForm.full_name });
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء التحديث', 'error');
      }
    } catch (error) {
      console.error('updateProfile error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  return (
     <> 
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
      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-brand-purple" />
                تعديل الملف الشخصي
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">الاسم الكامل</label>
                <input
                  type="text"
                  value={editProfileForm.full_name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, full_name: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                <input
                  type="text"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  placeholder="مثال: 011-487-5502"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مقر المكتب</label>
                <input
                  type="text"
                  value={editProfileForm.office}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, office: e.target.value })}
                  placeholder="مثال: مبنى G1، الطابق الثالث، مكتب 304"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة مهنية</label>
                <textarea
                  value={editProfileForm.bio}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                  placeholder="اكتبي نبذة مختصرة عنك..."
                  className="w-full min-h-[80px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}