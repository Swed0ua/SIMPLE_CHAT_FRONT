import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { MainTabsNavigation } from './MainTabsNavigation';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigation() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabsNavigation} />
      {/* <MainStack.Screen name="ChatDetails" component={ChatDetails} /> */}
    </MainStack.Navigator>
  );
}
