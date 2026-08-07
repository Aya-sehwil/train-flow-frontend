 import React from 'react';
import { FileText, Clock, ClipboardList, CheckCircle2, Search } from 'lucide-react';

export default function ApplicationsTab({
  setShowExportModal,
  appStats,
  appSearchQuery,
  setAppSearchQuery,
  showSpecialtyDropdown,
  setShowSpecialtyDropdown,
  showStatusDropdown,
  setShowStatusDropdown,
  selectedSpecialtyFilter,
  setSelectedSpecialtyFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  studentApps,
  appsLoading,
  appsError,
  fetchRequests,
  selectAllChecked,
  handleToggleAll,
  handleToggleRow,
  handleAppStatusChange,
}) {
  return (
    <div className="space-y-6 animate-fade-in text-right">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إدارة طلبات التدريب</h1>
          <p className="text-gray-400 text-xs font-semibold">مراجعة واعتماد خطط التدريب الميداني لطلاب المرحلة النهائية.</p>
        </div>
        <button onClick={() => setShowExportModal(true)} className="flex items-center gap-1 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition">
          <FileText className="h-4 w-4" /> تصدير تقرير
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي طلبات المستلمة</span>
            <span className="text-2xl font-extrabold text-gray-800">{appStats.received}</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات بانتظار المراجعة</span>
            <span className="text-2xl font-extrabold text-[#c08d13]">{appStats.pending}</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات تحت التعديل</span>
            <span className="text-2xl font-extrabold text-blue-500">{appStats.underEdit}</span>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 block">طلبات تمت الموافقة عليها</span>
            <span className="text-2xl font-extrabold text-green-600">{appStats.approved}</span>
          </div>
          <div className="h-10 w-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex-grow sm:flex-1 w-full relative">
            <input
              type="text"
              placeholder="البحث باسم الطالب، التخصص، أو جهة التدريب..."
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              className="w-full py-1.5 pl-3 pr-8 border border-gray-200 bg-[#fbfbfd] rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40 shadow-sm"
            />
            <Search className="absolute inset-y-0 right-2.5 h-4 w-4 my-auto text-gray-400" />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSpecialtyDropdown(!showSpecialtyDropdown);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm active:scale-95"
              >
                <span>{selectedSpecialtyFilter === 'all' ? 'حسب التخصصات' : selectedSpecialtyFilter}</span>
                <span className="text-[10px] text-gray-400 font-semibold">▼</span>
              </button>

              {showSpecialtyDropdown && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-1.5 text-right animate-fade-in">
                  {[
                    { id: 'all', text: 'جميع التخصصات / الكل' },
                    ...Array.from(new Set(studentApps.map(a => a.major).filter(Boolean))).map(m => ({ id: m, text: m }))
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpecialtyFilter(item.id);
                        setShowSpecialtyDropdown(false);
                      }}
                      className={'w-full text-right px-3 py-1.5 text-xs font-semibold rounded-lg transition ' + (
                        selectedSpecialtyFilter === item.id
                          ? 'bg-purple-50 text-brand-purple'
                          : 'text-gray-650 hover:bg-gray-50'
                      )}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowSpecialtyDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-750 hover:bg-gray-50 transition shadow-sm active:scale-95"
              >
                <span>{
                  selectedStatusFilter === 'all' ? 'جميع الحالات' :
                  selectedStatusFilter === 'pending' ? 'بانتظار المراجعة' :
                  selectedStatusFilter === 'approved' ? 'تمت الموافقة' :
                  selectedStatusFilter === 'rejected' ? 'مرفوض' :
                  selectedStatusFilter === 'edit' ? 'تحت التعديل' : selectedStatusFilter
                }</span>
                <span className="text-[10px] text-gray-400 font-semibold">▼</span>
              </button>

              {showStatusDropdown && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-30 p-1.5 text-right animate-fade-in">
                  {[
                    { id: 'all', text: 'جميع الحالات' },
                    { id: 'pending', text: 'بانتظار المراجعة' },
                    { id: 'approved', text: 'تمت الموافقة' },
                    { id: 'rejected', text: 'مرفوض' },
                    { id: 'edit', text: 'تحت التعديل' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedStatusFilter(item.id);
                        setShowStatusDropdown(false);
                      }}
                      className={'w-full text-right px-3 py-1.5 text-xs font-semibold rounded-lg transition ' + (
                        selectedStatusFilter === item.id
                          ? 'bg-purple-50 text-brand-purple'
                          : 'text-gray-650 hover:bg-gray-50'
                      )}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm active:scale-95"
            >
              تحديث
            </button>
          </div>
        </div>

        {appsLoading && (
          <div className="p-10 text-center text-gray-400 text-xs font-bold">
            جاري تحميل الطلبات...
          </div>
        )}

        {!appsLoading && appsError && (
          <div className="p-10 text-center text-red-500 text-xs font-bold">
            {appsError}
          </div>
        )}

        {!appsLoading && !appsError && (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[10px] font-bold text-gray-400 border-b border-gray-50">
                <th className="p-4 text-center w-12">
                  <input type="checkbox" checked={selectAllChecked} onChange={handleToggleAll} className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer" />
                </th>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">التخصص</th>
                <th className="p-4">جهة التدريب المقترحة</th>
                <th className="p-4">حالة الطلب</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50 text-gray-700">
              {studentApps
                .filter(app => {
                  const matchesSearch =
                    (app.name || '').toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                    (app.major || '').toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                    (app.company || '').toLowerCase().includes(appSearchQuery.toLowerCase());
                  const matchesSpecialty = selectedSpecialtyFilter === 'all' || app.major === selectedSpecialtyFilter;
                  const matchesStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;
                  return matchesSearch && matchesSpecialty && matchesStatus;
                })
                .map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-center">
                    <input type="checkbox" checked={app.checked || false} onChange={() => handleToggleRow(app.id)} className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple cursor-pointer" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                        {app.name ? app.name.substring(0, 1) : '؟'}
                      </div>
                      <div className="text-right">
                        <h4 className="font-extrabold text-gray-800">{app.name}</h4>
                        <span className="text-[10px] text-gray-400">{app.idNum}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-600">{app.major}</td>
                  <td className="p-4 font-semibold text-gray-500">{app.company}</td>
                  <td className="p-4 font-semibold">
                    {app.status === 'pending' && (
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-bold">بانتظار المراجعة</span>
                    )}
                    {app.status === 'approved' && (
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold">تمت الموافقة</span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full border border-red-100 text-[10px] font-bold">مرفوض</span>
                    )}
                    {app.status === 'edit' && (
                      <span className="px-2.5 py-0.5 bg-purple-50 text-brand-purple rounded-full border border-purple-100 text-[10px] font-bold">تحت التعديل</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      {app.status === 'pending' ? (
                        <>
                          {/* <button
                            onClick={() => handleAppStatusChange(app.id, 'edit', app.name)}
                            className="px-3 py-1 border border-blue-500 text-blue-500 bg-white rounded-lg hover:bg-blue-50 text-[10px] font-bold transition"
                          >
                            طلب تعديل
                          </button> */}
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'accepted', app.name)}
                            className="px-3 py-1 bg-brand-purple text-white rounded-lg hover:bg-brand-purpleDark text-[10px] font-bold transition"
                          >
                            اعتماد
                          </button>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'rejected', app.name)}
                            className="px-3 py-1 border border-red-500 text-red-500 bg-white rounded-lg hover:bg-red-50 text-[10px] font-bold transition"
                          >
                            رفض
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold">تم اتخاذ إجراء</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {studentApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 text-xs font-bold">
                    لا توجد طلبات حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}