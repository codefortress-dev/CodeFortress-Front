import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
    TranslateModule
  ],
  templateUrl: './custom-projects.component.html',
  styleUrls: ['./custom-projects.component.scss']
})
export class CustomProjectsComponent implements OnInit {
  private http = inject(HttpClient);
  translate = inject(TranslateService);

  proyectos: any[] = [];
  proyectosFiltrados: any[] = [];
  estadoSeleccionado: string = 'todos';
  estados: string[] = [];

  // valores temporales para acciones
  nuevoDemo: Record<number, string> = {};
  nuevoEstado: Record<number, string> = {};

  ngOnInit(): void {
    this.http.get<any[]>('/mock-data/custom-projects.json').subscribe(data => {
      this.proyectos = data;
      this.proyectosFiltrados = [...data];
      this.estados = this.extraerEstados(data);
    });
  }

  extraerEstados(proyectos: any[]): string[] {
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

    // simulamos post
    console.log('(Mock) POST /projects/' + id + '/demo', { demo });
    of({ success: true }).pipe(delay(500)).subscribe(() => {
      const p = this.proyectos.find(p => p.id === id);
      if (p) p.demoUrl = demo;
      this.nuevoDemo[id] = '';
    });
  }

  actualizarEstado(id: number): void {
    const estado = this.nuevoEstado[id];
    if (!estado) return;

    console.log('(Mock) POST /projects/' + id + '/estado', { estado });
    of({ success: true }).pipe(delay(500)).subscribe(() => {
      const p = this.proyectos.find(p => p.id === id);
      if (p) p.estado = estado;
      this.filtrar();
    });
  }
} 
