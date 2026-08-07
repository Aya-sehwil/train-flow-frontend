 import React from 'react';
import * as XLSX from 'xlsx';
import { Building2, Pencil, FileText, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// كل النوافذ المنبثقة (Modals) الخاصة بلوحة تحكم المشرف مجمعة بملف واحد.
// كل الـ state والدوال بتنجي من الملف الرئيسي (SupervisorDashboard.jsx) كـ props.
export default function SupervisorModals({
  API_BASE_URL,
  token,
  triggerToast,

  // Add Institution Modal
  showAddInstModal,
  setShowAddInstModal,
  newInst,
  setNewInst,
  fetchInstitutions,

  // Edit Institution Modal
  editingInstitution,
  setEditingInstitution,

  // Grade Confirm Modal
  showGradeConfirmModal,
  setShowGradeConfirmModal,
  evalStudentData,
  evalFields,
  handleSaveAcademicEval,

  // Report Confirm Modal
  showReportConfirmModal,
  setShowReportConfirmModal,
  feedbackText,
  setFeedbackText,
  handleApproveReport,
  handleReturnReport,

  // Export Modal
  showExportModal,
  setShowExportModal,
  exportProgress,
  setExportProgress,
  exportFormat,
  setExportFormat,
  studentApps,

  // Send Message to Institution Modal
  messagingInstitution,
  setMessagingInstitution,
  messageForm,
  setMessageForm,

  // Institution Details Modal
  selectedInstitution,
  setSelectedInstitution,

  // Attachment Preview Modal
  selectedAttachment,
  setSelectedAttachment,

  // Edit Profile Modal
  showEditProfileModal,
  setShowEditProfileModal,
  editProfileForm,
  setEditProfileForm,
  fetchProfile,
}) {
   const { updateUser } = useAuth();
  return (
    <>
      {/* 1. Add Institution Modal */}
      {showAddInstModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-brand-purple" />
                إضافة جهة تدريب جديدة
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newInst.name || !newInst.sector || !newInst.contact) {
                triggerToast('الرجاء ملء جميع الحقول المطلوبة', 'error');
                return;
              }
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: newInst.name,
                    sector: newInst.sector,
                    contact_person: newInst.contact,
                    contact_phone: newInst.contact_phone,
                    email: newInst.email,
                    description: newInst.description,
                    status: newInst.status,
                  }),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast(`تمت إضافة مؤسسة ${newInst.name} بنجاح!`);
                  setShowAddInstModal(false);
                  setNewInst({ name: '', sector: '', contact: '', contact_phone: '', email: '', status: 'active', logo: null, description: '' });
                  fetchInstitutions();
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء إضافة المؤسسة', 'error');
                }
              } catch (error) {
                console.error('createInstitution error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">اسم جهة التدريب *</label>
                <input
                  type="text"
                  value={newInst.name}
                  onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                  placeholder="مثال: شركة الاتصالات السعودية"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">القطاع / المجال *</label>
                <input
                  type="text"
                  value={newInst.sector}
                  onChange={(e) => setNewInst({ ...newInst, sector: e.target.value })}
                  placeholder="مثال: قطاع البرمجيات والتقنية"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة / معلومات عن جهة التدريب</label>
                <textarea
                  value={newInst.description}
                  onChange={(e) => setNewInst({ ...newInst, description: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عن الشركة ومجالات التدريب فيها..."
                  className="w-full min-h-[60px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مسؤول الاتصال *</label>
                <input
                  type="text"
                  value={newInst.contact}
                  onChange={(e) => setNewInst({ ...newInst, contact: e.target.value })}
                  placeholder="مثال: أ. محمد العلي"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newInst.contact_phone}
                    onChange={(e) => setNewInst({ ...newInst, contact_phone: e.target.value })}
                    placeholder="مثال: 0501234567"
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newInst.email}
                    onChange={(e) => setNewInst({ ...newInst, email: e.target.value })}
                    placeholder="example@company.com"
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">حالة الاعتماد *</label>
                <select
                  value={newInst.status}
                  onChange={(e) => setNewInst({ ...newInst, status: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 bg-white rounded-xl text-right text-xs focus:outline-none"
                >
                  <option value="active">معتمد نشط</option>
                  <option value="pending">تحت المراجعة</option>
                  <option value="expired">الاعتماد منتهي</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddInstModal(false);
                    setNewInst({ name: '', sector: '', contact: '', contact_phone: '', email: '', status: 'active', logo: null, description: '' });
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  إضافة الجهة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1.5 Edit Institution Modal */}
      {editingInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setEditingInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Pencil className="h-4.5 w-4.5 text-brand-purple" />
                تعديل بيانات جهة التدريب
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions/${editingInstitution.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: editingInstitution.name,
                    sector: editingInstitution.sector,
                    contact_person: editingInstitution.contact,
                    contact_phone: editingInstitution.contact_phone,
                    email: editingInstitution.email,
                    description: editingInstitution.description,
                  }),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast('تم تحديث بيانات المؤسسة بنجاح!');
                  setEditingInstitution(null);
                  fetchInstitutions();
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء التحديث', 'error');
                }
              } catch (error) {
                console.error('updateInstitution error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">اسم جهة التدريب</label>
                <input
                  type="text"
                  value={editingInstitution.name || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">القطاع / المجال</label>
                <input
                  type="text"
                  value={editingInstitution.sector || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, sector: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مسؤول الاتصال</label>
                <input
                  type="text"
                  value={editingInstitution.contact || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, contact: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editingInstitution.contact_phone || ''}
                    onChange={(e) => setEditingInstitution({ ...editingInstitution, contact_phone: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editingInstitution.email || ''}
                    onChange={(e) => setEditingInstitution({ ...editingInstitution, email: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة / وصف</label>
                <textarea
                  value={editingInstitution.description || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, description: e.target.value })}
                  className="w-full min-h-[60px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingInstitution(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Grade Recording Confirmation Modal */}
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
                {((Number(evalFields.commitment) || 0) + (Number(evalFields.report) || 0) + (Number(evalFields.discussion) || 0))}%
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

      {/* 3. Report Action Modal (Approve / Return) */}
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

      {/* 4. Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-gray-100 shadow-xl p-6 text-right space-y-4 animate-fade-in">
            <h3 className="text-sm font-extrabold text-gray-800 pb-2 border-b border-gray-50 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-brand-purple" />
              تصدير التقارير والبيانات
            </h3>

            {exportProgress !== null ? (
              <div className="py-4 space-y-3">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4d44b5] h-full transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>% {exportProgress}</span>
                  <span>جاري تصدير الملف وتجهيزه...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">حدد صيغة الملف المناسبة للتصدير والحفظ على جهازك الشخصي:</p>
                <div className="space-y-2">
                  {[
                    { id: 'pdf', text: 'مستند PDF (كشف ملخص منسق)' },
                    { id: 'excel', text: 'جدول Excel (كافة الحقول التفصيلية)' },
                    { id: 'csv', text: 'ملف نصي CSV (بيانات خام)' }
                  ].map(fmt => (
                    <label key={fmt.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition select-none flex-row-reverse justify-between">
                      <input
                        type="radio"
                        name="exportFmt"
                        value={fmt.id}
                        checked={exportFormat === fmt.id}
                        onChange={() => setExportFormat(fmt.id)}
                        className="text-[#4d44b5] focus:ring-[#4d44b5]"
                      />
                      <span className="text-xs font-semibold text-gray-700">{fmt.text}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExportProgress(10);
                      setTimeout(() => setExportProgress(50), 200);
                      setTimeout(() => {
                        setExportProgress(100);

                        const exportData = studentApps.map(app => ({
                          'اسم الطالب': app.name,
                          'الرقم الجامعي': app.idNum,
                          'التخصص': app.major,
                          'جهة التدريب المقترحة': app.company,
                          'حالة الطلب':
                            app.status === 'pending' ? 'بانتظار المراجعة' :
                            app.status === 'approved' ? 'تمت الموافقة' :
                            app.status === 'rejected' ? 'مرفوض' :
                            app.status === 'edit' ? 'تحت التعديل' : app.status,
                        }));

                        const worksheet = XLSX.utils.json_to_sheet(exportData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'طلبات الطلاب');
                        XLSX.writeFile(workbook, `طلبات_الطلاب_${new Date().toISOString().split('T')[0]}.xlsx`);

                        setTimeout(() => {
                          setShowExportModal(false);
                          setExportProgress(null);
                          triggerToast('تم تصدير الملف بنجاح!');
                        }, 300);
                      }, 500);
                    }}
                    className="flex-1 py-2 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                  >
                    بدء التصدير
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Send Message to Institution Modal */}
      {messagingInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setMessagingInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Mail className="h-4.5 w-4.5 text-brand-purple" />
                مراسلة {messagingInstitution.name}
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!messageForm.subject.trim() || !messageForm.message.trim()) {
                triggerToast('الرجاء تعبئة الموضوع والرسالة', 'error');
                return;
              }
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions/${messagingInstitution.id}/send-message`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(messageForm),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast(data.message || 'تم إرسال الرسالة بنجاح!');
                  setMessagingInstitution(null);
                  setMessageForm({ subject: '', message: '' });
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء الإرسال', 'error');
                }
              } catch (error) {
                console.error('sendInstitutionMessage error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">
              <div className="p-2.5 bg-gray-50/50 rounded-xl text-[10px] text-gray-500 font-semibold">
                سترسل الرسالة إلى: <span className="font-bold text-gray-700">{messagingInstitution.email}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">الموضوع *</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="مثال: تنسيق موعد زيارة ميدانية"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نص الرسالة *</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="اكتبي رسالتك هنا..."
                  className="w-full min-h-[120px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setMessagingInstitution(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Institution Details Modal */}
      {selectedInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setSelectedInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-brand-purple" />
                تفاصيل جهة التدريب
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-right space-y-1">
                <h2 className="text-base font-extrabold text-gray-800">{selectedInstitution.name}</h2>
                <p className="text-xs text-gray-400 font-semibold">{selectedInstitution.sector}</p>
              </div>

              {selectedInstitution.description && (
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedInstitution.description}</p>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">مسؤول الاتصال:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.contact || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">رقم الهاتف:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.contact_phone || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">البريد الإلكتروني:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.email || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-semibold">عدد الطلاب الحاليين:</span>
                  <span className="font-bold text-brand-purple">{selectedInstitution.students}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white flex gap-2.5 justify-end border-t border-gray-50">
              <button
                type="button"
                onClick={() => setSelectedInstitution(null)}
                className="px-5 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. File Attachment Preview Modal */}
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

      {/* 8. Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-brand-purple" />
                تعديل الملف الشخصي
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/profile`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(editProfileForm),
                });
                const data = await response.json();
               if (data.success) {
                  triggerToast('تم تحديث الملف الشخصي بنجاح!');
                  setShowEditProfileModal(false);
                  fetchProfile();
                  updateUser({ name: editProfileForm.full_name });
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء التحديث', 'error');
                }
              } catch (error) {
                console.error('updateProfile error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">الاسم الكامل</label>
                <input
                  type="text"
                  value={editProfileForm.full_name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, full_name: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                <input
                  type="text"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  placeholder="مثال: 011-487-5502"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مقر المكتب</label>
                <input
                  type="text"
                  value={editProfileForm.office}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, office: e.target.value })}
                  placeholder="مثال: مبنى G1، الطابق الثالث، مكتب 304"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة مهنية</label>
                <textarea
                  value={editProfileForm.bio}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                  placeholder="اكتبي نبذة مختصرة عنك..."
                  className="w-full min-h-[80px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}