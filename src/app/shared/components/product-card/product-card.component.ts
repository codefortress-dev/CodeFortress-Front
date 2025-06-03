import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Producto, SupportedLang } from '../../../catalog/models/product.model';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  /* @Input() producto!: Producto;
  @Input() currentLang: SupportedLang = 'es'; */
  @Input() product!: Producto;
  @Input() lang: 'es' | 'en' = 'es';
  @Input() modoVista: 'preview' | 'detalle' = 'detalle';
}
