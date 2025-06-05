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

import { Role } from '../../../../core/models/role.model';
import { Permission } from '../../../../core/models/permission.model';



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
    TranslateModule
  ]
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  allPermissions: Permission[] = [];
  permissionsMap: { [key: string]: string } = {};
  selectedRole: Role | null = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.http.get<Role[]>('/mock-data/roles.json').subscribe(data => {
      this.roles = data;
    });

    this.http.get<Permission[]>('/mock-data/permissions.json').subscribe(perms => {
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

  dialogRef.afterClosed().subscribe((updatedPermissions: string[] | undefined) => {
    if (updatedPermissions) {
      const idx = this.roles.findIndex(r => r.id === role.id);
      if (idx > -1) {
        this.roles[idx].permissions = updatedPermissions;
      }
    }
  });
}


  saveRole(): void {
    if (!this.selectedRole) return;
    const index = this.roles.findIndex(r => r.id === this.selectedRole!.id);
    if (index !== -1) {
      this.roles[index] = { ...this.selectedRole };
    }
    this.selectedRole = null;
  }

  cancelEdit(): void {
    this.selectedRole = null;
  }
}
