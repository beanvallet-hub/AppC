import { NitroSQLiteConnection, open } from 'react-native-nitro-sqlite';

let dbPromise: NitroSQLiteConnection | null = null;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = open({ name: 'appcDb.sqlite' });
  }

  return dbPromise;
}
