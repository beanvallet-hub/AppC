import { getDatabase } from '../database/database';
import { dbRecToJsObj, rowsToJsRecords } from '../utils/utils';

export type Task = {
    id: number;
    name: string;
    isCompleted: boolean;
    isFavorite: boolean;
};

const booleanColumns = new Set(['is_completed', 'is_favorite']);


export async function getTasks(
): Promise<Task[]> {
    const db = getDatabase();

    const { results } = await db.executeAsync<Task>(
        'SELECT * FROM tasks'
    );

    return rowsToJsRecords<Task>(results as any, booleanColumns);
}



export async function createTask(taskData: { name: string, isCompleted: boolean, isFavorite: boolean }
): Promise<Task> {
    try {
        const db = getDatabase();

        const { insertId  } = await db.executeAsync(
            'INSERT INTO tasks (name, is_completed, is_favorite) VALUES (?, ?, ?)',
            [taskData.name, taskData.isCompleted, taskData.isFavorite]
        );

        if (insertId) {
            const { results } = await db.executeAsync(
                `
                SELECT *
                FROM tasks
                WHERE id = ?
            `,
                [insertId]
            );

            return dbRecToJsObj(results[0], booleanColumns) as Task;
        }
        else {
            throw new Error('Insert failed');
        }

    } catch (error) {
        console.log('Task creationn failed!');

        throw error;
    }
}


export async function updateTask(taskData: Task) {
    try {
        const db = getDatabase();

        await db.executeAsync(
            `UPDATE tasks
                SET name = ?,
                    is_completed = ?,
                    is_favorite = ?
                WHERE id = ?;`,
            [taskData.name,
            taskData.isCompleted,
            taskData.isFavorite,
            taskData.id]
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
        const db = getDatabase();

        await db.executeAsync(
            'DELETE FROM tasks WHERE id = ?',
            [taskData.id]
        );
    } catch (error) {
        console.log('Task deletion failed!');

        throw error;
    }
}

export async function testDb(
) {
    const db = getDatabase();

    const tasks = await db.executeAsync(
        'SELECT 1'
    );

    const i = tasks.rows.item(0);

    return i;
}

