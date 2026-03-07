import { Injectable, signal } from '@angular/core';
import { Observable, delay, map, of, tap } from 'rxjs';

export interface User {
  id: string;
  username: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mockCredentials = {
    username: 'admin',
    password: 'password123',
  };

  // Signal for state management
  readonly currentUser = signal<User | null>(null);

  login(username: string, password: string): Observable<boolean> {
    const isCredentialValid =
      username === this.mockCredentials.username && password === this.mockCredentials.password;

    return of(isCredentialValid).pipe(
      delay(1000), // Simulate network delay
      tap((isValid) => {
        if (!isValid) {
          throw new Error('Username atau password salah.');
        }

        this.currentUser.set({
          id: '1',
          username,
          name: 'Demo User',
        });
      }),
      map(() => true)
    );
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
