import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Me } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { GoogleService } from '../../core/services/google.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly authService = inject(AuthService);
  private readonly googleService = inject(GoogleService);
  private readonly route = inject(ActivatedRoute);

  readonly me = signal<Me | null>(null);
  readonly isLoading = signal(true);
  readonly isConnecting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('googleConnected') === 'true') {
      this.successMessage.set('Google Calendar connected successfully.');
    }
    const googleError = params.get('googleError');
    if (googleError) {
      this.errorMessage.set(googleError);
    }

    this.loadMe();
  }

  connectGoogleCalendar(): void {
    this.isConnecting.set(true);
    this.errorMessage.set(null);

    this.googleService.getAuthUrl().subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: () => {
        this.isConnecting.set(false);
        this.errorMessage.set('Failed to start the Google connection. Please try again.');
      },
    });
  }

  private loadMe(): void {
    this.authService.me().subscribe({
      next: (me) => {
        this.me.set(me);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load your profile.');
        this.isLoading.set(false);
      },
    });
  }
}
