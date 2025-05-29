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
  isLoaded: boolean; // 新增加载状态
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

// 尝试从localStorage获取初始语言
function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('taskflow-language') as Language;
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
  }
  return 'en'; // 默认英文
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // 使用函数获取初始语言
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // 只处理浏览器语言首选项，因为localStorage已经在初始状态处理了
    const browserLanguage = navigator.language.split('-')[0] as Language;
    
    // 如果没有localStorage中的语言设置，但有匹配的浏览器语言设置
    if (!localStorage.getItem('taskflow-language') && 
        browserLanguage && 
        availableLanguages.some(lang => lang.code === browserLanguage)) {
      setLanguageState(browserLanguage);
      localStorage.setItem('taskflow-language', browserLanguage);
    }
    
    // 标记语言已加载完成
    setIsLoaded(true);
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
    isLoaded, // 提供加载状态
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