import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, CheckCircle2, Clock } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const REQUIRED_ACADEMIC_HOURS = 100;

export default function Applications() {
  const { triggerToast } = useOutletContext();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const loadStudents = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/registrar/eligibility`, { headers: getHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success) setStudents(data.data);
      })
      .catch(() => triggerToast('تعذر تحميل بيانات الطلاب', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = {
    pending: students.filter(s => s.eligibility_status === 'pending').length,
    qualified: students.filter(s => s.eligibility_status === 'qualified').length,
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name?.includes(searchQuery) || s.university_id?.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || s.eligibility_status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">

      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">متابعة أهلية الطلاب للتدريب</h1>
        <p className="text-gray-400 text-xs font-semibold">
          عرض تلقائي لحالة أهلية الطلاب بناءً على الساعات الأكاديمية المنجزة (الحد الأدنى {REQUIRED_ACADEMIC_HOURS} ساعة). هذه الحالة تُحسب تلقائياً ولا يمكن تعديلها يدوياً.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">لم يكمل الساعات المطلوبة بعد</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.pending}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">مستوفي الشروط</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.qualified}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 relative">
          <input
            type="text"
            placeholder="بحث بالرقم الجامعي أو الاسم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-3 pr-10 bg-gray-50 rounded-xl text-right text-xs focus:outline-none border-none font-semibold font-cairo"
          />
          <Search className="absolute inset-y-0 right-3 h-4 w-4 my-auto text-gray-400" />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48 p-2.5 bg-gray-50 rounded-xl text-right focus:outline-none border-none font-bold text-gray-650 cursor-pointer font-cairo text-xs"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">لم يكمل الساعات بعد</option>
          <option value="qualified">مستوفي الشروط</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-400 border-b border-gray-50">
                <th className="p-4">الطالب / الرقم الجامعي</th>
                <th className="p-4">الكلية / التخصص</th>
                <th className="p-4">الساعات المنجزة</th>
                <th className="p-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-xs font-bold">جاري التحميل...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-xs font-bold">لا توجد نتائج مطابقة</td></tr>
              ) : filteredStudents.map(s => (
                <tr key={s.student_id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center text-xs">
                        {s.full_name?.charAt(0)}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 block">{s.full_name}</span>
                        <span className="text-[9px] text-gray-400 font-mono block">{s.university_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-800 block">{s.college || '—'}</span>
                    <span className="text-[10px] text-gray-400 block">{s.major || '—'}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-700">
                    {s.academic_hours_completed || 0} / {REQUIRED_ACADEMIC_HOURS}
                  </td>
                  <td className="p-4">
                    {s.eligibility_status === 'pending' && (
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-bold">لم يكمل الساعات بعد</span>
                    )}
                    {s.eligibility_status === 'qualified' && (
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold">مستوفي الشروط</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}