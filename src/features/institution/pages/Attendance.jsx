import React, { useState } from 'react';
import { Clock, Users, ClipboardList, Search, Check, Trash2 } from 'lucide-react';

export default function Attendance() {
  // Toast notifications state and trigger
  const [toast, setToast] = useState(null);
  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 1, name: 'عبدالله محمد', idNum: '432109876', avatar: 'ع', date: '18 أكتوبر 2023', checkIn: '08:05 ص', checkOut: '02:15 م', hours: '6 ساعات', status: 'pending' },
    { id: 2, name: 'عبدالله محمد', idNum: '432109876', avatar: 'ع', date: '17 أكتوبر 2023', checkIn: '08:05 ص', checkOut: '02:15 م', hours: '6 ساعات', status: 'pending' },
    { id: 3, name: 'عبدالله محمد', idNum: '432109876', avatar: 'ع', date: '16 أكتوبر 2023', checkIn: '08:05 ص', checkOut: '02:15 م', hours: '6 ساعات', status: 'pending' },
    { id: 4, name: 'عبدالله محمد', idNum: '432109876', avatar: 'ع', date: '15 أكتوبر 2023', checkIn: '08:05 ص', checkOut: '02:15 م', hours: '6 ساعات', status: 'pending' },
    { id: 5, name: 'عبدالله محمد', idNum: '432109876', avatar: 'ع', date: '14 أكتوبر 2023', checkIn: '08:05 ص', checkOut: '02:15 م', hours: '6 ساعات', status: 'pending' },
  ]);

  const handleApproveAttendance = (id) => {
    setAttendanceLogs(prev => prev.map(log => log.id === id ? { ...log, status: 'approved' } : log));
    triggerToast('تم اعتماد ساعة الحضور بنجاح');
  };

  const handleRejectAttendance = (id) => {
    setAttendanceLogs(prev => prev.filter(log => log.id !== id));
    triggerToast('تم رفض وإلغاء تسجيل الحضور', 'error');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 p-4 rounded-2xl shadow-xl transition-all duration-300 max-w-sm flex items-center gap-3 border animate-fade-in ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : toast.type === 'info'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-green-50 text-green-800 border-green-200'
        }`}>
          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <span className="text-sm font-semibold text-right w-full">{toast.msg}</span>
        </div>
      )}

      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">سجل الحضور والانصراف</h1>
        <p className="text-gray-400 text-xs font-semibold">متابعة واعتماد ساعات التدريب الميداني للطلاب.</p>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Hours awaiting approval */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">ساعات بانتظار الاعتماد</span>
            <span className="text-3xl font-extrabold text-gray-800">156</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* 2. Absent today */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">غياب اليوم</span>
            <span className="text-3xl font-extrabold text-gray-800">5</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-550">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* 3. Attended today */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">حضور اليوم</span>
            <span className="text-3xl font-extrabold text-gray-800">38</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-purple">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="bg-white rounded-3xl border border-gray-150/40 shadow-sm overflow-hidden text-right">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/20">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="البحث باسم الطالب أو الرقم الجامعي..." 
              value={attendanceSearch}
              onChange={e => setAttendanceSearch(e.target.value)}
              className="w-full py-2 pl-3 pr-10 border border-gray-250 bg-white rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40 shadow-xs"
            />
            <Search className="absolute inset-y-0 right-3 h-4 w-4 my-auto text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-450 border-b border-gray-100">
                <th className="p-4">الطالب</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">وقت الحضور</th>
                <th className="p-4">وقت الانصراف</th>
                <th className="p-4">إجمالي الساعات</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {attendanceLogs
                .filter(l => l.name.toLowerCase().includes(attendanceSearch.toLowerCase()) || l.idNum.includes(attendanceSearch))
                .map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center text-xs">
                        {log.avatar}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 block">{log.name}</span>
                        <span className="text-[9px] text-gray-400 font-mono block">{log.idNum}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{log.date}</td>
                    <td className="p-4 text-green-650 font-bold">{log.checkIn}</td>
                    <td className="p-4 text-red-655 font-bold">{log.checkOut}</td>
                    <td className="p-4 text-brand-purple font-bold">{log.hours}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                        log.status === 'approved' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {log.status === 'approved' ? 'مقبول' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="p-4">
                      {log.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleApproveAttendance(log.id)}
                            className="p-1.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition border border-green-150"
                            title="اعتماد"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectAttendance(log.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition border border-red-150"
                            title="رفض"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[10px] font-bold">تم الاعتماد</span>
                      )}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>عرض 1 إلى 5 من 42</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-400 hover:text-gray-600">&lt;</button>
            <button className="px-3 py-1 bg-brand-purple text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-400 hover:text-gray-600">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
