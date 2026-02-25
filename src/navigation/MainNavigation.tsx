import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { MainTabsNavigation } from './MainTabsNavigation';
import ChatDetailsScreen from '../screens/main/ChatDetailsScreen/ChatDetailsScreen';
import { ROUTES } from './routesConfig';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigation() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name={ROUTES.MainTabs} component={MainTabsNavigation} />
      <MainStack.Screen
        name={ROUTES.ChatDetails}
        component={ChatDetailsScreen}
        options={{ headerShown: true, title: 'Chat Details' }}
      />
    </MainStack.Navigator>
  );
}
