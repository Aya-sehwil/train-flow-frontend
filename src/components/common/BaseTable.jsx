import React from 'react';

export default function BaseTable({
  headers = [],
  children,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-[24px] shadow-xs border border-gray-100 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse select-none font-cairo">
          <thead>
            <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-450 border-b border-gray-100">
              {headers.map((header, idx) => (
                <th key={idx} className="p-4 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
