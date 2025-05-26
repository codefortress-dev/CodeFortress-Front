import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogService, Producto } from '../catalog.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, MatProgressSpinnerModule,],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getProductos().subscribe((productos) => {
      this.producto = productos.find(p => p.id === id) || null;
      this.isLoading = false;
    });
  }
}
