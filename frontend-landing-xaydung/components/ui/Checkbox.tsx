import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <label className={`inline-flex items-start gap-3 group ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={`
              peer w-5 h-5 rounded-md border-2 border-gray-300 
              appearance-none cursor-pointer
              transition-all duration-200
              checked:bg-primary-600 checked:border-primary-600
              hover:border-primary-400
              focus:outline-none focus:ring-4 focus:ring-primary-100
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          
          {/* Checkmark icon */}
          <svg 
            className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={3}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        {label && (
          <div className="flex-1 select-none">
            <span className={`text-sm font-medium transition-colors ${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}`}>
              {label}
            </span>
            {helperText && (
              <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
