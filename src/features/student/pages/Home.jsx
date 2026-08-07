import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ImportantTasks from '../components/ImportantTasks';
import StatCard from '../../../components/common/StatCard';
import UpdatesWidget from '../components/UpdatesWidget';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { Calendar, Clock, FileText, AlertTriangle, XCircle } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Home() {
  const { triggerToast } = useOutletContext();

  const [totalDays, setTotalDays] = useState(0);
  const [completedHours, setCompletedHours] = useState(0);
  const [requiredHours, setRequiredHours] = useState(130);
  const [reportsCount, setReportsCount] = useState(0);
  const [monthlyDays, setMonthlyDays] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState(null);

useEffect(() => {
  fetch(`${API}/student/profile`, { headers: getHeaders() })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const hours = res.data.academic_hours_completed || 0;
        setEligibilityStatus(hours >= 100 ? 'qualified' : 'pending');
      }
    })
    .catch(() => {});
}, []);

  useEffect(() => {
    fetch(`${API}/attendance/stats`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setTotalDays(res.data.totalDays);
          setCompletedHours(res.data.completedHours);
          setRequiredHours(res.data.requiredHours);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const now = new Date();
    fetch(`${API}/attendance/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => { if (res.success) setMonthlyDays(res.data.map(d => d.day)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API}/reports`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => { if (res.success) setReportsCount(res.data.length); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setNotifLoading(true);
    fetch(`${API}/notifications`, { headers: getHeaders() })
      .then(r => r.json())
      .then(res => { if (res.success) setNotifications(res.data); })
      .catch(() => {})
      .finally(() => setNotifLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(`${API}/notifications/read-all`, {
        method: 'PATCH',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch {
      triggerToast('تعذر تحديث الإشعارات', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Eligibility Banner */}
      {eligibilityStatus === 'pending' && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-right flex-1">
            <p className="text-xs font-bold text-amber-700">حسابك بانتظار اعتماد الأهلية</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">لا يمكنك التقديم على فرص التدريب حتى تتم مراجعة واعتماد أهليتك من قِبل قسم القبول والتسجيل.</p>
          </div>
        </div>
      )}

      {eligibilityStatus === 'unqualified' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div className="text-right flex-1">
            <p className="text-xs font-bold text-red-700">لم يتم اعتماد أهليتك للتدريب</p>
            <p className="text-[11px] text-red-600 font-semibold mt-0.5">الرجاء التواصل مع قسم القبول والتسجيل لمعرفة المستندات أو المتطلبات الناقصة.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-right shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-xl font-extrabold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-400 text-xs font-semibold">
            ابحث وتقدم للوظائف التدريبية الميدانية التي تتوافق مع تخصصك الاكاديمي
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eefaf3] text-green-600 text-xs font-bold rounded-full border border-[#dcf5e7]">
            <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            <span>الحالة: قيد المباشرة والتدريب</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard
          title="أيام الحضور"
          value={String(totalDays)}
          icon={Calendar}
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="ساعات التدريب المنجزة"
          value={String(completedHours)}
          total={String(requiredHours)}
          icon={Clock}
          iconColor="text-yellow-500"
          iconBg="bg-yellow-50"
          type="progress"
        />
        <StatCard
          title="التقارير المرفوعة"
          value={String(reportsCount)}
          icon={FileText}
          iconColor="text-brand-purple"
          iconBg="bg-purple-50"
        />
        <div className="h-full">
          <ImportantTasks />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch lg:flex-1 lg:min-h-0">
        <div className="h-full"><ScheduleCalendar monthlyDays={monthlyDays} /></div>
        <div className="h-full">
          <UpdatesWidget
            notifications={notifications}
            notifLoading={notifLoading}
            onMarkAllRead={handleMarkAllRead}
          />
        </div>
      </div>
    </div>
  );
}