import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../../core/models/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeRoleEditorComponent } from '../empleoyee-permission-editor/employee-role-editor.component';
import { Role } from '../../../../core/models/role.model';


import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-employees',
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  allRoles: Role[] = [];

  

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.http.get<Role[]>('/mock-data/roles.json').subscribe((roles) => {
      this.allRoles = roles;
      console.log('Roles cargados:', this.allRoles);

      this.http.get<any[]>('/mock-data/employees.json').subscribe((rawEmployees) => {
  this.employees = rawEmployees.map(emp => ({
    ...emp,
    roles: (emp.roles ?? []) // ✅ fallback si emp.roles es undefined
      .map((name: string) => this.allRoles.find(r => r.name === name)!)
      .filter(Boolean)
  }));
   console.log('Empleados con roles:', this.employees);
});

    });
  }
  getRoleNames(emp: Employee): string {
     console.log('Roles de', emp.name, emp.roles);
  return emp.roles && emp.roles.length > 0
    ? emp.roles.map(r => r.name).join(', ')
    : '-';
}

  editEmployee(employee: Employee): void {
  const dialogRef = this.dialog.open(EmployeeRoleEditorComponent, {
    width: '400px',
    data: {
      name: employee.name,
      roles: (employee.roles || []).map(r => r.name), // ✅ corrección segura
      allRoles: this.allRoles.map(r => r.name)
    }
  });

    dialogRef.afterClosed().subscribe((updated: string[]) => {
      if (updated) {
        employee.roles = updated.map(name => this.allRoles.find(r => r.name === name)!).filter(Boolean);
      }
    });
  }

  getPermissionsFor(emp: Employee): string[] {
    return emp.roles.flatMap(role => role.permissions);
  }
}
