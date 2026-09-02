import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { notificationService } from './notificationService';

class FcmService {
  async getFcmToken() {
    const hasPermission = await notificationService.hasPermission();

    if (!hasPermission) {
      return null;
    }

    const messaging = getMessaging();
    const token = await getToken(messaging);

    console.log('FCM token :>> ', token);

    return token;
  }

  async registerToken() {
    const token = await this.getFcmToken();

    if (token) {
      await this.sendTokenToBackend(token);
    }

    return token;
  }

  subscribeToTokenRefresh() {
    const messaging = getMessaging();

    return messaging.onTokenRefresh(async token => {
      await this.sendTokenToBackend(token);
    });
  }

  subscribeToForegroundMessages() {
    const messaging = getMessaging();

    return messaging.onMessage(this.handleNotificationDisplay);
  }

  handleNotificationDisplay(remoteMessage: any) {
    const { data } = remoteMessage;

      if (!data) {
        return;
      }

      console.log('notif data :>> ', data);

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

  private async sendTokenToBackend(token: string) {
    // Your API call
    // await api.post('/devices', {
    //   token,
    //   platform: Platform.OS,
    // });
  }
}

export const fcmService = new FcmService();
