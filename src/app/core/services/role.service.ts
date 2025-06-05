import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly url = '/mock/roles.json';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url);
  }

  getRoleByName(name: string): Observable<Role | undefined> {
    return this.getRoles().pipe(
      map(roles => roles.find(role => role.name === name))
    );
  }
}