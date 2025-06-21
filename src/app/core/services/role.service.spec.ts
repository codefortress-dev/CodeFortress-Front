import { RoleService } from './role.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Role } from '../models/role.model';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: jest.Mocked<HttpClient>;

  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'admin',
      description: {
        es: 'Administrador del sistema',
        en: 'System administrator',
      },
      permissions: ['user-create', 'user-edit']
    },
    {
      id: 2,
      name: 'editor',
      description: {
        es: 'Editor de contenido',
        en: 'Content editor',
      },
      permissions: ['content-edit']
    }
  ];

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    service = new RoleService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch roles from /mock/roles.json', (done) => {
    httpMock.get.mockReturnValue(of(mockRoles));

    service.getRoles().subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
      expect(httpMock.get).toHaveBeenCalledWith('/mock/roles.json');
      done();
    });
  });

  it('should return a role by name if found', (done) => {
    httpMock.get.mockReturnValue(of(mockRoles));

    service.getRoleByName('admin').subscribe((role) => {
      expect(role).toEqual(mockRoles[0]);
      done();
    });
  });

  it('should return undefined if role by name not found', (done) => {
    httpMock.get.mockReturnValue(of(mockRoles));

    service.getRoleByName('unknown').subscribe((role) => {
      expect(role).toBeUndefined();
      done();
    });
  });
});
