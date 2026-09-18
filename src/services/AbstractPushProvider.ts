import { notificationService } from '@/services/notificationService';

export abstract class AbstractPushProvider {
  abstract readonly name: string;

  abstract isAvailable(): Promise<boolean>;

  abstract initialize(): void;

  abstract getToken(): Promise<string | null>;

  abstract registerToken(): Promise<void>;

  abstract subscribeToTokenRefresh(): any;

  abstract subscribeToForegroundMessages(): any;

  displayNotification(message: { data: { title: string, body: string }}): void {
    const { data } = message;

    if (!data) {
      return;
    }

    const notifData = {
      id: 'remote-fcm-1',
      title: String(data.title) ?? 'Notification',
      body: String(data.body) ?? '',

      data,

      android: {
        channelId: 'default',

        pressAction: {
          id: 'default',
        },
      },

      ios: {
        sound: 'default',
      },
    };

    notificationService.show(notifData);
  }

  hasNotificationPermission() {
    return  notificationService.hasPermission();
  }

  async sendTokenToBackend(token: string) {
    // Your API call
    // await api.post('/devices', {
    //   token,
    //   platform: Platform.OS,
    // });
  }
}
