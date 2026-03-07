import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AlertBoxComponent } from './components/alert-box/alert-box.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertBoxComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnDestroy {
  private static readonly ERROR_ALERT_TIMEOUT_MS = 2000;
  private static readonly ERROR_ALERT_ANIMATION_MS = 300;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private errorAlertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isErrorAlertVisible = signal(false);
  readonly isPasswordVisible = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get usernameControl() {
    return this.loginForm.controls.username;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  get passwordType() {
    return this.isPasswordVisible() ? 'text' : 'password';
  }

  get yearText() {
    return new Date().getFullYear();
  }

  onTogglePassword() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  ngOnDestroy(): void {
    this.clearErrorMessage();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.clearErrorMessage();

    const { username, password } = this.loginForm.getRawValue();

    this.authService
      .login(username, password)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard-home']);
        },
        error: () => {
          this.showErrorMessage('Invalid username or password.');
        },
      });
  }

  private showErrorMessage(message: string): void {
    this.clearErrorAlertTimeout();
    this.errorMessage.set(message);

    requestAnimationFrame(() => this.isErrorAlertVisible.set(true));

    this.errorAlertTimeoutId = setTimeout(() => {
      this.hideErrorMessage();
    }, AuthComponent.ERROR_ALERT_TIMEOUT_MS);
  }

  private clearErrorMessage(): void {
    this.clearErrorAlertTimeout();
    this.isErrorAlertVisible.set(false);
    this.errorMessage.set(null);
  }

  private hideErrorMessage(): void {
    this.clearErrorAlertTimeout();
    this.isErrorAlertVisible.set(false);

    this.errorAlertTimeoutId = setTimeout(() => {
      this.errorMessage.set(null);
      this.errorAlertTimeoutId = null;
    }, AuthComponent.ERROR_ALERT_ANIMATION_MS);
  }

  private clearErrorAlertTimeout(): void {
    if (this.errorAlertTimeoutId) {
      clearTimeout(this.errorAlertTimeoutId);
      this.errorAlertTimeoutId = null;
    }
  }
}
