 import React from 'react';
import { AlertCircle, FileText, MessageCircle, Info, Bell } from 'lucide-react';

export default function NotificationsTab({
  notifications,
  notifFilter,
  setNotifFilter,
}) {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-right">
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800 font-cairo">مركز الإشعارات</h1>
        <p className="text-gray-400 text-xs font-semibold">تابع آخر المستجدات والطلبات الواردة في مسارك الأكاديمي.</p>
      </div>

      <div className="flex items-center gap-2 justify-end shrink-0 border-b border-gray-100 pb-1">
        {[
          { id: 'all', text: 'الكل' },
          { id: 'request', text: 'طلبات جديدة' },
          { id: 'report', text: 'تقارير جديدة' },
          { id: 'message', text: 'رسائل التواصل' }
        ].map(pill => (
          <button
            key={pill.id}
            onClick={() => setNotifFilter(pill.id)}
            className={'px-4 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ' + (
              notifFilter === pill.id
                ? 'bg-[#4d44b5] text-white shadow-sm shadow-purple-100'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            {pill.text}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {(() => {
          const todayNotifs = notifications.filter(n => n.group === 'today' && (notifFilter === 'all' || n.type === notifFilter));
          if (todayNotifs.length === 0) return null;
          return (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-800 pr-1">اليوم</h3>
              {todayNotifs.map(n => (
                <div key={n.id} className="p-4 bg-white rounded-3xl border border-gray-100/50 shadow-sm flex items-start justify-between gap-4 text-right hover:border-[#4d44b5]/15 hover:shadow-md transition duration-200">
                  <div className="flex items-start gap-4">
                    <div className={'h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 border ' + (
                      n.type === 'request' ? 'bg-red-50 text-red-500 border-red-100/50' :
                      n.type === 'report' ? 'bg-green-50 text-green-500 border-green-100/50' :
                      n.type === 'message' ? 'bg-indigo-50 text-[#4d44b5] border-purple-100/50' :
                      'bg-sky-50 text-sky-500 border-sky-100/50'
                    )}>
                      {n.type === 'request' ? <AlertCircle className="h-5 w-5" /> :
                       n.type === 'report' ? <FileText className="h-5 w-5" /> :
                       n.type === 'message' ? <MessageCircle className="h-5 w-5" /> :
                       <Info className="h-5 w-5" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-gray-800">{n.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">{n.text}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 pr-2">{n.time}</span>
                </div>
              ))}
            </div>
          );
        })()}

        {(() => {
          const yesterdayNotifs = notifications.filter(n => n.group === 'yesterday' && (notifFilter === 'all' || n.type === notifFilter));
          if (yesterdayNotifs.length === 0) return null;
          return (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-800 pr-1">أمس</h3>
              {yesterdayNotifs.map(n => (
                <div key={n.id} className="p-4 bg-white rounded-3xl border border-gray-100/50 shadow-sm flex items-start justify-between gap-4 text-right hover:border-[#4d44b5]/15 hover:shadow-md transition duration-200">
                  <div className="flex items-start gap-4">
                    <div className={'h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 border ' + (
                      n.type === 'request' ? 'bg-red-50 text-red-500 border-red-100/50' :
                      n.type === 'report' ? 'bg-green-50 text-green-500 border-green-100/50' :
                      n.type === 'message' ? 'bg-indigo-50 text-[#4d44b5] border-purple-100/50' :
                      'bg-sky-50 text-sky-500 border-sky-100/50'
                    )}>
                      {n.type === 'request' ? <AlertCircle className="h-5 w-5" /> :
                       n.type === 'report' ? <FileText className="h-5 w-5" /> :
                       n.type === 'message' ? <MessageCircle className="h-5 w-5" /> :
                       <Info className="h-5 w-5" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-gray-800">{n.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">{n.text}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 pr-2">{n.time}</span>
                </div>
              ))}
            </div>
          );
        })()}

        {notifications.filter(n => notifFilter === 'all' || n.type === notifFilter).length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Bell className="h-10 w-10 mx-auto text-gray-350 mb-2 animate-bounce" />
            <p className="text-xs font-bold">لا توجد إشعارات حالياً في هذا القسم.</p>
          </div>
        )}

      </div>
    </div>
  );
}