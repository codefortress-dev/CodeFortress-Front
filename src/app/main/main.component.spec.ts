import { MainComponent } from './main.component';
import {
  runInInjectionContext,
  createEnvironmentInjector,
  Injector,
  signal
} from '@angular/core';

describe('MainComponent (con runInInjectionContext)', () => {
  let injector: any;

  beforeAll(() => {
    const parentInjector = Injector.create({ providers: [] });
    injector = createEnvironmentInjector([], parentInjector as any);
  });

  function createComponentWithSignals(collapsed: boolean, width: number): MainComponent {
    return runInInjectionContext(injector, () => {
      const cmp = new MainComponent();
      // Sobrescribimos señales simuladas
      (cmp as any).isLeftSidebarCollapsed = signal(collapsed);
      (cmp as any).screenWidth = signal(width);
      return cmp;
    });
  }

  it('debe devolver "" si el sidebar está colapsado', () => {
    const component = createComponentWithSignals(true, 1200);
    expect(component.sizeClass()).toBe('');
  });

  it('debe devolver "body-trimmed" si no está colapsado y screenWidth > 768', () => {
    const component = createComponentWithSignals(false, 1024);
    expect(component.sizeClass()).toBe('body-trimmed');
  });

  it('debe devolver "body-md-screen" si no está colapsado y screenWidth <= 768', () => {
    const component = createComponentWithSignals(false, 600);
    expect(component.sizeClass()).toBe('body-md-screen');
  });
});
