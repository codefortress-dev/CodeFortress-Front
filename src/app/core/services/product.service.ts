import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>('/mock-data/products.json');
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>('/mock-data/categories.json');
  }
}
