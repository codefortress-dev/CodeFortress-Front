import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.scss']
})
export class CallToActionComponent {}
