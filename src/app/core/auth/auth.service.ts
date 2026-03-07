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
  private static readonly AUTH_STORAGE_KEY = 'ng-sima-auth-user';

  private readonly mockCredentials = {
    username: 'admin',
    password: 'password123',
  };

  // Signal for state management
   readonly currentUser = signal<User | null>(this.getStoredUser());

  login(username: string, password: string): Observable<boolean> {
    const isCredentialValid =
      username === this.mockCredentials.username && password === this.mockCredentials.password;

    return of(isCredentialValid).pipe(
      delay(1000), // Simulate network delay
      tap((isValid) => {
        if (!isValid) {
          throw new Error('Username atau password salah.');
        }

        const user: User = {
          id: '1',
          username,
          name: 'Demo User',
        };

        this.currentUser.set(user);
        this.storeUser(user);
      }),
      map(() => true)
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(AuthService.AUTH_STORAGE_KEY);
  }

  private storeUser(user: User): void {
    localStorage.setItem(AuthService.AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(AuthService.AUTH_STORAGE_KEY);

    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch {
      localStorage.removeItem(AuthService.AUTH_STORAGE_KEY);
      return null;
    }

  }

}
