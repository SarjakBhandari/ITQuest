import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { CreateTaskInput, TaskListResponse, TaskResponse, UpdateTaskInput } from '../../types/task';

export async function listTasks(): Promise<TaskListResponse> {
  return apiRequest<TaskListResponse>(apiEndpoints.tasks, { method: 'GET' });
}

export async function createTask(input: CreateTaskInput): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(apiEndpoints.tasks, {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(apiEndpoints.task(id), {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
}

export async function deleteTask(id: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.task(id), { method: 'DELETE' });
}

export async function snoozeTask(id: string): Promise<TaskResponse> {
  return apiRequest<TaskResponse>(apiEndpoints.snoozeTask(id), { method: 'POST' });
}

export async function sortTasksByPriority(): Promise<TaskListResponse> {
  return apiRequest<TaskListResponse>(apiEndpoints.sortTasksByPriority, { method: 'POST' });
}

export async function enableExamMode(): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.enableExamMode, { method: 'POST' });
}

export async function disableExamMode(): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.disableExamMode, { method: 'POST' });
}
