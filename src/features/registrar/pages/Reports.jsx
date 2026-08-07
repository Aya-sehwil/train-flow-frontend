import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  SlidersHorizontal,
  ChevronLeft,
  Users,
  CheckCircle2,
  TrendingUp,
  Printer,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Eye,
  Briefcase
} from 'lucide-react';

export default function Reports() {
  const { triggerToast } = useOutletContext();
  const [selectedTemplate, setSelectedTemplate] = useState('employment');
  const [filters, setFilters] = useState({ year: '2023-2024', term: 'term1', college: 'all', company: 'all' });

  const handleGenerateReport = (e) => {
    e.preventDefault();
    triggerToast('تم تحديث البيانات وتوليد التقرير بنجاح');
  };

  const handleResetFilters = () => {
    setFilters({ year: '2023-2024', term: 'term1', college: 'all', company: 'all' });
    triggerToast('تم إعادة ضبط معايير التقرير');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right font-cairo">
      
      {/* Title */}
      <div className="pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">مركز التقارير الشاملة</h1>
        <p className="text-gray-400 text-xs font-semibold">تحليل البيانات، مؤشرات الأداء، وإصدار التقارير المتخصصة لدائرة القبول والتسجيل</p>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right column: Templates selection (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-extrabold text-gray-855 flex items-center gap-1.5 pb-2">
            <FileText className="h-4.5 w-4.5 text-gray-400" /> نماذج جاهزة
          </h3>

          <div className="space-y-2 text-xs">
            <button 
              onClick={() => setSelectedTemplate('employment')}
              className={`w-full p-4 rounded-2xl text-right transition flex items-center justify-between border-none cursor-pointer ${
                selectedTemplate === 'employment'
                  ? 'bg-purple-50/40 text-brand-purple font-bold'
                  : 'bg-gray-50 text-gray-650 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Indigo bullet/indicator check as in mockup */}
                <div className="mt-1 h-4 w-4 rounded-full border border-brand-purple flex items-center justify-center shrink-0">
                  {selectedTemplate === 'employment' && (
                    <div className="h-2 w-2 rounded-full bg-brand-purple" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="block font-bold">نسب توظيف الطلاب</span>
                  <span className="text-[9px] text-gray-400 block font-semibold leading-relaxed">تحليل معدلات التوظيف بعد انتهاء فترة التدريب الميداني.</span>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedTemplate('quality')}
              className={`w-full p-4 rounded-2xl text-right transition flex items-center justify-between border-none cursor-pointer ${
                selectedTemplate === 'quality'
                  ? 'bg-purple-50/40 text-brand-purple font-bold'
                  : 'bg-gray-50 text-gray-650 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                  {selectedTemplate === 'quality' && (
                    <div className="h-2 w-2 rounded-full bg-brand-purple" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="block font-bold">تقييم جودة الشركات</span>
                  <span className="text-[9px] text-gray-400 block font-semibold leading-relaxed">بناءً على ملاحظات المشرفين وتقييمات الطلاب للجهات المضيفة.</span>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setSelectedTemplate('colleges')}
              className={`w-full p-4 rounded-2xl text-right transition flex items-center justify-between border-none cursor-pointer ${
                selectedTemplate === 'colleges'
                  ? 'bg-purple-50/40 text-brand-purple font-bold'
                  : 'bg-gray-50 text-gray-650 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                  {selectedTemplate === 'colleges' && (
                    <div className="h-2 w-2 rounded-full bg-brand-purple" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="block font-bold">أداء الكليات الشامل</span>
                  <span className="text-[9px] text-gray-400 block font-semibold leading-relaxed">مقارنة معدلات الالتزام والدرجات بين مختلف الكليات.</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Left column: Parameters & Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Report parameters */}
          <form onSubmit={handleGenerateReport} className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-855 flex items-center gap-1.5 pb-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-gray-400" /> محددات التقرير
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label>العام الجامعي</label>
                <select 
                  value={filters.year}
                  onChange={e => setFilters({...filters, year: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl border-none font-bold text-gray-700 cursor-pointer focus:outline-none font-cairo"
                >
                  <option value="2023-2024">2023 - 2024</option>
                  <option value="2022-2023">2022 - 2023</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>الفصل الدراسي</label>
                <select 
                  value={filters.term}
                  onChange={e => setFilters({...filters, term: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl border-none font-bold text-gray-700 cursor-pointer focus:outline-none font-cairo"
                >
                  <option value="term1">الفصل الأول</option>
                  <option value="term2">الفصل الثاني</option>
                  <option value="term3">الفصل الصيفي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>الكلية / القسم</label>
                <select 
                  value={filters.college}
                  onChange={e => setFilters({...filters, college: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl border-none font-bold text-gray-700 cursor-pointer focus:outline-none font-cairo"
                >
                  <option value="all">جميع الكليات</option>
                  <option value="computers">كلية الحاسب</option>
                  <option value="engineering">كلية الهندسة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label>جهة التدريب (الشركات)</label>
                <select 
                  value={filters.company}
                  onChange={e => setFilters({...filters, company: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl border-none font-bold text-gray-700 cursor-pointer focus:outline-none font-cairo"
                >
                  <option value="all">الكل (شامل)</option>
                  <option value="aramco">أرامكو السعودية</option>
                  <option value="stc">STC للاتصالات</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-650 hover:bg-gray-200 font-bold rounded-xl transition border-none font-cairo cursor-pointer"
              >
                إعادة ضبط
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1 px-5 py-2 bg-brand-purple hover:bg-[#5249c4] text-white rounded-xl font-bold transition active:scale-95 duration-200 border-none font-cairo cursor-pointer shadow"
              >
                <Sparkles className="h-4 w-4" /> توليد التقرير
              </button>
            </div>
          </form>

          {/* Report Preview */}
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold text-gray-855 flex items-center gap-1.5">
                  <Eye className="h-4.5 w-4.5 text-gray-400" /> معاينة التقرير
                </h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold font-cairo">محدث للتو</span>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <button 
                  onClick={() => triggerToast('جاري تشغيل الطباعة...')}
                  className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 bg-transparent border-none cursor-pointer"
                  title="طباعة التقرير"
                >
                  <Printer className="h-4.5 w-4.5" />
                </button>
                <button 
                  onClick={() => triggerToast('تصدير التقرير كملف Excel', 'info')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0fdf4] text-green-700 bg-white border-none font-cairo cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" /> تصدير Excel
                </button>
                <button 
                  onClick={() => triggerToast('تصدير التقرير كملف PDF')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-gray-50 text-gray-700 bg-white border-none font-cairo cursor-pointer"
                >
                  <FileCode className="h-4 w-4 text-gray-450" /> تصدير PDF
                </button>
              </div>
            </div>

            {/* Header info */}
            <div className="text-center space-y-1.5 py-2">
              <h2 className="text-base font-extrabold text-gray-855">تقرير نسب توظيف الطلاب (التدريب المنتهي بالتوظيف)</h2>
              <p className="text-[10px] text-gray-400 font-bold font-cairo">العام الجامعي: 2023-2024 | الفصل الأول | جميع الكليات</p>
            </div>

            {/* Main highlights grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#f8f9fd] p-4 rounded-2xl text-center space-y-1 border-none shadow-xs">
                <div className="h-8 w-8 bg-purple-50 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xl font-extrabold text-gray-800 block">450</span>
                <span className="text-[9px] text-gray-400 font-bold block">إجمالي المتدربين</span>
              </div>

              <div className="bg-[#f8f9fd] p-4 rounded-2xl text-center space-y-1 border-none shadow-xs">
                <div className="h-8 w-8 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-xl font-extrabold text-gray-800 block">128</span>
                <span className="text-[9px] text-gray-400 font-bold block">تم توظيفهم</span>
              </div>

              <div className="bg-[#f8f9fd] p-4 rounded-2xl text-center space-y-1 border-none shadow-xs">
                <div className="h-8 w-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-xl font-extrabold text-green-600 block">28.4%</span>
                <span className="text-[9px] text-gray-400 font-bold block">نسبة التحويل</span>
              </div>
            </div>

            {/* Table: Top hiring companies */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-gray-800 text-center pb-2">أعلى الشركات توظيفاً للمتدربين</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-[10px] font-semibold text-gray-700">
                  <thead>
                    <tr className="bg-[#fcfcff] text-[9px] font-bold text-gray-455 border-b border-gray-100">
                      <th className="p-3">اسم الشركة</th>
                      <th className="p-3">القطاع</th>
                      <th className="p-3 text-center">عدد المتدربين</th>
                      <th className="p-3 text-center">عدد المعينين</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/40">
                      <td className="p-3 text-gray-800 font-bold">شركة التقنية المتقدمة</td>
                      <td className="p-3 text-gray-450">تكنولوجيا المعلومات</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">45</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">18</td>
                    </tr>
                    <tr className="hover:bg-gray-50/40">
                      <td className="p-3 text-gray-800 font-bold">البنك الوطني الأول</td>
                      <td className="p-3 text-gray-450">مالي ومصرفي</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">30</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">12</td>
                    </tr>
                    <tr className="hover:bg-gray-50/40">
                      <td className="p-3 text-gray-800 font-bold">مجموعة الهندسة المعمارية</td>
                      <td className="p-3 text-gray-450">هندسة وإنشاءات</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">25</td>
                      <td className="p-3 text-center text-brand-purple font-extrabold">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
