import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-action-error',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ActionErrorComponent {
  constructor(private router: Router,
                private location: Location
  ) {}

  navigate(): void {
    if (window.history.length > 1) {
    this.location.back();
  } else {
    this.router.navigate(['/']); // o a donde desees redirigir por defecto
  }
}
}
