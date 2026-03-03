import React, { ReactNode } from 'react';

export type AppGateProps = {
  /** When all values are true, the children are displayed, otherwise the placeholder. */
  ready: Record<string, boolean>;
  placeholder: ReactNode;
  children: ReactNode;
};

export function AppGate({ ready, placeholder, children }: AppGateProps) {
  const allReady =
    Object.keys(ready).length > 0 && Object.values(ready).every(Boolean);

  return allReady ? <>{children}</> : <>{placeholder}</>;
}

export default AppGate;
