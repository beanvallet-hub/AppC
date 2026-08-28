import { type DB } from '@op-engineering/op-sqlite';


export async function migrate(db: DB) {
  // await db.execAsync(`
  //   PRAGMA journal_mode = WAL;
  // `);

  // await db.execute(`
  //   DROP TABLE IF EXISTS application;
  // `);

  // await db.execute(`
  //   DROP TABLE IF EXISTS tasks;
  // `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS application (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_init_data_loaded BOOLEAN DEFAULT 0,
      preferences TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_completed BOOLEAN DEFAULT 0,
      is_favorite BOOLEAN DEFAULT 0,
      remind_at TEXT
    );
  `);
}
