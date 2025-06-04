import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../cart.service';
import { CartItem } from '../models/cart-item.model';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormGroup } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class CheckoutComponent  implements OnInit {
  form!: FormGroup; // declaramos la propiedad sin inicializarla aquí

  cart: CartItem[] = [];
  total = 0;
  enviado = false;

constructor(private fb: FormBuilder, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      proyecto: ['', Validators.required]
    });

    this.cartService.getCart().subscribe(items => {
      this.cart = items;
      this.total = this.cartService.getTotal();
    });
  }

  confirmar(): void {
    if (this.form.invalid || this.cart.length === 0) return;
    const orderId = 'ORD-' + Date.now().toString();
    setTimeout(() => {
       this.cartService.clearCart();
    this.router.navigate(['/thank-you', orderId]);
    }, 1000);
    
  }
}