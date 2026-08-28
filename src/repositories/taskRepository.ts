import { getDatabase } from '../database/database';
import { dbRecToJsObj, rowsToJsRecords } from '../utils/utils';

export type Task = {
    id: number;
    name: string;
    isCompleted: boolean;
    isFavorite: boolean;
    remindAt?: string;
};

export type CreateTaskDto = {
    name: string;
    isCompleted: boolean;
    isFavorite: boolean;
    remindAt?: string;
};

const booleanColumns = new Set(['is_completed', 'is_favorite']);

export async function getTaskById(
  id: number,
): Promise<Task | null> {
  const db = getDatabase();

  const result = await db.execute(
    `
      SELECT
        *
      FROM tasks
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  if (result.rows.length < 1) {
    return null;
  }

  return result.rows[0] as Task;
}


export async function getTasks(): Promise<Task[]> {
    const db = getDatabase();

    const result = await db.execute(
        'SELECT * FROM tasks'
    );

    return rowsToJsRecords<Task>(result.rows as any, booleanColumns);
}



export async function createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
        const db = getDatabase();

        const result = await db.execute(
            'INSERT INTO tasks (name, is_completed, is_favorite, remind_at) VALUES (?, ?, ?, ?)',
            [taskData.name, taskData.isCompleted, taskData.isFavorite, (taskData.remindAt ?? null)]
        );

        if (result.insertId) {
            const findResult = await db.execute(
                `
                SELECT *
                FROM tasks
                WHERE id = ?
            `,
                [result.insertId]
            );

            return dbRecToJsObj(findResult.rows[0], booleanColumns) as Task;
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

        await db.execute(
            `UPDATE tasks
                SET name = ?,
                    is_completed = ?,
                    is_favorite = ?,
                    remind_at = ?
                WHERE id = ?;`,
            [taskData.name,
            taskData.isCompleted,
            taskData.isFavorite,
            (taskData.remindAt ?? null),
            taskData.id]
        );

        return taskData;
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

        await db.execute(
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

    const tasks = await db.execute(
        'SELECT 1'
    );

    const i = tasks.rows[0];

    return i;
}

