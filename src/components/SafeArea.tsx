import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SafeArea({
  children,
  top = true,
  bottom = true,
  left = true,
  right = true,
  style = {},
}: React.PropsWithChildren<SafeAreaProps>) {
  const insert = useSafeAreaInsets();
  return (
    <View
      style={[
        style,
        styles.container,
        {
          paddingTop: top ? insert.top : 0,
          paddingBottom: bottom ? insert.bottom : 0,
          paddingLeft: left ? insert.left : 0,
          paddingRight: right ? insert.right : 0,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
