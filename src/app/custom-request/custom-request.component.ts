import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CustomRequestService } from '../core/services/custom-request.service';
import { CategoriaAtencion } from './models/categoria-atencion.model';
import { isWeekend } from 'date-fns';

@Component({
  selector: 'app-custom-request',
  standalone: true,
  templateUrl: './custom-request.component.html',
  styleUrls: ['./custom-request.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatError,
    MatCheckboxModule
  ]
})
export class CustomRequestComponent implements OnInit {
  form: FormGroup;
  categorias: CategoriaAtencion[] = [];
  horarios: string[] = [];
  fechasDisponibles: string[] = [];
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private service: CustomRequestService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      tipoProyecto: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      fecha: ['', [Validators.required, this.validarFechaNoFinDeSemana]],
      horario: ['', Validators.required],
      ejecutivoAsignado: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$')
      ]],
      repetirPassword: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.edadMinimaValidator]],
      experienciaPrev: [false]
    }, {
      validators: this.contrasenasIgualesValidator
    });
  }

  ngOnInit(): void {
    this.service.getCategorias().subscribe((data) => {
      this.categorias = data;
    });

    this.form.get('categoria')?.valueChanges.subscribe((categoriaId) => {
      if (categoriaId) {
        this.service.getEjecutivoAsignado(categoriaId).subscribe((nombre) => {
          this.form.get('ejecutivoAsignado')?.setValue(nombre);
        });

        this.horarios = [];
        this.form.get('horario')?.reset();
        this.cargarFechasDisponibles(categoriaId);
        this.form.get('fecha')?.reset();
        this.form.get('horario')?.reset();
      }
    });

    this.form.get('fecha')?.valueChanges.subscribe((fecha: Date) => {
      const categoriaId = this.form.get('categoria')?.value;
      if (fecha && categoriaId) {
        const iso = fecha.toISOString().split('T')[0];
        this.service.getHorariosDisponibles(categoriaId, iso).subscribe((horas) => {
          this.horarios = horas;
        });
      }
    });
    this.form.valueChanges.subscribe(() => {
    if (this.form.hasError('contrasenasDistintas')) {
      this.form.get('repetirPassword')?.setErrors({ contrasenasDistintas: true });
    } else {
      this.form.get('repetirPassword')?.setErrors(null);
    }
  });
  }

  enviar(): void {
    if (this.form.valid) {
      alert('✅ Tu solicitud fue enviada con éxito.');
      this.form.reset();
      this.horarios = [];
    } else {
      this.form.markAllAsTouched();
      alert('❌ Revisa los campos. Hay errores en el formulario.');
    }
  }

  validarFechaNoFinDeSemana(control: AbstractControl) {
    const fecha: Date = control.value;
    if (fecha && isWeekend(fecha)) {
      return { finDeSemanaNoPermitido: true };
    }
    return null;
  }

  edadMinimaValidator(control: AbstractControl) {
    const fecha = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad >= 18 ? null : { menorEdad: true };
  }

  contrasenasIgualesValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const repeat = form.get('repetirPassword')?.value;
    return pass === repeat ? null : { contrasenasDistintas: true };
  }

  filtrarFechasDisponibles = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const iso = fecha.toISOString().split('T')[0];
    return this.fechasDisponibles.includes(iso);
  };

  resaltarFechasDisponibles = (fecha: Date): string => {
    const iso = fecha.toISOString().split('T')[0];
    return this.fechasDisponibles.includes(iso) ? 'fecha-disponible' : '';
  };

  private cargarFechasDisponibles(categoriaId: string): void {
    this.service.getDisponibilidad().subscribe(disponibilidad => {
      const fechasObj = disponibilidad[categoriaId] || {};
      this.fechasDisponibles = Object.keys(fechasObj);
    });
  }
}
