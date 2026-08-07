 import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Search, Download, User, FileSpreadsheet, Paperclip } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const SERVER_ORIGIN = `${import.meta.env.VITE_API_URL}`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// بيبني رابط المرفق الكامل - الملفات فعلياً متخزنة مباشرة جوا مجلد uploads/
// (حسب reportsController.js يلي بيستخدمه الطالب فعلياً لرفع التقارير)
const getAttachmentUrl = (attachment_url) => {
  if (!attachment_url) return null;
  const filename = attachment_url.split('/').pop(); // بس اسم الملف، بغض النظر شو الصيغة المخزنة
  return `${SERVER_ORIGIN}/uploads/${filename}`;
};

export default function StudentReports() {
  const { triggerToast } = useOutletContext();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSelectedStudent(null);
    setReports([]);
    try {
      const res = await fetch(`${API_BASE_URL}/supervisor/students/search?q=${encodeURIComponent(query.trim())}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
        if (data.data.length === 0) {
          triggerToast('لا يوجد طالب مطابق ضمن طلابك', 'error');
        }
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء البحث', 'error');
      }
    } catch (error) {
      console.error('search error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setReportsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/supervisor/students/${student.student_id}/reports`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء جلب التقارير', 'error');
      }
    } catch (error) {
      console.error('reports error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    } finally {
      setReportsLoading(false);
    }
  };

  const statusText = (status) => ({
    approved: 'معتمد',
    pending: 'قيد المراجعة',
    edit: 'معاد للتعديل',
    late: 'متأخر',
  }[status] || status);

  const handleExportExcel = () => {
    if (!selectedStudent || reports.length === 0) {
      triggerToast('لا توجد تقارير لتصديرها', 'error');
      return;
    }
    const exportData = reports.map(r => ({
      'الأسبوع': r.week_number,
      'المهام المنجزة': r.tasks,
      'التحديات': r.challenges || '',
      'الحالة': statusText(r.status),
      'ملاحظات المشرف': r.supervisor_feedback || '',
      'تاريخ الرفع': r.uploaded_at ? new Date(r.uploaded_at).toLocaleDateString('ar-EG') : '',
      'رابط المرفق': getAttachmentUrl(r.attachment_url) || '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'التقارير');
    XLSX.writeFile(workbook, `تقارير_${selectedStudent.full_name}.xlsx`);
  };

  const handleExportPdf = async () => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${API_BASE_URL}/supervisor/students/${selectedStudent.student_id}/reports/pdf`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        triggerToast('تعذر توليد ملف PDF', 'error');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقارير_${selectedStudent.full_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('pdf export error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-5xl mx-auto">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">بحث عن طالب وتقاريره</h1>
        <p className="text-gray-400 text-xs font-semibold">ابحث بالاسم أو الرقم الجامعي لعرض كل التقارير المرفوعة من طالب معيّن وتصديرها.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم الجامعي..."
            className="w-full py-2.5 pr-10 pl-4 bg-white border border-gray-200/85 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/50 shadow-sm"
          />
          <Search className="absolute inset-y-0 right-3.5 h-4 w-4 my-auto text-gray-400" />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-5 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95 disabled:opacity-60"
        >
          {searching ? 'جاري البحث...' : 'بحث'}
        </button>
      </form>

      {searchResults.length > 0 && !selectedStudent && (
        <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm divide-y divide-gray-50">
          {searchResults.map(s => (
            <div
              key={s.student_id}
              onClick={() => handleSelectStudent(s)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-50 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                  {s.full_name?.charAt(0)}
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-gray-800">{s.full_name}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">{s.university_id} • {s.major}</p>
                </div>
              </div>
              <span className="text-[10px] text-brand-purple font-bold">عرض التقارير ←</span>
            </div>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center font-bold shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-extrabold text-gray-800">{selectedStudent.full_name}</h3>
                <p className="text-[10px] text-gray-400 font-semibold">{selectedStudent.university_id} • {selectedStudent.major}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold hover:bg-gray-50 transition"
              >
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#4d44b5] text-white rounded-xl text-[11px] font-bold hover:bg-brand-purpleDark transition"
              >
                <Download className="h-4 w-4" /> PDF
              </button>
              <button
                onClick={() => { setSelectedStudent(null); setReports([]); }}
                className="px-3 py-2 text-gray-400 text-[11px] font-bold hover:text-gray-600 transition"
              >
                رجوع
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden">
            {reportsLoading ? (
              <div className="p-10 text-center text-gray-400 text-xs font-bold">جاري تحميل التقارير...</div>
            ) : reports.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-xs font-bold">لا توجد تقارير مرفوعة لهذا الطالب حالياً</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-400 border-b border-gray-50">
                      <th className="p-4">الأسبوع</th>
                      <th className="p-4">تاريخ الرفع</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">المهام المنجزة</th>
                      <th className="p-4">المرفق</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
                    {reports.map(r => {
                      const attachmentUrl = getAttachmentUrl(r.attachment_url);
                      return (
                        <tr key={r.attachment_id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-800">{r.week_number}</td>
                          <td className="p-4 text-gray-400 font-semibold">
                            {r.uploaded_at ? new Date(r.uploaded_at).toLocaleDateString('ar-EG') : '—'}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 bg-gray-50 text-gray-600 rounded-full border border-gray-100 text-[10px] font-bold">
                              {statusText(r.status)}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-gray-500 max-w-xs truncate" title={r.tasks}>{r.tasks}</td>
                          <td className="p-4">
                            {attachmentUrl ? (
                              <a
                                href={attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-purple hover:underline"
                              >
                                <Paperclip className="h-3.5 w-3.5" /> عرض المرفق
                              </a>
                            ) : (
                              <span className="text-[10px] text-gray-300 font-semibold">لا يوجد</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}