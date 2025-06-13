import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { User } from '../models/user.model';

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private permissionsService: NgxPermissionsService
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>('/mock-data/users.json').pipe(
      delay(300),
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Credenciales inválidas');

        this.currentUser = user;
        const now = Date.now();

        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('last_activity', now.toString());

        this.permissionsService.loadPermissions(user.permissions || []);
        return user;
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('last_activity');
    localStorage.setItem('manual_logout', 'true');
    this.permissionsService.flushPermissions();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    const lastActivity = localStorage.getItem('last_activity');

    if (!token || !user || !lastActivity) {
      this.logout();
      return false;
    }

    const now = Date.now();
    const last = parseInt(lastActivity, 10);

    if (now - last > INACTIVITY_LIMIT_MS) {
      this.logout();
      return false;
    }

    // actualizar tiempo de actividad por cada validación exitosa
    localStorage.setItem('last_activity', now.toString());
    return true;
  }

  getUser(): any {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  restorePermissions(permissions: string[]): void {
    this.permissionsService.loadPermissions(permissions);
  }

  updateActivity(): void {
    // Llama esto desde eventos de usuario o interceptores
    localStorage.setItem('last_activity', Date.now().toString());
  }
}
