import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import ChatsScreen from '../screens/main/ChatsScreen';
import { BottomTab } from '../components/BottomTab/BottomTab';
import {
  IconHomeFilled,
  IconHome,
  IconContainerFilled,
  IconContainer,
} from '@tabler/icons-react-native';
import { ComponentType } from 'react';
import { MAIN_TABS_ROUTES } from './routesConfig';

const MainTabs = createBottomTabNavigator<MainTabParamList>();

type IconProps = { color: string; size: number };
const renderIcon = (
  focused: boolean,
  color: string,
  size: number,
  Icon: ComponentType<IconProps>,
  IconFilled: ComponentType<IconProps>,
) => {
  const Component = focused ? IconFilled : Icon;
  return <Component color={color} size={size} />;
};

export function MainTabsNavigation() {
  return (
    <MainTabs.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: true }}
      initialRouteName={MAIN_TABS_ROUTES.Chats}
      tabBar={props => <BottomTab {...props} />}
    >
      <MainTabs.Screen
        name={MAIN_TABS_ROUTES.Chats}
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon(focused, color, size, IconHome, IconHomeFilled),
        }}
      />
      <MainTabs.Screen
        name={MAIN_TABS_ROUTES.Contacts}
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon(
              focused,
              color,
              size,
              IconContainer,
              IconContainerFilled,
            ),
        }}
      />
    </MainTabs.Navigator>
  );
}
