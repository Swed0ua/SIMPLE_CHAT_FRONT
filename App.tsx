import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { NavigationContainer } from '@react-navigation/native';
import LoadingOverlay from './src/components/LoadingOvarlay';
import { KeyboardProvider } from 'react-native-keyboard-controller';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <LanguageProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <NavigationContainer>
                <ProtectedRoute />
              </NavigationContainer>
              <LoadingOverlay />
            </LanguageProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
