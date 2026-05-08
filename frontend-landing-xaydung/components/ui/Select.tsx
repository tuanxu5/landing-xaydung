import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 outline-none appearance-none bg-white';
    
    const borderStyles = error
      ? 'border-2 border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
      : 'border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100';

    const disabledStyles = disabled
      ? 'opacity-60 cursor-not-allowed bg-gray-100'
      : 'cursor-pointer';

    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              ${baseStyles}
              ${borderStyles}
              ${disabledStyles}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          
          {/* Dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
