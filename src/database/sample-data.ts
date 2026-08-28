import { NitroSQLiteConnection } from 'react-native-nitro-sqlite';

const tasks = [
    { id: 1, name: 'task 1', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 2, name: 'task 2', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 3, name: 'task 3', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 4, name: 'task 4', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 5, name: 'task 5', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 6, name: 'task 6', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 7, name: 'task 7', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 8, name: 'task 8', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 9, name: 'task 9', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 10, name: 'task 10', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 11, name: 'task 11', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 12, name: 'task 12', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 13, name: 'task 13', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 14, name: 'task 14', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 15, name: 'task 15', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 16, name: 'task 16', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 17, name: 'task 17', isCompleted: false, isFavorite: false, remindAt: null },
    { id: 18, name: 'task 18', isCompleted: false, isFavorite: false, remindAt: null },
];


export async function loadSampleData(db: NitroSQLiteConnection) {
    // await db.executeAsync(
    //     'DELETE FROM application'
    // );

    // await db.executeAsync(
    //     'DELETE FROM tasks'
    // );

    const { results } = await db.executeAsync(
        'SELECT * FROM application limit 1'
    );

    const hasAppRec = results.length > 0;
    const dataLoaded = hasAppRec && (results[0])?.is_init_data_loaded;

    if (!dataLoaded) {
        await db.executeAsync(
            `DELETE FROM tasks;
             UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tasks';`,
        );

        await db.executeAsync(
            'INSERT OR IGNORE INTO application (id, name, is_init_data_loaded, preferences) VALUES (?, ?, ?, ?)',
            [1, 'AppA', 0, '{"language":"en","theme":"light"}']
        );

        const statement = 'INSERT INTO tasks (id, name, is_completed, is_favorite, remind_at) VALUES (?, ?, ?, ?, ?)';

        for (const task of tasks) {
            await db.executeAsync(statement, [task.id, task.name, task.isCompleted, task.isFavorite, task.remindAt]);
        }
        
        await db.executeAsync(`
            UPDATE application
            SET is_init_data_loaded = ?
            WHERE id = ?
            `,
            [1, 1]
        );
    }
}
