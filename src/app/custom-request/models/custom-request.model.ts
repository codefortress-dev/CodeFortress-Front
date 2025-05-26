export interface CustomRequest {
  nombre: string;
  correo: string;
  tipoProyecto: string;
  descripcion: string;
  fecha: string;           // formato ISO (ej: '2025-06-03')
  horario: string;         // ej: '09:00', '15:30'
  categoria: string;       // 'comercial', 'tecnico', etc.
  ejecutivoAsignado: string; // nombre del ejecutivo asignado
}
