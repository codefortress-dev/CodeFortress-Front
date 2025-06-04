import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: any = null;

  constructor(
    private http: HttpClient,
    private permissionsService: NgxPermissionsService
  ) {}

  login(email: string, password: string): Observable<any> {
  return this.http.get<any[]>('/mock/users.json').pipe(
    map(users => {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Credenciales inválidas');

      this.currentUser = user;
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(user));
      this.permissionsService.loadPermissions(user.permissions);
      return user;
    })
  );
}

  logout(): void {
    this.currentUser = null;
    localStorage.clear();
    this.permissionsService.flushPermissions();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUser(): any {
    return this.currentUser || JSON.parse(localStorage.getItem('user') || '{}');
  }
}