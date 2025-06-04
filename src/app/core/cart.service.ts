import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'cart_items';
  private readonly items$ = new BehaviorSubject<CartItem[]>(this.loadCart());

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.items$.next(items);
  }

  getCart(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  addToCart(item: CartItem) {
  const items = this.loadCart();
  const index = items.findIndex(p => p.productId === item.productId);

  if (index >= 0) {
    items[index].cantidad += item.cantidad;

    if (items[index].cantidad <= 0) {
      items.splice(index, 1); // si llega a 0, se elimina
    }
  } else if (item.cantidad > 0) {
    items.push(item);
  }

  this.saveCart(items);
}


  removeFromCart(productId: number) {
    const items = this.loadCart().filter(p => p.productId !== productId);
    this.saveCart(items);
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.loadCart().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }
}
