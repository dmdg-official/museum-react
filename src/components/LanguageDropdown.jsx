import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageDropdown({ className = '' }) {
  const { lang, setLang, currentLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left z-[90] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="언어 선택 / Select Language"
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-amber-400/80 text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer select-none"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <span className={`text-[10px] text-amber-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0B1120]/98 backdrop-blur-xl border border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.65)] p-1.5 z-[999]"
        >
          <div className="space-y-1">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-100 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base leading-none">{item.flag}</span>
                  <span>{item.nativeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
