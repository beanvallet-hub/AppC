import "@/api/client";
import { getDatabase } from "@/database/database";
import { migrate } from "@/database/migrations";
import { loadSampleData } from "@/database/sample-data";
import { initializeI18n } from "@/i18n";
import { notificationService } from "@/services/notificationService";


let initializationPromise: Promise<void> | null = null;

export function initializeApp() {
  if (!initializationPromise) {
    initializationPromise = initialize();
  }

  return initializationPromise;
}

async function initialize() {
  const db = getDatabase();

  await migrate(db);

  await loadSampleData(db);

  await initializeI18n();

  await notificationService.initialize();
}
