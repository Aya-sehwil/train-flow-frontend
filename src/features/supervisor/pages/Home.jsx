 import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Clock, ClipboardList } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Home() {
  const navigate = useNavigate();
  const { token } = useOutletContext();

  const [dashboardStats, setDashboardStats] = useState({
    pendingReports: 0,
    pendingRequests: 0,
    activeOpportunities: 0,
    totalTrainees: 0
  });
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [homeLoading, setHomeLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setHomeLoading(true);

    const fetchHomeData = async () => {
      try {
        const [statsRes, tasksRes, progressRes] = await Promise.all([
          fetch(`${API_BASE_URL}/supervisor/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/supervisor/dashboard/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/supervisor/dashboard/weekly-progress`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const statsData = await statsRes.json();
        const tasksData = await tasksRes.json();
        const progressData = await progressRes.json();

        if (statsData.success) setDashboardStats(statsData.stats);
        if (tasksData.success) setUrgentTasks(tasksData.tasks);
        if (progressData.success) setWeeklyProgress(progressData.progress);
      } catch (error) {
        console.error('fetchHomeData error:', error);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchHomeData();
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-right">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">مرحباً بك، لوحة التحكم</h1>
          <p className="text-gray-400 text-xs font-semibold font-cairo">
            نظرة عامة على نشاط التدريب الميداني اليوم.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">إجمالي المتدربين</span>
            <span className="text-3xl font-extrabold text-gray-855">{dashboardStats.totalTrainees}</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4d44b5]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right cursor-pointer hover:border-brand-purple/20 transition duration-200" onClick={() => navigate('/dashboard/supervisor/institutions')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">الفرص النشطة</span>
            <span className="text-3xl font-extrabold text-gray-855">{dashboardStats.activeOpportunities}</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-purple/20 transition duration-200 text-right" onClick={() => navigate('/dashboard/supervisor/applications')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">طلبات بانتظار المراجعة</span>
            <span className="text-3xl font-extrabold text-gray-855">{dashboardStats.pendingRequests}</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-purple/20 transition duration-200 text-right" onClick={() => navigate('/dashboard/supervisor/reports')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">تقارير بانتظار التقييم</span>
            <span className="text-3xl font-extrabold text-gray-855">{dashboardStats.pendingReports}</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Home Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
              <h3 className="text-sm font-extrabold text-gray-800">
                مهام عاجلة
              </h3>
            </div>
            <div className="space-y-3">
              {urgentTasks.length === 0 && !homeLoading && (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد مهام عاجلة حالياً</p>
              )}
              {urgentTasks.slice(0, 3).map(task => (
                <div key={`${task.type}-${task.id}`} className="p-3.5 bg-white border border-gray-100 rounded-2xl relative text-right">
                  <span className="absolute top-3.5 left-3.5 text-[9px] text-gray-400 font-bold">
                    {task.date ? new Date(task.date).toLocaleDateString('en-GB') : ''}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                    task.type === 'request'
                      ? 'bg-red-50 text-red-650 border-red-100/50'
                      : 'bg-amber-50 text-amber-600 border-amber-100/50'
                  }`}>
                    {task.type === 'request' ? 'مراجعة طلب' : 'تقييم أسبوعي'}
                  </span>
                  <h5 className="text-xs font-bold text-gray-800 mt-2.5">
                    {task.type === 'request' ? `طلب انضمام: ${task.student_name}` : `تقييم ${task.week_number || ''}`}
                  </h5>
                  <p className="text-[10px] text-gray-450 font-semibold mt-0.5 font-cairo">
                    {task.type === 'request' ? task.major : task.student_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/supervisor/applications')}
            className="w-full mt-4 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-2xl hover:bg-brand-purpleDark transition active:scale-98 shadow-sm cursor-pointer font-cairo"
          >
            عرض كل المهام
          </button>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm text-right flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-gray-800 mb-6">
              معدل الإنجاز العام
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyProgress.map(day => {
                    const dayNamesArabic = {
                      Sunday: 'الأحد', Monday: 'الاثنين', Tuesday: 'الثلاثاء',
                      Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت'
                    };
                    return { ...day, dayLabel: dayNamesArabic[day.day_name] || day.day_name };
                  })}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dayLabel" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'نسبة الإنجاز']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #f1f5f9' }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {weeklyProgress.map((entry, idx) => {
                      const colors = ['#38bdf8', '#6366f1', '#fbbf24', '#f87171', '#fef08a', '#a78bfa', '#34d399'];
                      return <Cell key={idx} fill={colors[idx % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>نسبة إنجاز المهام الأسبوعية للمجموعات التدريبية</span>
          </div>
        </div>

      </div>
    </div>
  );
}