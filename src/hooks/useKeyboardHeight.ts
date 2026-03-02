import { useState } from 'react';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { runOnJS } from 'react-native-worklets';

export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useKeyboardHandler({
    onMove: e => {
      'worklet';
      runOnJS(setHeight)(e.height);
    },
    onEnd: e => {
      'worklet';
      runOnJS(setHeight)(e.height);
    },
  });

  return height;
}
