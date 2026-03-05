import React from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

export const StickyPusher = forwardRef<View, ViewProps>(function StickyPusher(
  { children, style, ...rest },
  ref,
) {
  return (
    <View ref={ref} style={style} collapsable={false} {...rest}>
      {children}
    </View>
  );
});
