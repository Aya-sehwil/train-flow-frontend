import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Briefcase, MapPin, Clock, History, Check } from 'lucide-react';

export default function Opportunities({ triggerToast = () => {} }) {
  const navigate = useNavigate();

  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [showEditOppModal, setShowEditOppModal] = useState(null);
  
  const [opportunities, setOpportunities] = useState([
    { 
      id: 1, 
      title: 'مطور برمجيات متدرب', 
      dept: 'قسم الهندسة والبرمجيات', 
      supervisor: 'أ. خالد منصور', 
      location: 'الرياض، المقر الرئيسي (حضوري)', 
      duration: '3 أشهر (تبدأ من 1 سبتمبر)', 
      totalSeats: 5,
      filledSeats: 2,
      tags: ['React', 'Node.js', 'Git'],
      description: 'فرصة تدريبية للعمل على مشاريع تطوير تطبيقات الويب باستخدام تقنيات حديثة ضمن فريق التطوير المتميز.',
      applicants: 5, 
      status: 'active' 
    },
    { 
      id: 2, 
      title: 'محلل بيانات متدرب', 
      dept: 'قسم الذكاء الاصطناعي وتحليل البيانات', 
      supervisor: 'أ. ريم الناصر', 
      location: 'عن بعد (Remote)', 
      duration: '6 أشهر (تبدأ من 15 سبتمبر)', 
      totalSeats: 2,
      filledSeats: 0,
      tags: ['SQL', 'PowerBI', 'Excel'],
      description: 'المشاركة في تحليل بيانات الأداء واستخراج التقارير باستخدام أدوات ذكاء الأعمال لدعم اتخاذ القرار.',
      applicants: 0, 
      status: 'active' 
    },
    { 
      id: 3, 
      title: 'مصمم واجهات المستخدم (UI/UX)', 
      dept: 'قسم التصميم والوسائط الرقمية', 
      supervisor: 'أ. سارة العتيبي', 
      location: 'جدة، الفرع الإقليمي', 
      duration: 'انتهت في 30 أغسطس', 
      totalSeats: 3,
      filledSeats: 3,
      tags: ['Figma', 'Prototyping'],
      description: 'تصميم واجهات المستخدم لتطبيقات الشركة الداخلية وتحسين تجربة المستخدم بناءً على الأبحاث.',
      applicants: 3, 
      status: 'closed' 
    },
  ]);

  const [newOpp, setNewOpp] = useState({ 
    title: '', 
    dept: '', 
    supervisor: '', 
    location: '', 
    duration: '', 
    description: '', 
    tags: '', 
    totalSeats: 5, 
    status: 'active' 
  });

  const handleAddOpportunity = (e) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.dept) {
      triggerToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    const created = {
      id: Date.now(),
      title: newOpp.title,
      dept: newOpp.dept,
      supervisor: newOpp.supervisor || 'غير محدد',
      location: newOpp.location || 'الرياض (حضوري)',
      duration: newOpp.duration || '3 أشهر',
      totalSeats: parseInt(newOpp.totalSeats) || 5,
      filledSeats: 0,
      tags: newOpp.tags ? newOpp.tags.split(',').map(t => t.trim()) : ['React'],
      description: newOpp.description || 'فرصة تدريبية للعمل واكتساب الخبرة العملية.',
      applicants: 0,
      status: newOpp.status
    };
    setOpportunities([created, ...opportunities]);
    setShowAddOppModal(false);
    setNewOpp({ title: '', dept: '', supervisor: '', location: '', duration: '', description: '', tags: '', totalSeats: 5, status: 'active' });
    triggerToast('تمت إضافة الفرصة التدريبية بنجاح!');
  };

  const handleEditOpportunity = (e) => {
    e.preventDefault();
    setOpportunities(prev => prev.map(opp => opp.id === showEditOppModal.id ? showEditOppModal : opp));
    setShowEditOppModal(null);
    triggerToast('تم تعديل الفرصة التدريبية بنجاح!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      
      {/* Header section with Filter and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">إدارة الفرص التدريبية</h1>
          <p className="text-gray-400 text-xs font-semibold">إدارة وتتبع الفرص المتاحة للطلاب للتدريب الميداني.</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select className="px-3.5 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold focus:outline-none focus:border-brand-purple text-right text-gray-655 cursor-pointer font-cairo">
            <option>جميع الحالات</option>
            <option>نشطة</option>
            <option>مغلقة</option>
          </select>
          <button 
            onClick={() => setShowAddOppModal(true)} 
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-purple text-white rounded-2xl text-xs font-bold hover:bg-[#5249c4] transition shadow-md active:scale-95 cursor-pointer font-cairo"
          >
            <Plus className="h-4.5 w-4.5" /> إضافة فرصة جديدة
          </button>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Successfully Closed */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">تم إغلاقها بنجاح</span>
            <span className="text-3xl font-extrabold text-gray-800">12</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <History className="h-6 w-6" />
          </div>
        </div>

        {/* 2. Available Seats */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">إجمالي المقاعد المتاحة</span>
            <span className="text-3xl font-extrabold text-gray-800">5</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* 3. Total Opportunities */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center justify-between text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 block">فرصة تدريبية</span>
            <span className="text-3xl font-extrabold text-gray-800">45</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-purple">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Grid of opportunity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div key={opp.id} className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between gap-5 text-right relative hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              
              {/* Badge & Status */}
              <div className="flex items-start justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                  opp.status === 'active' 
                    ? 'bg-green-50 text-green-600 border-green-100/50' 
                    : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}>
                  {opp.status === 'active' ? 'نشطة' : 'مكتملة'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-gray-850">{opp.title}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-2.5 leading-relaxed font-cairo">
                  {opp.description}
                </p>
              </div>

              {/* Meta List */}
              <div className="space-y-2.5 pt-3 border-t border-gray-50 text-[10px] font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{opp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{opp.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>
                    {opp.status === 'active' 
                      ? `${opp.totalSeats} مقاعد متاحة (تم شغل ${opp.filledSeats})`
                      : `${opp.totalSeats}/${opp.totalSeats} مقاعد ممتلئة`
                    }
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {opp.tags && opp.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-55/40 border border-gray-100 text-gray-600 text-[9px] font-bold rounded-lg font-cairo">
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-1">
              
              {/* Left: Applicants Info */}
              <div className="flex items-center">
                {opp.status === 'active' ? (
                  opp.applicants > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {/* Avatar stack */}
                      <div className="flex -space-x-1.5 rtl:space-x-reverse">
                        <div className="h-6 w-6 rounded-full border border-white bg-purple-100 text-brand-purple flex items-center justify-center text-[8px] font-bold shrink-0">
                          س
                        </div>
                        <div className="h-6 w-6 rounded-full border border-white bg-blue-100 text-blue-655 flex items-center justify-center text-[8px] font-bold shrink-0">
                          أ
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400">+3</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold text-gray-400">لا يوجد متقدمين بعد</span>
                  )
                ) : (
                  <div className="flex items-center justify-center bg-green-50 text-green-500 rounded-full p-0.5 border border-green-150">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-1.5">
                {opp.status === 'active' ? (
                  <>
                    <button 
                      onClick={() => setShowEditOppModal(opp)} 
                      className="px-3.5 py-1.5 border border-gray-200 text-gray-500 text-[10px] font-bold rounded-xl hover:text-brand-purple hover:bg-gray-50 transition font-cairo"
                    >
                      تعديل
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/institution?tab=applications')} 
                      className="px-3.5 py-1.5 bg-[#f4f2ff] text-brand-purple text-[10px] font-bold rounded-xl hover:bg-brand-purple hover:text-white transition duration-200 font-cairo"
                    >
                      عرض التفاصيل
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => triggerToast('سيتم عرض التقرير النهائي للفرصة المكتملة', 'info')}
                    className="px-3.5 py-1.5 border border-gray-250 text-gray-550 text-[10px] font-bold rounded-xl hover:bg-gray-50 hover:text-brand-purple transition font-cairo flex items-center gap-1"
                  >
                    عرض التقرير النهائي
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Add Opportunity Modal */}
      {showAddOppModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleAddOpportunity} className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden text-right animate-fade-in">
            <div className="p-5 border-b border-gray-100 bg-[#fbfbfd] flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-805">إضافة فرصة تدريبية جديدة</h3>
              <button type="button" onClick={() => setShowAddOppModal(false)} className="h-7 w-7 rounded-lg border border-gray-150 text-gray-400 hover:text-gray-700 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-4 text-xs font-bold text-gray-700">
              
              <div className="space-y-1">
                <label>المسمى الوظيفي للفرصة *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مطور برمجيات متدرب" 
                  value={newOpp.title}
                  onChange={e => setNewOpp({...newOpp, title: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label>القسم / التخصص التدريبي *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: قسم الهندسة والبرمجيات" 
                  value={newOpp.dept}
                  onChange={e => setNewOpp({...newOpp, dept: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label>اسم المشرف الميداني المسؤول *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: أ. خالد منصور" 
                  value={newOpp.supervisor}
                  onChange={e => setNewOpp({...newOpp, supervisor: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>موقع ومكان التدريب</label>
                  <input 
                    type="text" 
                    placeholder="الرياض (حضوري)" 
                    value={newOpp.location}
                    onChange={e => setNewOpp({...newOpp, location: e.target.value})}
                    className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label>المدة الزمنية للتدريب</label>
                  <input 
                    type="text" 
                    placeholder="3 أشهر" 
                    value={newOpp.duration}
                    onChange={e => setNewOpp({...newOpp, duration: e.target.value})}
                    className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>حالة الفرصة</label>
                <select 
                  value={newOpp.status}
                  onChange={e => setNewOpp({...newOpp, status: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                >
                  <option value="active">نشطة ومتاحة للتقديم</option>
                  <option value="closed">مغلقة/مكتملة</option>
                </select>
              </div>

            </div>
            <div className="p-4 border-t border-gray-50 bg-[#fbfbfd] flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowAddOppModal(false)} className="px-4 py-2 border border-gray-255 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50">إلغاء</button>
              <button type="submit" className="px-5 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 shadow font-cairo">إضافة الفرصة</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {showEditOppModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleEditOpportunity} className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden text-right animate-fade-in">
            <div className="p-5 border-b border-gray-100 bg-[#fbfbfd] flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-805">تعديل الفرصة التدريبية</h3>
              <button type="button" onClick={() => setShowEditOppModal(null)} className="h-7 w-7 rounded-lg border border-gray-150 text-gray-400 hover:text-gray-700 flex items-center justify-center">✕</button>
            </div>
            <div className="p-5 space-y-4 text-xs font-bold text-gray-700">
              
              <div className="space-y-1">
                <label>المسمى الوظيفي *</label>
                <input 
                  type="text" 
                  required
                  value={showEditOppModal.title}
                  onChange={e => setShowEditOppModal({...showEditOppModal, title: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                />
              </div>

              <div className="space-y-1">
                <label>القسم / التخصص التدريبي *</label>
                <input 
                  type="text" 
                  required
                  value={showEditOppModal.dept}
                  onChange={e => setShowEditOppModal({...showEditOppModal, dept: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                />
              </div>

              <div className="space-y-1">
                <label>اسم المشرف الميداني *</label>
                <input 
                  type="text" 
                  required
                  value={showEditOppModal.supervisor}
                  onChange={e => setShowEditOppModal({...showEditOppModal, supervisor: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>موقع ومكان التدريب</label>
                  <input 
                    type="text" 
                    value={showEditOppModal.location}
                    onChange={e => setShowEditOppModal({...showEditOppModal, location: e.target.value})}
                    className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label>المدة الزمنية</label>
                  <input 
                    type="text" 
                    value={showEditOppModal.duration}
                    onChange={e => setShowEditOppModal({...showEditOppModal, duration: e.target.value})}
                    className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>حالة الفرصة</label>
                <select 
                  value={showEditOppModal.status}
                  onChange={e => setShowEditOppModal({...showEditOppModal, status: e.target.value})}
                  className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-brand-purple text-right font-semibold"
                >
                  <option value="active">نشطة ومتاحة</option>
                  <option value="closed">مغلقة/مكتملة</option>
                </select>
              </div>

            </div>
            <div className="p-4 border-t border-gray-50 bg-[#fbfbfd] flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowEditOppModal(null)} className="px-4 py-2 border border-gray-255 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50">إلغاء</button>
              <button type="submit" className="px-5 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-[#5249c4] transition active:scale-95 shadow font-cairo">حفظ التغييرات</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
