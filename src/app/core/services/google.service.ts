import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleAuthUrlResponse } from '../models/google.model';

@Injectable({ providedIn: 'root' })
export class GoogleService {
  private readonly http = inject(HttpClient);

  getAuthUrl(): Observable<GoogleAuthUrlResponse> {
    return this.http.get<GoogleAuthUrlResponse>(`${environment.apiUrl}/auth/google`);
  }
}
