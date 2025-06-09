import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user: User;
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, 
            private http: HttpClient,
            private snackBar: MatSnackBar,
          private translate: TranslateService) {  
    this.user = { ...this.authService.getUser() };
  }

  save(): void {
  this.loading = true;
  this.successMessage = '';
  this.errorMessage = '';

  // Simular envío al backend (a futuro se reemplaza por una API real)
  this.http.post('/mock-data/update-profile.json', this.user).pipe(
    delay(500) // Simulación de latencia
  ).subscribe({
    next: () => {
      this.loading = false;
      this.successMessage = 'profile.savedSuccess';
      localStorage.setItem('user', JSON.stringify(this.user)); // persistencia local
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'profile.savedError';
    }
  });
  this.snackBar.open(
  this.translate.instant('profile.updated'),  // Texto multilenguaje si ya tienes traducciones
  'OK',
  { duration: 3000 }
);
}
}
