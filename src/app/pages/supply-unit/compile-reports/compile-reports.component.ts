// compile-reports.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-compile-reports',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './compile-reports.component.html',
  styleUrls: ['./compile-reports.component.scss']
})
export class CompileReportsComponent {
  reports: any[] = [];

  constructor() {
    this.loadMockData();
  }

  hasField(fieldName: string): boolean {
    return this.reports.some(report => report[fieldName] !== undefined);
  }

  loadMockData() {
    // Sample RSMI Reports
    const rsmiReports = [
      {
        type: 'RSMI',
        serialNo: 'RSMI-001',
        entityName: 'DepEd Central Office',
        fundCluster: 'FC-1001',
        date: '2023-10-15',
        description: 'Office supplies issuance',
        quantity: 50,
        unitCost: 150,
        totalCost: 7500
      }
    ];

    // Sample PAR Reports
    const parReports = [
      {
        type: 'PAR',
        parNo: 'PAR-001',
        entityName: 'DepEd Regional Office',
        fundCluster: 'FC-2001',
        date: '2023-10-16',
        description: 'Equipment acknowledgment',
        quantity: 10,
        unitCost: 2500,
        totalCost: 25000
      }
    ];

    // Sample ICS Reports
    const icsReports = [
      {
        type: 'ICS',
        icsNo: 'ICS-001',
        entityName: 'DepEd Division Office',
        fundCluster: 'FC-3001',
        date: '2023-10-17',
        description: 'Computer equipment custody',
        quantity: 5,
        unitCost: 45000,
        totalCost: 225000
      }
    ];

    this.reports = [...rsmiReports, ...parReports, ...icsReports];
  }

  exportCSV() {
    const csvContent = this.convertToCSV(this.reports);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'compiled-reports.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(items: any[]): string {
    const header = Object.keys(items[0]).join(',');
    const rows = items.map(item =>
      Object.values(item)
        .map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        )
        .join(',')
    );
    return [header, ...rows].join('\n');
  }
}