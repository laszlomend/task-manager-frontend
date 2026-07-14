import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/task-list/task-list').then((m) => m.TaskList),
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
  },
  { path: '**', redirectTo: 'tasks' },
];
