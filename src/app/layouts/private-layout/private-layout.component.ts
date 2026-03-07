import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './private-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly displayName = computed(() => this.authService.currentUser()?.name ?? 'User');

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}