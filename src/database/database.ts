import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }

  return dbPromise;
}

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('app.db');

  console.log('database initialized');

  return db;
}
