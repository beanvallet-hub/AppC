import { API_URL, APP_ENV, DEBUG } from '@env';

export const env = {
  apiUrl: API_URL ?? '',
  environment: APP_ENV ?? 'development',
  debug: DEBUG === 'true',
};
