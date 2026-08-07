import React from 'react';

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label = '',
  icon: Icon = null,
  error = '',
  className = '',
  name = '',
  required = false
}) {
  return (
    <div className={`flex flex-col gap-1 w-full text-right ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-gray-500 font-cairo">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-2 pl-3 pr-10 bg-gray-100 rounded-2xl text-right text-xs focus:outline-none focus:ring-2 focus:ring-purple-200/50 border-none font-semibold font-cairo ${
            error ? 'ring-2 ring-red-200 bg-red-50/30' : ''
          }`}
        />
        {Icon && (
          <Icon className="absolute inset-y-0 right-3 h-4 w-4 my-auto text-gray-400" />
        )}
      </div>
      {error && (
        <span className="text-[10px] font-bold text-red-500 font-cairo">
          {error}
        </span>
      )}
    </div>
  );
}
