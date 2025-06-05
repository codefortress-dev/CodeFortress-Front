import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  standalone: true,
  selector: 'app-employees',
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Employee[]>('/mock-data/employees.json').subscribe(data => {
      this.employees = data;
    });
  }
}
