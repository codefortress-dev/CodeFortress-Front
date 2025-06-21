import { TrialRequestComponent } from './trial-request.component';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

describe('TrialRequestComponent (sin TestBed)', () => {
  let fb: FormBuilder;
  let httpMock: any;
  let routerMock: any;
  let snackBarMock: any;
  let translateMock: any;
  let cdrMock: any;
  let component: TrialRequestComponent;

  beforeEach(() => {
    fb = new FormBuilder();
    httpMock = {
      get: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };
    snackBarMock = { open: jest.fn() };
    translateMock = { instant: jest.fn((key: string) => key) };
    cdrMock = { markForCheck: jest.fn() };

    component = new TrialRequestComponent(
      routerMock,
      fb,
      httpMock,
      snackBarMock,
      translateMock,
      cdrMock
    );
    component.ngOnInit();
  });

  it('debe inicializar el formulario con el campo email vacío y válido', () => {
    expect(component.trialForm).toBeDefined();
    expect(component.trialForm.get('email')).toBeDefined();
    expect(component.trialForm.get('email')?.value).toBe('');
    expect(component.trialForm.valid).toBe(false);
  });

  it('no debe enviar el formulario si el email es inválido', () => {
    component.trialForm.get('email')?.setValue('correo@invalido'); // Falta dominio
    component.submit();
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('debe redirigir a /success si la solicitud es exitosa', () => {
    component.trialForm.get('email')?.setValue('user@example.com');
    httpMock.get.mockReturnValue(of({ status: 'ok' }));

    component.submit();

    expect(httpMock.get).toHaveBeenCalledWith('/mock-data/trial-request.json');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/success']);
  });

  it('debe redirigir a /error si ocurre un fallo en la solicitud', () => {
    component.trialForm.get('email')?.setValue('user@example.com');
    httpMock.get.mockReturnValue(throwError(() => new Error('Error')));

    component.submit();

    expect(httpMock.get).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/error']);
  });
});
