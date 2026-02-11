import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Route, useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { Animated, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getBottomTabItemStyle, getStyle } from './BottomTabStyle';
import { useEffect, useRef } from 'react';
import { bottomTabSpacing } from '../../constants/spacing';
import { useAppDispatch } from '../../store/store';
import { setTabBarHeight } from '../../store/slices/layoutSlice';

const AnimatedView = Animated.createAnimatedComponent(View);

export type BottomTabItemProps = {
  route: Route<string, object | undefined>;
  buildHref: (name: string, params?: object) => string | undefined;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  textColor: string;
  label: string;
  options: BottomTabNavigationOptions;
};

export const BottomTabItem = ({
  route,
  buildHref,
  isFocused,
  onPress,
  onLongPress,
  label,
  options,
}: BottomTabItemProps) => {
  const theme = useTheme();
  const style = getBottomTabItemStyle({ theme: theme.theme });

  const shadowAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const shadowColor = theme.theme.colors.primary[400];

  const iconColor = isFocused
    ? theme.theme.colors.primary[100]
    : theme.theme.colors.primary[50];

  useEffect(() => {
    Animated.spring(shadowAnim, {
      toValue: isFocused ? 1 : 0,
      damping: 8,
      mass: 1,
      useNativeDriver: false,
    }).start();
  }, [isFocused, shadowAnim]);

  return (
    <View style={style.container}>
      <PlatformPressable
        key={route.key}
        href={buildHref(route.name, route.params)}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={style.item}
      >
        <AnimatedView
          style={[
            style.shadow,
            {
              boxShadow: shadowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  `0 16px 0px 0px ${shadowColor}`,
                  `0 16px 34px 22px ${shadowColor}`,
                ],
              }),
            },
          ]}
        />
        {options.tabBarIcon?.({
          focused: isFocused,
          color: iconColor,
          size: bottomTabSpacing.bottomTabIconSize,
        })}
        {options.tabBarShowLabel && (
          <Text style={{ color: iconColor }}>{label}</Text>
        )}
      </PlatformPressable>
    </View>
  );
};

export const BottomTab = ({
  state,
  descriptors,
  navigation,
  insets: _insets,
}: BottomTabBarProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const textColor = theme.theme.colors.text.inverse;
  const { buildHref } = useLinkBuilder();

  const style = getStyle({ theme: theme.theme, insets: _insets });
  return (
    <View
      style={[style.container]}
      onLayout={e => {
        const { height } = e.nativeEvent.layout;
        dispatch(setTabBarHeight(height));
      }}
    >
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
          <BottomTabItem
            key={route.key}
            route={route}
            buildHref={buildHref}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            textColor={textColor}
            label={label}
            options={options}
          />
        );
      })}
    </View>
  );
};
