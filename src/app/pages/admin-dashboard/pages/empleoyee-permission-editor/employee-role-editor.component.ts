import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-employee-role-editor',
  standalone: true,
  templateUrl: './employee-role-editor.component.html',
  styleUrls: ['./employee-role-editor.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
    NgxPermissionsModule
  ]
})
export class EmployeeRoleEditorComponent {
  selectedRoles: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { name: string; roles: string[]; allRoles: string[] },
    private dialogRef: MatDialogRef<EmployeeRoleEditorComponent>
  ) {
    this.selectedRoles = [...data.roles];
  }

  save(): void {
    this.dialogRef.close(this.selectedRoles);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
