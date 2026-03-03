import React from 'react';
import { AppGate } from './AppGate';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import { useAppSelector } from '../../../store/store';

type AppGateWithAuthProps = {
  children?: React.ReactNode;
};

export function AppGateWithAuth({ children }: AppGateWithAuthProps) {
  const isAuthLoading = useAppSelector(s => s.auth.isAuthLoading);

  console.log('isAuthLoading', isAuthLoading);

  return (
    <AppGate
      ready={{ auth: !isAuthLoading }}
      placeholder={<LoadingPlaceholder />}
    >
      {children ?? <></>}
    </AppGate>
  );
}

export default AppGateWithAuth;
