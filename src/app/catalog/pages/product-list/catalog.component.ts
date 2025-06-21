import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Producto, SupportedLang } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    TranslateModule,
    ProductCardComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: any[] = [];
  categoriasDisponibles: { id: number, nombre: string }[] = [];
  categoriaSeleccionada: number | 'Todos' = 'Todos';
  isLoading = true;
  currentLang: SupportedLang = 'es';

  constructor(
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.currentLang = ['es', 'en'].includes(lang) ? (lang as SupportedLang) : 'es';

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = ['es', 'en'].includes(event.lang) ? (event.lang as SupportedLang) : 'es';
      this.actualizarCategorias();
      this.filtrarProductos();
    });

    this.productService.getProductos().subscribe((productos) => {
      this.productos = productos;

      this.productService.getCategorias().subscribe(categorias => {
        this.categorias = categorias;
        this.actualizarCategorias();
        this.filtrarProductos();
        this.isLoading = false;
      });
    });
  }

  onCategoriaChange(categoriaId: number | 'Todos') {
    this.categoriaSeleccionada = categoriaId;
    this.filtrarProductos();
  }

  public actualizarCategorias() {
    this.categoriasDisponibles = [
      { id: 'Todos', nombre: this.translate.instant('catalog.all') },
      ...this.categorias.map(c => ({
        id: c.id,
        nombre: c.nombre[this.currentLang] || c.nombre['es']
      }))
    ];

    if (!this.categoriasDisponibles.find(c => c.id === this.categoriaSeleccionada)) {
      this.categoriaSeleccionada = 'Todos';
    }
  }

  public filtrarProductos() {
    if (this.categoriaSeleccionada === 'Todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        p => p.categoriaId === this.categoriaSeleccionada
      );
    }
  }
}
