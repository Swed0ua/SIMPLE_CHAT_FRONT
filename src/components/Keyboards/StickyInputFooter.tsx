import { ReactNode } from 'react';
import { KeyboardSpacer } from './KeyboardSpacer';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

type StickyInputFooterProps = {
  children: ReactNode;
  bottomInset?: number;
};

export function StickyInputFooter({
  children,
  bottomInset = 0,
}: StickyInputFooterProps) {
  const keyboardHeight = useKeyboardHeight();

  return (
    <>
      <KeyboardSpacer height={keyboardHeight} bottomInset={bottomInset} />
      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: bottomInset,
        }}
      >
        {children}
      </KeyboardStickyView>
    </>
  );
}
