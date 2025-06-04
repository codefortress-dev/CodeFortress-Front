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

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  isLoading = true;
  currentLang: SupportedLang = 'es';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Determinar el idioma actual
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.currentLang = ['es', 'en'].includes(lang) ? (lang as SupportedLang) : 'es';

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = ['es', 'en'].includes(event.lang) ? (event.lang as SupportedLang) : 'es';
    });

    // Obtener producto por ID
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductos().subscribe((productos) => {
      this.producto = productos.find(p => p.id === id) || null;
      this.isLoading = false;
    });
  }
}
