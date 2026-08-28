import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';

export type LocalNotification = {
  id: string;
  title: string;
  body: string;
  date: Date;
};

const DEFAULT_CHANNEL_ID = 'default';

class NotificationService {
  async initialize() {
    await notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: 'General',
      importance: AndroidImportance.DEFAULT,
    });
  }

  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();

    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  async hasPermission(): Promise<boolean> {
    const settings = await notifee.getNotificationSettings();

    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  async show(notification: Omit<LocalNotification, 'date'>) {
    await notifee.displayNotification({
      id: notification.id,
      title: notification.title,
      body: notification.body,

      android: {
        channelId: DEFAULT_CHANNEL_ID,

        pressAction: {
          id: 'default',
        },
      },

      ios: {
        sound: 'default',
      },
    });
  }

  async schedule(notification: LocalNotification) {
    await notifee.createTriggerNotification(
      {
        id: notification.id,

        title: notification.title,
        body: notification.body,

        android: {
          channelId: DEFAULT_CHANNEL_ID,

          pressAction: {
            id: 'default',
          },
        },

        ios: {
          sound: 'default',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: notification.date.getTime(),
      },
    );
  }

  async cancel(id: string) {
    await notifee.cancelNotification(id);
  }

  async cancelAll() {
    await notifee.cancelAllNotifications();
  }

  async getScheduled() {
    return notifee.getTriggerNotifications();
  }
}

export const notificationService = new NotificationService();
