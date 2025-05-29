'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { supabase } from '@/lib/supabase';
import enTranslations from '@/locales/en.json';
import zhTranslations from '@/locales/zh.json';

type Language = 'en' | 'zh';
type TranslationKey = keyof typeof enTranslations;

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, any>) => string;
  availableLanguages: { code: Language; name: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en: enTranslations,
  zh: zhTranslations,
};

const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'zh' as Language, name: '中文' },
];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const { user } = useAuth();
  
  useEffect(() => {
    // Initialize language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('taskflow-language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    } else if (browserLanguage && availableLanguages.some(lang => lang.code === browserLanguage)) {
      setLanguageState(browserLanguage);
      localStorage.setItem('taskflow-language', browserLanguage);
    }
  }, []);
  
  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('taskflow-language', newLanguage);
    
    // Update user preference in Supabase if logged in
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ language: newLanguage })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };
  
  const t = (key: TranslationKey, params?: Record<string, any>): string => {
    let text = translations[language][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\{${paramKey}\}`, 'g'), String(paramValue));
      });
    }
    
    return text;
  };
  
  const value = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };
  
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}