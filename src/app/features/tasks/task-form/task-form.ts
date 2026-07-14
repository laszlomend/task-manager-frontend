import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiErrorResponse, ApiValidationErrorResponse } from '../../../core/models/api-error.model';
import { TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly taskId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = this.taskId !== null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    dueDate: [''],
    status: ['TODO' as TaskStatus],
  });

  readonly isLoading = signal(this.isEditMode);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    if (this.taskId) {
      this.taskService.get(this.taskId).subscribe({
        next: (task) => {
          this.form.patchValue({
            title: task.title,
            description: task.description ?? '',
            dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
            status: task.status,
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load task.');
          this.isLoading.set(false);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { title, description, dueDate, status } = this.form.getRawValue();
    const request = {
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status,
    };

    const save$ = this.isEditMode
      ? this.taskService.update(this.taskId!, request)
      : this.taskService.create(request);

    save$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.extractErrorMessage(error));
      },
    });
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorResponse | ApiValidationErrorResponse | undefined;
      if (body && 'details' in body && body.details.length > 0) {
        return body.details.map((detail) => detail.message).join(' ');
      }
      if (body?.error) {
        return body.error;
      }
    }
    return 'Something went wrong. Please try again.';
  }
}
