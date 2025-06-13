import { Component, HostListener, OnInit, signal, inject } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { LeftSidebarComponent } from './layout/left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';
import { AuthService } from './core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgClass, LeftSidebarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'codefortress-front';
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  private snackBar: MatSnackBar = inject(MatSnackBar);
private router: Router = inject(Router);
  private listenersRegistered = false;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    if (user?.permissions?.length) {
      this.auth.restorePermissions(user.permissions);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
  this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);

  // Eventos para resetear actividad
  
    const eventos = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
    eventos.forEach(event => {
      window.addEventListener(event, () => {
        if (this.auth.isAuthenticated()) {
          this.auth.updateActivity();
        }
      });
    });
    this.listenersRegistered = true;
  

  // Verificación periódica para forzar logout si ya expiró
  setInterval(() => {
  //const authenticated = this.auth.isAuthenticated();
  const manualLogout = localStorage.getItem('manual_logout') === 'true';
  if (!this.auth.isAuthenticated() && !manualLogout) {
    this.snackBar.open('Tu sesión ha expirado por inactividad.', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    // ✅ Redirigir solo si ya no estamos en login para evitar loops
    if (this.router.url !== '/login') {
      this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
  window.location.reload();
});

    }
  }
}, 30 * 1000); // Cada 30 segundos
}


  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
