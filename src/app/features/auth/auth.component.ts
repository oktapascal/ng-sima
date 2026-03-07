import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
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

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.getRawValue();

    this.authService
      .login(username, password)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Login successful');
        },
        error: () => {
          this.errorMessage.set('Invalid username or password.');
        },
      });
  }
}
