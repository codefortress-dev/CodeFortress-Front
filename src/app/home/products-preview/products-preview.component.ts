import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto,SupportedLang } from '../../catalog/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products-preview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TranslateModule,ProductCardComponent],
  templateUrl: './products-preview.component.html',
  styleUrl: './products-preview.component.scss',
})
export class ProductsPreviewComponent implements OnInit {
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  products: Producto[] = [];
  currentLang: SupportedLang = 'es'; // default, overridden on init

  ngOnInit() {
    this.currentLang = this.translate.currentLang as SupportedLang || this.translate.defaultLang as SupportedLang;

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang as SupportedLang;
    });

    this.productService.getProductos().subscribe((all) => {
      this.products = all.slice(0, 4);
    });
  }
}
