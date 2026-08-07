import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MapPin, Users, FileText, Camera } from 'lucide-react';

const SERVER_BASE = 'http://localhost:5000';
const API = `${SERVER_BASE}/api`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// هيدرز خاصة برفع الملفات - بدون Content-Type عشان المتصفح يحطها صح لوحده (multipart/form-data)
const getUploadHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const STATUS_LABELS = {
  active: { text: 'معتمد نشط', className: 'bg-green-100 text-green-700' },
  pending: { text: 'قيد المراجعة', className: 'bg-amber-100 text-amber-700' },
  expired: { text: 'اعتماد مجمّد', className: 'bg-red-100 text-red-700' },
};

export default function Profile() {
  const { triggerToast: outletToast } = useOutletContext() || {};
  const fileInputRef = useRef(null);

  // Toast notifications state and trigger (نفس نمط الصفحات التانية بالمشروع)
  const [toast, setToast] = useState(null);
  const triggerToast = (msg, type = 'success') => {
    if (outletToast) return outletToast(msg, type);
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [status, setStatus] = useState('pending');
  const [logoUrl, setLogoUrl] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    department: '',
    contact_phone: '',
    contact_person_name: '',
    description: '',
  });

  useEffect(() => {
    fetch(`${API}/institution/profile`, { headers: getHeaders() })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setForm({
            name: res.data.name || '',
            email: res.data.email || '',
            address: res.data.address || '',
            department: res.data.department || '',
            contact_phone: res.data.contact_phone || '',
            contact_person_name: res.data.contact_person_name || '',
            description: res.data.description || '',
          });
          setStatus(res.data.status || 'pending');
          setLogoUrl(res.data.logo_url || '');
        } else {
          triggerToast(res.message || 'تعذر تحميل البيانات', 'error');
        }
      })
      .catch(() => triggerToast('تعذر الاتصال بالسيرفر', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      triggerToast('نوع الملف غير مدعوم. الرجاء اختيار صورة JPG أو PNG أو WEBP.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('حجم الصورة كبير جداً. الحد الأقصى 2 ميجابايت.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setUploadingLogo(true);
    try {
      const res = await fetch(`${API}/institution/profile/logo`, {
        method: 'POST',
        headers: getUploadHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setLogoUrl(data.logo_url);
        triggerToast('تم تحديث شعار المؤسسة بنجاح ✅');
      } else {
        triggerToast(data.message || 'تعذر رفع الشعار', 'error');
      }
    } catch {
      triggerToast('تعذر الاتصال بالسيرفر', 'error');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      triggerToast('اسم الجهة مطلوب', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/institution/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          department: form.department,
          contact_phone: form.contact_phone,
          contact_person_name: form.contact_person_name,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('تم حفظ بيانات الملف الشخصي بنجاح');
      } else {
        triggerToast(data.message || 'تعذر حفظ التغييرات', 'error');
      }
    } catch {
      triggerToast('تعذر الاتصال بالسيرفر', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-xs text-gray-400 font-bold text-center py-20">جاري تحميل البيانات...</p>;
  }

  const statusInfo = STATUS_LABELS[status] || STATUS_LABELS.pending;

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      {/* Toast Notification (بس لو الصفحة مش جوا Layout بيوفر triggerToast) */}
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
          <span className="text-sm font-semibold text-right w-full">{toast.msg}</span>
        </div>
      )}

      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">الملف الشخصي للمؤسسة</h1>
        <p className="text-gray-400 text-xs font-semibold">إدارة وعرض بيانات ومعلومات المؤسسة التدريبية.</p>
      </div>

      <div className="max-w-3xl bg-white rounded-3xl border border-gray-150/40 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-gray-50 text-center sm:text-right">
          
          {/* الشعار: صورة لو موجودة، وإلا الحرف الأول من الاسم - مع زر كاميرا للرفع */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 bg-brand-purple/10 text-brand-purple flex items-center justify-center text-3xl font-extrabold rounded-3xl shadow-sm border border-brand-purple/20 overflow-hidden">
              {logoUrl ? (
                <img src={`${SERVER_BASE}${logoUrl}`} alt="شعار المؤسسة" className="h-full w-full object-cover" />
              ) : (
                form.name ? form.name[0] : 'م'
              )}
            </div>
            <button
              type="button"
              onClick={handleLogoClick}
              disabled={uploadingLogo}
              title="تغيير الشعار"
              className="absolute -bottom-1 -left-1 h-7 w-7 bg-brand-purple text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#5249c4] transition border-2 border-white cursor-pointer disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>

          <div className="space-y-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="اسم المؤسسة"
                className="text-lg font-extrabold text-gray-805 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-brand-purple focus:outline-none w-full sm:w-auto text-center sm:text-right font-cairo"
              />
              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap ${statusInfo.className}`}>
                {statusInfo.text}
              </span>
            </div>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="العنوان (مثال: الرياض، حي العليا)"
              className="text-xs text-gray-400 font-bold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-brand-purple focus:outline-none w-full text-center sm:text-right font-cairo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold text-gray-700">
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block">البريد الإلكتروني الرسمي</span>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Mail className="h-4 w-4 text-gray-455 shrink-0" />
              <span dir="ltr" className="text-gray-500">{form.email}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block">رقم الهاتف</span>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Phone className="h-4 w-4 text-gray-455 shrink-0" />
              <input
                type="text"
                dir="ltr"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+966 5xxxxxxxx"
                className="bg-transparent focus:outline-none w-full font-cairo"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block">القسم / الإدارة المسؤولة</span>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <MapPin className="h-4 w-4 text-gray-455 shrink-0" />
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="مثال: إدارة الموارد البشرية"
                className="bg-transparent focus:outline-none w-full font-cairo"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block">مسؤول التدريب المباشر</span>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Users className="h-4 w-4 text-gray-455 shrink-0" />
              <input
                type="text"
                value={form.contact_person_name}
                onChange={(e) => setForm({ ...form, contact_person_name: e.target.value })}
                placeholder="مثال: أ. عبدالرحمن المدير"
                className="bg-transparent focus:outline-none w-full font-cairo"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs font-semibold text-gray-700">
          <span className="text-[10px] text-gray-400 font-bold block">نبذة عن المؤسسة</span>
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <FileText className="h-4 w-4 text-gray-455 shrink-0 mt-0.5" />
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="اكتبي نبذة مختصرة عن المؤسسة ومجالات التدريب فيها..."
              className="bg-transparent focus:outline-none w-full font-cairo resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-2xl hover:bg-[#5249c4] transition shadow-md font-cairo cursor-pointer disabled:opacity-60"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ بيانات الملف الشخصي'}
          </button>
        </div>
      </div>
    </div>
  );
}