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
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatIconModule,
    NgxPermissionsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  allRoles: Role[] = [];
  newEmployeeForm!: FormGroup;
  private nextId = 1000; // Simulación de ID incremental

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newEmployeeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required]
    });

    this.http.get<Role[]>('https://mastermindsit.github.io/mock-api/roles.json').subscribe((roles) => {
      this.allRoles = roles;

      this.http.get<Employee[]>('https://mastermindsit.github.io/mock-api/employees.json').subscribe((rawEmployees) => {
        this.employees = rawEmployees.map(emp => ({
          id: emp.id ?? this.generateId(),
          name: emp.name,
          email: emp.email,
          roles: (emp.roles ?? []).map((role: any) =>
            this.allRoles.find(r => r.name === (typeof role === 'string' ? role : role.name))!
          ).filter(Boolean)
        }));
        
      });
      
    });
  }

  getRoleNames(emp: Employee): string {
    return emp.roles?.length ? emp.roles.map(r => r.name).join(', ') : '-';
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeRoleEditorComponent, {
      width: '400px',
      data: {
        name: employee.name,
        roles: employee.roles.map(r => r.name),
        allRoles: this.allRoles.map(r => r.name)
      }
    });

    dialogRef.afterClosed().subscribe((updated: string[]) => {
      if (updated) {
        employee.roles = updated
          .map(name => this.allRoles.find(r => r.name === name)!)
          .filter(Boolean);
      }
    });
  }

  getPermissionsFor(emp: Employee): string[] {
    return emp.roles.flatMap(role => role.permissions);
  }

  addNewEmployee(): void {
  if (this.newEmployeeForm.invalid) return;

  const { email, roles } = this.newEmployeeForm.value;

  const newEmployee: Employee = {
    id: this.generateId(),
    name: email.split('@')[0],
    email,
    roles: roles.map((roleId: number) =>
      this.allRoles.find(r => r.id === roleId)!
    ).filter(Boolean)
  };

  this.employees.push(newEmployee);
  this.newEmployeeForm.reset();
  this.newEmployeeForm.controls['roles'].setValue([]);
}



  private generateId(): number {
    return this.nextId++;
  }
}
