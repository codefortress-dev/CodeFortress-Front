import { ThankYouComponent } from './thank-you.component';
import { ActivatedRoute } from '@angular/router';

describe('ThankYouComponent', () => {
  it('should read orderId from route params', () => {
    const routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('ORD-123')
        }
      }
    } as unknown as ActivatedRoute;

    const component = new ThankYouComponent(routeMock);

    expect(routeMock.snapshot.paramMap.get).toHaveBeenCalledWith('orderId');
    expect(component.orderId).toBe('ORD-123');
  });

  it('should set orderId to null if not present', () => {
    const routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    } as unknown as ActivatedRoute;

    const component = new ThankYouComponent(routeMock);

    expect(component.orderId).toBeNull();
  });
});
