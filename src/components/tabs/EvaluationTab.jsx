 import React from 'react';
import { FileText, Award } from 'lucide-react';

export default function EvaluationTab({
  setShowExportModal,
  setShowGradeConfirmModal,
  evalStudentData,
  attendanceRating,
  evalFields,
  setEvalFields,
}) {
  return (
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">استمارة التقييم والاعتماد النهائي</h1>
          <p className="text-gray-400 text-xs font-semibold">تثبيت واعتماد درجات ونتائج التقييم النهائي لطلاب التدريب الميداني.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-650 hover:bg-gray-50 flex items-center gap-1.5 transition active:scale-95"
          >
            <FileText className="h-4 w-4" /> تصدير تقرير
          </button>
          <button
            onClick={() => setShowGradeConfirmModal(true)}
            className="px-4 py-2 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark flex items-center gap-1.5 transition shadow-sm active:scale-95"
          >
            <Award className="h-4 w-4" /> اعتماد ورصد الدرجات
          </button>
        </div>
      </div>

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

            {(() => {
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
              );
            })()}

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
    </div>
  );
}