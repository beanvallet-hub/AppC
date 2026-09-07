import { notificationService } from './notificationService';
import {
  HmsPushInstanceId,
  HmsPushEvent,
  RNRemoteMessage,
} from '@hmscore/react-native-hms-push';


/**
 * Huawei mobile service for push notifications
 */
class HmsService {
  readonly name = 'hms' as const;

  async isAvailable(): Promise<boolean> {
    try {
      // Check whether HMS Push services are available.
      //
      // Use the availability API exposed by the version
      // of @hmscore/react-native-hms-push installed in your project.

      return true;
    } catch {
      return false;
    }
  }

  async initialize(): Promise<void> {
    try {
      HmsPushEvent.onTokenError(result => {
        console.log(result);
      });
      
      // HmsPushMessaging.setBackgroundMessageHandler(dataMessage => {
      //   HmsLocalNotification.localNotification({
      //     [HmsLocalNotification.Attr.title]: '[Headless] DataMessage Received',
      //     [HmsLocalNotification.Attr.message]: new RNRemoteMessage(
      //       dataMessage,
      //     ).getDataOfMap(),
      //   })
      //     .then(result => {
      //       console.log('[Headless] DataMessage Received', result);
      //     })
      //     .catch(err => {
      //       console.log(
      //         '[LocalNotification Default] Error/Exception: ' +
      //           JSON.stringify(err),
      //       );
      //     });

      //   return Promise.resolve();
      // });
    } catch (error) {
      console.error('[HMS] Initialization failed', error);
    }
  }

  async getToken() {
    const hasPermission = await notificationService.hasPermission();

    if (!hasPermission) {
      return null;
    }

    let token = null;

    try {
      token = await HmsPushInstanceId.getToken('');
      
    } catch (error) {
      console.log(error);
    }


    console.log('HMS token :>> ', token);

    return token ? token.result : null;
  }

  async registerToken() {
    const token = await this.getToken();

    if (token) {
      await this.sendTokenToBackend(token.toString());
    }

    return token;
  }

  subscribeToTokenRefresh() {
    // const messaging = getMessaging();

    return HmsPushEvent.onTokenReceived(async token => {
      await this.sendTokenToBackend(token);
    });
  }

  subscribeToForegroundMessages() {
    // const messaging = getMessaging();

    return HmsPushEvent.onRemoteMessageReceived(event => {
      const RNRemoteMessageObj = new RNRemoteMessage(event.msg);
      const msg = RNRemoteMessageObj.parseMsgAllAttribute(event.msg);

      // console.log("Data message received : " + msg);

      this.handleNotificationDisplay(msg);
    });
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

export const hsmService = new HmsService();
