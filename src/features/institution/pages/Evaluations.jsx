import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Evaluations() {
  // Toast notifications state and trigger
  const [toast, setToast] = useState(null);
  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [evalName, setEvalName] = useState('أحمد خالد سالم');
  const [evalScores, setEvalScores] = useState({ commitment: 0, teamwork: 0 });
  const [evalNotes, setEvalNotes] = useState({ commitment: '', teamwork: '', general: '' });

  const calculateTotalScore = () => {
    const sum = (evalScores.commitment + evalScores.teamwork);
    return sum === 0 ? '--' : sum;
  };

  const handleSendEvaluation = () => {
    if (evalScores.commitment === 0 || evalScores.teamwork === 0) {
      triggerToast('يرجى تحديد درجة لكل معيار قبل الإرسال', 'error');
      return;
    }
    triggerToast('تم إرسال التقييم النهائي للمشرف الأكاديمي بنجاح!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 p-4 rounded-2xl shadow-xl transition-all duration-300 max-w-sm flex items-center gap-3 border animate-fade-in ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : toast.type === 'info'
            ? 'bg-blue-50 text-blue-800 border-blue-200'
            : 'bg-green-50 text-green-800 border-green-200'
        }`}>
          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <span className="text-sm font-semibold text-right w-full">{toast.msg}</span>
        </div>
      )}

      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800">تقييم المتدرب: {evalName}</h1>
        <p className="text-gray-400 text-xs font-semibold">الفترة التقييمية: الربع الأول (مارس 2024)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIGHT COLUMN: Criteria form (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-150/40 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-gray-850 pb-2 border-b border-gray-50">المعايير المهنية</h3>
          
          {/* Criteria 1: Commitment */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-gray-800">اللتزام والانضباط</h4>
                <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">مدى التزام المتدرب بأوقات الدوام الرسمي، وحضور الاجتماعات، وتطبيق سياسات المؤسسة.</p>
              </div>
              <span className="text-brand-purple font-extrabold text-xs shrink-0">{evalScores.commitment}/5</span>
            </div>
            {/* Rating buttons */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setEvalScores(prev => ({ ...prev, commitment: score }))}
                  className={`h-9 w-full rounded-xl text-xs font-bold border transition duration-150 ${
                    evalScores.commitment === score
                      ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <textarea 
              rows="2"
              placeholder="ملاحظات حول الالتزام..."
              value={evalNotes.commitment}
              onChange={e => setEvalNotes(prev => ({ ...prev, commitment: e.target.value }))}
              className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-55/30 focus:outline-none focus:border-brand-purple font-cairo font-semibold"
            />
          </div>

          {/* Criteria 2: Teamwork */}
          <div className="space-y-3 pt-4 border-t border-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-gray-800">العمل الجماعي</h4>
                <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">القدرة على التعاون مع الزملاء والمشرفين، والمساهمة الإيجابية في بيئة العمل.</p>
              </div>
              <span className="text-brand-purple font-extrabold text-xs shrink-0">{evalScores.teamwork}/5</span>
            </div>
            {/* Rating buttons */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setEvalScores(prev => ({ ...prev, teamwork: score }))}
                  className={`h-9 w-full rounded-xl text-xs font-bold border transition duration-150 ${
                    evalScores.teamwork === score
                      ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <textarea 
              rows="2"
              placeholder="ملاحظات حول العمل الجماعي..."
              value={evalNotes.teamwork}
              onChange={e => setEvalNotes(prev => ({ ...prev, teamwork: e.target.value }))}
              className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-55/30 focus:outline-none focus:border-brand-purple font-cairo font-semibold"
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-2 pt-4 border-t border-gray-50">
            <h4 className="text-xs font-extrabold text-gray-805">ملاحظات عامة وتوصيات</h4>
            <textarea 
              rows="3"
              placeholder="أدخل التوصيات النهائية، نقاط القوة، ومجالات التحسين للمتدرب..."
              value={evalNotes.general}
              onChange={e => setEvalNotes(prev => ({ ...prev, general: e.target.value }))}
              className="w-full p-2.5 border border-gray-250 rounded-xl text-xs bg-gray-55/30 focus:outline-none focus:border-brand-purple font-cairo font-semibold"
            />
          </div>

        </div>

        {/* LEFT COLUMN: Summary (1/3 width) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150/40 shadow-sm text-right flex flex-col justify-between gap-5 h-fit">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-gray-800 border-b border-gray-50 pb-3">ملخص التقييم</h3>
            
            <div className="py-8 bg-gray-50 border border-gray-100 rounded-2xl text-center space-y-1">
              <span className="text-4xl font-extrabold text-brand-purple block">
                {calculateTotalScore()}{calculateTotalScore() !== '--' && '/10'}
              </span>
              <span className="text-[10px] text-gray-400 font-bold block">النتيجة الإجمالية</span>
            </div>

            <div className="space-y-2 pt-1">
              <button 
                onClick={handleSendEvaluation}
                className="w-full py-2.5 bg-brand-purple text-white text-xs font-bold rounded-2xl hover:bg-[#5249c4] transition active:scale-95 cursor-pointer font-cairo"
              >
                إرسال للمشرف الأكاديمي
              </button>
              <button 
                onClick={() => triggerToast('تم حفظ التقييم كمسودة')}
                className="w-full py-2.5 border border-gray-200 text-gray-650 text-xs font-bold rounded-2xl hover:bg-gray-50 transition active:scale-95 cursor-pointer font-cairo bg-white"
              >
                حفظ كمسودة
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50/50 p-2.5 border border-amber-100/50 rounded-xl text-[10px] font-bold">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <span>لا يمكن التعديل بعد الإرسال</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
