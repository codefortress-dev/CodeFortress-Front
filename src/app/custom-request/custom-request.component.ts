import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import { CustomRequestService } from '../core/custom-request.service';
import { CategoriaAtencion } from './models/categoria-atencion.model';
import { isWeekend } from 'date-fns';

@Component({
  selector: 'app-custom-request',
  standalone: true,
  templateUrl: './custom-request.component.html',
  styleUrls: ['./custom-request.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
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
      ejecutivoAsignado: ['']
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
    this.form.get('categoria')?.valueChanges.subscribe((categoriaId: string) => {
  this.cargarFechasDisponibles(categoriaId);

  // Opcionalmente limpia fecha y horario si el usuario cambia la categoría
  this.form.get('fecha')?.reset();
  this.form.get('horario')?.reset();
  });
  }

  validarFechaNoFinDeSemana(control: any) {
    const fecha: Date = control.value;
    if (fecha && isWeekend(fecha)) {
      return { finDeSemanaNoPermitido: true };
    }
    return null;
  }

  enviar(): void {
    if (this.form.valid) {
      console.log('Solicitud enviada:', this.form.value);
      this.form.reset();
      this.horarios = [];
    }
  }
  filtrarFechasDisponibles = (fecha: Date | null): boolean => {
  if (!fecha) return false;
  const iso = fecha.toISOString().split('T')[0];
  return this.fechasDisponibles.includes(iso);
};
private cargarFechasDisponibles(categoriaId: string): void {
  this.service.getDisponibilidad().subscribe(disponibilidad => {
    const fechasObj = disponibilidad[categoriaId] || {};
    this.fechasDisponibles = Object.keys(fechasObj);
  });
}
resaltarFechasDisponibles = (fecha: Date): string => {
  const iso = fecha.toISOString().split('T')[0];
  return this.fechasDisponibles.includes(iso) ? 'fecha-disponible' : '';
};

}
