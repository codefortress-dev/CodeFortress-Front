import { ActionSuccessComponent } from './success.component';
import { Router } from '@angular/router';

describe('ActionSuccessComponent (sin TestBed)', () => {
  let routerMock: any;
  let component: ActionSuccessComponent;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    };

    component = new ActionSuccessComponent(routerMock);
  });

  it('debe redirigir a "/" al ejecutar navigate()', () => {
    component.navigate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
