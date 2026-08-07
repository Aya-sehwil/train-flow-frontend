import React from 'react';

export default function StatCard({ title, value, total, icon: Icon, iconColor, iconBg, type }) {
  return (
    <div className="bg-white rounded-[24px] border border-[#f0f4f9] p-4 lg:p-5 text-center flex flex-col items-center justify-center min-h-[135px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-200 h-full font-cairo select-none">
      
      {/* Icon Badge */}
      <div className={`p-2.5 rounded-2xl mb-2 ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Label/Title */}
      <span className="text-gray-500 text-xs font-semibold mb-1">{title}</span>

      {/* Metric Value */}
      {type === 'progress' ? (
        <div className="w-full flex flex-col items-center">
          <div className="flex items-baseline gap-1 mb-1.5 select-all">
            <span className="text-2xl font-extrabold text-gray-800">{value}</span>
            <span className="text-gray-400 text-xs">/ {total}</span>
          </div>
          {/* Progress bar */}
          <div className="w-4/5 bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(value / total) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <span className="text-2xl font-extrabold text-gray-800 select-all">{value}</span>
      )}
      
    </div>
  );
}
