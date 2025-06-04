import { Component, Input } from '@angular/core';
import { CartService } from '../cart.service';
import { CartItem } from '../models/cart-item.model'
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-add-to-cart-button',
  templateUrl: 'add-to-cart-button.component.html',
  styleUrls: ['add-to-cart-button.component.scss'],
  imports: [TranslateModule, MatIconModule]
})
export class AddToCartButtonComponent {
  @Input() productId!: number;
  @Input() nombre!: string;
  @Input() precio!: number;
  @Input() imagen?: string;

  constructor(private cartService: CartService) {}

  agregarAlCarrito() {
    const item: CartItem = {
      productId: this.productId,
      nombre: this.nombre,
      precio: this.precio,
      cantidad: 1,
      imagen: this.imagen
    };

    this.cartService.addToCart(item);
  }
}
