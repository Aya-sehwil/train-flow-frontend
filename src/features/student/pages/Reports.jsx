import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, FileText, Send, Paperclip, Loader } from 'lucide-react';

const API = 'http://localhost:5000/api';

// عدد أسابيع التدريب المتاحة بالقائمة المنسدلة - عدليه لو مدة التدريب عندك مختلفة
const WEEK_OPTIONS = Array.from({ length: 20 }, (_, i) => `الأسبوع ${i + 1}`);

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Reports() {
  const { triggerToast } = useOutletContext();

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [showUploadReportModal, setShowUploadReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ week: '', tasks: '', challenges: '', file: null });

  const loadReports = () => {
    setReportsLoading(true);
    fetch(`${API}/reports`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setReports(res.data.map(r => ({
            id: r.attachment_id,
            week: r.week_number,
            date: r.uploaded_at?.split('T')[0],
            status: r.status,
            tasks: r.tasks,
            challenges: r.challenges,
            feedback: r.supervisor_feedback || 'قيد الدراسة والمراجعة',
          })));
        }
      })
      .catch(() => triggerToast('تعذر تحميل التقارير', 'error'))
      .finally(() => setReportsLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDownload = async (reportId) => {
    try {
      const res = await fetch(`${API}/reports/download/${reportId}`, { headers: getHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        triggerToast(data?.message || 'تعذر تحميل الملف', 'error');
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      let filename = `report_${reportId}`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      triggerToast('تم تحميل الملف بنجاح');
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportForm.week || !reportForm.tasks || !reportForm.challenges) {
      triggerToast('الرجاء تعبئة كافة الحقول المطلوبة', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('week_number', reportForm.week);
      formData.append('tasks', reportForm.tasks);
      formData.append('challenges', reportForm.challenges);
      if (reportForm.file) formData.append('file', reportForm.file);
      const res = await fetch(`${API}/reports`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        loadReports();
        setShowUploadReportModal(false);
        setReportForm({ week: '', tasks: '', challenges: '', file: null });
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="space-y-0.5">
            <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">التقارير الدورية والأسبوعية</h1>
            <p className="text-gray-400 text-xs font-semibold">قم برفع تقاريرك التدريبية الميدانية بانتظام ليقوم بمراجعتها مشرفك الأكاديمي.</p>
          </div>
          <button onClick={() => setShowUploadReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark active:scale-95 transition shrink-0 shadow-md shadow-purple-100">
            <Plus className="h-4 w-4" /> رفع تقرير جديد
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-100/60 shadow-sm">
          <div className="flex-1 w-full relative">
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input type="text" placeholder="البحث في تقاريرك..." value={reportSearchQuery}
              onChange={(e) => setReportSearchQuery(e.target.value)}
              className="w-full py-2 pr-10 pl-4 bg-gray-50 border border-gray-200/80 rounded-xl text-right text-xs focus:outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-400 border-b border-gray-50">
                  <th className="p-4">الأسبوع</th>
                  <th className="p-4">تاريخ الرفع</th>
                  <th className="p-4">حالة التقرير</th>
                  <th className="p-4">ملاحظات وتوجيهات المشرف الأكاديمي</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
                {reportsLoading ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs font-bold">جاري تحميل التقارير...</td></tr>
                ) : reports.filter(rep => rep.week.includes(reportSearchQuery) || rep.feedback.includes(reportSearchQuery)).map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-800">{rep.week}</td>
                    <td className="p-4 text-gray-400 font-semibold">{rep.date}</td>
                    <td className="p-4">
                      {rep.status === 'approved' && <span className="px-2.5 py-0.5 bg-green-50 text-green-650 rounded-full border border-green-100 text-[10px] font-bold">معتمد مقبول</span>}
                      {rep.status === 'edit' && <span className="px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full border border-red-100 text-[10px] font-bold">معاد للتعديل</span>}
                      {rep.status === 'pending' && <span className="px-2.5 py-0.5 bg-purple-50 text-brand-purple rounded-full border border-purple-100 text-[10px] font-bold">قيد الدراسة</span>}
                    </td>
                    <td className="p-4 font-semibold text-gray-500 max-w-xs truncate" title={rep.feedback}>{rep.feedback}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-2.5 justify-center">
                        <button onClick={() => handleDownload(rep.id)} className="text-[10px] font-bold text-brand-purple hover:underline">تنزيل الملف</button>
                        {rep.status === 'edit' && (
                          <button onClick={() => { setReportForm({ week: rep.week, tasks: rep.tasks, challenges: rep.challenges, file: null }); setShowUploadReportModal(true); }}
                            className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[9px] font-bold hover:bg-red-650 transition">تعديل ورفع</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUploadReportModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button type="button"
                onClick={() => { setShowUploadReportModal(false); setReportForm({ week: '', tasks: '', challenges: '', file: null }); }}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold">✕</button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-purple" /> رفع تقرير تدريبي أسبوعي
              </h3>
            </div>

            <form onSubmit={handleSubmitReport}>
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-550 block">رقم الأسبوع التدريبي *</label>
                  <select
                    value={reportForm.week}
                    onChange={(e) => setReportForm({ ...reportForm, week: e.target.value })}
                    required
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40 bg-white cursor-pointer"
                  >
                    <option value="" disabled>اختر رقم الأسبوع</option>
                    {WEEK_OPTIONS.map((weekLabel) => (
                      <option key={weekLabel} value={weekLabel}>{weekLabel}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-550 block">المهام والأعمال المنجزة *</label>
                  <textarea value={reportForm.tasks}
                    onChange={(e) => setReportForm({ ...reportForm, tasks: e.target.value })}
                    placeholder="اشرح المهام التي قمت بها خلال هذا الأسبوع..."
                    className="w-full min-h-[80px] p-3 border border-gray-200 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-550 block">التحديات والصعوبات *</label>
                  <textarea value={reportForm.challenges}
                    onChange={(e) => setReportForm({ ...reportForm, challenges: e.target.value })}
                    placeholder="اذكر أي تحديات أو صعوبات واجهتها..."
                    className="w-full min-h-[70px] p-3 border border-gray-200 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-550 block">إرفاق ملف التقرير (اختياري)</label>
                  <label className="w-full flex items-center justify-center gap-2 py-3 px-3 border border-dashed border-gray-300 rounded-xl text-[11px] font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition">
                    <Paperclip className="h-3.5 w-3.5" />
                    {reportForm.file ? reportForm.file.name : 'اختر ملف PDF أو Word'}
                    <input type="file" className="hidden" onChange={(e) => setReportForm({ ...reportForm, file: e.target.files[0] })} />
                  </label>
                </div>
              </div>
              <div className="flex gap-2.5 p-5 border-t border-gray-50 bg-gray-50/30">
                <button type="button"
                  onClick={() => { setShowUploadReportModal(false); setReportForm({ week: '', tasks: '', challenges: '', file: null }); }}
                  className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition">إلغاء</button>
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-md shadow-purple-50">
                  <Send className="h-3.5 w-3.5" /> رفع التقرير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}