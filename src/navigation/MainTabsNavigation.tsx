import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import ChatsScreen from '../components/ChatsScreen';
import { BottomTab } from '../components/BottomTab/BottomTab';

const MainTabs = createBottomTabNavigator<MainTabParamList>();

export function MainTabsNavigation() {
  return (
    <MainTabs.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Chats"
      tabBar={props => <BottomTab {...props} />}
    >
      <MainTabs.Screen name="Chats" component={ChatsScreen} />
      <MainTabs.Screen name="Contacts" component={ChatsScreen} />
    </MainTabs.Navigator>
  );
}
