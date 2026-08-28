import { axiosIns } from './client';

const RESOURCE_URL = '/task';

export type Task = {
  id: number;
  name: string;
  isCompleted: boolean;
  isFavorite: boolean;
  remindAt?: string;
};

export async function getTask(taskData: { id: number }) {
  return axiosIns.get<Task>(`${RESOURCE_URL}/${taskData.id}`);
}

export async function getTasks() {
  return axiosIns.get<Task[]>(RESOURCE_URL, { timeout: 2_000 });
}

export async function createTask(taskData: {
  name: string;
  isCompleted: boolean;
  isFavorite: boolean;
}) {
  try {
    return axiosIns.post<Task>(RESOURCE_URL, taskData);
  } catch (error) {
    console.log('Task creationn failed!');

    throw error;
  }
}

export async function updateTask(taskData: Task) {
  try {
    return axiosIns.patch(`${RESOURCE_URL}/${taskData.id}`, taskData);
  } catch (error) {
    console.log('Task update failed!');

    throw error;
  }
}

export async function deleteTask(taskData: {
  id: number;
  name?: string;
  isCompleted?: boolean;
  isFavorite?: boolean;
}) {
  try {
    return axiosIns.delete(`${RESOURCE_URL}/${taskData.id}`);
  } catch (error) {
    console.log('Task deletion failed!');

    throw error;
  }
}
