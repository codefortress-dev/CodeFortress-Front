import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { RoleEditorComponent } from '../role-editor/role-editor.component';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { Role } from '../../../../core/models/role.model';
import { Permission } from '../../../../core/models/permission.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatListOption,
    MatSelectionList,
    TranslateModule,
    NgxPermissionsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  allPermissions: Permission[] = [];
  permissionsMap: { [key: string]: string } = {};
  selectedRole: Role | null = null;
  newRoleName: string = '';
  newRolePermissions: string[] = [];
  nextId = 1000;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private dialog: MatDialog,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this.http.get<Role[]>('https://mastermindsit.github.io/mock-api/roles.json').subscribe(data => {
      this.roles = data;
    });

    this.http.get<Permission[]>('https://mastermindsit.github.io/mock-api/permissions.json').subscribe(perms => {
      this.allPermissions = perms;
      const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
      this.permissionsMap = Object.fromEntries(
        perms.map(p => [p.code, p[lang as 'es' | 'en'] ?? p.code])
      );
    });
  }

  getRoleDescription(role: Role): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    return role.description?.[lang as 'es' | 'en'] ?? '';
  }

  editRole(role: Role): void {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    const dialogRef = this.dialog.open(RoleEditorComponent, {
      data: {
        name: role.name,
        permissions: role.permissions,
        all: this.allPermissions,
        lang
      }
    });

    dialogRef.afterClosed().subscribe((result: { name: string; permissions: string[] } | undefined) => {
      if (result) {
        const idx = this.roles.findIndex(r => r.id === role.id);
        if (idx > -1) {
          this.roles[idx].name = result.name;
          this.roles[idx].permissions = result.permissions;
        }
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissionsService.getPermissions()[permission] !== undefined;
  }

  createRole(): void {
    if (!this.newRoleName.trim() || this.newRolePermissions.length === 0) return;
    const newRole: Role = {
      id: this.nextId++,
      name: this.newRoleName,
      permissions: this.newRolePermissions,
       description: {
    es: '',
    en: ''
  }
    };
    this.roles.push(newRole);
    this.newRoleName = '';
    this.newRolePermissions = [];
  }

  toggleNewPermission(code: string): void {
    const idx = this.newRolePermissions.indexOf(code);
    if (idx > -1) this.newRolePermissions.splice(idx, 1);
    else this.newRolePermissions.push(code);
  }
}