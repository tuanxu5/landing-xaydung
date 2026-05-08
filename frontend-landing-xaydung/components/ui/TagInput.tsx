'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  maxTags?: number;
}

export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Nhập tag và nhấn Enter...',
  error,
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace on empty input
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    // Check if tag already exists
    if (value.includes(trimmedValue)) {
      setInputValue('');
      return;
    }
    
    // Check max tags limit
    if (value.length >= maxTags) {
      return;
    }
    
    onChange([...value, trimmedValue]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <div>
      <div
        className={`flex flex-wrap gap-2 p-3 rounded-lg border transition-colors ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
            : 'border-gray-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'
        }`}
      >
        {/* Tags */}
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium group"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 transition-colors"
              title="Xóa tag"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={value.length >= maxTags}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm disabled:cursor-not-allowed"
        />
      </div>

      {/* Helper text */}
      <div className="mt-2 flex items-center justify-between">
        {error ? (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd> để thêm tag
          </p>
        )}
        <p className="text-xs text-gray-500">
          {value.length}/{maxTags}
        </p>
      </div>
    </div>
  );
}
