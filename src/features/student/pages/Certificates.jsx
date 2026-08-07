 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Certificates() {
  const { triggerToast } = useOutletContext();

  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [requiredHours, setRequiredHours] = useState(130);
  const [completedHours, setCompletedHours] = useState(0);

  useEffect(() => {
    setEvalLoading(true);
    fetch(`${API}/student/evaluation`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) setEvaluation(res.data);
      })
      .catch(() => triggerToast('تعذر تحميل بيانات التقييم', 'error'))
      .finally(() => setEvalLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API}/attendance/stats`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setCompletedHours(res.data.completedHours);
          setRequiredHours(res.data.requiredHours);
        }
      })
      .catch(() => {});
  }, []);

  const handleCertificateDownload = async () => {
    try {
      const res = await fetch(`${API}/student/certificate/download`, { headers: getHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        triggerToast(data?.message || 'تعذر تحميل الشهادة', 'error');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      triggerToast('تم تحميل شهادة التدريب المعتمدة بنجاح!');
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">التقييم والشهادات</h1>
          <p className="text-gray-400 text-xs font-semibold">كشف ملخص التقييم والنتائج النهائية المعتمدة من الجهات الأكاديمية والتدريبية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 border-b border-gray-50 pb-2 w-full">تقييم المشرف الأكاديمي</h3>
          {evalLoading ? (
            <div className="text-gray-400 text-xs font-bold py-8">جاري التحميل...</div>
          ) : (
            <>
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle cx="56" cy="56" r="48" stroke="#4d44b5" strokeWidth="8" fill="transparent"
                    strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * (evaluation?.academic_total ?? 0)) / 100} />
                </svg>
                <span className="absolute text-xl font-extrabold text-[#4d44b5]">{evaluation?.academic_total ?? 0} %</span>
              </div>
              <div className="text-xs space-y-1.5 w-full text-right bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">الالتزام والمواظبة:</span>
                  <span className="text-gray-800 font-extrabold">{evaluation?.attendance_score ?? 0} / 20</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">التقييم الشفهي والمناقشة:</span>
                  <span className="text-gray-800 font-extrabold">{evaluation?.oral_score ?? 0} / 60</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">التقرير النهائي المعتمد:</span>
                  <span className="text-gray-800 font-extrabold">{evaluation?.final_report_score ?? 0} / 20</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 border-b border-gray-50 pb-2 w-full">تقييم مشرف جهة التدريب</h3>
          {evalLoading ? (
            <div className="text-gray-400 text-xs font-bold py-8">جاري التحميل...</div>
          ) : evaluation?.field_available ? (
            <>
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle cx="56" cy="56" r="48" stroke="#10b981" strokeWidth="8" fill="transparent"
                    strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * (evaluation?.field_total ?? 0)) / 100} />
                </svg>
                <span className="absolute text-xl font-extrabold text-green-600">{evaluation?.field_total ?? 0} %</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">النتيجة الإجمالية المعتمدة من جهة التدريب</p>
            </>
          ) : (
            <div className="py-8 space-y-2">
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold inline-block">لم يُرصد بعد</span>
              <p className="text-[10px] text-gray-400 font-semibold px-4">
                لم تصل بعد نتيجة تقييمك من جهة التدريب.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-purple-50 text-brand-purple rounded-2xl border border-purple-100 flex items-center justify-center text-xl shrink-0">🏆</div>
            <div className="text-right">
              <h3 className="text-xs font-extrabold text-gray-800">شهادة إتمام التدريب الميداني المعتمدة</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                يمكنك تنزيل شهادة إنجاز التدريب الموقعة الكترونياً بعد إتمام {requiredHours} ساعة.
              </p>
            </div>
          </div>
          <button
            onClick={handleCertificateDownload}
            disabled={completedHours < requiredHours}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[11px] font-bold transition shadow-sm active:scale-95 shrink-0 ${
              completedHours < requiredHours
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#4d44b5] text-white hover:bg-[#4d44b5]/90'
            }`}
          >
            <Download className="h-4 w-4" /> تنزيل الشهادة المعتمدة (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}