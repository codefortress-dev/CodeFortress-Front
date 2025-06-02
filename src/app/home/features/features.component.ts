import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-features',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {}
