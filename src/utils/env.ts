import { APP_ENV } from '@env';

type Environments = 'development' | 'production' | 'test';

const getEnviroments = (): Environments => {
  if (APP_ENV) {
    return APP_ENV as Environments;
  }

  return __DEV__ ? 'development' : 'production';
};

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';
export const isTest = APP_ENV === 'test';

export const getEnvState = () => APP_ENV;
