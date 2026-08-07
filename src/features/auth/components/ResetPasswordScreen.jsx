import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';

// نفس شروط الباسورد المطبقة بالباك اند وبصفحة التسجيل بالضبط
const passwordChecks = [
  { id: 'length', label: '8 أحرف على الأقل', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'حرف كبير واحد على الأقل (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'حرف صغير واحد على الأقل (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'رقم واحد على الأقل (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'رمز خاص واحد على الأقل (!@#$%...)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const isPasswordStrong = (pw) => passwordChecks.every((check) => check.test(pw));

export default function ResetPasswordScreen({ onNavigate, onSubmit }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!password) {
      tempErrors.password = 'كلمة المرور مطلوبة';
    } else if (!isPasswordStrong(password)) {
      tempErrors.password = 'كلمة المرور لا تحقق كل الشروط الموضحة أدناه';
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ password });
    }
  };

  return (
    <div className="w-full animate-fade-in text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-1">إعادة تعيين كلمة مرور جديدة</h2>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed max-w-xs mx-auto">
        لحماية حسابك يرجى اختيار كلمة مرور قوية
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordTouched(true)}
              placeholder="••••••••••••"
              className={`w-full bg-white px-10 py-2.5 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* قائمة شروط الباسورد التفاعلية - نفس المستخدمة بصفحة التسجيل */}
          {passwordTouched && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 mb-1.5 text-right">يجب أن تحتوي كلمة المرور على:</p>
              <ul className="space-y-1">
                {passwordChecks.map((check) => {
                  const passed = check.test(password);
                  return (
                    <li
                      key={check.id}
                      className={`flex items-center justify-end gap-1.5 text-xs ${
                        passed ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <span>{check.label}</span>
                      {passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`w-full bg-white px-10 py-2.5 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-purple text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-[0.98] transition-all duration-200"
        >
          حفظ
        </button>

        {/* Back to Login */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-gray-400 text-sm font-semibold hover:text-brand-purple transition"
          >
            العودة إلى شاشة تسجيل الدخول
          </button>
        </div>
      </form>
    </div>
  );
}