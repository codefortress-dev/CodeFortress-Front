import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { CartItem } from '../models/cart-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule, TranslateModule, MatIconModule]
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cart = items;
      this.total = this.cartService.getTotal();
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
  increase(item: CartItem) {
  this.cartService.addToCart({
    ...item,
    cantidad: 1 // suma 1 al actual
  });
  this.actualizarTotal();
}

decrease(item: CartItem) {
  if (item.cantidad > 1) {
    this.cartService.addToCart({
      ...item,
      cantidad: -1 // resta 1 al actual
    });
  } else {
    this.removeItem(item.productId);
  }
  this.actualizarTotal();
}




private actualizarTotal() {
  this.total = this.cartService.getTotal();
}

}
