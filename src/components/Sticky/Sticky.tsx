import React, { RefObject, useEffect, useRef, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { getStickyTranslateY, type StickTo } from '../../utils/stickyUtils';
import { useStickyScroll } from '../../context/StickyScrollContext';

type StickyProps = {
  children: React.ReactNode;
  stickTo: StickTo;
  pusherRef?: RefObject<View | null>;
  style?: ViewStyle;
};

export const Sticky = ({
  children,
  stickTo,
  pusherRef,
  style,
}: StickyProps) => {
  const ctx = useStickyScroll();
  const [translateY, setTranslateY] = useState(0);
  const selfRef = React.useRef<View>(null);
  const recalcGenRef = useRef(0);

  const recalc = () => {
    const sticky = selfRef.current;
    recalcGenRef.current += 1;
    const myGen = recalcGenRef.current;
    if (!sticky) return;

    sticky.measureInWindow((_x, naturalY, _w, h) => {
      if (!ctx) return;
      const viewportTop = ctx.viewportTop;
      const viewportBottom = ctx.viewportBottom || naturalY + h + 800;
      let wrapperTop = naturalY;
      let wrapperBottom = naturalY + h;
      let pusherTop: number | null = null;

      // console.log('naturalY : ', naturalY);
      // console.log('pusherRef : ', pusherRef?.current);

      const apply = (py: number | null = null, pusherBottom?: number) => {
        if (py != null) {
          pusherTop = py;
          wrapperTop = Math.min(wrapperTop, py);
        }
        if (pusherBottom != null)
          wrapperBottom = Math.max(wrapperBottom, pusherBottom);
        const ty = getStickyTranslateY(
          naturalY,
          h,
          viewportTop,
          viewportBottom,
          stickTo,
          pusherTop,
          wrapperTop,
          wrapperBottom,
        );
        console.log('data to calculate translateY : ', {
          naturalY,
          h,
          viewportTop,
          viewportBottom,
          stickTo,
          pusherTop,
          wrapperTop,
          wrapperBottom,
        });
        const roundedTy = Math.trunc(ty * 1000) / 1000;
        console.log('roundedTy : ', roundedTy);
        if (myGen !== recalcGenRef.current) return;
        setTranslateY(roundedTy);
      };

      if (pusherRef?.current) {
        pusherRef.current.measureInWindow((_px, py, _pw, ph) => {
          apply(py, py + ph);
        });
      } else {
        apply();
      }
    });
  };

  useEffect(() => {
    recalc();
  }, [ctx?.scrollY, ctx?.viewportTop, ctx?.viewportBottom, stickTo, pusherRef]);
  return (
    <View
      ref={selfRef}
      style={[style, { transform: [{ translateY }] }]}
      collapsable={false}
    >
      {children}
    </View>
  );
};
