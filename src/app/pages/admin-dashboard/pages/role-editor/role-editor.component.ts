import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { Permission } from '../../../../core/models/permission.model';

@Component({
  selector: 'app-role-editor',
  standalone: true,
  templateUrl: './role-editor.component.html',
  styleUrls: ['./role-editor.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectionList,
    MatListOption,
    TranslateModule
  ]
})
export class RoleEditorComponent {
  roleName: string;
  rolePermissions: string[];
  allPermissions: Permission[];
  permissionsMap: { [key: string]: string } = {};

  constructor(
    private dialogRef: MatDialogRef<RoleEditorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; permissions: string[]; all: Permission[]; lang: string }
  ) {
    this.roleName = data.name;
    this.rolePermissions = [...data.permissions];
    this.allPermissions = data.all;
    this.permissionsMap = Object.fromEntries(
      this.allPermissions.map(p => [p.code, p[data.lang as 'es' | 'en'] || p.code])
    );
  }

  togglePermission(code: string): void {
    if (this.rolePermissions.includes(code)) {
      this.rolePermissions = this.rolePermissions.filter(p => p !== code);
    } else {
      this.rolePermissions.push(code);
    }
  }

  save(): void {
    this.dialogRef.close(this.rolePermissions);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
