import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthenticatedUser,
  LoginResponse,
  Me,
  MeResponse,
  RefreshResponse,
  RegisterResponse,
} from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'tma_access_token';
const REFRESH_TOKEN_KEY = 'tma_refresh_token';
const USER_KEY = 'tma_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly userSignal = signal<AuthenticatedUser | null>(this.readUserFromStorage());
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  register(email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((response) => this.storeSession(response)));
  }

  refresh(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((response) => localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken)));
  }

  me(): Observable<Me> {
    return this.http
      .get<MeResponse>(`${environment.apiUrl}/auth/me`)
      .pipe(map((response) => response.user));
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private storeSession(response: LoginResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.userSignal.set(response.user);
  }

  private readUserFromStorage(): AuthenticatedUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      return null;
    }
  }
}
