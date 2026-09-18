import { notificationService } from '@/services/notificationService';

type CreateReminderDto = {
  id: string;
  title: string;
  body: string;
  date: Date;
};

export async function createReminder(reminder: CreateReminderDto) {
  const permissionGranted = await notificationService.hasPermission();

  if (!permissionGranted) {
    const granted = await notificationService.requestPermission();

    if (!granted) {
      // Decide whether UX should still save the reminder.
      return;
    }
  }

  await notificationService.schedule({
    id: `reminder-${reminder.id}`,
    title: reminder.title,
    body: reminder.body,
    date: reminder.date,
  });

  return reminder;
}

export async function updateReminder(reminder: CreateReminderDto) {
  const notificationId = `reminder-${reminder.id}`;

  await notificationService.cancel(notificationId);

  const permissionGranted = await notificationService.hasPermission();

  if (permissionGranted) {
    await notificationService.schedule({
      id: notificationId,
      title: reminder.title,
      body: reminder.body,
      date: reminder.date,
    });
  }
}

export async function deleteReminder(reminderId: number) {
  await notificationService.cancel(`reminder-${reminderId}`);
}
