import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, Plus, Search, SlidersHorizontal, Mail, Pencil } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const sectorOptions = [
  'قطاع البرمجيات والتقنية',
  'قطاع الاتصالات وتقنية المعلومات',
  'القطاع المصرفي والمالي',
  'قطاع التجارة الإلكترونية',
  'القطاع الصحي والطبي',
  'القطاع الهندسي والإنشائي',
  'قطاع التعليم والتدريب',
  'القطاع الحكومي والإداري',
  'قطاع الإعلام والتسويق',
  'قطاع الطاقة والصناعة',
  'أخرى',
];

export default function Institutions() {
  const { triggerToast, token } = useOutletContext();

  // ==========================================
  // بيانات المؤسسات
  // ==========================================
  const [institutions, setInstitutions] = useState([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(false);
  const [institutionsError, setInstitutionsError] = useState(null);

  const fetchInstitutions = async () => {
    if (!token) return;
    setInstitutionsLoading(true);
    setInstitutionsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/institutions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const mapped = data.institutions.map((inst) => ({
          id: inst.institution_id,
          name: inst.name,
          sector: inst.sector || 'غير محدد',
          students: inst.students_count || 0,
          contact: inst.contact_person_name || 'غير محدد',
          contact_phone: inst.contact_phone,
          email: inst.email,
          status: inst.status || 'pending',
          description: inst.description,
          logo: inst.logo_url,
        }));
        setInstitutions(mapped);
      } else {
        setInstitutionsError(data.message || 'حدث خطأ أثناء جلب المؤسسات');
      }
    } catch (error) {
      console.error('fetchInstitutions error:', error);
      setInstitutionsError('تعذر الاتصال بالخادم');
    } finally {
      setInstitutionsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ملاحظة: حالة الاعتماد (status) بقت للعرض فقط بصفحة المشرف.
  // تفعيل/تجميد الاعتماد بقى حصراً من صفحة "القبول والتسجيل".
  const getCompanyDetails = (status) => {
    const statusMap = {
      active: {
        statusText: 'معتمد نشط',
        statusBg: 'bg-green-50 text-green-500 border border-green-100/70',
        statusDot: 'bg-green-500',
      },
      pending: {
        statusText: 'تحت المراجعة',
        statusBg: 'bg-amber-50 text-amber-500 border border-amber-100/70',
        statusDot: 'bg-amber-500',
      },
      expired: {
        statusText: 'مجمّد',
        statusBg: 'bg-gray-100 text-gray-600 border border-gray-200/70',
        statusDot: 'bg-gray-500',
      },
    };

    const info = statusMap[status] || statusMap.pending;

    return {
      logoBg: 'bg-purple-50',
      logoIcon: <Building2 className="h-5.5 w-5.5 text-brand-purple" />,
      statusText: info.statusText,
      statusBg: info.statusBg,
      statusDot: info.statusDot,
    };
  };

  // ==========================================
  // فلاتر البحث
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSector, setSelectedSector] = useState('all');

  // ==========================================
  // Modals (منقولة من SupervisorModals.jsx)
  // ==========================================
  const [showAddInstModal, setShowAddInstModal] = useState(false);
  const [newInst, setNewInst] = useState({ name: '', sector: '', contact: '', contact_phone: '', email: '', description: '' });
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [messagingInstitution, setMessagingInstitution] = useState(null);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  return (
    <> 
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
            const details = getCompanyDetails(inst.status);
            return (
              <div key={inst.id} className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200 min-h-[250px]">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                 {inst.logo ? (
                      <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-white border border-gray-150">
                        <img
                          src={inst.logo.startsWith('/') ? `${import.meta.env.VITE_API_URL}${inst.logo}` : inst.logo}
                          alt={inst.name}
                          className="h-full w-full object-cover"
                        />
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
                  </div>

                  <button
                    onClick={() => setSelectedInstitution(inst)}
                    className="text-[10px] font-extrabold text-[#4d44b5] hover:underline"
                  >
                    عرض التفاصيل
                  </button>
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
      {/* 1. Add Institution Modal */}
      {showAddInstModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-brand-purple" />
                إضافة جهة تدريب جديدة
              </h3>
            </div>
            <p className="px-5 pt-3 text-[10px] text-gray-400 font-semibold">
              ستتم إضافة الجهة بحالة "تحت المراجعة" تلقائياً، وتفعيل اعتمادها لاحقاً من قبل القبول والتسجيل.
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newInst.name || !newInst.sector || !newInst.contact) {
                triggerToast('الرجاء ملء جميع الحقول المطلوبة', 'error');
                return;
              }
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: newInst.name,
                    sector: newInst.sector,
                    contact_person_name: newInst.contact,
                    contact_phone: newInst.contact_phone,
                    email: newInst.email,
                    description: newInst.description,
                  }),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast(`تمت إضافة مؤسسة ${newInst.name} بنجاح!`);
                  setShowAddInstModal(false);
                  setNewInst({ name: '', sector: '', contact: '', contact_phone: '', email: '', description: '' });
                  fetchInstitutions();
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء إضافة المؤسسة', 'error');
                }
              } catch (error) {
                console.error('createInstitution error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">اسم جهة التدريب *</label>
                <input
                  type="text"
                  value={newInst.name}
                  onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                  placeholder="مثال: شركة الاتصالات السعودية"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">القطاع / المجال *</label>
                <select
                  value={newInst.sector}
                  onChange={(e) => setNewInst({ ...newInst, sector: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 bg-white rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                >
                  <option value="">-- اختر القطاع --</option>
                  {sectorOptions.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة / معلومات عن جهة التدريب</label>
                <textarea
                  value={newInst.description}
                  onChange={(e) => setNewInst({ ...newInst, description: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عن الشركة ومجالات التدريب فيها..."
                  className="w-full min-h-[60px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مسؤول الاتصال *</label>
                <input
                  type="text"
                  value={newInst.contact}
                  onChange={(e) => setNewInst({ ...newInst, contact: e.target.value })}
                  placeholder="مثال: أ. محمد العلي"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newInst.contact_phone}
                    onChange={(e) => setNewInst({ ...newInst, contact_phone: e.target.value })}
                    placeholder="مثال: 0501234567"
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newInst.email}
                    onChange={(e) => setNewInst({ ...newInst, email: e.target.value })}
                    placeholder="example@company.com"
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddInstModal(false);
                    setNewInst({ name: '', sector: '', contact: '', contact_phone: '', email: '', description: '' });
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  إضافة الجهة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Institution Modal */}
      {editingInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setEditingInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Pencil className="h-4.5 w-4.5 text-brand-purple" />
                تعديل بيانات جهة التدريب
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions/${editingInstitution.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name: editingInstitution.name,
                    sector: editingInstitution.sector,
                    contact_person_name: editingInstitution.contact,
                    contact_phone: editingInstitution.contact_phone,
                    email: editingInstitution.email,
                    description: editingInstitution.description,
                  }),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast('تم تحديث بيانات المؤسسة بنجاح!');
                  setEditingInstitution(null);
                  fetchInstitutions();
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء التحديث', 'error');
                }
              } catch (error) {
                console.error('updateInstitution error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">اسم جهة التدريب</label>
                <input
                  type="text"
                  value={editingInstitution.name || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

          <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">القطاع / المجال</label>
                <select
                  value={editingInstitution.sector || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, sector: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 bg-white rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                >
                  <option value="">-- اختر القطاع --</option>
                  {sectorOptions.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">مسؤول الاتصال</label>
                <input
                  type="text"
                  value={editingInstitution.contact || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, contact: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editingInstitution.contact_phone || ''}
                    onChange={(e) => setEditingInstitution({ ...editingInstitution, contact_phone: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 block">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editingInstitution.email || ''}
                    onChange={(e) => setEditingInstitution({ ...editingInstitution, email: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نبذة / وصف</label>
                <textarea
                  value={editingInstitution.description || ''}
                  onChange={(e) => setEditingInstitution({ ...editingInstitution, description: e.target.value })}
                  className="w-full min-h-[60px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingInstitution(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Send Message to Institution Modal */}
      {messagingInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setMessagingInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Mail className="h-4.5 w-4.5 text-brand-purple" />
                مراسلة {messagingInstitution.name}
              </h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!messageForm.subject.trim() || !messageForm.message.trim()) {
                triggerToast('الرجاء تعبئة الموضوع والرسالة', 'error');
                return;
              }
              try {
                const response = await fetch(`${API_BASE_URL}/supervisor/institutions/${messagingInstitution.id}/send-message`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(messageForm),
                });
                const data = await response.json();
                if (data.success) {
                  triggerToast(data.message || 'تم إرسال الرسالة بنجاح!');
                  setMessagingInstitution(null);
                  setMessageForm({ subject: '', message: '' });
                } else {
                  triggerToast(data.message || 'حدث خطأ أثناء الإرسال', 'error');
                }
              } catch (error) {
                console.error('sendInstitutionMessage error:', error);
                triggerToast('تعذر الاتصال بالخادم', 'error');
              }
            }} className="p-5 space-y-4">
              <div className="p-2.5 bg-gray-50/50 rounded-xl text-[10px] text-gray-500 font-semibold">
                سترسل الرسالة إلى: <span className="font-bold text-gray-700">{messagingInstitution.email}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">الموضوع *</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="مثال: تنسيق موعد زيارة ميدانية"
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 block">نص الرسالة *</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="اكتبي رسالتك هنا..."
                  className="w-full min-h-[120px] py-2 px-3 border border-gray-200 rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setMessagingInstitution(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#4d44b5] text-white rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm active:scale-95"
                >
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Institution Details Modal */}
      {selectedInstitution && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-xl overflow-hidden animate-fade-in text-right">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={() => setSelectedInstitution(null)}
                className="text-gray-400 hover:text-gray-600 transition text-sm font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-brand-purple" />
                تفاصيل جهة التدريب
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-right space-y-1">
                <h2 className="text-base font-extrabold text-gray-800">{selectedInstitution.name}</h2>
                <p className="text-xs text-gray-400 font-semibold">{selectedInstitution.sector}</p>
              </div>

              {selectedInstitution.description && (
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedInstitution.description}</p>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">مسؤول الاتصال:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.contact || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">رقم الهاتف:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.contact_phone || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">البريد الإلكتروني:</span>
                  <span className="font-bold text-gray-700">{selectedInstitution.email || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-semibold">عدد الطلاب الحاليين:</span>
                  <span className="font-bold text-brand-purple">{selectedInstitution.students}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white flex gap-2.5 justify-end border-t border-gray-50">
              <button
                type="button"
                onClick={() => setSelectedInstitution(null)}
                className="px-5 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}