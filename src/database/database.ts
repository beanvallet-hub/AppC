import { open, type DB } from '@op-engineering/op-sqlite';

let dbPromise: DB | null = null;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = open({ name: 'appcDb.sqlite' });
  }

  return dbPromise;
}
