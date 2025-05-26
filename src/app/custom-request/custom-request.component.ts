import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CustomRequestService } from '../core/custom-request.service';
import { CategoriaAtencion } from './models/categoria-atencion.model';
import { CustomRequest } from './models/custom-request.model';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-custom-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './custom-request.component.html',
  styleUrls: ['./custom-request.component.scss']
})
export class CustomRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(CustomRequestService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);


  categorias: CategoriaAtencion[] = [];
  horariosDisponibles: string[] = [];

  today = new Date();

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    tipoProyecto: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    fecha: [
  '',
  [
    Validators.required,
    (control: AbstractControl) => {
      const raw = control.value;
      const fecha = typeof raw === 'string' ? new Date(raw) : raw;
      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return { fechaInvalida: true };

      const day = fecha.getDay();
      return day === 0 || day === 6 ? { finDeSemanaNoPermitido: true } : null;
    }
  ]
]
,
    horario: ['', Validators.required]
  });

  ngOnInit(): void {
    this.servicio.getCategorias().subscribe(data => {
      this.categorias = data;
      console.log(this.categorias);
      this.cdr.detectChanges();
    });

    this.form.get('categoria')?.valueChanges.subscribe(() => this.cargarHorarios());
    this.form.get('fecha')?.valueChanges.subscribe(() => this.cargarHorarios());
    
  }

  private cargarHorarios(): void {
    const categoria = this.form.get('categoria')?.value;
    const rawFecha = this.form.get('fecha')?.value;

    if (!categoria || !rawFecha) return;

    const fecha = typeof rawFecha === 'string' ? new Date(rawFecha) : rawFecha;
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return;

    const iso = fecha.toISOString().split('T')[0];
    this.servicio.getHorariosDisponibles(categoria, iso).subscribe(horarios => {
      this.horariosDisponibles = horarios;
      this.form.get('horario')?.setValue(null);
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const rawFecha = values.fecha;
    if (!rawFecha || !values.categoria) return;

    const fecha = typeof rawFecha === 'string' ? new Date(rawFecha) : rawFecha;
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return;

    const fechaISO = fecha.toISOString().split('T')[0];

    this.servicio.getEjecutivoAsignado(values.categoria).subscribe(ejecutivo => {
      const solicitud: CustomRequest = {
        nombre: values.nombre!,
        correo: values.correo!,
        tipoProyecto: values.tipoProyecto!,
        descripcion: values.descripcion!,
        fecha: fechaISO,
        horario: values.horario!,
        categoria: values.categoria!,
        ejecutivoAsignado: ejecutivo
      };

      console.log('Solicitud enviada:', solicitud);
      this.snackBar.open('¡Solicitud enviada con éxito!', 'Cerrar', { duration: 3000 });
      this.form.reset();
      this.horariosDisponibles = [];
    });
  }
}
