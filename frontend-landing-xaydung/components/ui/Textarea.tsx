import React, { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 outline-none resize-none';
    
    const borderStyles = error
      ? 'border-2 border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
      : 'border-2 border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100';

    const disabledStyles = disabled
      ? 'opacity-60 cursor-not-allowed bg-gray-100'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${borderStyles}
            ${disabledStyles}
            ${className}
          `}
          {...props}
        />
        
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

Textarea.displayName = 'Textarea';

export default Textarea;
