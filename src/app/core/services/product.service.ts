import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>('https://mastermindsit.github.io/mock-api/products.json');
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>('https://mastermindsit.github.io/mock-api/categories.json');
  }
}
