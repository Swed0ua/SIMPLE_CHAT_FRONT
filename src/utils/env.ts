import { APP_ENV } from '@env';

export const isDevelopment = APP_ENV === 'development';
export const isProduction = APP_ENV === 'production';
export const isTest = APP_ENV === 'test';

export const getEnvState = () => APP_ENV;
