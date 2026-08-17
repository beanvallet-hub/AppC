import { getDatabase } from '@/database/database';
import { dbRecToJsObj, rowsToJsRecords } from '@/utils/utils';

export type Task = {
    id: number;
    name: string;
    isCompleted: boolean;
    isFavorite: boolean;
};

const booleanColumns = new Set(['is_completed', 'is_favorite']);


export async function getTasks(
): Promise<Task[]> {
    const db = await getDatabase();

    const tasks = await db.getAllAsync<Task>(
        'SELECT * FROM tasks'
    );

    return rowsToJsRecords<Task>(tasks, booleanColumns);
}



export async function createTask(taskData: { name: string, isCompleted: boolean, isFavorite: boolean }
): Promise<Task> {
    try {
        const db = await getDatabase();

        const result = await db.runAsync(
            'INSERT INTO tasks (name, is_completed, is_favorite) VALUES (?, ?, ?)',
            taskData.name, taskData.isCompleted, taskData.isFavorite
        );

        const task = await db.getFirstAsync(
            `
                SELECT *
                FROM tasks
                WHERE id = ?
            `,
            result.lastInsertRowId
        );



        return dbRecToJsObj(task as any, booleanColumns) as Task;
    } catch (error) {
        console.log('Task creationn failed!');

        throw error;
    }
}


export async function updateTask(taskData: Task) {
    try {
        const db = await getDatabase();

        console.log('taskData :>> ', taskData);


        const id = await db.runAsync(
            `UPDATE tasks
                SET name = ?,
                    is_completed = ?,
                    is_favorite = ?
                WHERE id = ?;`,
            taskData.name,
            taskData.isCompleted,
            taskData.isFavorite,
            taskData.id
        );
    } catch (error) {
        console.log('Task update failed!');

        throw error;
    }
}



export async function deleteTask(taskData: {
    id: number, 
    name?: string;
    isCompleted?: boolean;
    isFavorite?: boolean;
}) {
    try {
        const db = await getDatabase();

        const res = await db.runAsync(
            'DELETE FROM tasks WHERE id = ?',
            taskData.id
        );
    } catch (error) {
        console.log('Task deletion failed!');

        throw error;
    }
}
