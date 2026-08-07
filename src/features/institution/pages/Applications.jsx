 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function Applications() {
  const { triggerToast } = useOutletContext();

  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState('');

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const loadApplications = () => {
    setLoading(true);
    fetch(`${API}/institution/applications`, { headers: getHeaders() })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setApplications(res.data);
          if (res.data.length > 0 && selectedAppId === null) {
            setSelectedAppId(res.data[0].request_id);
          }
        } else {
          triggerToast(res.message || 'تعذر تحميل الطلبات', 'error');
        }
      })
      .catch(() => triggerToast('تعذر الاتصال بالسيرفر', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedApp = applications.find((app) => app.request_id === selectedAppId) || null;

  useEffect(() => {
    setNotesDraft(selectedApp?.rejection_reason || '');
  }, [selectedAppId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await fetch(`${API}/institution/applications/${requestId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          status: newStatus,
          rejection_reason: newStatus === 'rejected' ? notesDraft : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        loadApplications();
      } else {
        triggerToast(data.message || 'تعذر تحديث حالة الطلب', 'error');
      }
    } catch {
      triggerToast('تعذر الاتصال بالسيرفر', 'error');
    }
  };

  const filteredApps = applications.filter((app) => {
    const q = appSearchQuery.trim();
    if (!q) return true;
    return (
      (app.full_name || '').includes(q) ||
      (app.university_id || '').includes(q) ||
      (app.major || '').includes(q)
    );
  });

  const statusLabel = (status) =>
    status === 'approved' ? 'تم القبول' : status === 'rejected' ? 'مرفوض' : 'قيد الانتظار';

  const statusClasses = (status) =>
    status === 'approved'
      ? 'bg-green-50 text-green-600 border-green-100'
      : status === 'rejected'
      ? 'bg-red-50 text-red-655 border-red-100'
      : 'bg-amber-50 text-amber-600 border-amber-100';

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">مراجعة طلبات الانضمام</h1>
        <p className="text-gray-400 text-xs font-semibold">إدارة ومتابعة طلبات الطلاب المتقدمين للتدريب لدى مؤسستكم.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: Applicant Details & Decision */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150/40 shadow-sm flex flex-col justify-between gap-5 text-right lg:order-1">
          {!selectedApp ? (
            <p className="text-xs text-gray-400 font-bold text-center py-10">
              {loading ? 'جاري التحميل...' : 'لا يوجد طلب محدد'}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-extrabold text-gray-800">تفاصيل الطلب</h3>
              </div>

              <div className="text-center py-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="h-16 w-16 bg-brand-purple/10 text-brand-purple font-extrabold flex items-center justify-center text-xl rounded-full mx-auto shadow-sm">
                  {selectedApp.full_name ? selectedApp.full_name[0] : 'س'}
                </div>
                <h4 className="text-sm font-extrabold text-gray-800">{selectedApp.full_name}</h4>
                <p className="text-[10px] text-gray-400 font-bold">{selectedApp.major}</p>
                <p className="text-[10px] text-gray-400 font-bold">{selectedApp.college}</p>
              </div>

              <div className="space-y-1 text-xs font-semibold text-gray-600">
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-400">الرقم الجامعي</span>
                  <span>{selectedApp.university_id || '--'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-400">البريد الإلكتروني</span>
                  <span dir="ltr">{selectedApp.email || '--'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-400">تاريخ التقديم</span>
                  <span>{selectedApp.submission_date?.split('T')[0] || '--'}</span>
                </div>
              </div>

              {/* Decision Buttons */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 block">اتخاذ إجراء</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.request_id, 'pending')}
                    className={`py-2 text-[10px] font-bold rounded-xl border text-center transition cursor-pointer ${
                      selectedApp.status === 'pending'
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                        : 'bg-[#fffae6] border-[#ffe8b3] text-amber-600 hover:bg-amber-100/50'
                    }`}
                  >
                    قيد الانتظار
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.request_id, 'rejected')}
                    className={`py-2 text-[10px] font-bold rounded-xl border text-center transition cursor-pointer ${
                      selectedApp.status === 'rejected'
                        ? 'bg-red-500 border-red-500 text-white shadow-md'
                        : 'bg-[#fff5f5] border-[#ffd6d6] text-red-600 hover:bg-red-100/50'
                    }`}
                  >
                    رفض الطلب
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.request_id, 'approved')}
                    className={`py-2 text-[10px] font-bold rounded-xl border text-center transition cursor-pointer ${
                      selectedApp.status === 'approved'
                        ? 'bg-green-500 border-green-500 text-white shadow-md'
                        : 'bg-[#f5fbf7] border-[#d2f3dd] text-green-600 hover:bg-green-100/50'
                    }`}
                  >
                    قبول الطلب
                  </button>
                </div>
              </div>

              {/* Rejection reason (يُرسل للطالب فقط عند الرفض) */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-gray-400 block">سبب الرفض (يظهر للطالب عند الرفض)</label>
                <textarea
                  rows="3"
                  placeholder="اكتب سبب الرفض إن وجد..."
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-[#f8f9fd] text-right focus:outline-none focus:border-brand-purple font-semibold font-cairo"
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Application List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150/40 shadow-sm overflow-hidden flex flex-col justify-between lg:order-2">
          <div>
            <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-gray-800">قائمة المتقدمين</h3>
              <input
                type="text"
                placeholder="بحث بالاسم أو الرقم الجامعي أو التخصص..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                className="flex-1 max-w-xs py-1.5 px-3 bg-gray-50 border border-gray-200/80 rounded-xl text-right text-xs focus:outline-none"
              />
              <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-[10px] font-bold shrink-0">
                {applications.length} طالب
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-450 border-b border-gray-100">
                    <th className="p-4">الطالب</th>
                    <th className="p-4">التخصص</th>
                    <th className="p-4">الكلية</th>
                    <th className="p-4">تاريخ التقديم</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400 text-xs font-bold">
                        جاري تحميل الطلبات...
                      </td>
                    </tr>
                  ) : filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400 text-xs font-bold">
                        لا يوجد طلبات
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr
                        key={app.request_id}
                        onClick={() => setSelectedAppId(app.request_id)}
                        className={`cursor-pointer transition duration-150 hover:bg-[#fcfcff] ${
                          selectedAppId === app.request_id ? 'bg-[#f4f2ff] border-r-4 border-brand-purple' : ''
                        }`}
                      >
                        <td className="p-4 flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center text-xs">
                            {app.full_name ? app.full_name[0] : '؟'}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-800 block">{app.full_name}</span>
                            <span className="text-[9px] text-gray-400 block">{app.university_id}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">{app.major || '--'}</td>
                        <td className="p-4 text-gray-800">{app.college || '--'}</td>
                        <td className="p-4 text-gray-450">{app.submission_date?.split('T')[0] || '--'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${statusClasses(app.status)}`}>
                            {statusLabel(app.status)}
                          </span>
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
    </div>
  );
}