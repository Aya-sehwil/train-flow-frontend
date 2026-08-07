 import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FileText, Clock, ClipboardList, CheckCircle2, XCircle, Search } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Applications() {
  const { triggerToast, token } = useOutletContext();

  // ==========================================
  // بيانات الطلبات
  // ==========================================
  const [studentApps, setStudentApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState(null);

  const fetchRequests = async () => {
    if (!token) return;
    setAppsLoading(true);
    setAppsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/requests`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        const mapped = data.requests.map((req) => ({
          id: req.request_id,
          name: req.student_name,
          idNum: req.university_id,
          major: req.major,
          company: req.institution_name || 'غير محدد',
          status: req.status,
          rejection_reason: req.rejection_reason,
          checked: false,
        }));
        setStudentApps(mapped);
      } else {
        setAppsError(data.message || 'حدث خطأ أثناء جلب الطلبات');
      }
    } catch (error) {
      console.error('fetchRequests error:', error);
      setAppsError('تعذر الاتصال بالخادم');
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const appStats = {
    received: studentApps.length,
    pending: studentApps.filter((a) => a.status === 'pending').length,
    rejected: studentApps.filter((a) => a.status === 'rejected').length,
    approved: studentApps.filter((a) => a.status === 'approved').length,
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // حالة نافذة "سبب الرفض"
  const [rejectingApp, setRejectingApp] = useState(null); // { id, name }
  const [rejectionReason, setRejectionReason] = useState('');

  const handleToggleAll = () => {
    const nextVal = !selectAllChecked;
    setSelectAllChecked(nextVal);
    setStudentApps(prev => prev.map(app => ({ ...app, checked: nextVal })));
  };

  const handleToggleRow = (id) => {
    setStudentApps(prev => prev.map(app => app.id === id ? { ...app, checked: !app.checked } : app));
  };

  const handleAppStatusChange = async (appId, newStatus, studentName, reason) => {
    const apiStatus = newStatus === 'accepted' ? 'approved' : newStatus === 'rejected' ? 'rejected' : null;

    if (!apiStatus) {
      triggerToast('ميزة "طلب تعديل" غير مفعّلة حالياً بالخادم', 'info');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/requests/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: apiStatus,
          ...(apiStatus === 'rejected' ? { rejection_reason: reason } : {}),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // نحدّث حالة الصف بدل ما نحذفه، حتى يضل موجود بالتصدير
        // وبفلاتر الحالات التانية (تمت الموافقة / مرفوض)
        setStudentApps(prev => prev.map(app =>
          app.id === appId ? { ...app, status: apiStatus } : app
        ));

        if (apiStatus === 'approved') {
          triggerToast(`تم اعتماد وقبول طلب تدريب الطالب/ة ${studentName}`);
        } else {
          triggerToast(`تم رفض طلب تدريب الطالب/ة ${studentName}`, 'error');
        }
      } else {
        triggerToast(data.message || 'حدث خطأ أثناء تحديث الطلب', 'error');
      }
    } catch (error) {
      console.error('handleAppStatusChange error:', error);
      triggerToast('تعذر الاتصال بالخادم، حاولي مرة أخرى', 'error');
    }
  };

  // ==========================================
  // فلاتر البحث
  // ==========================================
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  // الفلتر الافتراضي صار "بانتظار المراجعة" بدل "الكل"، حتى بمجرد ما يوافق/يرفض
  // المشرف على طلب، الصف يختفي تلقائياً من العرض الافتراضي (لأنه ما عاد pending)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('pending');

  // مراجع (refs) لعناصر القوائم المنسدلة لضبط إغلاقها عند الضغط خارجها
  const specialtyRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target)) {
        setShowSpecialtyDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // المصفوفة المفلترة (بحث + تخصص + حالة) — بنستخدمها هون بدل ما نكررها
  // جوا الـ JSX، حتى نقدر نتحقق من طولها الحقيقي (بعد الفلترة) ونعرض
  // رسالة مناسبة لما ما يكون في نتائج تطابق الفلتر المختار.
  const filteredApps = studentApps.filter(app => {
    const matchesSearch =
      (app.name || '').toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      (app.major || '').toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      (app.company || '').toLowerCase().includes(appSearchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialtyFilter === 'all' || app.major === selectedSpecialtyFilter;
    const matchesStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  // نص رسالة "لا توجد نتائج" حسب فلتر الحالة المختار حالياً
  const emptyStateMessage =
    selectedStatusFilter === 'pending' ? 'لا توجد طلبات قيد المراجعة حالياً' :
    selectedStatusFilter === 'approved' ? 'لا توجد طلبات تمت الموافقة عليها حالياً' :
    selectedStatusFilter === 'rejected' ? 'لا توجد طلبات مرفوضة حالياً' :
    'لا توجد طلبات حالياً';

  // ==========================================
  // تصدير مباشر لملف Excel (بدون نافذة اختيار صيغة)
  // ==========================================
  const handleDirectExport = () => {
    if (studentApps.length === 0) {
      triggerToast('لا يوجد بيانات لتصديرها حالياً', 'error');
      return;
    }

    const exportData = studentApps.map(app => ({
      'اسم الطالب': app.name,
      'الرقم الجامعي': app.idNum,
      'التخصص': app.major,
      'جهة التدريب المقترحة': app.company,
      'حالة الطلب':
        app.status === 'pending' ? 'بانتظار المراجعة' :
        app.status === 'approved' ? 'تمت الموافقة' :
        app.status === 'rejected' ? 'مرفوض' : app.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'طلبات الطلاب');
    XLSX.writeFile(workbook, `طلبات_الطلاب_${new Date().toISOString().split('T')[0]}.xlsx`);

    triggerToast('تم تصدير الملف بنجاح!');
  };

  return (
    <>
    <div className="space-y-6 animate-fade-in text-right">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إدارة طلبات التدريب</h1>
          <p className="text-gray-400 text-xs font-semibold">مراجعة واعتماد خطط التدريب الميداني لطلاب المرحلة النهائية.</p>
        </div>
        <button onClick={handleDirectExport} className="flex items-center gap-1 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition">
          <FileText className="h-4 w-4" /> تصدير تقرير
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي طلبات المستلمة</span>
            <span className="text-2xl font-extrabold text-gray-800">{appStats.received}</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات بانتظار المراجعة</span>
            <span className="text-2xl font-extrabold text-[#c08d13]">{appStats.pending}</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات مرفوضة</span>
            <span className="text-2xl font-extrabold text-red-500">{appStats.rejected}</span>
          </div>
          <div className="h-10 w-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات تمت الموافقة عليها</span>
            <span className="text-2xl font-extrabold text-green-600">{appStats.approved}</span>
          </div>
          <div className="h-10 w-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/*
        ملاحظة مهمة: شلنا overflow-hidden من هاد الـ container الخارجي.
        كانت هاي الخاصية عم تقص أي عنصر بيطلع برا حدود الصندوق (زي القوائم
        المنسدلة تبع الفلاتر لما بتنفتح للأسفل)، فكانت القائمة تنقص وتظهر
        مبتورة. الزوايا المدورة تبع الجدول نفسه محفوظة لأنها منقولة لصندوق
        داخلي منفصل تحت (rounded-b-3xl overflow-hidden) يلف الجدول بس.
      */}
      <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm">
        <div className="p-4 bg-white border-b border-gray-50 flex flex-col sm:flex-row gap-3 items-center justify-between rounded-t-3xl">
          <div className="flex-grow sm:flex-1 w-full relative">
            <input
              type="text"
              placeholder="البحث باسم الطالب، التخصص، أو جهة التدريب..."
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              className="w-full py-1.5 pl-3 pr-8 border border-gray-200 bg-[#fbfbfd] rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40 shadow-sm"
            />
            <Search className="absolute inset-y-0 right-2.5 h-4 w-4 my-auto text-gray-400" />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="relative" ref={specialtyRef}>
              <button
                type="button"
                onClick={() => {
                  setShowSpecialtyDropdown(!showSpecialtyDropdown);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm active:scale-95"
              >
                <span>{selectedSpecialtyFilter === 'all' ? 'حسب التخصصات' : selectedSpecialtyFilter}</span>
                <span className="text-[10px] text-gray-400 font-semibold">▼</span>
              </button>

              {showSpecialtyDropdown && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-1.5 text-right animate-fade-in">
                  {[
                    { id: 'all', text: 'جميع التخصصات / الكل' },
                    ...Array.from(new Set(studentApps.map(a => a.major).filter(Boolean))).map(m => ({ id: m, text: m }))
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpecialtyFilter(item.id);
                        setShowSpecialtyDropdown(false);
                      }}
                      className={'w-full text-right px-3 py-1.5 text-xs font-semibold rounded-lg transition ' + (
                        selectedSpecialtyFilter === item.id
                          ? 'bg-purple-50 text-brand-purple'
                          : 'text-gray-650 hover:bg-gray-50'
                      )}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowSpecialtyDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-750 hover:bg-gray-50 transition shadow-sm active:scale-95"
              >
                <span>{
                  selectedStatusFilter === 'all' ? 'جميع الحالات' :
                  selectedStatusFilter === 'pending' ? 'بانتظار المراجعة' :
                  selectedStatusFilter === 'approved' ? 'تمت الموافقة' :
                  selectedStatusFilter === 'rejected' ? 'مرفوض' : selectedStatusFilter
                }</span>
                <span className="text-[10px] text-gray-400 font-semibold">▼</span>
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-1.5 text-right animate-fade-in">
                  {[
                    { id: 'all', text: 'جميع الحالات' },
                    { id: 'pending', text: 'بانتظار المراجعة' },
                    { id: 'approved', text: 'تمت الموافقة' },
                    { id: 'rejected', text: 'مرفوض' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedStatusFilter(item.id);
                        setShowStatusDropdown(false);
                      }}
                      className={'w-full text-right px-3 py-1.5 text-xs font-semibold rounded-lg transition ' + (
                        selectedStatusFilter === item.id
                          ? 'bg-purple-50 text-brand-purple'
                          : 'text-gray-650 hover:bg-gray-50'
                      )}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm active:scale-95"
            >
              تحديث
            </button>
          </div>
        </div>

        {appsLoading && (
          <div className="p-10 text-center text-gray-400 text-xs font-bold">
            جاري تحميل الطلبات...
          </div>
        )}

        {!appsLoading && appsError && (
          <div className="p-10 text-center text-red-500 text-xs font-bold">
            {appsError}
          </div>
        )}

        {!appsLoading && !appsError && (
        <div className="overflow-x-auto rounded-b-3xl">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-400 border-b border-gray-50">
                <th className="p-4 text-center w-12">
                  <input type="checkbox" checked={selectAllChecked} onChange={handleToggleAll} className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer" />
                </th>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">التخصص</th>
                <th className="p-4">جهة التدريب المقترحة</th>
                <th className="p-4">حالة الطلب</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-center">
                    <input type="checkbox" checked={app.checked || false} onChange={() => handleToggleRow(app.id)} className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                        {app.name ? app.name.substring(0, 1) : '؟'}
                      </div>
                      <div className="text-right">
                        <h4 className="font-extrabold text-gray-800">{app.name}</h4>
                        <span className="text-[10px] text-gray-400">{app.idNum}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-600">{app.major}</td>
                  <td className="p-4 font-semibold text-gray-500">{app.company}</td>
                  <td className="p-4 font-semibold">
                    {app.status === 'pending' && (
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-bold">بانتظار المراجعة</span>
                    )}
                    {app.status === 'approved' && (
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold">تمت الموافقة</span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full border border-red-100 text-[10px] font-bold">مرفوض</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'accepted', app.name)}
                            className="px-3 py-1 bg-brand-purple text-white rounded-lg hover:bg-brand-purpleDark text-[10px] font-bold transition"
                          >
                            اعتماد
                          </button>
                          <button
                            onClick={() => {
                              setRejectingApp({ id: app.id, name: app.name });
                              setRejectionReason('');
                            }}
                            className="px-3 py-1 border border-red-500 text-red-500 bg-white rounded-lg hover:bg-red-50 text-[10px] font-bold transition"
                          >
                            رفض
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold">تم اتخاذ إجراء</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 text-xs font-bold">
                    {emptyStateMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>

      {/* Reject Reason Modal */}
      {rejectingApp && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setRejectingApp(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800">رفض طلب التدريب</h3>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                طالب: <span className="text-gray-800 font-extrabold">{rejectingApp.name}</span>
                {' '}| الرجاء توضيح سبب الرفض حتى يظهر للطالب.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">سبب الرفض *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: التخصص غير متوافق مع مجال الجهة، أو الجهة استوفت العدد المطلوب من المتدربين..."
                  className="w-full min-h-[90px] p-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingApp(null)}
                  className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      triggerToast('الرجاء كتابة سبب الرفض أولاً', 'error');
                      return;
                    }
                    handleAppStatusChange(rejectingApp.id, 'rejected', rejectingApp.name, rejectionReason.trim());
                    setRejectingApp(null);
                  }}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-sm active:scale-95"
                >
                  تأكيد الرفض
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     </>
  );
}