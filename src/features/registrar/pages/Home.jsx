import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  FileText,
  Briefcase,
  Award,
  MoreVertical
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export default function Home() {
  const { triggerToast } = useOutletContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    startedTraining: 0,
    finishedTraining: 0,
    pendingRequests: 0,
  });
  const [collegeDistribution, setCollegeDistribution] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/registrar/dashboard/stats`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_BASE_URL}/registrar/dashboard/college-distribution`, { headers: getHeaders() }).then(r => r.json()),
    ])
      .then(([statsRes, distRes]) => {
        if (statsRes.success) setStats(statsRes.stats);
        if (distRes.success) setCollegeDistribution(distRes.data);
      })
      .catch(() => triggerToast('تعذر تحميل بيانات لوحة التحكم', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxCount = Math.max(...collegeDistribution.map(c => c.count), 1);
  const barColors = ['#38bdf8', '#7c3aed', '#fbbf24', '#34d399', '#f472b6'];

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-right">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">نظرة عامة على التدريب</h1>
          <p className="text-gray-400 text-xs font-semibold">
            احصائيات الفصل الدراسي الحالي للعام الاكاديمي 2023/2024
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي الطلبة المسجلين</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.totalStudents}</span>
            <span className="text-[9px] text-green-500 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> إجمالي مسجلين بالنظام
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">باشروا بالتدريب</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.startedTraining}</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">أنهوا التدريب</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.finishedTraining}</span>
            <span className="text-[9px] text-gray-400 font-bold block">أكملوا 130 ساعة تدريبية</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/dashboard/registrar/applications')}
          className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات معلقة</span>
            <span className="text-2xl font-extrabold text-gray-800">{loading ? '...' : stats.pendingRequests}</span>
            <span className="text-[9px] text-brand-purple font-bold block">مراجعة الطلبات ←</span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50/50 flex items-center justify-center text-red-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-gray-855">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            onClick={() => navigate('/dashboard/registrar/letters')}
            className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl text-center space-y-2 transition duration-200 active:scale-95 border-none cursor-pointer"
          >
            <div className="h-9 w-9 bg-purple-50 text-brand-purple rounded-xl flex items-center justify-center mx-auto">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 block">إصدار خطاب توجيه</span>
          </button>

          <button 
            onClick={() => triggerToast('شاشة اعتماد المباشرات قريباً')}
            className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl text-center space-y-2 transition duration-200 active:scale-95 border-none cursor-pointer"
          >
            <div className="h-9 w-9 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 block">اعتماد المباشرة</span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/registrar/grades')}
            className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl text-center space-y-2 transition duration-200 active:scale-95 border-none cursor-pointer"
          >
            <div className="h-9 w-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto">
              <Award className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 block">إدخل الدرجات</span>
          </button>

          <button 
            onClick={() => triggerToast('شاشة حل المشكلات قيد التطوير')}
            className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl text-center space-y-2 transition duration-200 active:scale-95 border-none cursor-pointer"
          >
            <div className="h-9 w-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 block">حل المشاكل</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xs font-extrabold text-gray-855">توزيع الطلاب على الكليات</h3>
          <button className="text-gray-405 hover:text-gray-600 bg-transparent border-none cursor-pointer"><MoreVertical className="h-4 w-4" /></button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-xs font-bold py-10">جاري تحميل البيانات...</div>
        ) : collegeDistribution.length === 0 ? (
          <div className="text-center text-gray-400 text-xs font-bold py-10">لا توجد بيانات كافية للعرض</div>
        ) : (
          <>
            <div className="h-48 flex items-end justify-around pb-3 pt-6">
              {collegeDistribution.map((item, idx) => (
                <div key={item.college} className="flex flex-col items-center w-1/5 group">
                  <div
                    className="w-8 rounded-t-lg group-hover:opacity-90 transition duration-250"
                    style={{ height: `${(item.count / maxCount) * 100}%`, backgroundColor: barColors[idx % barColors.length] }}
                  />
                  <span className="text-[9px] text-gray-400 font-bold mt-2 font-cairo">{item.college}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[9px] font-bold text-gray-450 pt-2">
              {collegeDistribution.map((item, idx) => (
                <span key={item.college} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: barColors[idx % barColors.length] }} />
                  {item.college}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}