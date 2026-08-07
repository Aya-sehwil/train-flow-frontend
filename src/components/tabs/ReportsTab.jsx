 import React from 'react';
import { Search, FileText, CheckCircle2, AlertTriangle, Paperclip, MessageCircle } from 'lucide-react';

export default function ReportsTab({
  navigate,
  reportsList,
  selectedStudentReport,
  setSelectedStudentReport,
  feedbackText,
  setFeedbackText,
  setSelectedAttachment,
  setShowReportConfirmModal,
}) {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="space-y-0.5 shrink-0 text-right">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">التقارير الأسبوعية للطلاب</h1>
        <p className="text-gray-400 text-xs font-semibold">مراجعة وتقييم الأنشطة التدريبية المرفوعة من الطلاب وتقديم الملاحظات والتوجيهات.</p>
      </div>

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
                    navigate(`/dashboard/supervisor?tab=evaluation&studentId=${rep.studentId || rep.id}`);
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
          {(() => {
            const currentRep = reportsList.find(r => r.id === selectedStudentReport) || reportsList[0];

            if (!currentRep) {
              return (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-xs text-gray-400 font-bold">لا توجد تقارير أسبوعية مرفوعة حالياً</p>
                </div>
              );
            }

            return (
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
            );
          })()}
        </div>
      </div>
    </div>
  );
}