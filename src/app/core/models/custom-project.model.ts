export interface CustomProject {
  id: number;
  nombreCliente: string;
  nombreProyecto: string;
  responsable: string;
  descripcion: string;
  estado: string;
  demoUrl?: string;
  fechaInicio?: Date;
  fechaActualizacion?: Date;
}
