import { getDatabase } from "./database/database";
import { migrate } from "./database/migrations";
// import { getAxios } from "./api/client";
import { loadSampleData } from "./database/sample-data";


let initializationPromise: Promise<void> | null = null;

export function initializeApp() {
  if (!initializationPromise) {
    initializationPromise = initialize();
  }

  return initializationPromise;
}

async function initialize() {
  const db = await getDatabase();

  // await migrate(db);

  // await loadSampleData(db);

  // getAxios();
}
