import { EmployeeService } from './employee.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    service = new EmployeeService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch employees from /mock/employees.json', (done) => {
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: 'Ana',
        email: 'ana@empresa.com',
        roles: [
          {
            id: 1,
            name: 'admin',
            description: {"es":'',"en":''},
            permissions: ['user-list', 'user-edit']
          }
        ]
      },
      {
        id: 2,
        name: 'Luis',
        email: 'luis@empresa.com',
        roles: [
          {
            id: 2,
            name: 'editor',
            description: {"es":'',"en":''},
            permissions: ['content-edit']
          }
        ]
      }
    ];

    httpMock.get.mockReturnValue(of(mockEmployees));

    service.getEmployees().subscribe((employees) => {
      expect(employees).toEqual(mockEmployees);
      expect(httpMock.get).toHaveBeenCalledWith('/mock/employees.json');
      done();
    });
  });
});
