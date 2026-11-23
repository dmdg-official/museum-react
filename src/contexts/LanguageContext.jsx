import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

export const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어', nativeLabel: '한국어 (KO)', flag: '🇰🇷', short: 'KO', ttsLang: 'ko-KR', aiLangName: 'Korean' },
  { code: 'en', name: 'English', nativeLabel: 'English (EN)', flag: '🇺🇸', short: 'EN', ttsLang: 'en-US', aiLangName: 'English' },
  { code: 'ja', name: '日本語', nativeLabel: '日本語 (JA)', flag: '🇯🇵', short: 'JA', ttsLang: 'ja-JP', aiLangName: 'Japanese' },
  { code: 'fr', name: 'Français', nativeLabel: 'Français (FR)', flag: '🇫🇷', short: 'FR', ttsLang: 'fr-FR', aiLangName: 'French' },
  { code: 'id', name: 'Indonesia', nativeLabel: 'Indonesia (ID)', flag: '🇮🇩', short: 'ID', ttsLang: 'id-ID', aiLangName: 'Indonesian' },
  { code: 'es', name: 'Español', nativeLabel: 'Español (ES)', flag: '🇪🇸', short: 'ES', ttsLang: 'es-ES', aiLangName: 'Spanish' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('dmdg_sodam_lang') || localStorage.getItem('dmdg_lang') || 'ko';
    return SUPPORTED_LANGUAGES.some((l) => l.code === saved) ? saved : 'ko';
  });

  const setLang = (code) => {
    const valid = SUPPORTED_LANGUAGES.some((l) => l.code === code) ? code : 'ko';
    setLangState(valid);
    localStorage.setItem('dmdg_sodam_lang', valid);
    localStorage.setItem('dmdg_lang', valid);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const t = (key) => {
    const dict = translations[lang] || translations.ko;
    return dict[key] !== undefined ? dict[key] : (translations.ko[key] !== undefined ? translations.ko[key] : key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, currentLang, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
