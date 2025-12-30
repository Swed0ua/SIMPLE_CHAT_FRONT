import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { languageResources } from '../locales/i18n';
import { createContext, useContext, useEffect, useState } from 'react';
import { getLocales } from 'react-native-localize';

const LANGUAGE_STORAGE_KEY = '@app_language';
const DEFAULT_LANGUAGE = 'en';

type LanguageAvailable = keyof typeof languageResources;
interface LanguageContextProps {
  language: LanguageAvailable;
  setLanguage: (language: LanguageAvailable) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lng, setLng] = useState<LanguageAvailable>(DEFAULT_LANGUAGE);

  const getDeviceAvailableLanguage = (): LanguageAvailable | undefined => {
    const deviceLocales = getLocales();
    for (const locale of deviceLocales) {
      if (locale.languageCode in languageResources) {
        return locale.languageCode as LanguageAvailable;
      }
    }
    return undefined;
  };

  const getLanguageFromStorage = async (): Promise<
    LanguageAvailable | undefined
  > => {
    try {
      const languageFromStorage =
        await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      return languageFromStorage as LanguageAvailable | undefined;
    } catch (error) {
      console.error('Failed to get language from storage:', error);
      return undefined;
    }
  };

  const getLanguage = async (): Promise<LanguageAvailable> => {
    const languageFromStorage = await getLanguageFromStorage();
    if (languageFromStorage && languageFromStorage in languageResources) {
      return languageFromStorage;
    }

    const deviceAvailableLanguage = getDeviceAvailableLanguage();
    if (deviceAvailableLanguage) {
      return deviceAvailableLanguage;
    }

    return DEFAULT_LANGUAGE;
  };

  const saveLanguageToStorage = async (language: LanguageAvailable) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  };

  const setLanguage = async (newLanguage: LanguageAvailable) => {
    if (!(newLanguage in languageResources)) {
      console.warn(`Language "${newLanguage}" is not available`);
      return;
    }
    try {
      await i18n.changeLanguage(newLanguage);
      await saveLanguageToStorage(newLanguage);
      setLng(newLanguage);
    } catch (error) {
      console.error('Failed to set language:', error);
    }
  };

  const initializeLanguage = async (): Promise<void> => {
    try {
      const newLanguage = await getLanguage();
      await i18n.changeLanguage(newLanguage);
      setLng(newLanguage);
    } catch (error) {
      console.error('Failed to initialize language:', error);
    }
  };

  useEffect(() => {
    initializeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language: lng, setLanguage: setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
