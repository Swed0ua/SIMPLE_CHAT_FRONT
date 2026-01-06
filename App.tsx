import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { LanguageProvider } from './src/context/LanguageContext';
import { useEffect } from 'react';
import { getEnvState } from './src/utils/env';

import { SUPABASE_URL } from '@env';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    console.log('SUPABASE_URL', SUPABASE_URL);
    console.log('AppContent', getEnvState());
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <Text>Hello world</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
