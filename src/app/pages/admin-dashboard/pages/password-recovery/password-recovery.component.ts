import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  email: string = '';
  message: string | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  recover(): void {
    this.message = null;
    this.error = null;
    this.loading = true;

    this.http.get<User[]>('/mock-data/users.json').pipe(
      delay(300),
      switchMap(users => {
        const exists = users.some(user => user.email === this.email);
        if (exists) {
          //return this.http.post('/mock-data/password-recovery', { email: this.email }).pipe(delay(600));
          return of({ success: true }).pipe(delay(600));
        } else {
          throw new Error('Email not found');
        }
      })
    ).subscribe({
      next: () => {
        this.message = 'login.recoverySuccess';
        this.loading = false;
      },
      error: () => {
        this.error = 'login.recoveryError';
        this.loading = false;
      }
    });
  }
}
