import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode, ThemeModeSettings } from '../types/theme';
import { availableThemes, lightTheme } from '../constants';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme_mode';

interface ThemeContextProps {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeModeSettings) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const getThemeModeSysColorScheme = (): ThemeMode => {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  };

  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    getThemeModeSysColorScheme(),
  );

  const getThemeData = () => {
    if (themeMode in availableThemes) {
      return availableThemes[themeMode];
    }
    return lightTheme;
  };

  const getThemeModeFromStorage =
    async (): Promise<ThemeModeSettings | null> => {
      const themeModeFromStorage = await AsyncStorage.getItem(
        THEME_STORAGE_KEY,
      );
      return themeModeFromStorage as ThemeModeSettings | null;
    };

  const saveThemeModeToStorage = (mode: ThemeModeSettings) => {
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const setAutomaticThemeMode = async () => {
    // Set the theme mode to automatic
    const themeModeFromStorage = await getThemeModeFromStorage();
    let newThemeMode: ThemeMode;

    if (
      themeModeFromStorage &&
      themeModeFromStorage !== 'auto' &&
      themeModeFromStorage in availableThemes
    ) {
      newThemeMode = themeModeFromStorage;
    } else {
      newThemeMode = getThemeModeSysColorScheme();
    }

    if (newThemeMode !== themeMode) {
      setThemeModeState(newThemeMode);
    }
  };

  const setThemeMode = (mode: ThemeModeSettings) => {
    // Manually set the theme mode state
    saveThemeModeToStorage(mode);
    if (!mode || mode === 'auto' || !(mode in availableThemes)) {
      setThemeModeState(getThemeModeSysColorScheme());
    } else {
      setThemeModeState(mode);
    }
  };

  useEffect(() => {
    setAutomaticThemeMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: getThemeData(),
        themeMode: themeMode,
        setThemeMode: setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
