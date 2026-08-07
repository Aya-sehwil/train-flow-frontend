 import React from 'react';
import { Building2, Plus, Search, SlidersHorizontal, Mail, Pencil, PowerOff } from 'lucide-react';

export default function InstitutionsTab({
  setShowAddInstModal,
  searchQuery,
  setSearchQuery,
  showFilterDropdown,
  setShowFilterDropdown,
  selectedSector,
  setSelectedSector,
  institutions,
  institutionsLoading,
  institutionsError,
  getCompanyDetails,
  setMessagingInstitution,
  setMessageForm,
  setEditingInstitution,
  handleDeactivateInstitution,
  handleRenewInstitution,
  setSelectedInstitution,
  triggerToast,
}) {
  return (
    <div className="space-y-6 animate-fade-in text-right max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إدارة المؤسسات التدريبية</h1>
          <p className="text-gray-400 text-xs font-semibold">تتبع وإدارة جهات التدريب المعتمدة وطلبات الشراكة.</p>
        </div>
        <button
          onClick={() => setShowAddInstModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#4d44b5] text-white rounded-xl text-[11px] font-bold hover:bg-brand-purpleDark active:scale-95 transition shrink-0 shadow-md shadow-purple-150"
        >
          <Plus className="h-4 w-4" /> إضافة مؤسسة جديدة
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="البحث عن جهات التدريب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pr-10 pl-4 bg-white border border-gray-200/80 rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/50 shadow-sm"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200/80 rounded-2xl text-[11px] font-bold text-gray-650 hover:bg-gray-50 transition shadow-sm active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            تصفية
          </button>

          {showFilterDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 p-2 text-right animate-fade-in">
              <span className="text-[9px] text-gray-400 font-bold block px-3 py-1 bg-gray-50 rounded-xl mb-1">التصفية حسب التخصصات:</span>
              {[
                { id: 'all', text: 'جميع التخصصات / الكل' },
                ...Array.from(new Set(institutions.map(i => i.sector).filter(Boolean))).map(s => ({ id: s, text: s }))
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedSector(item.id);
                    setShowFilterDropdown(false);
                  }}
                  className={'w-full text-right px-3 py-2 text-xs font-semibold rounded-xl transition ' + (
                    selectedSector === item.id
                      ? 'bg-purple-50 text-brand-purple'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {institutionsLoading && (
        <div className="p-10 text-center text-gray-400 text-xs font-bold">
          جاري تحميل المؤسسات...
        </div>
      )}

      {!institutionsLoading && institutionsError && (
        <div className="p-10 text-center text-red-500 text-xs font-bold">
          {institutionsError}
        </div>
      )}

      {!institutionsLoading && !institutionsError && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {institutions
          .filter(inst => {
            const matchesSearch = inst.name.includes(searchQuery) || inst.sector.includes(searchQuery);
            const matchesSector = selectedSector === 'all' || inst.sector === selectedSector;
            return matchesSearch && matchesSector;
          })
          .map(inst => {
            const details = getCompanyDetails(inst.name, inst.status);
            return (
              <div key={inst.id} className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200 min-h-[250px]">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    {inst.logo ? (
                      <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-white border border-gray-150">
                        <img src={inst.logo} alt={inst.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${details.logoBg}`}>
                        {details.logoIcon}
                      </div>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1.5 ${details.statusBg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${details.statusDot}`} />
                      {details.statusText}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <h3 className="text-xs font-extrabold text-gray-800">{inst.name}</h3>
                    <p className="text-[9px] text-gray-400 font-semibold">{inst.sector}</p>
                    {inst.description && (
                      <p className="text-[9px] text-gray-400 truncate mt-1" title={inst.description}>{inst.description}</p>
                    )}
                  </div>

                  <div className="border-t border-gray-100/70" />

                  <div className="flex items-center justify-between text-[11px] text-gray-500 py-1">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block mb-0.5">مسؤول الاتصال</span>
                      <span className="font-bold text-gray-700">{inst.contact}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-gray-400 block mb-0.5">الطلاب الحاليين</span>
                      <span className="font-bold text-brand-purple flex items-center gap-1">
                        <span className="text-xs">👥</span>
                        <span>{inst.students === 0 ? '00 طالب' : inst.students < 10 ? `0${inst.students} طلاب` : `${inst.students} طالب`}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                  <Mail
                      className="h-4.5 w-4.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => {
                        if (inst.email) {
                          setMessagingInstitution(inst);
                          setMessageForm({ subject: '', message: '' });
                        } else {
                          triggerToast('لا يوجد بريد إلكتروني مسجل لهذه المؤسسة', 'error');
                        }
                      }}
                    />
                    <Pencil
                      className="h-4.5 w-4.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => setEditingInstitution({ ...inst })}
                      title="تعديل بيانات المؤسسة"
                    />
                    {inst.status !== 'expired' && (
                      <PowerOff
                        className="h-4.5 w-4.5 text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={() => handleDeactivateInstitution(inst.id, inst.name)}
                        title="تعطيل اعتماد المؤسسة"
                      />
                    )}
                  </div>

                  {inst.status === 'expired' && (
                    <button
                      onClick={() => handleRenewInstitution(inst.id, inst.name)}
                      className={`text-[10px] font-extrabold ${details.actionColor}`}
                    >
                      {details.actionText}
                    </button>
                  )}
                  {inst.status !== 'expired' && (
                    <button
                      onClick={() => setSelectedInstitution(inst)}
                      className={`text-[10px] font-extrabold ${details.actionColor}`}
                    >
                      {details.actionText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        <div
          onClick={() => setShowAddInstModal(true)}
          className="bg-transparent rounded-3xl border-2 border-dashed border-gray-200/80 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-purple/40 hover:bg-white/50 transition duration-200 min-h-[250px]"
        >
          <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-3 shadow-inner">
            <Building2 className="h-6 w-6 text-gray-400 animate-pulse" />
          </div>
          <h3 className="text-xs font-extrabold text-gray-800 mb-1">إضافة مؤسسة جديدة</h3>
          <p className="text-[10px] text-gray-400 max-w-[180px] leading-relaxed font-semibold">ابدأ بإضافة جهة تدريب جديدة لتوسيع فرص الطلاب.</p>
        </div>
      </div>
      )}
    </div>
  );
}