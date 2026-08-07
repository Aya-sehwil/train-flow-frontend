import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';

export default function ImportantTasks() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#3b32a3] to-[#2d248a] rounded-[24px] p-4 lg:p-5 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between h-full font-cairo text-right select-none">
      <div>
        <div className="flex items-center justify-start gap-2 mb-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <h3 className="text-base font-bold">المهام الهامة</h3>
        </div>
        <p className="text-indigo-100 text-xs leading-relaxed mb-3">
          الوصول إلى مهامك الأكثر تكراراً على الفور.
        </p>
      </div>

      <div className="space-y-2">
        {/* Register Daily Attendance */}
        <button
          onClick={() => navigate('/dashboard/student/attendance')}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white text-[#2d248a] font-bold rounded-2xl hover:bg-indigo-50 active:scale-[0.98] transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs">تسجيل الحضور اليومي</span>
        </button>

        {/* Upload Weekly Report */}
        <button
          onClick={() => navigate('/dashboard/student/reports')}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-transparent border border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 active:scale-[0.98] transition duration-200"
        >
          <ArrowLeft className="h-4 w-4 text-white/80" />
          <span className="text-xs">رفع التقرير الأسبوعي</span>
        </button>
      </div>
    </div>
  );
}