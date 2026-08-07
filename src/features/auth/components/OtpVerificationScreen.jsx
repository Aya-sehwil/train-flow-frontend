import { useState, useEffect, useRef } from 'react';

export default function OtpVerificationScreen({ onNavigate, onSubmit }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(57);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const chars = pasteData.split('');
      setCode(chars);
      inputRefs[5].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('الرجاء إدخال الرمز المكون من 6 أرقام كاملة');
      return;
    }
    setError('');
    onSubmit({ code: fullCode });
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(59);
      console.log('OTP Code resent!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full animate-fade-in text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-1">رمز التحقق</h2>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed max-w-xs mx-auto">
        أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex justify-center gap-2" dir="ltr">
          {code.map((char, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="1"
              value={char}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-brand-purple transition duration-200"
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-brand-purple text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-[0.98] transition-all duration-200"
        >
          تحقق من الرمز
        </button>

        <div className="text-sm text-gray-400">
          {timer > 0 ? (
            <span>
              لم أستلم الرمز؟ <span className="text-brand-purple font-medium">إعادة إرسال الرمز</span> ({formatTime(timer)})
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-brand-purple hover:underline font-semibold transition"
            >
              إعادة إرسال الرمز الآن
            </button>
          )}
        </div>
      </form>
    </div>
  );
}