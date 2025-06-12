import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;
  loading: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.error = null;
    this.loading = true;


    this.auth.login(this.email, this.password).subscribe({
      next: user => {
        this.loading = false;
        this.router.navigate(['/admin']);
      },
      error: err => {
        this.loading = false;
        console.error('[LOGIN] Error en autenticación:', err);
        this.error = err.message || 'Error de autenticación';
      }
    });
  }
}

