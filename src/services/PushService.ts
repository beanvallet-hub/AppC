import { Platform } from 'react-native';
import { getUtils } from '@react-native-firebase/app';
import { AbstractPushProvider } from './AbstractPushProvider';
import { FcmPushProvider } from './FcmPushProvider';
import { HmsPushProvider } from './HmsPushProvider';

class PushService extends AbstractPushProvider {
  name: string;
  private provider: AbstractPushProvider | null;

  constructor() {
    super();

    this.name = 'default';
    this.provider = null;
  }

  async initialize(): Promise<void> {
    this.getPushProvider().then(provider => {
      this.provider = provider;

      console.log('♫♫♫ Using Push Provider: ', provider.name);

      provider.initialize();
    });
  }

  isAvailable(): Promise<boolean> {
    if (this.provider) {
      return this.provider.isAvailable();
    }

    throw new Error(
      'Provider not set. Did you forget to initialize the push provider',
    );
  }

  getToken(): Promise<string | null> {
    if (this.provider) {
      return this.provider.getToken();
    }
    throw new Error(
      'Provider not set. Did you forget to initialize the push provider',
    );
  }

  registerToken(): Promise<void> {
    if (this.provider) {
      return this.provider.registerToken();
    }
    throw new Error(
      'Provider not set. Did you forget to initialize the push provider',
    );
  }

  subscribeToTokenRefresh(): any {
    if (this.provider) {
      return this.provider.subscribeToTokenRefresh();
    }
    throw new Error(
      'Provider not set. Did you forget to initialize the push provider',
    );
  }

  subscribeToForegroundMessages(): any {
    if (this.provider) {
      return this.provider.subscribeToForegroundMessages();
    }

    throw new Error(
      'Provider not set. Did you forget to initialize the push provider',
    );
  }

  async getPushProvider() {
    if (Platform.OS !== 'android') {
      return new FcmPushProvider();
    }

    const { isAvailable } = await getUtils().getPlayServicesStatus();

    if (isAvailable) {
      console.log('Play service available ****');

      return new FcmPushProvider();
    }

    console.log('Play service not available !!!!');

    return new HmsPushProvider();
  }
}

export const pushService = new PushService();
