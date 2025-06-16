import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
    TranslateModule,
    NgxPermissionsModule
  ],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  translate = inject(TranslateService);

  form!: FormGroup;
  products: any[] = [];
  categories: any[] = [];
  preview: string | null = null;
  editing: boolean = false;
  currentEditId: number | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.form = this.fb.group({
      nombreEs: '',
      nombreEn: '',
      descripcionEs: '',
      descripcionEn: '',
      categoriaId: '',
      precio: 0,
      imagen: '',
      activo: true
    });

    this.http.get<any[]>('/mock-data/products.json').subscribe(p => this.products = p);
    this.http.get<any[]>('/mock-data/categories.json').subscribe(c => this.categories = c);
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  getCategoryName(id: number): string {
    const found = this.categories.find(cat => cat.id === id);
    return found ? (found.nombre[this.translate.currentLang] || found.nombre['es']) : '-';
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.preview = reader.result as string;
      reader.readAsDataURL(file);

      // Aquí guardamos solo la ruta ficticia como si ya estuviera en /images-products/
      const fakePath = `/images-products/${file.name}`;
      this.form.patchValue({ imagen: fakePath });
    }
  }

 save() {
  const producto = {
    id: this.editing ? this.currentEditId : Date.now(),
    nombre: {
      es: this.form.value.nombreEs,
      en: this.form.value.nombreEn
    },
    descripcion: {
      es: this.form.value.descripcionEs,
      en: this.form.value.descripcionEn
    },
    categoriaId: this.form.value.categoriaId,
    precio: this.form.value.precio,
    imagen: this.form.value.imagen,
    activo: this.form.value.activo
  };

  const url = '/mock-api/products'; // se cambia fácilmente por '/api/products' en producción

  this.http.post(url, producto).subscribe(() => {
    if (this.editing) {
      this.products = this.products.map(p => p.id === this.currentEditId ? producto : p);
    } else {
      this.products.push(producto);
    }
    this.resetForm();
  });
}


  startEdit(product: any) {
    this.editing = true;
    this.currentEditId = product.id;
    this.preview = product.imagen;

    this.form.patchValue({
      nombreEs: product.nombre.es,
      nombreEn: product.nombre.en,
      descripcionEs: product.descripcion.es,
      descripcionEn: product.descripcion.en,
      categoriaId: product.categoriaId,
      precio: product.precio,
      imagen: product.imagen,
      activo: product.activo
    });
  }

  resetForm() {
    this.editing = false;
    this.currentEditId = null;
    this.preview = null;
    this.form.reset({
      nombreEs: '',
      nombreEn: '',
      descripcionEs: '',
      descripcionEn: '',
      categoriaId: '',
      precio: 0,
      imagen: '',
      activo: true
    });
  }
}
