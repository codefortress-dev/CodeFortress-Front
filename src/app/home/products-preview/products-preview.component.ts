import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../catalog/models/product.model';
import { ProductService } from '../../core/product.service';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-preview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule,  CurrencyPipe, TranslateModule],
  templateUrl: './products-preview.component.html',
  styleUrl: './products-preview.component.scss',
})
export class ProductsPreviewComponent {
  private productService = inject(ProductService);
  products: Producto[] = [];

  ngOnInit() {
    this.productService.getProductos().subscribe((all) => {
      this.products = all.slice(0, 4); // ← Solo primeros 4
    });
  }
}
