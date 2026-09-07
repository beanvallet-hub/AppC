import {
  HmsPushEvent,
  HmsPushInstanceId,
  HmsPushMessaging,
  RNRemoteMessage,
} from '@hmscore/react-native-hms-push';
import { AbstractPushProvider } from './AbstractPushProvider';

export class HmsPushProvider extends AbstractPushProvider {
  name: string;

  constructor() {
    super();
    this.name = 'hms';
  }

  isAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  initialize(): void {
    HmsPushEvent.onTokenError(result => {
      console.log(result);
    });

    HmsPushMessaging.setBackgroundMessageHandler(dataMessage => {
      this.displayNotification(dataMessage);
    });
  }

  async getToken(): Promise<string | null> {
    const hasPermission = await this.hasNotificationPermission();

    if (!hasPermission) {
      return null;
    }

    let token = null;

    try {
      token = await HmsPushInstanceId.getToken('');
    } catch (error) {
      console.log('Error: HmsPushProvider - getToken', error);

      throw error;
    }

    return token ? (token as any).result : null;
  }

  async registerToken(): Promise<void> {
    const token = await this.getToken();

    if (token) {
      await this.sendTokenToBackend(token.toString());
    }
  }

  subscribeToTokenRefresh(): any {
    const cleaner = HmsPushEvent.onTokenReceived(async token => {
      await this.sendTokenToBackend(token);
    });

    return () => (cleaner as any).remove();
  }

  subscribeToForegroundMessages(): any {
    const cleaner = HmsPushEvent.onRemoteMessageReceived(event => {
      const RNRemoteMessageObj = new RNRemoteMessage(event.msg);
      const msg = RNRemoteMessageObj.parseMsgAllAttribute(event.msg);

      this.displayNotification(msg);
    });

    return () => (cleaner as any).remove();
  }

  displayNotification(message: any): void {
    console.log("Data message received : ", message);

    super.displayNotification(message);
  }
}
