import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriaAtencion } from '../../custom-request/models/categoria-atencion.model';
import { Ejecutivo } from '../../custom-request/models/ejecutivo.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomRequestService {
  constructor(private http: HttpClient) {}

  getCategorias(): Observable<CategoriaAtencion[]> {
    return this.http.get<CategoriaAtencion[]>('/mock-data/categorias.json');
  }

  getEjecutivos(): Observable<Ejecutivo[]> {
    return this.http.get<Ejecutivo[]>('/mock-data/ejecutivos.json');
  }

  getDisponibilidad(): Observable<Record<string, Record<string, string[]>>> {
    return this.http.get<Record<string, Record<string, string[]>>>(
      '/mock-data/disponibilidad.json'
    );
  }

  /**
   * Devuelve los horarios disponibles para una categoría y fecha específica.
   */
  getHorariosDisponibles(
    categoriaId: string,
    fechaISO: string
  ): Observable<string[]> {
    return this.getDisponibilidad().pipe(
      map((disponibilidad) => {
        const porCategoria = disponibilidad[categoriaId] || {};
        return porCategoria[fechaISO] || [];
      })
    );
  }

  /**
   * Asigna un ejecutivo automáticamente según la categoría.
   */
  getEjecutivoAsignado(categoriaId: string): Observable<string> {
    return this.getEjecutivos().pipe(
      map((ejecutivos) => {
        const encontrado = ejecutivos.find((e) => e.categoria === categoriaId);
        return encontrado?.nombre || 'Ejecutivo por asignar';
      })
    );
  }
}
