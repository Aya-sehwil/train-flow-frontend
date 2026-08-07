 import React from 'react';
 import { Bell, MessageSquare, User, Check, FileText, Info } from 'lucide-react';
 
 const typeConfig = {
   approval_request: { icon: FileText, iconColor: 'text-[#E53E3E]', iconBg: 'bg-[#FFF5F5]' },
   new_report: { icon: FileText, iconColor: 'text-[#3182CE]', iconBg: 'bg-[#EFF6FF]' },
   contact_message: { icon: MessageSquare, iconColor: 'text-[#E53E3E]', iconBg: 'bg-[#FFF5F5]' },
   system_update: { icon: Info, iconColor: 'text-[#38A169]', iconBg: 'bg-[#F0FDF4]' },
 };
 
 const defaultConfig = { icon: Bell, iconColor: 'text-gray-500', iconBg: 'bg-gray-50' };
 
 function formatNotifTime(dateStr) {
   const date = new Date(dateStr);
   const now = new Date();
   const diffMin = Math.floor((now - date) / 60000);
   const diffHour = Math.floor(diffMin / 60);
   const isToday = date.toDateString() === now.toDateString();
 
   if (isToday) {
     if (diffMin < 1) return 'الآن';
     if (diffMin < 60) return `منذ ${diffMin} دقائق`;
     return `منذ ${diffHour} ساعة`;
   }
   const diffDays = Math.floor(diffMin / 1440);
   return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
 }
 
 export default function UpdatesWidget({ notifications = [], notifLoading = false, onMarkAllRead }) {
   return (
     <div className="bg-white rounded-[24px] border border-[#f0f4f9] p-4 lg:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-200 h-full font-cairo text-right select-none">
 
       {/* Header */}
       <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-50">
         <div className="flex items-center gap-2">
           <h3 className="text-base font-bold text-gray-800">آخر التحديثات</h3>
           <div className="p-1.5 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
             <Bell className="h-4 w-4" />
           </div>
         </div>
 
         <button
           onClick={onMarkAllRead}
           className="text-xs text-brand-purple hover:text-brand-purpleLight hover:underline font-bold transition cursor-pointer"
         >
           تحديد الكل كمقروء
         </button>
       </div>
 
       {/* List */}
       <div className="space-y-4">
         {notifLoading && (
           <p className="text-xs text-gray-400 text-center py-6">جاري تحميل التحديثات...</p>
         )}
 
         {!notifLoading && notifications.length === 0 && (
           <p className="text-xs text-gray-400 text-center py-6">لا توجد تحديثات حالياً</p>
         )}
 
         {!notifLoading && notifications.slice(0, 5).map((item) => {
           const config = typeConfig[item.type] || defaultConfig;
           return (
             <div key={item.id} className="flex items-start gap-3 hover:bg-gray-50/50 p-1.5 -mx-1.5 rounded-2xl transition duration-150 cursor-pointer">
               <div className={`w-9.5 h-9.5 flex items-center justify-center rounded-full ${config.iconBg} ${config.iconColor} shrink-0`}>
                 <config.icon className="h-4.5 w-4.5" />
               </div>
 
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between mb-0.5">
                   <h4 className={`text-sm ${item.is_read ? 'font-semibold text-gray-600' : 'font-bold text-gray-800'}`}>
                     {item.title}
                   </h4>
                   <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{formatNotifTime(item.created_at)}</span>
                 </div>
                 <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.body}</p>
               </div>
             </div>
           );
         })}
       </div>
 
     </div>
   );
 }