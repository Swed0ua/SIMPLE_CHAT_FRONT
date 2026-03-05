import { createContext, useCallback, useContext, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type StickyScrollContextValue = {
  scrollY: number;
  viewportTop: number;
  viewportBottom: number;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const StickyScrollContext = createContext<StickyScrollContextValue | null>(
  null,
);

export const StickyScrollProvider = ({
  children,
  viewportTop = 0,
  viewportBottom = 0,
}: {
  children: React.ReactNode;
  viewportTop?: number;
  viewportBottom?: number;
}) => {
  const [scrollY, setScrollY] = useState(0);
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // console.log('onScroll', e.nativeEvent.contentOffset.y);
    setScrollY(e.nativeEvent.contentOffset.y);
  }, []);
  const value: StickyScrollContextValue = {
    scrollY,
    viewportTop,
    viewportBottom,
    onScroll,
  };
  return (
    <StickyScrollContext.Provider value={value}>
      {children}
    </StickyScrollContext.Provider>
  );
};

export function useStickyScroll() {
  return useContext(StickyScrollContext);
}
