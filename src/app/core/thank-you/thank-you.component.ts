import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ThankYouComponent {
     orderId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
  }
}
