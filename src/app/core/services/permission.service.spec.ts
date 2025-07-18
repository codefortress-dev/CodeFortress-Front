import { PermissionService } from './permission.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Permission } from '../models/permission.model';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    service = new PermissionService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch permissions from /mock/permissions.json', (done) => {
    const mockPermissions: Permission[] = [
      {
        code: 'user-create',
        es: 'Crear usuario',
        en: 'Create user'
      },
      {
        code: 'user-list',
        es: 'Listar usuarios',
        en: 'List users'
      }
    ];

    httpMock.get.mockReturnValue(of(mockPermissions));

    service.getPermissions().subscribe((permissions) => {
      expect(permissions).toEqual(mockPermissions);
      expect(httpMock.get).toHaveBeenCalledWith('https://mastermindsit.github.io/mock-api/permissions.json');
      done();
    });
  });
});
