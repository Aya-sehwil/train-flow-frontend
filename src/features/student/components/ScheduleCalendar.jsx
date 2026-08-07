 import React from 'react';
 
 export default function ScheduleCalendar({ monthlyDays = [] }) {
   const daysOfWeek = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
 
   const now = new Date();
   const year = now.getFullYear();
   const month = now.getMonth(); // 0-indexed
   const today = now.getDate();
 
   // أول يوم بالشهر، ونعرف يوم الأسبوع تبعه (0 = أحد)
   const firstDayOfMonth = new Date(year, month, 1).getDay();
   // عدد أيام الشهر الحالي
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   // عدد أيام الشهر السابق (لتعبئة الخانات الفارغة بالبداية)
   const daysInPrevMonth = new Date(year, month, 0).getDate();
 
   const calendarDays = [];
 
   // أيام الشهر الماضي (باهتة)
   for (let i = firstDayOfMonth - 1; i >= 0; i--) {
     calendarDays.push({ day: daysInPrevMonth - i, isMuted: true });
   }
 
   // أيام الشهر الحالي
   for (let d = 1; d <= daysInMonth; d++) {
     calendarDays.push({
       day: d,
       isMuted: false,
       isActive: monthlyDays.includes(d), // حضر فعلياً هالليوم
       isToday: d === today,
     });
   }
 
   // نكمل الشبكة لآخر أسبوع بأيام الشهر الجاي (باهتة)
   const remaining = (7 - (calendarDays.length % 7)) % 7;
   for (let d = 1; d <= remaining; d++) {
     calendarDays.push({ day: d, isMuted: true });
   }
 
   return (
     <div className="bg-white rounded-[24px] border border-[#f0f4f9] p-4 lg:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-200 h-full font-cairo text-right select-none">
 
       {/* Title */}
       <h3 className="text-base font-bold text-gray-800 mb-3 pb-2.5 border-b border-gray-50">سجل الحضور</h3>
 
       {/* Days of Week Header */}
       <div className="grid grid-cols-7 gap-y-2 mb-2.5 text-center text-xs font-semibold text-gray-500" dir="rtl">
         {daysOfWeek.map((day, idx) => (
           <span key={idx}>{day}</span>
         ))}
       </div>
 
       {/* Days Grid */}
       <div className="grid grid-cols-7 gap-y-2 gap-x-1.5 text-center text-xs font-medium" dir="rtl">
         {calendarDays.map((item, idx) => {
           let dayClass = "w-8 h-8 flex items-center justify-center mx-auto rounded-full transition-all duration-150 cursor-pointer ";
 
           if (item.isMuted) {
             dayClass += "text-gray-300";
           } else if (item.isActive) {
             dayClass += "bg-brand-purple text-white shadow-md shadow-purple-100 font-bold hover:bg-brand-purpleDark";
           } else {
             dayClass += "text-gray-700 hover:bg-gray-50";
             if (item.isToday) {
               dayClass += " border border-gray-300";
             }
           }
 
           return (
             <div key={idx} className="flex justify-center select-all">
               <span className={dayClass}>
                 {item.day}
               </span>
             </div>
           );
         })}
       </div>
 
     </div>
   );
 }