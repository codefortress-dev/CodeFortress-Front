import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgxPermissionsModule } from 'ngx-permissions';

interface Permission {
  code: string;
  es: string;
  en: string;
}

@Component({
  standalone: true,
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    TranslateModule,
    NgxPermissionsModule
  ]
})
export class PermissionsComponent implements OnInit {
  permissions: Permission[] = [];

  constructor(private http: HttpClient, private translate: TranslateService) {}

  ngOnInit(): void {
    this.http.get<Permission[]>('/mock-data/permissions.json').subscribe(perms => {
      this.permissions = perms;
    });
  }

  getLabel(p: Permission): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    return p[lang as 'es' | 'en'] ?? p.code;
  }
}
