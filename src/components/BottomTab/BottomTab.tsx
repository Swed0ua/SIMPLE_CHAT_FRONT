import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/spacing';
import { getStyle } from './BottomTabStyle';

export const BottomTab = ({
  state,
  descriptors,
  navigation,
  insets: _insets,
}: BottomTabBarProps) => {
  const theme = useTheme();
  const textColor = theme.theme.colors.text.inverse;
  const { buildHref } = useLinkBuilder();

  const style = getStyle({ theme: theme.theme, insets: _insets });
  return (
    <View style={[style.container]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // @ts-ignore
        const label: string =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? textColor : 'red' }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};
