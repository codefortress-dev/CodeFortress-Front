import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/product.service';
import { Producto, SupportedLang } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


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
    TranslateModule
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriasDisponibles: string[] = [];
  categoriaSeleccionada: string = '';
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
  this.currentLang = ['es', 'en'].includes(event.lang)
    ? (event.lang as SupportedLang)
    : 'es';
      this.actualizarCategorias();
      this.filtrarProductos();
    });

    this.productService.getProductos().subscribe((data) => {
      this.productos = data;
      this.actualizarCategorias();
      this.filtrarProductos();
      this.isLoading = false;
    });
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }

  private actualizarCategorias() {
    const cats = this.productos.map(p => p.categoria[this.currentLang]);
    this.categoriasDisponibles = ['Todos', ...Array.from(new Set(cats))];
    if (!this.categoriasDisponibles.includes(this.categoriaSeleccionada)) {
      this.categoriaSeleccionada = 'Todos';
    }
  }

  private filtrarProductos() {
    if (this.categoriaSeleccionada === 'Todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        p => p.categoria[this.currentLang] === this.categoriaSeleccionada
      );
    }
  }
}
