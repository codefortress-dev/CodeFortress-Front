import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ChartModule,
    MatDatepickerModule,
    FormsModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  private http = inject(HttpClient);
  translate = inject(TranslateService);
  fromDate: Date | null = null;
toDate: Date | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  sales: any[] = [];
  dataSource = new MatTableDataSource<any>();
  chartData: any;
  chartOptions: any;

  selectedGroup: string = 'pais';
  displayedColumns: string[] = [
    'productoNombre',
    'categoria',
    'pais',
    'estadoLicencia',
    'cantidad',
    'precioUnitario',
    'total',
    'fecha'
  ];

  ngOnInit(): void {
    this.http.get<any[]>('/mock-data/sales.json').subscribe(data => {
      this.sales = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.prepareCharts();
    });

    this.translate.onLangChange.subscribe(() => {
      this.prepareCharts();
    });
  }

  prepareCharts(): void {
    const grouped = this.aggregateBy(this.selectedGroup);

    this.chartData = {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: this.translate.instant(`sales.by.${this.selectedGroup}`),
          data: Object.values(grouped),
          backgroundColor: '#42A5F5'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#333' } }
      },
      scales: {
        x: { ticks: { color: '#333' } },
        y: { ticks: { color: '#333' } }
      }
    };
  }
  filtrarPorFecha(): void {
  const desde = this.fromDate?.getTime() || 0;
  const hasta = this.toDate?.getTime() || Date.now();

  this.dataSource.data = this.sales.filter(sale => {
    const fechaVenta = new Date(sale.fecha).getTime();
    return fechaVenta >= desde && fechaVenta <= hasta;
  });

  this.prepareCharts(); // actualiza gráfico con el subset
}

  private aggregateBy(key: string): Record<string, number> {
    return this.sales.reduce((acc, item) => {
      const value = item[key] || 'Desconocido';
      acc[value] = (acc[value] || 0) + item.total;
      return acc;
    }, {} as Record<string, number>);
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const columns = this.displayedColumns.map(key => this.translate.instant(`sales.${key}`));
    const rows = this.sales.map(row => this.displayedColumns.map(key => row[key]));
    autoTable(doc, { head: [columns], body: rows, styles: { fontSize: 8 }, margin: { top: 10 } });
    doc.save('sales-report.pdf');
  }
}
