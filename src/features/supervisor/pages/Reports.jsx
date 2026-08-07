 import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Search, FileText, CheckCircle2, AlertTriangle, Paperclip, MessageCircle } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Reports() {
  const { triggerToast, token } = useOutletContext();
  const navigate = useNavigate();

  // ==========================================
  // بيانات التقارير الأسبوعية
  // ==========================================
  const [reportsList, setReportsList] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchReports = async () => {
    if (!token) return;
    setReportsLoading(true);
    setReportsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
     if (data.success) {
  const mapped = data.reports
    .map((r) => ({
      id: r.attachment_id,
      studentId: r.student_id,
      name: r.student_name,
      major: r.major,
      week: `الأسبوع ${r.week_number}`,
      status: r.status,
      company: r.institution_name || 'غير محدد',
      tasks: r.tasks,
      challenges: r.challenges,
      attachment_url: r.attachment_url,
      file_type: r.file_type,
      uploaded_at: r.uploaded_at,
      supervisor_feedback: r.supervisor_feedback,
    }))
    // نعرض بس التقارير يلي لسا بحاجة لإجراء من المشرف (قيد المراجعة أو متأخرة)
    // التقارير المعتمدة أو المُعادة للتعديل سابقاً بتضل موجودة بقاعدة البيانات
    // بس ما بتظهر هون، لأنه المشرف خلص إجراءه فيها.
    .filter((r) => r.status === 'pending' || r.status === 'late');
  setReportsList(mapped);
  if (mapped.length > 0 && !selectedStudentReport) {
    setSelectedStudentReport(mapped[0].id);
  }
} else {
        setReportsError(data.message || 'حدث خطأ أثناء جلب التقارير');
      }
    } catch (error) {
      console.error('fetchReports error:', error);
      setReportsError('تعذر الاتصال بالخادم');
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleApproveReport = async (reportId, studentName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved', feedback: feedbackText || null }),
      });
      const data = await response.json();
      if (data.success) {
        setReportsList(prev => prev.filter(rep => rep.id !== reportId));
        setSelectedStudentReport(null);
        triggerToast(`تم اعتماد تقرير الطالب ${studentName} بنجاح!`);
        setFeedbackText('');
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء اعتماد التقرير', 'error');
      }
    } catch (error) {
      console.error('handleApproveReport error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleReturnReport = async (reportId, studentName) => {
    if (!feedbackText.trim()) {
      triggerToast('الرجاء كتابة ملاحظات التعديل أولاً', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'edit', feedback: feedbackText }),
      });
      const data = await response.json();
      if (data.success) {
        setReportsList(prev => prev.filter(rep => rep.id !== reportId));
        setSelectedStudentReport(null);
        triggerToast(`تم إرسال ملاحظات التعديل للطالب ${studentName}`, 'error');
        setFeedbackText('');
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء إرسال الملاحظات', 'error');
      }
    } catch (error) {
      console.error('handleReturnReport error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  // ==========================================
  // Modals (منقولة من SupervisorModals.jsx)
  // ==========================================
  const [showReportConfirmModal, setShowReportConfirmModal] = useState(null); // { type: 'approve' | 'return', reportId, name }
  const [selectedAttachment, setSelectedAttachment] = useState(null); // { filename, size, type }

  const currentRep = reportsList.find(r => r.id === selectedStudentReport) || reportsList[0];

  return (
    <>
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="space-y-0.5 shrink-0 text-right">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">التقارير الأسبوعية للطلاب</h1>
        <p className="text-gray-400 text-xs font-semibold">مراجعة وتقييم الأنشطة التدريبية المرفوعة من الطلاب وتقديم الملاحظات والتوجيهات.</p>
      </div>

      {reportsLoading && (
        <div className="p-10 text-center text-gray-400 text-xs font-bold">
          جاري تحميل التقارير...
        </div>
      )}

      {!reportsLoading && reportsError && (
        <div className="p-10 text-center text-red-500 text-xs font-bold">
          {reportsError}
        </div>
      )}

      {!reportsLoading && !reportsError && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-50 space-y-3 shrink-0 text-right">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-800">قائمة الطلاب</h3>
              <span className="px-2.5 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full text-[9px] font-bold">{reportsList.length} تقرير</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن طالب..."
                className="w-full py-2 pl-3 pr-8 border border-gray-200 bg-[#fbfbfd] rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
              />
              <Search className="absolute inset-y-0 right-2.5 h-4 w-4 my-auto text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-50 p-2">
            {reportsList.map(rep => (
              <div
                key={rep.id}
                onClick={() => setSelectedStudentReport(rep.id)}
                className={`p-3 rounded-2xl cursor-pointer text-right transition duration-150 space-y-1.5 ${
                  selectedStudentReport === rep.id ? 'bg-purple-50/60 border border-purple-100/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className="text-xs font-bold text-gray-800 hover:text-brand-purple hover:underline cursor-pointer transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/supervisor/evaluation?studentId=${rep.studentId || rep.id}`);
                    }}
                  >
                    {rep.name}
                  </h4>
                  {rep.status === 'pending' && (
                    <span className="px-2.5 py-0.5 bg-[#fef8e7] text-[#c08d13] border border-[#fdf2cc] rounded-full text-[8px] font-bold">بالانتظار المراجعة</span>
                  )}
                  {rep.status === 'approved' && (
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded-full text-[8px] font-bold">تم التسليم</span>
                  )}
                  {rep.status === 'edit' && (
                    <span className="px-2.5 py-0.5 bg-purple-50 text-brand-purple border border-purple-100 rounded-full text-[8px] font-bold">معاد للتعديل</span>
                  )}
                  {rep.status === 'late' && (
                    <span className="px-2.5 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-[8px] font-bold">متأخر</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-semibold">{rep.major} • {rep.week}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 space-y-6">
          {!currentRep ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-xs text-gray-400 font-bold">لا توجد تقارير أسبوعية مرفوعة حالياً</p>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-50">
                <div className="flex items-start gap-4 text-right">
                  <div className="h-12 w-12 bg-purple-50 text-brand-purple border border-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-extrabold text-gray-800">{currentRep.week}</h2>
                    <p className="text-[11px] text-gray-400 font-semibold">
                      تم التسليم: {currentRep.uploaded_at ? new Date(currentRep.uploaded_at).toLocaleDateString('ar-EG') : '—'} • {currentRep.company}
                    </p>
                  </div>
                </div>
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  currentRep.status === 'pending' ? 'bg-[#fef8e7] text-[#c08d13] border border-[#fdf2cc]' :
                  currentRep.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                  currentRep.status === 'late' ? 'bg-red-50 text-red-500 border border-red-100' :
                  'bg-purple-50 text-brand-purple border border-purple-100'
                }`}>
                  {currentRep.status === 'pending' ? 'انتظار المراجعة' :
                  currentRep.status === 'approved' ? 'تم التسليم' :
                  currentRep.status === 'late' ? 'متأخر' : 'معاد للتعديل'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm text-right space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                    المهام المنجزة
                  </h4>
                  <div className="space-y-3 pt-1">
                    <div className="p-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs text-gray-700 font-semibold leading-relaxed">
                      {currentRep.tasks || 'لا يوجد وصف للمهام'}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm text-right space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                    التحديات والمواجهات
                  </h4>
                  <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl">
                    <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                      {currentRep.challenges || 'لا يوجد تحديات مذكورة'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-right">
                <h4 className="text-xs font-extrabold text-gray-800 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  المرفقات والوثائق الثبوتية
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentRep.attachment_url ? (
                    <div
                      onClick={() => setSelectedAttachment({ filename: currentRep.attachment_url, size: '', type: currentRep.file_type || 'pdf' })}
                      className="p-3 border border-gray-100 rounded-2xl flex items-center justify-between text-right cursor-pointer hover:bg-gray-50 hover:border-gray-200 transition max-w-xs"
                    >
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-gray-700 block truncate">{currentRep.attachment_url}</span>
                      </div>
                      <FileText className="h-6 w-6 text-red-500 shrink-0 mr-2" />
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 font-semibold">لا يوجد مرفق لهذا التقرير</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-right pt-4 border-t border-gray-50">
                <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <MessageCircle className="h-4.5 w-4.5 text-brand-purple" />
                  التغذية الراجعة التوجيهية
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="اكتب ملاحظاتك الأكاديمية والتوجيهية هنا لتعزيز مهارات الطالب..."
                  className="w-full min-h-[90px] p-3.5 border border-gray-200 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40 shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowReportConfirmModal({ type: 'return', reportId: currentRep.id, name: currentRep.name })}
                  className="px-6 py-2.5 border border-brand-purple/60 text-[#4d44b5] rounded-xl text-xs font-bold hover:bg-purple-50 transition"
                >
                  إعادة التقرير للتعديل
                </button>
                <button
                  onClick={() => setShowReportConfirmModal({ type: 'approve', reportId: currentRep.id, name: currentRep.name })}
                  className="px-6 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-md shadow-purple-100"
                >
                  اعتماد التقرير
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>

      {/* Report Action Modal (Approve / Return) */}
      {showReportConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowReportConfirmModal(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800">
                {showReportConfirmModal.type === 'approve' ? 'تأكيد اعتماد التقرير الأسبوعي' : 'إعادة التقرير للتعديل'}
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                طالب: <span className="text-gray-800 font-extrabold">{showReportConfirmModal.name}</span>
                {showReportConfirmModal.type === 'approve'
                  ? ' | سيتم اعتماد التقرير وإشعار الطالب بالموافقة.'
                  : ' | يرجى إدخال التوجيهات والتعديلات المطلوبة ليتمكن الطالب من إعادة الرفع.'}
              </p>

              {showReportConfirmModal.type === 'return' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">ملاحظات التعديل *</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="مثال: يرجى إضافة تفاصيل أكثر حول كود الربط وتوثيق الصعوبات البرمجية..."
                    className="w-full min-h-[90px] p-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportConfirmModal(null)}
                  className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { reportId, name, type } = showReportConfirmModal;
                    if (type === 'approve') {
                      handleApproveReport(reportId, name);
                    } else {
                      if (!feedbackText.trim()) {
                        triggerToast('الرجاء كتابة ملاحظات التعديل أولاً', 'error');
                        return;
                      }
                      handleReturnReport(reportId, name);
                    }
                    setShowReportConfirmModal(null);
                  }}
                  className={`flex-1 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 ${
                    showReportConfirmModal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#4d44b5] hover:bg-brand-purpleDark'
                  }`}
                >
                  {showReportConfirmModal.type === 'approve' ? 'تأكيد الاعتماد' : 'إرسال للتعديل'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/45 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setSelectedAttachment(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-brand-purple" />
                معاينة المرفق: {selectedAttachment.filename}
              </h3>
            </div>

            <div className="p-6 bg-gray-50 flex flex-col items-center justify-center min-h-[280px] border-b border-gray-50">
              <div className="h-16 w-16 bg-white border border-gray-150 rounded-2xl flex items-center justify-center text-red-500 text-3xl shadow-sm mb-4 animate-pulse">
                {selectedAttachment.type === 'pdf' ? '📄' : '🖼️'}
              </div>
              <h4 className="text-xs font-extrabold text-gray-850 mb-1">{selectedAttachment.filename}</h4>
              <p className="text-[10px] text-gray-400 font-semibold mb-6">الحجم: {selectedAttachment.size} • النوع: {selectedAttachment.type.toUpperCase()}</p>

              <div className="w-full max-w-xs p-3 bg-white border border-gray-100 rounded-xl text-center text-[10px] text-gray-500 leading-normal font-semibold shadow-inner">
                اضغطي على "تنزيل الملف المرفق" أدناه لفتح المستند الفعلي.
              </div>
            </div>

            <div className="p-4 bg-white flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setSelectedAttachment(null)}
                className="px-5 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
              >
                إغلاق المعاينة
              </button>
                  <a  
                href={`${import.meta.env.VITE_API_URL}/uploads/${selectedAttachment.filename}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => setSelectedAttachment(null), 100);
                }}
                className="px-5 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-[#4d44b5]/90 transition shadow-sm active:scale-95 inline-block text-center"
              >
                تنزيل الملف المرفق
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}