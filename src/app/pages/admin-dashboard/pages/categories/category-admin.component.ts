import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-category-admin',
  standalone: true,
  imports: [
    CommonModule,
MatListModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    NgxPermissionsModule
  ],
  templateUrl: './category-admin.component.html',
  styleUrls: ['./category-admin.component.scss']
})
export class CategoryAdminComponent implements OnInit {
  public http = inject(HttpClient);
  public fb = inject(FormBuilder);
  public translate = inject(TranslateService);
  //public permissionsService = inject(NgxPermissionsService);

  categories: any[] = [];
  form: FormGroup;
  isEditing = false;
  selectedCategory: any = null;

  constructor() {
    this.form = this.fb.group({
      es: ['', Validators.required],
      en: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<any[]>('https://mastermindsit.github.io/mock-api/categories.json').subscribe(data => {
      this.categories = data;
    });
  }

 /*  can(permission: string): boolean {
    return this.permissionsService.getPermission(permission) !== undefined;
  } */

  startEdit(category: any): void {
    this.selectedCategory = category;
    this.isEditing = true;
    this.form.setValue({
      es: category.nombre.es,
      en: category.nombre.en
    });
  }

  cancelEdit(): void {
    this.selectedCategory = null;
    this.isEditing = false;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) return;

    const values = this.form.value;

    if (this.isEditing && this.selectedCategory) {
      this.selectedCategory.nombre.es = values.es;
      this.selectedCategory.nombre.en = values.en;
    } else {
      const newCategory = {
        id: Date.now(),
        nombre: {
          es: values.es,
          en: values.en
        }
      };
      this.categories.push(newCategory);
    }

    this.cancelEdit();
  }
}