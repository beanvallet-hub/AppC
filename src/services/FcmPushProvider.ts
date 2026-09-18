import {
  getMessaging,
  Messaging,
  getToken as fcmGetToken,
  isSupported
} from '@react-native-firebase/messaging';
import { AbstractPushProvider } from '@/services/AbstractPushProvider';

export class FcmPushProvider extends AbstractPushProvider {
  name: string;
  private fcmInstance: Messaging;

  constructor() {
    super();

    this.name = 'fcm';
    this.fcmInstance = getMessaging();
  }

  isAvailable(): Promise<boolean> {
    return isSupported(this.fcmInstance);
  }

  initialize(): void {
    this.fcmInstance.setBackgroundMessageHandler(async remoteMessage => {
      this.displayNotification(remoteMessage);
    });
  }

  async getToken(): Promise<string | null> {
    const hasPermission = await this.hasNotificationPermission();

    if (!hasPermission) {
      return null;
    }

    let token = null;

    try {
      token = await fcmGetToken(this.fcmInstance);
    } catch (error) {
      console.log('Error: FcmPushProvider - getToken', error);

      throw error;
    }

    return token;
  }

  async registerToken(): Promise<void> {
    const token = await this.getToken();

    if (token) {
      await super.sendTokenToBackend(token);
    }
  }

  subscribeToTokenRefresh(): any {
    const cleaner = this.fcmInstance.onTokenRefresh(async token => {
      await super.sendTokenToBackend(token);
    });

    return cleaner as any;
  }

  subscribeToForegroundMessages(): any {
    const cleaner = this.fcmInstance.onMessage(this.displayNotification);

    return cleaner as any;
  }

  displayNotification(message: any): void {
    super.displayNotification(message);
  }
}
