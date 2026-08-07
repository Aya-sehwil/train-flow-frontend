 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Attendance() {
  const { triggerToast } = useOutletContext();

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState('--:--');
  const [checkOutTime, setCheckOutTime] = useState('--:--');
  const [totalDays, setTotalDays] = useState(0);
  const [monthlyDays, setMonthlyDays] = useState([]);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ar-SA'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`${API}/attendance/stats`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const d = res.data;
          setCheckedIn(d.todayCheckedIn);
          setCheckedOut(d.todayCheckedOut);
          setCheckInTime(d.checkInTime
            ? new Date(`1970-01-01T${d.checkInTime}`).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
            : '--:--');
          setCheckOutTime(d.checkOutTime
            ? new Date(`1970-01-01T${d.checkOutTime}`).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
            : '--:--');
          setTotalDays(d.totalDays);
        }
      })
      .catch(() => triggerToast('تعذر تحميل بيانات الحضور', 'error'));

    const now = new Date();
    fetch(`${API}/attendance/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => { if (res.success) setMonthlyDays(res.data.map(d => d.day)); })
      .catch(() => {});
  }, []);

  const handleCheckIn = async () => {
    if (checkedIn) return;
    try {
      const res = await fetch(`${API}/attendance/checkin`, { method: 'POST', headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setCheckedIn(true);
        setTotalDays(prev => prev + 1);
        const time = new Date(`1970-01-01T${data.checkInTime}`)
          .toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        setCheckInTime(time);
        triggerToast(data.message);
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال', 'error');
    }
  };

  const handleCheckOut = async () => {
    if (!checkedIn || checkedOut) return;
    try {
      const res = await fetch(`${API}/attendance/checkout`, { method: 'POST', headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setCheckedOut(true);
        const time = new Date(`1970-01-01T${data.checkOutTime}`)
          .toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        setCheckOutTime(time);
        triggerToast(data.message);
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال', 'error');
    }
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const monthNamesArabic = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthLabel = `${monthNamesArabic[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({ day: daysInPrevMonth - i, isMuted: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, isMuted: false });
  }
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    calendarCells.push({ day: d, isMuted: true });
  }

  const presentDaysCount = monthlyDays.length;
  const workingDaysSoFar = calendarCells.filter((c, idx) => {
    if (c.isMuted || c.day > todayDate) return false;
    const colIndex = idx % 7;
    const isWeekend = colIndex === 5 || colIndex === 6;
    return !isWeekend;
  }).length;
  const absentDaysCount = Math.max(workingDaysSoFar - presentDaysCount, 0);

  return (
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">حضور اليوم وتسجيل المباشرة</h1>
        <p className="text-gray-400 text-xs font-semibold">قم بتسجيل حضورك وانصرافك اليومي بناءً على نطاقك الجغرافي لجهة التدريب.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-right space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="text-xs font-extrabold text-gray-800">سجل أيام الحضور - {monthLabel}</h3>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px] font-bold">{presentDaysCount} يوم حضور</span>
              <span className="px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full text-[9px] font-bold">{absentDaysCount} غياب</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center text-xs">
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(dayName => (
              <div key={dayName} className="font-extrabold text-gray-400 text-[10px] pb-2">{dayName}</div>
            ))}
            {calendarCells.map((item, idx) => {
              const colIndex = idx % 7;
              const isWeekend = colIndex === 5 || colIndex === 6;
              const isToday = !item.isMuted && item.day === todayDate;
              const isPresent = !item.isMuted && (monthlyDays.includes(item.day) || (isToday && checkedIn));

              if (item.isMuted) {
                return (
                  <div key={idx} className="p-3 bg-gray-50 text-gray-300 rounded-xl">{item.day}</div>
                );
              }

              return (
                <div key={idx} className={`p-3 rounded-xl font-bold flex flex-col items-center justify-center
                  ${isToday
                    ? isPresent
                      ? 'bg-green-50 text-green-600 border border-green-150'
                      : 'bg-brand-purple/5 border border-brand-purple/20 text-[#4d44b5]'
                    : isPresent
                      ? 'bg-green-50 text-green-600 border border-green-100/50'
                      : isWeekend
                        ? 'bg-gray-50/50 text-gray-400'
                        : 'bg-white text-gray-600 border border-gray-100'
                  }`}>
                  <span>{item.day}</span>
                  {isPresent && <span className="text-[8px] mt-0.5">✔️</span>}
                  {isToday && !isPresent && <span className="text-[8px] mt-0.5">اليوم</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 font-bold block">الوقت المباشر الحالي</span>
              <span className="text-xl font-extrabold text-gray-800 tracking-wider font-mono">{timeStr}</span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl space-y-2 text-right">
              <div className="h-28 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4d44b5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="h-8 w-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple animate-ping absolute" />
                <MapPin className="h-6 w-6 text-brand-purple z-10 drop-shadow" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-extrabold justify-center bg-green-50/50 py-1 rounded-lg">
                <span>●</span>
                <span>أنت متواجد ضمن نطاق التحضير المعتمد (STC)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleCheckIn} disabled={checkedIn}
                className={`py-3 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95 flex flex-col items-center justify-center gap-1 ${checkedIn ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                <span>✓</span><span>تسجيل حضور</span>
              </button>
              <button onClick={handleCheckOut} disabled={!checkedIn || checkedOut}
                className={`py-3 rounded-2xl text-xs font-bold transition shadow-sm active:scale-95 flex flex-col items-center justify-center gap-1 ${(!checkedIn || checkedOut) ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-650'}`}>
                <span>✕</span><span>تسجيل انصراف</span>
              </button>
            </div>
            <div className="border-t border-gray-50 pt-3 flex justify-between text-[11px] font-bold text-gray-500">
              <div>
                <span className="block text-gray-400 text-[9px] mb-0.5">وقت الحضور اليوم</span>
                <span className="text-gray-700">{checkInTime}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-[9px] mb-0.5">وقت الانصراف اليوم</span>
                <span className="text-gray-700">{checkOutTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}