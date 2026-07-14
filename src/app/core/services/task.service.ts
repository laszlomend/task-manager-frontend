import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateTaskRequest,
  Task,
  TaskListResponse,
  TaskResponse,
  TaskStatus,
  UpdateTaskRequest,
} from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  list(status?: TaskStatus): Observable<Task[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http
      .get<TaskListResponse>(this.baseUrl, { params })
      .pipe(map((response) => response.tasks));
  }

  get(id: string): Observable<Task> {
    return this.http.get<TaskResponse>(`${this.baseUrl}/${id}`).pipe(map((response) => response.task));
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.http
      .post<TaskResponse>(this.baseUrl, request)
      .pipe(map((response) => response.task));
  }

  update(id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.http
      .put<TaskResponse>(`${this.baseUrl}/${id}`, request)
      .pipe(map((response) => response.task));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
