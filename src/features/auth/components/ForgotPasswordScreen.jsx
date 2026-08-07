import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function ForgotPasswordScreen({ onNavigate, onSubmit }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('البريد الإلكتروني غير صالح');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email });
    }
  };

  return (
    <div className="w-full animate-fade-in text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-1">هل نسيت كلمة المرور؟</h2>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed max-w-xs mx-auto">
        أدخل رقم هاتفك أو بريدك لاستعادة كلمة المرور الخاصة بك
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-right">
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
                error
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-purple-200 focus:border-brand-purple'
              }`}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1 text-right">{error}</p>
          )}
        </div>

        {/* Submit Button (labeled 'تسجيل دخول' or similar to match screenshot) */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-purple text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-[0.98] transition-all duration-200"
        >
          تسجيل دخول
        </button>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-gray-400 text-sm font-semibold hover:text-brand-purple transition"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </form>
    </div>
  );
}
