import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Producto, SupportedLang } from '../../../catalog/models/product.model';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AddToCartButtonComponent } from '../../../core/cart-button/add-to-cart-button.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, TranslateModule, AddToCartButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: any;
  @Input() modoVista: 'detalle' | 'preview' = 'preview';
  @Input() categories: any[] = [];

  lang: string = 'es'; // valor por defecto

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    this.translate.onLangChange.subscribe(event => {
      this.lang = event.lang;
    });
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? (cat.nombre[this.lang] || cat.nombre['es']) : '-';
  }
}