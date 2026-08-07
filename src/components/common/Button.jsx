import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary' | 'outline' | 'danger' | 'text'
  disabled = false, 
  className = '',
  icon: Icon = null
}) {
  const baseStyles = 'px-4 py-2 rounded-xl text-xs font-bold font-cairo transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none';
  
  const variants = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purpleLight shadow-sm',
    outline: 'border border-solid border-brand-purple text-brand-purple bg-transparent hover:bg-purple-50/50',
    danger: 'border border-solid border-red-500 text-red-500 bg-white hover:bg-red-50',
    text: 'text-gray-500 hover:text-gray-800 bg-transparent hover:bg-gray-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
