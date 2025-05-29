import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    RouterModule,
    TranslateModule
  ]
})


export class NavbarComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
constructor(public translate: TranslateService) {}

 changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang); // persistir idioma
  }
  
  toggleDrawer(): void {
    this.drawer.toggle();
  }
}
