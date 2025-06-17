import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-action-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class ActionSuccessComponent {
  constructor(private router: Router) {}

  navigate(): void {
    this.router.navigate(['/']);
  }
}
