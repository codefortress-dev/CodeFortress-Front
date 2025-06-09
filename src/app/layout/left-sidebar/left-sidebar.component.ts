import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
    this.closeSidenav();
  }
}
