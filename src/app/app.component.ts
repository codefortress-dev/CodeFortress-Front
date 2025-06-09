import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { LeftSidebarComponent } from './layout/left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NgIf, NgClass, LeftSidebarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'codefortress-front';
 isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  constructor(private auth: AuthService) {
  const user = this.auth.getUser();
  if (user?.permissions?.length) {
    this.auth.restorePermissions(user.permissions);
  }
}
  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
