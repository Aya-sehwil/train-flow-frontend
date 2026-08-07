import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OtpVerificationScreen from './OtpVerificationScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import logo from '../../../logo.png';

export default function LoginApp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [screen, setScreen] = useState('login');
  const [userEmail, setUserEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLoginSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        login(result.token, result.user);
        showToast('تم تسجيل الدخول بنجاح! جاري تحويلك...');
        setTimeout(() => navigate('/dashboard'), 1000);
        return;
      }

      // رسالة الخطأ جايّة مباشرة من الباك اند (مثلاً: "غير مسجل" أو "كلمة المرور غير صحيحة")
      showToast(result.message || 'فشل تسجيل الدخول. حاول مرة أخرى.', 'error');
    } catch (err) {
      // هون بس مشكلة اتصال حقيقية بالسيرفر (سيرفر مطفي، مشكلة شبكة...)
      showToast('تعذر الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.', 'error');
    }
  };

  const handleRegisterSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setTimeout(() => setScreen('login'), 1500);
        return;
      }

      showToast(result.message || 'فشل إنشاء الحساب. حاول مرة أخرى.', 'error');
    } catch (err) {
      showToast('تعذر الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.', 'error');
    }
  };

  const handleForgotPasswordSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      const result = await response.json();
      if (response.ok) {
        setUserEmail(data.email);
        showToast('تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح ✅');
        setTimeout(() => setScreen('otp_verification'), 1200);
      } else {
        showToast(result.message || 'حدث خطأ أثناء إرسال الرمز', 'error');
      }
    } catch {
      showToast('فشل الاتصال بالسيرفر...', 'error');
    }
  };

  const handleOtpSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, code: data.code })
      });
      const result = await response.json();
      if (response.ok) {
        setResetToken(result.resetToken);
        showToast('تم التحقق من الرمز بنجاح!');
        setTimeout(() => setScreen('reset_password'), 1000);
      } else {
        showToast(result.message || 'الرمز غير صحيح!', 'error');
      }
    } catch {
      showToast('فشل الاتصال بالسيرفر', 'error');
    }
  };

  const handleResetPasswordSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password: data.password })
      });
      const result = await response.json();
      if (response.ok) {
        showToast('تم تغيير كلمة المرور بنجاح!');
        setTimeout(() => setScreen('login'), 1800);
      } else {
        showToast(result.message || 'حدث خطأ', 'error');
      }
    } catch {
      showToast('فشل الاتصال بالسيرفر', 'error');
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onNavigate={setScreen} onSubmit={handleLoginSubmit} />;
      case 'register':
        return <RegisterScreen onNavigate={setScreen} onSubmit={handleRegisterSubmit} />;
      case 'forgot_password':
        return <ForgotPasswordScreen onNavigate={setScreen} onSubmit={handleForgotPasswordSubmit} />;
      case 'otp_verification':
        return <OtpVerificationScreen onNavigate={setScreen} onSubmit={handleOtpSubmit} />;
      case 'reset_password':
        return <ResetPasswordScreen onNavigate={setScreen} onSubmit={handleResetPasswordSubmit} />;
      default:
        return <LoginScreen onNavigate={setScreen} onSubmit={handleLoginSubmit} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fd] flex flex-col items-center justify-center p-4 relative font-cairo overflow-hidden">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 p-4 rounded-2xl shadow-xl transition-all duration-300 max-w-sm animate-fade-in flex items-center gap-3 border ${toast.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-green-50 text-green-800 border-green-200'
          }`}>
          <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-sm font-semibold text-right w-full">{toast.message}</span>
        </div>
      )}

      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="mb-4 z-10">
        <img
          src={logo}
          alt="Train Flow"
          className="h-12 w-auto object-contain mx-auto hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.style.display = 'none';
            document.getElementById('logo-fallback').style.display = 'flex';
          }}
        />
        <div id="logo-fallback" className="hidden items-center justify-center gap-2 mb-2">
          <span className="text-xl font-extrabold text-brand-purple tracking-tight">Train Flow</span>
        </div>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border border-[#f0f4f9] p-6 md:p-8 z-10 transition-all duration-300">
        {renderScreen()}
      </div>
    </div>
  );
}