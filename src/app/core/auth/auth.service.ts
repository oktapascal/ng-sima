import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface User {
  id: string;
  username: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal for state management
  readonly currentUser = signal<User | null>(null);

  login(username: string, password: string): Observable<boolean> {
    // Mock login logic
    return of(true).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        this.currentUser.set({
          id: '1',
          username,
          name: 'Demo User',
        });
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
  }
}