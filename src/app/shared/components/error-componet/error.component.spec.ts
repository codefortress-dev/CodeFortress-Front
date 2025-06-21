import { ActionErrorComponent } from './error.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('ActionErrorComponent (sin TestBed)', () => {
  let routerMock: any;
  let locationMock: any;
  let component: ActionErrorComponent;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    };

    locationMock = {
      back: jest.fn()
    };

    component = new ActionErrorComponent(routerMock, locationMock);
  });

  it('debe usar location.back() si hay historial', () => {
    jest.spyOn(window.history, 'length', 'get').mockReturnValue(2);
    component.navigate();
    expect(locationMock.back).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debe redirigir a "/" si no hay historial suficiente', () => {
    jest.spyOn(window.history, 'length', 'get').mockReturnValue(1);
    component.navigate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(locationMock.back).not.toHaveBeenCalled();
  });
});
