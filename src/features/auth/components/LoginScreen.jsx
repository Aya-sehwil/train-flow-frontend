import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen({ onNavigate, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'البريد الإلكتروني غير صالح';
    }
    // ملاحظة مهمة: هون منتحقق بس إن الحقل مش فاضي، بدون فرض شروط قوة/طول.
    // شروط القوة تُفرض فقط وقت إنشاء الحساب أو إعادة التعيين، مش وقت الدخول -
    // لأنه أي مستخدم عنده حساب قديم بباسورد قصير أو بسيط لازم يقدر يدخل عادي،
    // وشاشة الدخول مش المكان الصح لنطلب منه يغيّرها.
    if (!password) {
      tempErrors.password = 'كلمة المرور مطلوبة';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password, rememberMe });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-5">تسجيل الدخول</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الالكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="••••••••••••"
              className={`w-full bg-white px-10 py-2.5 border rounded-2xl text-right text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
              dir="ltr"
            />
            {/* Lock icon on the right */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Lock className="h-5 w-5" />
            </div>
            {/* Eye toggle on the left */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 text-right">{errors.password}</p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm select-none">
          <label className="flex items-center space-x-2 space-x-reverse cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                rememberMe
                  ? 'border-brand-purple bg-brand-purple'
                  : 'border-gray-300 bg-white group-hover:border-brand-purple'
              }`}>
                {rememberMe && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-gray-600 group-hover:text-gray-900 transition">تذكرني</span>
          </label>

          <button
            type="button"
            onClick={() => onNavigate('forgot_password')}
            className="text-gray-500 hover:text-brand-purple hover:underline transition"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-purple text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-[0.98] transition-all duration-200"
        >
          تسجيل الدخول
        </button>

        {/* Create account link */}
        <div className="text-center mt-4">
          <span className="text-gray-500">ليس لدي حساب ؟ </span>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-brand-purple font-semibold hover:underline hover:text-brand-purpleDark transition"
          >
            انشاء حساب
          </button>
        </div>
      </form>
    </div>
  );
}