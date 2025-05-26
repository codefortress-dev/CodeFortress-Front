import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/product.service';
import { Producto } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriasDisponibles: string[] = [];
  categoriaSeleccionada = 'Todos';
  isLoading = true; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data) => {
      this.productos = data;
      this.categoriasDisponibles = ['Todos', ...new Set(data.map(p => p.categoria))];
      this.filtrarProductos(); 
      this.isLoading = false;
    });
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
  }

  private filtrarProductos() {
    if (this.categoriaSeleccionada === 'Todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        p => p.categoria === this.categoriaSeleccionada
      );
    }
  }
}
