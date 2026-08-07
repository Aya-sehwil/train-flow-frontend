import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, Users } from 'lucide-react';

export default function Home({ triggerToast = () => {} }) {
  const navigate = useNavigate();

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
        {/* Reports Pending Review */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-purple/20 transition duration-200 text-right" onClick={() => navigate('/dashboard/institution?tab=evaluations')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">تقارير بانتظار التقييم</span>
            <span className="text-3xl font-extrabold text-gray-800">42</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        {/* Applications Pending */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-purple/20 transition duration-200 text-right" onClick={() => navigate('/dashboard/institution?tab=applications')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">طلبات بانتظار المراجعة</span>
            <span className="text-3xl font-extrabold text-gray-800">18</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        {/* Active Opportunities */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right cursor-pointer hover:border-brand-purple/20 transition duration-200" onClick={() => navigate('/dashboard/institution?tab=opportunities')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">الفرص النشطة</span>
            <span className="text-3xl font-extrabold text-gray-800">34</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Total Trainees */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right cursor-pointer hover:border-brand-purple/20 transition duration-200" onClick={() => navigate('/dashboard/institution?tab=applications')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">إجمالي المتدربين</span>
            <span className="text-3xl font-extrabold text-gray-800">1,248</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4d44b5]">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Home Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* General Achievement Rate Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm text-right flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-gray-808 mb-6">
              معدل الإنجاز العام
            </h3>
            <div className="h-64 flex items-end justify-between gap-3 px-2 border-b border-gray-100 pb-3">
              {/* Friday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-[#38bdf8]" 
                  style={{ height: '85%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الجمعة</span>
              </div>

              {/* Thursday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-black" 
                  style={{ height: '50%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الخميس</span>
              </div>

              {/* Wednesday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-[#6366f1]" 
                  style={{ height: '80%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الأربعاء</span>
              </div>

              {/* Tuesday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-[#fbbf24]" 
                  style={{ height: '35%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الثلاثاء</span>
              </div>

              {/* Monday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-[#f87171]" 
                  style={{ height: '65%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الاثنين</span>
              </div>

              {/* Sunday */}
              <div className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-10 rounded-t-xl transition-all duration-300 group-hover:opacity-90 bg-[#fef08a]" 
                  style={{ height: '50%' }}
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-2.5 font-cairo">الأحد</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>نسبة إنجاز المهام الأسبوعية للمجموعات التدريبية</span>
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between text-right">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
              <h3 className="text-sm font-extrabold text-gray-800">
                مهام عاجلة
              </h3>
              <button 
                onClick={() => triggerToast('سيتم فتح شاشة إضافة مهمة جديدة', 'info')}
                className="px-3.5 py-1.5 bg-brand-purple text-white text-[10px] font-bold rounded-xl hover:bg-[#5249c4] transition active:scale-95 cursor-pointer font-cairo"
              >
                إضافة مهمة
              </button>
            </div>
            <div className="space-y-3">
              {/* Task 1 */}
              <div className="p-3.5 bg-[#fcfcff] border border-gray-100 rounded-2xl relative text-right">
                <span className="absolute top-3.5 left-3.5 text-[9px] text-gray-400 font-bold">منذ ساعتين</span>
                <span className="px-2.5 py-0.5 bg-red-50 text-red-650 rounded-full text-[9px] font-bold border border-red-100/50">مراجعة طلب</span>
                <h5 className="text-xs font-bold text-gray-800 mt-2.5">طلب انضمام: أحمد محمد</h5>
                <p className="text-[10px] text-gray-450 font-semibold mt-0.5 font-cairo">تخصص هندسة برمجيات - جامعة الملك سعود</p>
              </div>

              {/* Task 2 */}
              <div className="p-3.5 bg-[#fcfcff] border border-gray-100 rounded-2xl relative text-right">
                <span className="absolute top-3.5 left-3.5 text-[9px] text-gray-400 font-bold">اليوم</span>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold border border-amber-100/50">تقييم أسبوعي</span>
                <h5 className="text-xs font-bold text-gray-800 mt-2.5">تقييم الأسبوع الثالث</h5>
                <p className="text-[10px] text-gray-450 font-semibold mt-0.5 font-cairo">فريق تحليل البيانات (5 متدربين)</p>
              </div>

              {/* Task 3 */}
              <div className="p-3.5 bg-[#fcfcff] border border-gray-100 rounded-2xl relative text-right">
                <span className="absolute top-3.5 left-3.5 text-[9px] text-gray-400 font-bold">أمس</span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold border border-blue-100/50">اعتماد خطة</span>
                <h5 className="text-xs font-bold text-gray-800 mt-2.5">خطة التدريب لقسم التسويق</h5>
                <p className="text-[10px] text-gray-450 font-semibold mt-0.5 font-cairo">بانتظار اعتماد المشرف المباشر</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard/institution?tab=applications')}
            className="w-full mt-4 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-2xl hover:bg-[#5249c4] transition active:scale-98 shadow-sm cursor-pointer font-cairo"
          >
            عرض كل المهام
          </button>
        </div>
      </div>
    </div>
  );
}
