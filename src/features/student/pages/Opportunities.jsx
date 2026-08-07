import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, MapPin, Loader } from 'lucide-react';

const API = 'http://localhost:5000/api/student';

// ألوان ثابتة للوغو حسب الـ index
const logoStyles = [
  { bg: 'bg-[#fef3c7]', color: 'text-[#d97706]' },
  { bg: 'bg-[#ffe9db]', color: 'text-[#ff6a00]' },
  { bg: 'bg-[#fff9db]', color: 'text-[#ffc400]' },
  { bg: 'bg-[#e0f2fe]', color: 'text-[#0284c7]' },
  { bg: 'bg-[#f0fdf4]', color: 'text-[#16a34a]' },
];

const getLogoText = (name) => {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
};

export default function Opportunities() {
  const { triggerToast, token } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null); // institution_id اللي يتقدم عليها

 // تفاصيل الطلب الفعّال الحالي للطالب (لو موجود): { status, institutionName }
    const [activeRequest, setActiveRequest] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const hasActiveRequest = !!activeRequest;

  // جلب الجهات + فحص حالة الطلبات الحالية للطالب
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}/institutions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setInstitutions(data.data);
        }
      } catch (err) {
        console.error('خطأ في جلب الجهات:', err);
      } finally {
        setLoading(false);
      }
    };

   const checkActiveRequest = async () => {
  if (!token) return;
  setCheckingStatus(true);
  try {
    const res = await fetch(`${API}/my-requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      // بنفضّل الطلب المقبول لو موجود، وإلا بناخد أي طلب قيد المراجعة
      const approved = data.data.find((r) => r.status === 'approved');
      const pending = data.data.find((r) => r.status === 'pending');
      const active = approved || pending || null;

      setActiveRequest(
        active
          ? {
              status: active.status,
              institutionName: active.institution_name || 'الجهة المختارة',
            }
          : null
      );
    }
  } catch (err) {
    console.error('خطأ في فحص حالة الطلبات:', err);
  } finally {
    setCheckingStatus(false);
  }
};

    fetchInstitutions();
    checkActiveRequest();
  }, [token]);

  const handleApply = async (institution) => {
    if (hasActiveRequest) {
      triggerToast('لديك طلب تدريب فعّال حالياً، لا يمكنك التقديم لجهة جديدة.', 'error');
      return;
    }

    setApplying(institution.institution_id);
    try {
      const res = await fetch(`${API}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ institution_id: institution.institution_id })
      });
      const data = await res.json();
     if (data.success) {
    triggerToast(`تم تقديم طلبك لـ ${institution.name} بنجاح!`);
    setActiveRequest({ status: 'pending', institutionName: institution.name });
   } else {
        triggerToast(data.message || 'حدث خطأ أثناء التقديم', 'error');
      }
    } catch (err) {
      console.error('handleApply error:', err);
      triggerToast('حدث خطأ، حاول مرة أخرى.', 'error');
    } finally {
      setApplying(null);
    }
  };

      const filteredInstitutions = institutions.filter(inst => {
        const matchesSearch =
          inst.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.department?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });

      return (
        <div className="space-y-4 animate-fade-in text-right">

          {/* Header */}
          <div className="space-y-0.5">
            <h1 className="text-lg lg:text-xl font-extrabold text-gray-800">استكشاف الفرص</h1>
            <p className="text-gray-400 text-xs font-semibold">
              ابحث وتقدم للوظائف التدريبية الميدانية التي تتوافق مع تخصصك الاكاديمي
            </p>
          </div>

          {/* تنبيه: حالة الطلب الفعّال (تختلف الرسالة حسب pending أو approved) */}
    {!loading && !checkingStatus && activeRequest?.status === 'pending' && (
      <div className="bg-[#fef8e7] border border-[#fdf2cc] p-4 rounded-2xl text-right">
        <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
          ⚠️ طلبك لـ <span className="font-extrabold">{activeRequest.institutionName}</span> لسا
          قيد المراجعة من قِبل مشرفك الأكاديمي. لا يمكنك التقديم لجهة جديدة إلا في حال
          تم رفض طلبك الحالي.
        </p>
      </div>
    )}

  {!loading && !checkingStatus && activeRequest?.status === 'approved' && (
  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-right">
    <p className="text-[11px] text-green-800 font-semibold leading-relaxed">
      ✅ وافق مشرفك الأكاديمي على طلبك لجهة{' '}
      <span className="font-extrabold">{activeRequest.institutionName}</span>. ما بتقدر
      تتقدم لأي جهة تدريب تانية طالما هاد الطلب فعّال.
    </p>
  </div>
)}

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث..."
            className="w-full py-2.5 pl-4 pr-10 border border-gray-200 bg-white rounded-2xl text-right text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Counter */}
      <div className="text-xs font-bold text-gray-500">
        {loading ? 'جاري التحميل...' : `${filteredInstitutions.length} فرص متاحة`}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {filteredInstitutions.map((inst, index) => {
            const style = logoStyles[index % logoStyles.length];
            const logoText = getLogoText(inst.name);
            const isDisabled = applying === inst.institution_id || hasActiveRequest;

            return (
              <div key={inst.institution_id} className="bg-white rounded-[24px] border border-[#f0f4f9] p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between font-cairo text-right">

                {/* Logo + Department */}
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold shadow-sm ${style.bg} ${style.color}`}>
                    {logoText}
                  </div>
                  {inst.department && (
                    <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 font-bold">
                      {inst.department}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="mt-4">
                  <h3 className="text-sm font-extrabold text-gray-800">{inst.name}</h3>
                </div>

                {/* Location & Contact */}
                <div className="mt-3.5 space-y-2 border-t border-gray-50 pt-3.5">
                  {inst.address && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-semibold">{inst.address}</span>
                    </div>
                  )}
                  {inst.contact_phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold">📞 {inst.contact_phone}</span>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(inst)}
                  disabled={isDisabled}
                  className="w-full py-2.5 mt-5 bg-brand-purple text-white text-xs font-bold rounded-xl shadow-md shadow-purple-100 hover:bg-brand-purpleDark active:scale-[0.98] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                 {applying === inst.institution_id
              ? 'جاري التقديم...'
              : activeRequest?.status === 'approved'
                ? 'تمت الموافقة على طلبك'
                : activeRequest?.status === 'pending'
                  ? 'طلبك قيد المراجعة'
                  : 'تقدم الآن'}
                </button>

              </div>
            );
          })}

          {filteredInstitutions.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-bold">
              لا توجد فرص مطابقة للبحث
            </div>
          )}
        </div>
      )}

    </div>
  );
}