import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    TranslateModule,
    ChartModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  private http = inject(HttpClient);
  translate = inject(TranslateService);

  sales: any[] = [];
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
      this.prepareCharts();
    });

    this.translate.onLangChange.subscribe(() => {
      this.prepareCharts(); // Update chart labels when language changes
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
        legend: {
          labels: {
            color: '#333'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#333' }
        },
        y: {
          ticks: { color: '#333' }
        }
      }
    };
  }

  private aggregateBy(key: string): Record<string, number> {
    return this.sales.reduce((acc, item) => {
      const value = item[key] || 'Desconocido';
      acc[value] = (acc[value] || 0) + item.total;
      return acc;
    }, {} as Record<string, number>);
  }
}
