import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CustomProject } from '../../../../core/models/custom-project.model';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-custom-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    TranslateModule,
    MatIconModule,
    NgxPermissionsModule
  ],
  templateUrl: './custom-projects.component.html',
  styleUrls: ['./custom-projects.component.scss']
})
export class CustomProjectsComponent implements OnInit {
  private http = inject(HttpClient);
  translate = inject(TranslateService);

  proyectos: CustomProject[] = [];
  proyectosFiltrados: CustomProject[] = [];
  estadoSeleccionado: string = 'todos';
  estados: string[] = [];

  // valores temporales
  nuevoDemo: Record<number, string> = {};
  nuevoEstado: Record<number, string> = {};
  mensajeExito: string = '';

  ngOnInit(): void {
    this.http.get<CustomProject[]>('https://mastermindsit.github.io/mock-api/custom-projects.json').subscribe(data => {
      this.proyectos = data;
      this.proyectosFiltrados = [...data];
      this.estados = this.extraerEstados(data);
    });
  }

  extraerEstados(proyectos: CustomProject[]): string[] {
    const encontrados = new Set(proyectos.map(p => p.estado.toLowerCase()));
    return ['todos', ...Array.from(encontrados)];
  }

  filtrar(): void {
    if (this.estadoSeleccionado === 'todos') {
      this.proyectosFiltrados = this.proyectos;
    } else {
      this.proyectosFiltrados = this.proyectos.filter(
        p => p.estado.toLowerCase() === this.estadoSeleccionado
      );
    }
  }

  guardarDemo(id: number): void {
    const demo = this.nuevoDemo[id];
    if (!demo) return;

    const body = { demoUrl: demo };


    of({ success: true }).pipe(delay(500)).subscribe(() => {
      const proyecto = this.proyectos.find(p => p.id === id);
      if (proyecto) proyecto.demoUrl = demo;

      this.mensajeExito = this.translate.instant('customProjects.demoSaved');
      setTimeout(() => (this.mensajeExito = ''), 3000);
      this.nuevoDemo[id] = '';
    });
  }

  actualizarEstado(id: number): void {
    const estado = this.nuevoEstado[id];
    if (!estado) return;


    of({ success: true }).pipe(delay(500)).subscribe(() => {
      const proyecto = this.proyectos.find(p => p.id === id);
      if (proyecto) proyecto.estado = estado;

      this.mensajeExito = this.translate.instant('customProjects.stateUpdated');
      setTimeout(() => (this.mensajeExito = ''), 3000);
      this.filtrar();
    });
  }
}
