import { createContext } from 'react';

export type Language = 'en' | 'fr';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isChanging: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
