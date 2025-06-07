import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
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

  estados = ['todos', 'activo', 'terminado', 'rescindido'];

  ngOnInit(): void {
    this.http.get<any[]>('/mock-data/custom-projects.json').subscribe(data => {
      this.proyectos = data;
      this.filtrar();
    });
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
}
