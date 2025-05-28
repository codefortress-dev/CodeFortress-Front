import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobile = false;

  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnInit(): void {
    this.checkScreenWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
}
