import { NitroSQLiteConnection, open } from 'react-native-nitro-sqlite';


export async function migrate(db: NitroSQLiteConnection) {
  // await db.execAsync(`
  //   PRAGMA journal_mode = WAL;
  // `);

  // await db.executeAsync(`
  //   DROP TABLE IF EXISTS application;
  // `);

  // await db.executeAsync(`
  //   DROP TABLE IF EXISTS tasks;
  // `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS application (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_init_data_loaded BOOLEAN DEFAULT 0,
      preferences TEXT
    );
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_completed BOOLEAN DEFAULT 0,
      is_favorite BOOLEAN DEFAULT 0
    );
  `);
}
