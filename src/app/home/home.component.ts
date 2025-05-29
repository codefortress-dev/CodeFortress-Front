import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { ProductsPreviewComponent } from './products-preview/products-preview.component';
import { ProcessComponent } from './process/process.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    ProductsPreviewComponent,
    ProcessComponent,
    TestimonialsComponent,
    CallToActionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
