import { CustomRequestService } from './custom-request.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CustomRequestService', () => {
  let service: CustomRequestService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    service = new CustomRequestService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get categorias from /mock-data/categorias.json', (done) => {
    const mockCategorias = [{ id: '1', nombre: 'Soporte' }];
    httpMock.get.mockReturnValue(of(mockCategorias));

    service.getCategorias().subscribe(categorias => {
      expect(categorias).toEqual(mockCategorias);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/categorias.json');
      done();
    });
  });

  it('should get ejecutivos from /mock-data/ejecutivos.json', (done) => {
    const mockEjecutivos = [{ nombre: 'María', categoria: 'ventas' }];
    httpMock.get.mockReturnValue(of(mockEjecutivos));

    service.getEjecutivos().subscribe(ejecutivos => {
      expect(ejecutivos).toEqual(mockEjecutivos);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/ejecutivos.json');
      done();
    });
  });

  it('should get disponibilidad from /mock-data/disponibilidad.json', (done) => {
    const mockData = { ventas: { '2025-06-21': ['10:00', '11:00'] } };
    httpMock.get.mockReturnValue(of(mockData));

    service.getDisponibilidad().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/disponibilidad.json');
      done();
    });
  });

  it('should get horarios disponibles para una categoría y fecha', (done) => {
    const mockDisponibilidad = {
      soporte: {
        '2025-06-21': ['09:00', '10:00'],
      },
    };
    httpMock.get.mockReturnValue(of(mockDisponibilidad));

    service.getHorariosDisponibles('soporte', '2025-06-21').subscribe(horarios => {
      expect(horarios).toEqual(['09:00', '10:00']);
      done();
    });
  });

  it('should return empty array si no hay horarios disponibles', (done) => {
    httpMock.get.mockReturnValue(of({}));

    service.getHorariosDisponibles('soporte', '2025-06-21').subscribe(horarios => {
      expect(horarios).toEqual([]);
      done();
    });
  });

  it('should get ejecutivo asignado por categoría', (done) => {
    const mockEjecutivos = [
      { nombre: 'Carlos', categoria: 'soporte' },
      { nombre: 'Ana', categoria: 'ventas' },
    ];
    httpMock.get.mockReturnValue(of(mockEjecutivos));

    service.getEjecutivoAsignado('soporte').subscribe(nombre => {
      expect(nombre).toBe('Carlos');
      done();
    });
  });

  it('should return fallback si no hay ejecutivo asignado', (done) => {
    httpMock.get.mockReturnValue(of([]));

    service.getEjecutivoAsignado('soporte').subscribe(nombre => {
      expect(nombre).toBe('Ejecutivo por asignar');
      done();
    });
  });
});
