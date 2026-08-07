 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Award,
  Check,
  Clock,
  Download,
  TrendingUp,
  Lock,
  SlidersHorizontal,
  List
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Grades() {
  const { triggerToast } = useOutletContext();

  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, completionPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'approved' | 'pending'

  const loadGrades = () => {
    setLoading(true);
    fetch(`${API}/registrar/grades`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setStudents(res.data);
          setStats(res.stats);
        } else {
          triggerToast(res.message || 'تعذر تحميل بيانات الدرجات', 'error');
        }
      })
      .catch(() => triggerToast('تعذر الاتصال بالخادم', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const handleApproveGrade = async (id, name) => {
    try {
      const res = await fetch(`${API}/registrar/grades/${id}/approve`, {
        method: 'PUT',
        headers: getHeaders()
      });
      const data = await res.json();

      if (data.success) {
        triggerToast(`تم اعتماد وتوثيق درجة الطالب ${name} بنجاح!`);
        loadGrades();
      } else {
        triggerToast(data.message || 'تعذر اعتماد الدرجة', 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleExportExcel = () => {
    if (students.length === 0) {
      triggerToast('لا توجد بيانات لتصديرها حالياً', 'error');
      return;
    }

    const exportData = students.map(s => ({
      'الرقم الجامعي': s.idNum,
      'اسم الطالب': s.name,
      'جهة التدريب': s.company,
      'تقييم المشرف (100)': s.supervisorScore ?? '—',
      'تقييم الشركة (100)': s.institutionScore ?? '—',
      'الدرجة النهائية': s.finalScore ?? '—',
      'الحالة': s.status === 'approved' ? 'معتمد' : 'بانتظار الاعتماد',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 15 }, { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 16 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الدرجات');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `درجات_الطلاب_${today}.xlsx`);

    triggerToast('تم تصدير ملف الدرجات بنجاح ✅');
  };

  const handleCloseCourse = () => {
    triggerToast('ميزة إغلاق المساق لسا تحت التطوير', 'info');
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      (s.name || '').includes(searchQuery) ||
      (s.idNum || '').includes(searchQuery) ||
      (s.company || '').includes(searchQuery);
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'approved' && s.status === 'approved') ||
      (activeTab === 'pending' && s.status === 'pending');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">

      {/* Title */}
      <div className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">تحديث بيانات المستخدمين</h1>
          <p className="text-gray-400 text-xs font-semibold">ابحث وقم بادارة بيانات الطلاب ,المشرفين, وممثلي الشركات</p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto text-xs">
          <button
            onClick={handleCloseCourse}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-brand-purple hover:bg-[#5249c4] text-white font-bold rounded-2xl transition active:scale-95 duration-200 border-none font-cairo cursor-pointer"
          >
            <Lock className="h-4 w-4" /> إغلاق مساق التدريب
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2.5 border border-brand-purple text-brand-purple hover:bg-purple-50 font-bold rounded-2xl transition active:scale-95 duration-200 bg-white cursor-pointer"
          >
            <Download className="h-4 w-4" /> تصدير الدرجات (Excel)
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي الطلبة</span>
            <span className="text-2xl font-extrabold text-gray-800">{stats.total}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">تم الاعتماد</span>
            <span className="text-2xl font-extrabold text-gray-800">{stats.approved}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <Check className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">بانتظار الاعتماد</span>
            <span className="text-2xl font-extrabold text-gray-800">{stats.pending}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-2 flex-grow">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-400">نسبة الإنجاز</span>
              <span className="text-brand-purple">{stats.completionPercent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-purple rounded-full" style={{ width: `${stats.completionPercent}%` }} />
            </div>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple shrink-0 ml-3">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="bg-white px-4 py-2.5 rounded-t-3xl shadow-sm flex items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border-none cursor-pointer">
            <List className="h-4.5 w-4.5" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border-none cursor-pointer">
            <SlidersHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex items-center gap-6 font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-1 border-b-2 transition duration-200 cursor-pointer ${
              activeTab === 'all' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`pb-1 border-b-2 transition duration-200 cursor-pointer ${
              activeTab === 'approved' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            المعتمدة
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-1 border-b-2 transition duration-200 flex items-center gap-1 cursor-pointer ${
              activeTab === 'pending' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>بانتظار الاعتماد</span>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 text-xs font-bold py-10">جاري التحميل...</div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-455 border-b border-gray-50">
                  <th className="p-4 w-10">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-4">الرقم الجامعي</th>
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">جهة التدريب</th>
                  <th className="p-4">تقييم المشرف (100)</th>
                  <th className="p-4">تقييم الشركة (100)</th>
                  <th className="p-4">الدرجة النهائية</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4 font-mono text-gray-500">{s.idNum}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-full ${s.avatarBg} font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                          {s.avatarText}
                        </div>
                        <span className="font-bold text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-650">{s.company}</td>
                    <td className="p-4 font-bold text-gray-600">{s.supervisorScore ?? '—'}</td>
                    <td className="p-4 font-bold text-gray-600">{s.institutionScore ?? '—'}</td>
                    <td className="p-4">
                      <span className="w-14 inline-block p-1.5 bg-gray-50 rounded-xl text-center font-bold border border-gray-200 text-gray-855">
                        {s.finalScore ?? '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        s.status === 'approved' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#fffae6] text-amber-600'
                      }`}>
                        {s.status === 'approved' ? '● معتمد' : '● بانتظار الاعتماد'}
                      </span>
                    </td>
                    <td className="p-4">
                      {s.status === 'pending' ? (
                        <button
                          onClick={() => handleApproveGrade(s.id, s.name)}
                          disabled={!s.canApprove}
                          className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 duration-200 font-cairo ${
                            s.canApprove
                              ? 'border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white bg-white cursor-pointer'
                              : 'border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                          }`}
                        >
                          اعتماد
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[10px]">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}