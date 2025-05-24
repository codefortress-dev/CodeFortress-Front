import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, Producto } from './catalog.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriasDisponibles: string[] = [];
  categoriaSeleccionada = 'Todos';

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getProductos().subscribe((data) => {
      this.productos = data;
      this.categoriasDisponibles = ['Todos', ...new Set(data.map(p => p.categoria))];
      this.filtrarProductos(); // importante
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
