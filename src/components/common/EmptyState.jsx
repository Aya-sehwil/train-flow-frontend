import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'لا توجد نتائج',
  message = 'لم نجد أي بيانات تطابق اختياراتك أو بحثك الحالي.',
  icon: Icon = Inbox,
  className = ''
}) {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200/80 font-cairo select-none ${className}`}>
      <div className="h-12 w-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-bold text-gray-700 mb-1">{title}</h4>
      <p className="text-gray-450 text-xs font-semibold max-w-xs">{message}</p>
    </div>
  );
}
