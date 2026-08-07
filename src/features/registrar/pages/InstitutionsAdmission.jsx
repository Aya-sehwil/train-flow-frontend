 import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Building2, Phone, Mail, User, ShieldCheck, ShieldOff } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const STATUS_LABELS = {
  active: { text: 'نشط', className: 'bg-green-100 text-green-700' },
  pending: { text: 'قيد المراجعة', className: 'bg-amber-100 text-amber-700' },
  expired: { text: 'مجمّد', className: 'bg-red-100 text-red-700' },
};

export default function InstitutionsAdmission() {
  const { triggerToast } = useOutletContext();

  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadInstitutions = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/registrar/institutions`, { headers: getHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success) setInstitutions(data.institutions);
        else triggerToast(data.message, 'error');
      })
      .catch(() => triggerToast('تعذر تحميل بيانات المؤسسات', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInstitutions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleStatus = async (institution) => {
    const isActive = institution.status === 'active';
    const action = isActive ? 'freeze' : 'activate';

    setActionLoadingId(institution.institution_id);
    try {
      const res = await fetch(
        `${API_BASE_URL}/registrar/institutions/${institution.institution_id}/${action}`,
        { method: 'PATCH', headers: getHeaders() }
      );
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        loadInstitutions();
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredInstitutions = institutions.filter(i =>
    i.name?.includes(searchQuery) ||
    i.sector?.includes(searchQuery) ||
    i.contact_person_name?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">

      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إدارة جهات التدريب</h1>
        <p className="text-gray-400 text-xs font-semibold">مراجعة بيانات المؤسسات وتفعيل أو تجميد اعتمادها.</p>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث بالاسم أو القطاع أو مسؤول الاتصال..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-3 pr-10 bg-gray-100 rounded-2xl text-right text-xs focus:outline-none focus:ring-2 focus:ring-purple-200/50 border-none font-semibold font-cairo"
          />
          <Search className="absolute inset-y-0 right-3 h-4 w-4 my-auto text-gray-400" />
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-400 text-xs font-bold py-16">جاري تحميل البيانات...</div>
      )}

      {!loading && filteredInstitutions.length === 0 && (
        <div className="text-center text-gray-400 text-xs font-bold py-16">لا توجد مؤسسات مطابقة</div>
      )}

      {!loading && filteredInstitutions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInstitutions.map(inst => {
            const statusInfo = STATUS_LABELS[inst.status] || STATUS_LABELS.pending;
            const isActive = inst.status === 'active';

            return (
              <div key={inst.institution_id} className="bg-white p-5 rounded-3xl shadow-sm space-y-4">

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-brand-purple/10 text-brand-purple font-extrabold flex items-center justify-center text-lg rounded-2xl shrink-0">
                      {inst.name?.charAt(0) || <Building2 className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">{inst.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold">{inst.sector || '—'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>

                {inst.description && (
                  <p className="text-[11px] text-gray-500 font-semibold leading-relaxed line-clamp-2 bg-gray-50 p-3 rounded-2xl">
                    {inst.description}
                  </p>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold">
                    <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{inst.contact_person_name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold">
                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span dir="ltr">{inst.contact_phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold">
                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span dir="ltr">{inst.email || '—'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-50">
                  <button
                    onClick={() => handleToggleStatus(inst)}
                    disabled={actionLoadingId === inst.institution_id}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[11px] font-bold transition active:scale-95 duration-200 border-none font-cairo cursor-pointer disabled:opacity-50 ${
                      isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-brand-purple text-white hover:bg-[#5249c4]'
                    }`}
                  >
                    {isActive ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                    {actionLoadingId === inst.institution_id
                      ? 'جاري التنفيذ...'
                      : isActive ? 'تجميد الاعتماد' : 'تفعيل الاعتماد'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}