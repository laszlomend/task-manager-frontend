import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private readonly taskService = inject(TaskService);

  readonly statusLabels = STATUS_LABELS;
  readonly statuses = STATUSES;
  readonly tasks = signal<Task[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly statusFilter = signal<TaskStatus | ''>('');

  constructor() {
    this.loadTasks();
  }

  onFilterChange(value: string): void {
    this.statusFilter.set(value as TaskStatus | '');
    this.loadTasks();
  }

  deleteTask(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) {
      return;
    }

    this.taskService.delete(task.id).subscribe({
      next: () => this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id)),
      error: () => this.errorMessage.set('Failed to delete task.'),
    });
  }

  changeStatus(task: Task, status: string): void {
    const newStatus = status as TaskStatus;
    if (newStatus === task.status) {
      return;
    }

    this.taskService.update(task.id, { status: newStatus }).subscribe({
      next: (updated) =>
        this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t))),
      error: () => this.errorMessage.set('Failed to update task status.'),
    });
  }

  private loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const filter = this.statusFilter() || undefined;
    this.taskService.list(filter).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load tasks.');
        this.isLoading.set(false);
      },
    });
  }
}
