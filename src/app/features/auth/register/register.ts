import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiErrorResponse, ApiValidationErrorResponse } from '../../../core/models/api-error.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern(/[0-9]/)],
    ],
  });

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService
      .register(email, password)
      .pipe(switchMap(() => this.authService.login(email, password)))
      .subscribe({
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
