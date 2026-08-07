import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Hash, Check, X } from 'lucide-react';

// ملاحظة أمنية: "مشرف أكاديمي"، "موظف قبول وتسجيل"، و"جهة تدريب" اتشالوا من هون عمداً.
// هاي أدوار حساسة (أو محتاجة توثيق من الجامعة)، فما لازم أي زائر يقدر يسجل
// حساب منها لحاله عبر هالفورم العام. حسابات هاي الأدوار تُنشأ فقط من داخل
// لوحة تحكم "قبول وتسجيل" من قبل موظف موجود مسبقاً (عبر /api/auth/create-staff).
// التسجيل الذاتي العام صار محصور بالطالب فقط.

// نفس شروط الباسورد المطبقة بالباك اند بالضبط
const passwordChecks = [
  { id: 'length', label: '8 أحرف على الأقل', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'حرف كبير واحد على الأقل (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'حرف صغير واحد على الأقل (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'رقم واحد على الأقل (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'رمز خاص واحد على الأقل (!@#$%...)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const isPasswordStrong = (pw) => passwordChecks.every((check) => check.test(pw));

const commonEmailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

export default function RegisterScreen({ onNavigate, onSubmit }) {
  // الدور صار ثابت "student" لأنه هو الدور الوحيد المسموح بالتسجيل الذاتي العام
  const role = 'student';
  const [username, setUsername] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleEmailChange = (value) => {
    setEmail(value);
    const atIndex = value.indexOf('@');
    if (atIndex === -1) {
      setShowEmailSuggestions(false);
      return;
    }
    const domainTyped = value.slice(atIndex + 1);
    if (commonEmailDomains.includes(domainTyped)) {
      setShowEmailSuggestions(false);
      return;
    }
    const filtered = commonEmailDomains.filter((d) => d.startsWith(domainTyped));
    setEmailSuggestions(filtered);
    setShowEmailSuggestions(filtered.length > 0);
  };

  const applyEmailSuggestion = (domain) => {
    const atIndex = email.indexOf('@');
    const localPart = atIndex === -1 ? email : email.slice(0, atIndex);
    setEmail(`${localPart}@${domain}`);
    setShowEmailSuggestions(false);
  };

  const handleUniversityIdChange = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setUniversityId(digitsOnly);
  };

  const validate = () => {
    const tempErrors = {};
    if (!username) {
      tempErrors.username = 'اسم المستخدم مطلوب';
    } else if (username.length < 3) {
      tempErrors.username = 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
    }

    if (!universityId) {
      tempErrors.universityId = 'الرقم الجامعي مطلوب للطلاب';
    } else if (!/^\d{10}$/.test(universityId)) {
      tempErrors.universityId = 'الرقم الجامعي يجب أن يتكون من 10 أرقام بالضبط';
    }

    if (!email) {
      tempErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!password) {
      tempErrors.password = 'كلمة المرور مطلوبة';
    } else if (!isPasswordStrong(password)) {
      tempErrors.password = 'كلمة المرور لا تحقق كل الشروط الموضحة أدناه';
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'الرجاء تأكيد كلمة المرور';
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = 'كلمة المرور وتأكيدها غير متطابقين';
    }

    if (!agreeTerms) {
      tempErrors.agreeTerms = 'يجب الموافقة على الشروط والأحكام';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: username,
        university_id: universityId,
        email,
        password,
        role
      });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-1">إنشاء حساب طالب جديد</h2>
      <p className="text-sm text-center text-gray-400 mb-5">أكمل بياناتك للتسجيل</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم المستخدم
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="محمد علي"
              className={`w-full bg-white px-4 py-2.5 pr-10 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.username
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <User className="h-5 w-5" />
            </div>
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.username}</p>
          )}
        </div>

        {/* University ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الرقم الجامعي
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={universityId}
              onChange={(e) => handleUniversityIdChange(e.target.value)}
              placeholder="4410023450 (10 أرقام)"
              maxLength={10}
              className={`w-full bg-white px-4 py-2.5 pr-10 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.universityId
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Hash className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 text-right">
            {universityId.length}/10 أرقام
          </p>
          {errors.universityId && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.universityId}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الالكتروني
          </label>
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 150)}
              placeholder="example123@gmail.com"
              className={`w-full bg-white px-4 py-2.5 pr-10 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>

            {showEmailSuggestions && (
              <ul className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden" dir="ltr">
                {emailSuggestions.map((domain) => {
                  const localPart = email.slice(0, email.indexOf('@'));
                  return (
                    <li
                      key={domain}
                      onMouseDown={() => applyEmailSuggestion(domain)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer text-left"
                    >
                      {localPart}@{domain}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.email}</p>
          )}
        </div>

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
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

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
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between text-sm select-none">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  agreeTerms
                    ? 'border-brand-purple bg-brand-purple'
                    : 'border-gray-300 bg-white group-hover:border-brand-purple'
                }`}>
                  {agreeTerms && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 transition">أوافق على كافة الشروط والأحكام</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate('forgot_password')}
              className="text-gray-500 hover:text-brand-purple hover:underline transition"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-purple text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-[0.98] transition-all duration-200"
        >
          إنشاء الحساب
        </button>

        {/* Link back to login */}
        <div className="text-center mt-4">
          <span className="text-gray-500">لديك حساب بالفعل ؟ </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-brand-purple font-semibold hover:underline hover:text-brand-purpleDark transition"
          >
            تسجيل الدخول
          </button>
        </div>
      </form>
    </div>
  );
}