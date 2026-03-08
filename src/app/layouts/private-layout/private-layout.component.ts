import { ChangeDetectionStrategy, Component, HostListener,computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './private-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly isSidebarOpen = signal(true);
  readonly isUserMenuOpen = signal(false);
  readonly isTransactionMenuOpen = signal(true);
  readonly isReportMenuOpen = signal(false);

  readonly displayName = computed(() => this.authService.currentUser()?.name ?? 'User');

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  toggleTransactionMenu(): void {
    this.isTransactionMenuOpen.update((isOpen) => !isOpen);
  }

  toggleReportMenu(): void {
    this.isReportMenuOpen.update((isOpen) => !isOpen);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target

    if(!(target instanceof HTMLElement)) {
      return;
    }

    if(target.closest('[data-user-dropdown]')) {
      return;
    }

    this.isUserMenuOpen.set(false);

  }
  
}