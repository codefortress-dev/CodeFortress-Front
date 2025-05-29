import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent {
steps = [
  { icon: 'search', title: 'process.step1.title', description: 'process.step1.desc' },
  { icon: 'build', title: 'process.step2.title', description: 'process.step2.desc' },
  { icon: 'rocket_launch', title: 'process.step3.title', description: 'process.step3.desc' }
];
}
