import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FileText, Award, Search, ChevronLeft } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Evaluation() {
  const { triggerToast, token } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeStudentId = searchParams.get('studentId');

  // ==========================================
  // قائمة طلاب هذا المشرف
  // ==========================================
  const [myStudents, setMyStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMyStudents = async () => {
    if (!token) return;
    setStudentsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/messages/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setMyStudents(data.students);
    } catch (error) {
      console.error('fetchMyStudents error:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredStudents = myStudents.filter(s =>
    s.full_name?.includes(searchQuery)
  );

  // ==========================================
  // بيانات التقييم
  // ==========================================
  const [attendanceRating, setAttendanceRating] = useState(0);
  const [evalFields, setEvalFields] = useState({
    commitment: '',
    discussion: '',
    report: '',
    comments: ''
  });
  const [evalStudentData, setEvalStudentData] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  const fetchEvaluation = async () => {
    if (!activeStudentId || !token) return;
    setEvalLoading(true);
    setEvalError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/evaluation/${activeStudentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvalStudentData(data.data);
        setAttendanceRating(data.data.attendance_rate || 0);
        if (data.data.academic_evaluation) {
          setEvalFields({
            commitment: String(data.data.academic_evaluation.commitment_score ?? ''),
            discussion: String(data.data.academic_evaluation.discussion_score ?? ''),
            report: String(data.data.academic_evaluation.report_score ?? ''),
            comments: data.data.academic_evaluation.notes || ''
          });
        } else {
          setEvalFields({ commitment: '', discussion: '', report: '', comments: '' });
        }
      } else {
        setEvalError(data.message || 'حدث خطأ أثناء جلب بيانات التقييم');
      }
    } catch (error) {
      console.error('fetchEvaluation error:', error);
      setEvalError('تعذر الاتصال بالخادم');
    } finally {
      setEvalLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStudentId, token]);

  const handleSaveAcademicEval = async () => {
    if (!evalFields.commitment || !evalFields.discussion || !evalFields.report) {
      triggerToast('الرجاء تعبئة كافة الدرجات المطلوبة قبل الاعتماد', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/evaluation/${activeStudentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          commitment_score: Number(evalFields.commitment),
          discussion_score: Number(evalFields.discussion),
          report_score: Number(evalFields.report),
          notes: evalFields.comments
        })
      });
      const data = await response.json();
      if (data.success) {
        triggerToast('تم اعتماد ورصد الدرجات النهائية للطالب بنجاح!');
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء رصد الدرجات', 'error');
      }
    } catch (error) {
      console.error('handleSaveAcademicEval error:', error);
      triggerToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  // ==========================================
  // بيانات التقييم الكاملة لكل الطلاب (لتصدير Excel)
  // ==========================================
  const [exportData, setExportData] = useState([]);

  const fetchEvaluationExportData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/evaluation-export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setExportData(data.data);
    } catch (error) {
      console.error('fetchEvaluationExportData error:', error);
    }
  };

  useEffect(() => {
    fetchEvaluationExportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleExportEvaluations = () => {
    if (exportData.length === 0) {
      triggerToast('لا يوجد بيانات تقييم لتصديرها حالياً', 'error');
      return;
    }

    const rows = exportData.map((s) => ({
      'اسم الطالب': s.full_name,
      'الرقم الجامعي': s.university_id,
      'التخصص': s.major,
      'جهة التدريب': s.institution_name || '—',
      'درجة الالتزام (20)': s.commitment_score ?? '—',
      'درجة المناقشة (60)': s.discussion_score ?? '—',
      'درجة التقرير (20)': s.report_score ?? '—',
      'المجموع الأكاديمي (100)': s.academic_total ?? '—',
      'تقييم المشرف المهني (100)': s.professional_score ?? '—',
      'نسبة الحضور الميداني': `${s.attendance_rate}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقييم الطلاب');
    XLSX.writeFile(workbook, `تقييم_الطلاب_${new Date().toISOString().split('T')[0]}.xlsx`);

    triggerToast('تم تصدير الملف بنجاح!');
  };


  const handleExportSingleStudent = () => {
    if (!evalStudentData) {
      triggerToast('لا يوجد بيانات طالب لتصديرها حالياً', 'error');
      return;
    }

    const row = {
      'اسم الطالب': evalStudentData.full_name || '—',
      'الرقم الجامعي': evalStudentData.university_id || '—',
      'التخصص': evalStudentData.major || '—',
      'جهة التدريب': evalStudentData.institution_name || '—',
      'المشرف المهني': evalStudentData.professional_supervisor || '—',
      'تاريخ الاعتماد': evalStudentData.approval_date
        ? new Date(evalStudentData.approval_date).toLocaleDateString('ar-EG')
        : '—',
      'نسبة الحضور الميداني': `${attendanceRating}%`,
      'درجة الالتزام (20)': evalFields.commitment || '—',
      'درجة المناقشة (60)': evalFields.discussion || '—',
      'درجة التقرير (20)': evalFields.report || '—',
      'المجموع الكلي': `${totalGrade}%`,
      'التقدير': assessmentText,
      'تقييم المشرف المهني (100)': evalStudentData.professional_evaluation?.score ?? '—',
      'ملاحظات': evalFields.comments || '—',
    };

    const worksheet = XLSX.utils.json_to_sheet([row]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقييم الطالب');
    XLSX.writeFile(
      workbook,
      `تقييم_${evalStudentData.full_name || 'طالب'}_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    triggerToast('تم تصدير بيانات الطالب بنجاح!');
  };

  // ==========================================
  // Modals
  // ==========================================
  const [showGradeConfirmModal, setShowGradeConfirmModal] = useState(false);

  const totalGrade = (Number(evalFields.commitment) || 0) + (Number(evalFields.report) || 0) + (Number(evalFields.discussion) || 0);
  let assessmentText = 'مقبول';
  if (totalGrade >= 95) assessmentText = 'ممتاز مرتفع';
  else if (totalGrade >= 90) assessmentText = 'ممتاز';
  else if (totalGrade >= 85) assessmentText = 'جيد جداً مرتفع';
  else if (totalGrade >= 80) assessmentText = 'جيد جداً';
  else if (totalGrade >= 75) assessmentText = 'جيد مرتفع';
  else if (totalGrade >= 70) assessmentText = 'جيد';
  else if (totalGrade > 0) assessmentText = 'مقبول';
  else assessmentText = 'غير مرصود';

  return (
    <>
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">استمارة التقييم والاعتماد النهائي</h1>
          <p className="text-gray-400 text-xs font-semibold">تثبيت واعتماد درجات ونتائج التقييم النهائي لطلاب التدريب الميداني.</p>
        </div>
   <div className="flex items-center gap-2">
          {activeStudentId && (
            <button
              onClick={handleExportSingleStudent}
              className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-650 hover:bg-gray-50 flex items-center gap-1.5 transition active:scale-95"
            >
              <FileText className="h-4 w-4" /> تصدير بيانات الطالب
            </button>
          )}
          <button
            onClick={handleExportEvaluations}
            className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-650 hover:bg-gray-50 flex items-center gap-1.5 transition active:scale-95"
          >
            <FileText className="h-4 w-4" /> تصدير الكل
          </button>
          {activeStudentId && (
            <button
              onClick={() => setShowGradeConfirmModal(true)}
              className="px-4 py-2 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark flex items-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Award className="h-4 w-4" /> اعتماد ورصد الدرجات
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Sidebar: قائمة الطلاب */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100/50 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-50 space-y-3">
            <h3 className="text-xs font-extrabold text-gray-800">طلابي ({myStudents.length})</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن طالب..."
                className="w-full py-2 pl-3 pr-8 border border-gray-200 bg-[#fbfbfd] rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
              />
              <Search className="absolute inset-y-0 right-2.5 h-4 w-4 my-auto text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-50 p-2 max-h-[600px] overflow-y-auto">
            {studentsLoading && (
              <p className="text-xs text-gray-400 text-center py-6">جاري التحميل...</p>
            )}
            {!studentsLoading && filteredStudents.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">لا يوجد طلاب حالياً</p>
            )}
            {!studentsLoading && filteredStudents.map(s => (
              <div
                key={s.student_id}
                onClick={() => navigate(`/dashboard/supervisor/evaluation?studentId=${s.student_id}`)}
                className={`p-3 rounded-2xl cursor-pointer text-right transition duration-150 flex items-center justify-between ${
                  Number(activeStudentId) === s.student_id ? 'bg-purple-50/60 border border-purple-100/50' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{s.full_name}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">{s.major}</p>
                </div>
                <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Content: استمارة التقييم */}
        <div className="lg:col-span-9 space-y-6">

          {!activeStudentId && (
            <div className="p-10 text-center text-gray-400 text-xs font-bold bg-white rounded-3xl border border-gray-100/50">
              الرجاء اختيار طالب من القائمة لعرض استمارة التقييم الخاصة به.
            </div>
          )}

          {activeStudentId && evalLoading && (
            <div className="p-10 text-center text-gray-400 text-xs font-bold">
              جاري تحميل بيانات التقييم...
            </div>
          )}

          {activeStudentId && !evalLoading && evalError && (
            <div className="p-10 text-center text-red-500 text-xs font-bold">
              {evalError}
            </div>
          )}

          {activeStudentId && !evalLoading && !evalError && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between items-center text-center space-y-6 min-h-[500px]">
              <div className="space-y-4 w-full">
                <div className="h-16 w-16 bg-purple-50 border border-purple-100 rounded-3xl text-brand-purple font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
                  {evalStudentData?.full_name ? evalStudentData.full_name.charAt(0) : 'ط'}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-gray-800">{evalStudentData?.full_name || '—'}</h3>
                  <span className="text-[10px] text-gray-400 font-semibold">الرقم الجامعي: {evalStudentData?.university_id || '—'}</span>
                </div>

                <div className="space-y-2 text-right text-xs bg-gray-50/50 p-4 rounded-2xl w-full border border-gray-100/50">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-400 font-semibold">جهة التدريب:</span>
                    <span className="font-extrabold text-gray-750">{evalStudentData?.institution_name || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-t border-gray-100/50">
                    <span className="text-gray-400 font-semibold">المشرف المهني:</span>
                    <span className="font-extrabold text-gray-750">{evalStudentData?.professional_supervisor || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-t border-gray-100/50">
                    <span className="text-gray-400 font-semibold">تاريخ الاعتماد:</span>
                    <span className="font-bold text-brand-purple">{evalStudentData?.approval_date ? new Date(evalStudentData.approval_date).toLocaleDateString('ar-EG') : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center pt-2">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="6.5" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#4d44b5" strokeWidth="6.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - attendanceRating / 100)} />
                  </svg>
                  <span className="text-lg font-extrabold text-brand-purple">{attendanceRating}%</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-2">متوسط الحضور الميداني</span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

                <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-800 pb-2 border-b border-gray-50 flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-brand-purple" />
                      التقييم الأكاديمي
                    </h3>

                    <div className="space-y-3 mt-3">
                      <div className="text-right space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">درجة الالتزام * (من 20)</label>
                        <input
                          type="number"
                          max="20"
                          min="0"
                          value={evalFields.commitment}
                          onChange={(e) => setEvalFields({ ...evalFields, commitment: e.target.value })}
                          placeholder="20"
                          className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                        />
                      </div>

                      <div className="text-right space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">درجة المناقشة * (من 60)</label>
                        <input
                          type="number"
                          max="60"
                          min="0"
                          value={evalFields.discussion}
                          onChange={(e) => setEvalFields({ ...evalFields, discussion: e.target.value })}
                          placeholder="60"
                          className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                        />
                      </div>

                      <div className="text-right space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">درجة التقرير * (من 20)</label>
                        <input
                          type="number"
                          max="20"
                          min="0"
                          value={evalFields.report}
                          onChange={(e) => setEvalFields({ ...evalFields, report: e.target.value })}
                          placeholder="18"
                          className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => setEvalFields({ commitment:'', discussion:'', report:'', comments:'' })}
                      className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-[10px] font-bold hover:bg-gray-50 transition active:scale-95"
                    >
                      تفريغ الحقول
                    </button>
                    <button
                      onClick={() => setShowGradeConfirmModal(true)}
                      className="flex-1 py-2 bg-[#4d44b5] text-white rounded-xl text-[10px] font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                    >
                      رصد الدرجات
                    </button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm text-right flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                      <h3 className="text-xs font-extrabold text-gray-800">تقييم المشرف المهني</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${evalStudentData?.professional_evaluation ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {evalStudentData?.professional_evaluation ? 'مكتمل' : 'لم يُرصد بعد'}
                      </span>
                    </div>

                    {evalStudentData?.professional_evaluation ? (
                      <div className="p-3 bg-indigo-50/35 rounded-2xl border border-indigo-100/30 text-[10px] text-gray-500 leading-relaxed font-semibold mt-3">
                        الدرجة: {evalStudentData.professional_evaluation.score ?? '—'} / 100
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-semibold mt-3">لم تصل بعد نتيجة تقييم المشرف المهني من جهة التدريب.</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">

                <div className="md:col-span-5 bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-center min-h-[160px]">
                  <div className="py-4 bg-[#4d44b5] text-white rounded-2xl px-4 flex flex-col items-center justify-center relative overflow-hidden flex-1 shadow-sm">
                    <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-purple-500/10" />
                    <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-indigo-500/10" />
                    <div className="text-3xl font-extrabold z-10">
                      {totalGrade}%
                    </div>
                    <h4 className="text-[10px] font-bold opacity-90 mt-1 z-10">المجموع الكلي والتقدير</h4>
                    <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1.5 z-10">{assessmentText}</span>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">

                  <div className="bg-white p-3.5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-center">
                    <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold mx-auto">✓</div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-bold block">الالتزام</span>
                      <span className="text-xs font-extrabold text-gray-750">{evalFields.commitment || 0} / 20</span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-center">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold mx-auto">📝</div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-bold block">جودة التقارير</span>
                      <span className="text-xs font-extrabold text-gray-750">{evalFields.report || 0} / 20</span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-center">
                    <div className="h-8 w-8 rounded-full bg-purple-50 text-brand-purple flex items-center justify-center text-xs font-bold mx-auto">💬</div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-bold block">المناقشة</span>
                      <span className="text-xs font-extrabold text-gray-750">{evalFields.discussion || 0} / 60</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
          )}
        </div>

      </div>
    </div>

      {/* Grade Recording Confirmation Modal */}
      {showGradeConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 shadow-xl p-6 text-right space-y-4 animate-fade-in">
            <div className="h-12 w-12 bg-amber-50 text-amber-500 border border-amber-100/50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-xl">
              ⚠️
            </div>
            <h3 className="text-sm font-extrabold text-gray-800 text-center">تأكيد رصد الدرجات النهائية</h3>
            <p className="text-xs text-gray-400 leading-relaxed text-center font-semibold">
              أنت على وشك رصد الدرجة النهائية للطالب <span className="text-gray-805 font-bold">{evalStudentData?.full_name || 'الطالب'}</span> بمجموع:
              <span className="text-brand-purple font-extrabold block text-lg mt-1">
                {totalGrade}%
              </span>
            </p>

            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-[10px] leading-relaxed font-bold border border-red-100">
              تنبيه: بعد اعتماد ورصد الدرجات لا يمكن تعديلها إلا بالتنسيق المباشر مع لجنة التدريب الميداني.
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowGradeConfirmModal(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGradeConfirmModal(false);
                  handleSaveAcademicEval();
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-sm active:scale-95"
              >
                تأكيد الرصد
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}