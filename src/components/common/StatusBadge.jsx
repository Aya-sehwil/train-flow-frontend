import React from 'react';

const statusMap = {
  qualified: { text: '● مستوفي الشروط', bg: 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]' },
  unqualified: { text: '● غير مستوفي', bg: 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' },
  pending: { text: '● بانتظار المراجعة', bg: 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]' },
  active: { text: '● نشط', bg: 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]' },
  draft: { text: '● مسودة', bg: 'bg-gray-50 text-gray-500 border-gray-200' },
  ready: { text: '● جاهز', bg: 'bg-blue-50 text-blue-600 border-blue-150' },
  issued: { text: '● تم الإرسال', bg: 'bg-green-50 text-green-600 border-green-150' },
  approved: { text: '● تم الاعتماد', bg: 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]' }
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusMap[status] || { text: status, bg: 'bg-gray-50 text-gray-500 border-gray-200' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-solid font-cairo shrink-0 inline-block ${config.bg} ${className}`}>
      {config.text}
    </span>
  );
}
