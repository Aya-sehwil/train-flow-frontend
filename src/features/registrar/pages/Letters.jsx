import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Send,
  Mail,
  Printer,
  Download,
  Search,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Letters() {
  const { triggerToast, token } = useOutletContext();

  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
const [sendingAction, setSendingAction] = useState(null); // 'institution' | 'student' | null
 const [selectedLetterStatus, setSelectedLetterStatus] = useState('ready');

  // ==========================================
  // جلب الطلاب المقبولين نهائياً
  // ==========================================
  const fetchAcceptedStudents = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/registrar/accepted-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStudentsList(data.data);
        if (data.data.length > 0 && !selectedRequestId) {
          setSelectedRequestId(data.data[0].request_id);
        }
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب الطلاب المقبولين');
      }
    } catch (err) {
      console.error('fetchAcceptedStudents error:', err);
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const selectedStudent =
    studentsList.find((s) => s.request_id === selectedRequestId) || studentsList[0];

  // ==========================================
  // إرسال الخطاب للمؤسسة
  // ==========================================
  const handleSendToInstitution = async (requestId, studentName, institutionName) => {
    setSendingAction('institution');
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrar/letters/${requestId}/send-institution`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStudentsList((prev) =>
          prev.map((s) =>
            s.request_id === requestId
              ? { ...s, letter_status: 'sent', letter_sent_at: new Date().toISOString() }
              : s
          )
        );
        triggerToast(data.message || `تم إرسال الخطاب إلى ${institutionName} بنجاح`);
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء إرسال الخطاب', 'error');
      }
    } catch (err) {
      console.error('handleSendToInstitution error:', err);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    } finally {
      setSendingAction(null);
    }
  };

  // ==========================================
  // إرسال نسخة للطالب
  // ==========================================
  const handleSendToStudent = async (requestId, studentName) => {
    setSendingAction('student');
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrar/letters/${requestId}/send-student`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStudentsList((prev) =>
          prev.map((s) =>
            s.request_id === requestId ? { ...s, student_copy_sent: 1 } : s
          )
        );
        triggerToast(data.message || `تم إرسال نسخة الخطاب للطالب ${studentName} بنجاح`);
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء إرسال النسخة للطالب', 'error');
      }
    } catch (err) {
      console.error('handleSendToStudent error:', err);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    } finally {
      setSendingAction(null);
    }
  };

  // ==========================================
  // تنزيل PDF (لازم نجيبه كـ blob لأنه محتاج Authorization header)
  // ==========================================
  const handleDownloadPdf = async (requestId, universityId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrar/letters/${requestId}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        triggerToast(data?.message || 'حدث خطأ أثناء تنزيل الخطاب', 'error');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `letter_${universityId || requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      triggerToast('تم تحميل ملف PDF بنجاح');
    } catch (err) {
      console.error('handleDownloadPdf error:', err);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

const filteredStudents = studentsList.filter((s) => {
  const matchesSearch =
    s.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.university_id?.toLowerCase().includes(searchTerm.toLowerCase());

  let matchesStatus = true;
  if (selectedLetterStatus === 'ready') matchesStatus = s.letter_status === 'ready';
  else if (selectedLetterStatus === 'sent') matchesStatus = s.letter_status === 'sent';
  else if (selectedLetterStatus === 'not_ready') matchesStatus = s.letter_status !== 'ready' && s.letter_status !== 'sent';
  // selectedLetterStatus === 'all' → matchesStatus تضل true دايماً

  return matchesSearch && matchesStatus;
});

  const readyCount = studentsList.filter((s) => s.letter_status === 'ready').length;
  const sentCount = studentsList.filter((s) => s.letter_status === 'sent').length;
  const totalCount = studentsList.length;

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">
      {/* Title */}
      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">اصدار خطابات التوجيه</h1>
        <p className="text-gray-400 text-xs font-semibold">
          ادارة واصدار الخطابات الرسمية للطلاب المقبولين نهائياً في جهات التدريب
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">جاهز للإصدار</span>
            <span className="text-2xl font-extrabold text-gray-800">{readyCount}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">تم الإرسال</span>
            <span className="text-2xl font-extrabold text-gray-800">{sentCount}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي المقبولين</span>
            <span className="text-2xl font-extrabold text-gray-800">{totalCount}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50/50 flex items-center justify-center text-amber-500">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-10 text-center text-gray-400 text-xs font-bold">جاري تحميل الطلاب...</div>
      )}

      {!loading && error && (
        <div className="p-10 text-center text-red-500 text-xs font-bold">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column (Actions and Preview) */}
          <div className="lg:col-span-4 space-y-6">
            {!selectedStudent ? (
              <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-gray-400 font-bold">لا يوجد طلاب مقبولين حالياً</p>
              </div>
            ) : (
              <>
                {/* Actions */}
                <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-xs font-extrabold text-gray-850">
                    إجراءات الخطاب ({selectedStudent.student_name})
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                      disabled={sendingAction === 'institution' || selectedStudent.letter_status === 'sent'}
                      onClick={() =>
                        handleSendToInstitution(
                          selectedStudent.request_id,
                          selectedStudent.student_name,
                          selectedStudent.institution_name
                        )
                      }
                      className="py-2.5 px-3 bg-brand-purple hover:bg-[#5249c4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-none font-cairo cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      {sendingAction === 'institution'
                        ? 'جاري الإرسال...'
                        : selectedStudent.letter_status === 'sent'
                        ? 'تم الإرسال ✓'
                        : 'إرسال إلكتروني للمؤسسة'}
                    </button>
                    <button
                      disabled={sendingAction === 'student'}
                      onClick={() =>
                        handleSendToStudent(selectedStudent.request_id, selectedStudent.student_name)
                      }
                      className="py-2.5 px-3 border border-brand-purple text-brand-purple hover:bg-purple-50 disabled:opacity-50 font-bold rounded-2xl transition active:scale-95 duration-200 flex items-center justify-center gap-1.5 bg-white font-cairo cursor-pointer"
                    >
                      <Mail className="h-4 w-4" />
                      {sendingAction === 'student' ? 'جاري الإرسال...' : 'إرسال نسخة للطالب'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => window.print()}
                      className="py-2 bg-gray-50 hover:bg-gray-100 text-gray-650 font-bold rounded-2xl transition active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-none font-cairo cursor-pointer"
                    >
                      <Printer className="h-4 w-4" /> طباعة
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadPdf(selectedStudent.request_id, selectedStudent.university_id)
                      }
                      className="py-2 bg-gray-50 hover:bg-gray-100 text-gray-650 font-bold rounded-2xl transition active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-none font-cairo cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> PDF
                    </button>
                  </div>
                </div>

                {/* Letter Preview */}
                <div className="bg-white p-6 rounded-3xl shadow-sm text-right relative overflow-hidden font-mono text-[9px] leading-relaxed space-y-4">
                  <div className="pb-3 flex justify-between items-center">
                    <span className="text-gray-400 font-bold">معاينة الخطاب</span>
                    <span className="text-gray-400 font-bold">
                      {selectedStudent.letter_ref_num || `TR-${new Date().getFullYear()}-${String(selectedStudent.request_id).padStart(4, '0')}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-gray-550">
                    <div className="text-right">
                      <p>المملكة العربية السعودية</p>
                      <p>وزارة التعليم</p>
                      <p>عمادة القبول والتسجيل</p>
                    </div>
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[7px] font-bold text-gray-400">
                      شعار الجامعة
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p>
                      <span className="font-bold text-gray-800">التاريخ:</span>{' '}
                      {new Date().toLocaleDateString('ar-EG')}
                    </p>
                    <p>
                      <span className="font-bold text-gray-800">الموضوع:</span> خطاب توجيه طالب للتدريب الميداني
                    </p>

                    <div className="pt-3 space-y-2 text-gray-650">
                      <p>سعادة مدير الموارد البشرية - {selectedStudent.institution_name} المحترم،</p>
                      <p className="indent-3 text-justify font-cairo">السلام عليكم ورحمة الله وبركاته،،</p>
                      <p className="indent-3 text-justify font-cairo">
                        نفيدكم بأن الطالب الموضح بياناته أدناه قد أنهى المتطلبات الأكاديمية للبدء في برنامج
                        التدريب الميداني. وبناءً على موافقتكم المسبقة، نوجه إليكم الطالب لبدء فترة التدريب
                        المقررة.
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl space-y-1">
                      <p>
                        <span className="font-bold text-gray-800">الاسم:</span>{' '}
                        {selectedStudent.student_name}
                      </p>
                      <p>
                        <span className="font-bold text-gray-800">الرقم الجامعي:</span>{' '}
                        {selectedStudent.university_id}
                      </p>
                      <p>
                        <span className="font-bold text-gray-800">التخصص:</span>{' '}
                        {selectedStudent.major || '—'}
                      </p>
                    </div>

                    <div className="pt-4 text-center font-cairo text-gray-450 space-y-1">
                      <p>شاكرين لكم تعاونكم المخلص ومساهمتكم في تأهيل كوادرنا الوطنية.</p>
                      <p className="font-bold">وتقبلوا فائق التحية والتقدير،،</p>
                      <p className="pt-4 font-bold text-gray-800">الختم الرسمي</p>
                      <p className="text-[7px]">عميد القبول والتسجيل</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

         {/* Right column (Table list) */}
      <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
  <div className="p-4 space-y-3">
  <div className="flex items-center justify-between">
    <h3 className="text-xs font-extrabold text-gray-800">الطلاب المقبولين نهائياً</h3>
    <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-[9px] font-bold">
      {filteredStudents.length} طالب
    </span>
  </div>

  <div className="flex items-center gap-2 flex-wrap">
    {[
      { id: 'ready', text: 'جاهز للإصدار' },
      { id: 'sent', text: 'تم الإرسال' },
      { id: 'not_ready', text: 'غير جاهز' },
      { id: 'all', text: 'الكل' },
    ].map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelectedLetterStatus(item.id)}
        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
          selectedLetterStatus === item.id
            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
        }`}
      >
        {item.text}
      </button>
    ))}
  </div>
</div>

              <div className="px-4 pb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث بالاسم أو الرقم الجامعي..."
                    className="w-full py-2 pl-3 pr-8 border border-gray-200 bg-[#fbfbfd] rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  />
                  <Search className="absolute inset-y-0 right-2.5 h-4 w-4 my-auto text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-450">
                      <th className="p-4">اسم الطالب / الرقم الجامعي</th>
                      <th className="p-4">جهة التدريب</th>
                      <th className="p-4">حالة الخطاب</th>
                      <th className="p-4">نسخة الطالب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-bold">
                          لا يوجد نتائج مطابقة
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => (
                        <tr
                          key={s.request_id}
                          onClick={() => setSelectedRequestId(s.request_id)}
                          className={`cursor-pointer transition duration-150 hover:bg-gray-50/50 ${
                            selectedRequestId === s.request_id ? 'bg-[#f4f2ff]' : ''
                          }`}
                        >
                          <td className="p-4">
                            <span className="font-bold text-gray-800 block">{s.student_name}</span>
                            <span className="text-[9px] text-gray-400 font-mono block">
                              {s.university_id}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{s.institution_name}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                s.letter_status === 'sent'
                                  ? 'bg-gray-100 text-gray-500'
                                  : s.letter_status === 'ready'
                                  ? 'bg-[#fffae6] text-amber-600'
                                  : 'bg-purple-50 text-brand-purple'
                              }`}
                            >
                              {s.letter_status === 'sent'
                                ? 'تم الإرسال'
                                : s.letter_status === 'ready'
                                ? 'جاهز للإصدار'
                                : 'غير جاهز'}
                            </span>
                          </td>
                          <td className="p-4">
                            {s.student_copy_sent ? (
                              <span className="text-green-500 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> أُرسلت
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-bold flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> لم تُرسل
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}