 import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ClipboardList, Building2, XCircle } from 'lucide-react';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Applied() {
  const { triggerToast } = useOutletContext();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    setApplicationsLoading(true);

    fetch(`${API}/student/my-requests`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const logoStyles = [
            'bg-green-50 text-green-650 border border-green-100/70',
            'bg-purple-50 text-brand-purple border border-purple-100/70',
            'bg-blue-50 text-blue-650 border border-blue-100/70',
            'bg-amber-50 text-amber-600 border border-amber-100/70',
          ];

          const statusMap = {
            'approved': 'accepted',
            'pending': 'pending',
            'rejected': 'rejected',
            'edit': 'edit',
          };

          const mapped = res.data.map((req, index) => {
            const descMap = {
              'accepted': 'تم قبول طلبك من قِبل جهة التدريب والأكاديمية، والآن أنت قيد المباشرة التدريبية.',
              'pending': 'الطلب قيد الدراسة والمراجعة من قِبل المشرف الأكاديمي لمطابقة خطتك الدراسية.',
              'rejected': req.rejection_reason || 'لم يتم توضيح سبب الرفض من قِبل المشرف الأكاديمي.',
              'edit': 'يرجى مراجعة ملفك وإعادة رفع المستندات المطلوبة.',
            };

            const logoText = req.institution_name
              ?.split(' ')
              .map(w => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 3) || '??';

            return {
              id: req.request_id,
              title: req.institution_department || 'متدرب',
              company: req.institution_name,
              logoText,
              logoBg: logoStyles[index % logoStyles.length],
              status: statusMap[req.status] || 'pending',
              date: req.submission_date
                ? new Date(req.submission_date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—',
              desc: descMap[req.status] || '',
              letterAvailable: !!req.student_copy_sent,
            };
          });

          setApplications(mapped);
        }
      })
      .catch(() => triggerToast('تعذر تحميل الطلبات', 'error'))
      .finally(() => setApplicationsLoading(false));
  }, []);

  const handleWithdrawRequest = async (app) => {
    try {
      const res = await fetch(`${API}/student/my-requests/${app.id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.filter(item => item.id !== app.id));
        triggerToast(`تم سحب طلب التقديم من ${app.company} بنجاح!`, 'error');
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال', 'error');
    }
  };

  const handleDownloadLetter = async (requestId) => {
    try {
      const res = await fetch(`${API}/student/letter/${requestId}/download`, { headers: getHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        triggerToast(data?.message || 'تعذر تحميل الخطاب', 'error');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `letter_${requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      triggerToast('تم تحميل الخطاب بنجاح');
    } catch {
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  // بما إنه النظام هلق ما بيسمح إلا بطلب فعّال واحد بكل وقت (pending أو accepted)،
  // بنفصل الطلب الفعّال الحالي (لو موجود) عن سجل الطلبات المرفوضة سابقاً.
  const activeRequest = applications.find(a => a.status === 'pending' || a.status === 'accepted' || a.status === 'edit');
  const rejectedHistory = applications.filter(a => a.status === 'rejected');

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-4xl mx-auto">
      <div className="space-y-0.5 border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">طلب التدريب الخاص بي</h1>
        <p className="text-gray-400 text-xs font-semibold">متابعة حالة طلبك الحالي وسجل طلباتك السابقة.</p>
      </div>

      {applicationsLoading && (
        <div className="flex justify-center items-center py-16">
          <span className="text-xs text-gray-400 font-bold">جاري التحميل...</span>
        </div>
      )}

      {!applicationsLoading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 space-y-2 bg-white rounded-3xl border border-gray-100/50">
          <ClipboardList className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-bold">لا توجد طلبات مقدمة بعد</p>
          <p className="text-xs font-semibold">تصفح فرص التدريب وتقدم الآن</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="mt-3 px-5 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purpleDark transition shadow-sm"
          >
            استكشاف الفرص
          </button>
        </div>
      )}

      {!applicationsLoading && applications.length > 0 && (
        <div className="space-y-6">

          {/* الطلب الفعّال الحالي */}
          {activeRequest ? (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${activeRequest.logoBg}`}>
                    {activeRequest.logoText}
                  </div>
                  <div className="text-right space-y-0.5">
                    <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      {activeRequest.company}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-semibold">{activeRequest.title} • تاريخ التقديم: {activeRequest.date}</p>
                  </div>
                </div>
                <div>
                  {activeRequest.status === 'accepted' && (
                    <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[11px] font-bold">مقبول ومثبت</span>
                  )}
                  {activeRequest.status === 'pending' && (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[11px] font-bold">تحت الدراسة</span>
                  )}
                  {activeRequest.status === 'edit' && (
                    <span className="px-3 py-1.5 bg-purple-50 text-brand-purple rounded-full border border-purple-100 text-[11px] font-bold">تعديل الملف</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-semibold bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                {activeRequest.desc}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                {activeRequest.status === 'accepted' && activeRequest.letterAvailable && (
                  <button
                    onClick={() => handleDownloadLetter(activeRequest.id)}
                    className="px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                  >
                    تنزيل خطاب التوجيه
                  </button>
                )}
                {activeRequest.status === 'edit' && (
                  <button
                    onClick={() => {
                      navigate('/dashboard/student/reports');
                      triggerToast('تم توجيهك لشاشة التقارير لتعديل المستند');
                    }}
                    className="px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                  >
                    إعادة رفع الملفات
                  </button>
                )}
                {activeRequest.status === 'pending' && (
                  <button
                    onClick={() => handleWithdrawRequest(activeRequest)}
                    className="px-5 py-2.5 border border-red-500 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition active:scale-95"
                  >
                    سحب الطلب
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <ClipboardList className="h-9 w-9 text-gray-300" />
              <p className="text-sm font-bold text-gray-500">ما عندك طلب تدريب فعّال حالياً</p>
              <p className="text-xs text-gray-400 font-semibold max-w-sm">
                بإمكانك تصفح فرص التدريب المتاحة والتقديم لجهة تدريب جديدة.
              </p>
              <button
                onClick={() => navigate('/opportunities')}
                className="mt-1 px-5 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purpleDark transition shadow-sm"
              >
                استكشاف الفرص
              </button>
            </div>
          )}

          {/* شروط التقديم */}
          <div className="bg-[#fef8e7] border border-[#fdf2cc] p-4 rounded-3xl text-right">
            <h4 className="text-[11px] font-extrabold text-amber-850 mb-1 flex items-center gap-1.5">
              ⚠️ شروط التقديم والاعتماد
            </h4>
            <p className="text-[10px] text-amber-800 leading-relaxed font-semibold">
              يسمح لك النظام بالتقديم لجهة تدريب واحدة فقط بنفس الوقت. إذا تم رفض طلبك من قِبل
              المشرف الأكاديمي، بإمكانك التقديم لجهة تدريب أخرى مباشرة.
            </p>
          </div>

          {/* سجل الطلبات المرفوضة سابقاً */}
          {rejectedHistory.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm">
              <div className="p-4 border-b border-gray-50">
                <h3 className="text-xs font-extrabold text-gray-800">سجل الطلبات السابقة</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">طلبات سبق وقدّمتها ولم يتم قبولها.</p>
              </div>
              <div className="divide-y divide-gray-50">
                {rejectedHistory.map(app => (
                  <div key={app.id} className="p-4 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <XCircle className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 text-right space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-extrabold text-gray-700">{app.company}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold shrink-0">{app.date}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                        سبب الرفض: {app.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}