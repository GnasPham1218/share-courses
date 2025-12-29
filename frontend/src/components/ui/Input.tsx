import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode; // Icon bên trái (VD: Kính lúp tìm kiếm)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Render Label nếu có */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Render Icon bên trái nếu có */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input chính */}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900'
              }
              ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {/* Render câu báo lỗi nếu có */}
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';