import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials = [
    {
      quote: 'testimonials.quote1',
      author: 'testimonials.author1',
      position: 'testimonials.position1'
    },
    {
      quote: 'testimonials.quote2',
      author: 'testimonials.author2',
      position: 'testimonials.position2'
    },
    {
      quote: 'testimonials.quote3',
      author: 'testimonials.author3',
      position: 'testimonials.position3'
    }
  ];
}
