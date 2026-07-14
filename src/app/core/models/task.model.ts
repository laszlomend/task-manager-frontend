export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TaskStatus;
  googleEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskListResponse {
  tasks: Task[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
}
