import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, User, ChevronLeft, UserCheck } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});


// خريطة مبدئية: كل كلية وتخصصاتها. لاحقاً بتصير هاي البيانات جاية من الجامعة مباشرة.
const COLLEGE_MAJORS = {
  'كلية  الادارة والتمويل ': ['محاسبة ', 'ادارة اعمال ', ' نظم معلومات ادارية '],
  // 'كلية تكنولوجيا المعلومات': ['علوم حاسوب', 'نظم معلومات', 'أمن سيبراني', 'ذكاء اصطناعي', 'شبكات حاسوب'],
  // 'كلية إدارة الأعمال': ['إدارة أعمال', 'محاسبة', 'تسويق', 'تمويل ومصارف', 'إدارة موارد بشرية'],
  // 'كلية العلوم': ['رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'إحصاء'],
  // 'كلية الآداب': ['لغة إنجليزية', 'لغة عربية', 'تاريخ', 'جغرافيا', 'علم اجتماع'],
  // 'كلية التربية': ['معلم صف', 'رياض أطفال', 'تربية خاصة', 'تكنولوجيا تعليم'],
  // 'كلية الطب': ['طب عام', 'طب أسنان', 'تمريض', 'علاج طبيعي'],
  // 'كلية الصيدلة': ['صيدلة'],
  // 'كلية الحقوق': ['قانون'],
};

const COLLEGES = Object.keys(COLLEGE_MAJORS);
export default function Users() {
  const { triggerToast } = useOutletContext();

  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [saving, setSaving] = useState(false);
  const [major, setMajor] = useState('');
  const [college, setCollege] = useState('');
  const [savingAcademicInfo, setSavingAcademicInfo] = useState(false);
  const [isEditingAcademicInfo, setIsEditingAcademicInfo] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/registrar/students`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_BASE_URL}/registrar/supervisors`, { headers: getHeaders() }).then(r => r.json()),
    ])
      .then(([studentsRes, supervisorsRes]) => {
      if (studentsRes.success) {
          setStudents(studentsRes.data);
          if (studentsRes.data.length > 0) {
            setSelectedStudentId(studentsRes.data[0].student_id);
            setSelectedSupervisorId(studentsRes.data[0].supervisor_id || '');
            setMajor(studentsRes.data[0].major || '');
            setCollege(studentsRes.data[0].college || '');
            setIsEditingAcademicInfo(!studentsRes.data[0].major);
          }
        }
        if (supervisorsRes.success) setSupervisors(supervisorsRes.data);
      })
      .catch(() => triggerToast('تعذر تحميل البيانات', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedStudent = students.find(s => s.student_id === selectedStudentId);

const handleSelectStudent = (student) => {
  setSelectedStudentId(student.student_id);
  setSelectedSupervisorId(student.supervisor_id || '');
  setCollege(student.college || '');
  setMajor(student.major || '');
  setIsEditingAcademicInfo(!student.major); // لو ما عنده تخصص أصلاً، افتحلها بوضع التعديل تلقائياً
};

  const handleAssignSupervisor = async (e) => {
    e.preventDefault();
    if (!selectedSupervisorId) {
      triggerToast('الرجاء اختيار المشرف الأكاديمي', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/registrar/students/${selectedStudentId}/assign-supervisor`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ supervisor_id: selectedSupervisorId }),
      });
     const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        setIsEditingAcademicInfo(false);
        loadData();
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAcademicInfo = async (e) => {
    e.preventDefault();
    if (!major.trim()) {
      triggerToast('الرجاء إدخال التخصص', 'error');
      return;
    }
    setSavingAcademicInfo(true);
    try {
      const res = await fetch(`${API_BASE_URL}/registrar/students/${selectedStudentId}/academic-info`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ major, college }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message);
        loadData();
      } else {
        triggerToast(data.message, 'error');
      }
    } catch {
      triggerToast('حدث خطأ في الاتصال بالخادم', 'error');
    } finally {
      setSavingAcademicInfo(false);
    }
  };

  const handleCollegeChange = (newCollege) => {
  setCollege(newCollege);
  // لو التخصص الحالي مش تابع للكلية الجديدة، نصفّره حتى ما يضل تخصص من كلية تانية
  const majorsForCollege = COLLEGE_MAJORS[newCollege] || [];
  if (!majorsForCollege.includes(major)) {
    setMajor('');
  }
};

const filteredStudents = students.filter(s =>
    s.full_name?.includes(searchQuery) ||
    s.university_id?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">

      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">تعيين المشرفين الأكاديميين</h1>
        <p className="text-gray-400 text-xs font-semibold">ابحث عن طالب وحددي أو غيّري المشرف الأكاديمي المسؤول عنه.</p>
      </div>

      {loading && (
        <div className="text-center text-gray-400 text-xs font-bold py-16">جاري تحميل البيانات...</div>
      )}

      {!loading && students.length === 0 && (
        <div className="text-center text-gray-400 text-xs font-bold py-16">لا يوجد طلاب مسجلين حالياً</div>
      )}

      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: assign form */}
          <form onSubmit={handleAssignSupervisor} className="lg:col-span-7 space-y-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 bg-brand-purple/10 text-brand-purple font-extrabold flex items-center justify-center text-xl rounded-full shadow-sm shrink-0">
                  {selectedStudent?.full_name?.charAt(0) || '؟'}
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-extrabold text-gray-800">{selectedStudent?.full_name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{selectedStudent?.major || '—'} • {selectedStudent?.college || '—'}</p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">{selectedStudent?.university_id}</p>
                </div>
              </div>
            </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-gray-855 pb-2 flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-gray-400" /> البيانات الأكاديمية
              </h3>

         <div className="space-y-1 text-xs font-bold text-gray-700">
                <label>الكلية *</label>
                <select
                  value={college}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  disabled={!isEditingAcademicInfo}
                  className="w-full p-2.5 bg-gray-50 rounded-2xl border-none font-bold text-gray-750 focus:outline-none font-cairo text-right cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">-- اختر الكلية --</option>
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            <div className="space-y-1 text-xs font-bold text-gray-700">
              <label>التخصص *</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled={!isEditingAcademicInfo || !college}
                className="w-full p-2.5 bg-gray-50 rounded-2xl border-none font-bold text-gray-750 focus:outline-none font-cairo text-right cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                required
              >
                <option value="">{college ? '-- اختر التخصص --' : '-- اختاري الكلية أولاً --'}</option>
                {(COLLEGE_MAJORS[college] || []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

              <div className="flex justify-end gap-2.5 pt-2">
                {isEditingAcademicInfo ? (
                  <button
                    type="button"
                    onClick={handleUpdateAcademicInfo}
                    disabled={savingAcademicInfo}
                    className="px-6 py-2.5 bg-brand-purple text-white rounded-2xl text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 duration-200 shadow-md border-none font-cairo cursor-pointer disabled:opacity-50"
                  >
                    {savingAcademicInfo ? 'جاري الحفظ...' : 'حفظ البيانات الأكاديمية'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingAcademicInfo(true)}
                    className="px-6 py-2.5 bg-white text-brand-purple border border-brand-purple rounded-2xl text-xs font-bold hover:bg-purple-50 transition active:scale-95 duration-200 font-cairo cursor-pointer"
                  >
                    تعديل البيانات
                  </button>
                )}
              </div>
            </div>
 
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-gray-855 pb-2 flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-gray-400" /> المشرف الأكاديمي الحالي
              </h3>

              <div className="p-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-700">
                {selectedStudent?.supervisor_name || 'لم يتم تعيين مشرف بعد'}
              </div>

              <div className="space-y-1 text-xs font-bold text-gray-700">
                <label>تعيين / تغيير المشرف الأكاديمي *</label>
                <select
                  value={selectedSupervisorId}
                  onChange={(e) => setSelectedSupervisorId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 rounded-2xl border-none font-bold text-gray-750 focus:outline-none cursor-pointer font-cairo"
                  required
                >
                  <option value="">-- اختر مشرفاً --</option>
                  {supervisors.map(sup => (
                    <option key={sup.supervisor_id} value={sup.supervisor_id}>
                      {sup.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-brand-purple text-white rounded-2xl text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 duration-200 shadow-md border-none font-cairo cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التعيين'}
                </button>
              </div>
            </div>
          </form>

          {/* Right: search & list */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm p-5 space-y-4 h-fit">
            <h3 className="text-xs font-extrabold text-gray-855">البحث عن طالب</h3>

            <div className="relative">
              <input
                type="text"
                placeholder="الاسم أو الرقم الجامعي..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-3 pr-10 bg-gray-100 rounded-2xl text-right text-xs focus:outline-none focus:ring-2 focus:ring-purple-200/50 border-none font-semibold font-cairo"
              />
              <Search className="absolute inset-y-0 right-3 h-4 w-4 my-auto text-gray-400" />
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[9px] text-gray-400 font-bold block">نتائج البحث ({filteredStudents.length})</span>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredStudents.map(s => (
                  <div
                    key={s.student_id}
                    onClick={() => handleSelectStudent(s)}
                    className={`p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition duration-150 cursor-pointer flex items-center justify-between border-none ${
                      selectedStudentId === s.student_id ? 'bg-purple-50/40 shadow-xs' : ''
                    }`}
                  >
                 <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-brand-purple/10 text-brand-purple font-bold flex items-center justify-center text-xs rounded-full relative">
                        {s.full_name?.charAt(0)}
                        <span className={`absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${s.supervisor_id ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-800 block">{s.full_name}</span>
                        <span className="text-[8.5px] text-gray-400 block font-mono">{s.university_id}</span>
                      </div>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}