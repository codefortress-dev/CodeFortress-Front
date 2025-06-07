import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Producto, SupportedLang } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddToCartButtonComponent } from '../../../core/cart-button/add-to-cart-button.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    AddToCartButtonComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  isLoading = true;
  currentLang: SupportedLang = 'es';
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang as SupportedLang || 'es';
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang as SupportedLang || 'es';
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Cargar productos y categorías
    this.productService.getProductos().subscribe((productos) => {
      this.producto = productos.find(p => p.id === id) || null;
      this.isLoading = false;
    });

    this.productService.getCategorias().subscribe(data => {
      this.categories = data;
    });
  }

  getCategoryName(id: number): string {
    const found = this.categories.find(cat => cat.id === id);
    return found ? (found.nombre[this.currentLang] || found.nombre['es']) : '-';
  }
}
