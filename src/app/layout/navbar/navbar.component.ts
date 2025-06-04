
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    TranslateModule
  ]
})
export class NavbarComponent {
  totalItems = 0;
  constructor(public translate: TranslateService, private cartService: CartService) {}

  ngOnInit(): void {
  this.cartService.getCart().subscribe(cart => {
    this.totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  });
}

  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang); // Persist selected language
  }
}
