import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MainStack = createNativeStackNavigator();

export function MainNavigation() {
  return <MainStack.Navigator></MainStack.Navigator>;
}
