import { CustomRequestComponent } from './custom-request.component';
import { FormBuilder } from '@angular/forms';
import { CustomRequestService } from '../core/services/custom-request.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('CustomRequestComponent', () => {
  let component: CustomRequestComponent;
  let serviceMock: jest.Mocked<CustomRequestService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    serviceMock = {
      getCategorias: jest.fn(),
      getEjecutivoAsignado: jest.fn(),
      getDisponibilidad: jest.fn(),
      getHorariosDisponibles: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    const fb = new FormBuilder();
    component = new CustomRequestComponent(routerMock, fb, serviceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and load categories on ngOnInit', () => {
    serviceMock.getCategorias.mockReturnValue(of([
      { id: 'ventas', nombre: 'Ventas' }
    ]));

    component.ngOnInit();

    expect(serviceMock.getCategorias).toHaveBeenCalled();
  });

  it('should load ejecutivo and fechas when categoria changes', () => {
    // ✅ Mock antes del ngOnInit
    serviceMock.getCategorias.mockReturnValue(of([
      { id: 'ventas', nombre: 'Ventas' }
    ]));
    serviceMock.getEjecutivoAsignado.mockReturnValue(of('Luis'));
    serviceMock.getDisponibilidad.mockReturnValue(of({
      ventas: { '2025-07-01': ['10:00'] }
    }));

    component.ngOnInit();
    component.form.get('categoria')?.setValue('ventas');

    expect(serviceMock.getEjecutivoAsignado).toHaveBeenCalledWith('ventas');
    expect(serviceMock.getDisponibilidad).toHaveBeenCalled();
  });

  it('should load horarios when fecha changes and categoria is selected', () => {
    serviceMock.getCategorias.mockReturnValue(of([
      { id: 'ventas', nombre: 'Ventas' }
    ]));
    serviceMock.getHorariosDisponibles.mockReturnValue(of(['11:00', '12:00']));

    component.ngOnInit();
    component.form.get('categoria')?.setValue('ventas');
    component.form.get('fecha')?.setValue(new Date('2025-07-01'));

    expect(serviceMock.getHorariosDisponibles).toHaveBeenCalledWith('ventas', '2025-07-01');
  });

  it('should mark contraseñasDistintas error when passwords mismatch', () => {
    component.form.get('password')?.setValue('Abc1234');
    component.form.get('repetirPassword')?.setValue('Xyz0000');

    component.form.updateValueAndValidity();

    expect(component.form.errors).toEqual({ contrasenasDistintas: true });
  });

  it('should validate edad mínima correctamente', () => {
    const fechaMayorEdad = new Date();
    fechaMayorEdad.setFullYear(fechaMayorEdad.getFullYear() - 20);

    const fechaMenorEdad = new Date();
    fechaMenorEdad.setFullYear(fechaMenorEdad.getFullYear() - 15);

    expect(component.edadMinimaValidator({ value: fechaMayorEdad } as any)).toBeNull();
    expect(component.edadMinimaValidator({ value: fechaMenorEdad } as any)).toEqual({ menorEdad: true });
  });



  it('should navigate to /success if form is valid on enviar()', () => {
    serviceMock.getCategorias.mockReturnValue(of([]));
    component.ngOnInit();

    component.form.patchValue({
      nombre: 'Juan',
      correo: 'juan@example.com',
      tipoProyecto: 'Web',
      descripcion: 'Descripción del proyecto',
      categoria: 'ventas',
      fecha: new Date('2025-07-01'),
      horario: '10:00',
      password: 'Abc1234',
      repetirPassword: 'Abc1234',
      fechaNacimiento: new Date('2000-01-01'),
      experienciaPrev: true
    });

    component.enviar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/success']);
  });

  it('should navigate to /error if form is invalid on enviar()', () => {
    serviceMock.getCategorias.mockReturnValue(of([]));
    component.ngOnInit();

    component.form.patchValue({
      nombre: '',
      correo: 'invalid',
      password: '123',
      repetirPassword: '321'
    });

    component.enviar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/error']);
  });
});
