import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';

import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  imports: [CardModule, CommonModule, NgApexchartsModule, MaterialModule, ButtonModule],
  standalone: true
})
export class StarterComponent implements OnInit {

  // Single Purchase Request Data (For Quick Status View)
  purchaseRequest = {
    name: 'Procurement of IT Equipments',
    department: 'IT Department',
    amount: 5000,
    status: 'Pending', // Possible statuses: "Approved", "Pending", "Rejected"
    date: '2024-01-05'
  };

  // Budget Allocation Data
  budgetAllocations = [
    { department: 'IT', totalBudget: 20000, allocated: 15000, remaining: 5000 },
    { department: 'HR', totalBudget: 15000, allocated: 8000, remaining: 7000 },
    { department: 'Finance', totalBudget: 25000, allocated: 20000, remaining: 5000 },
    { department: 'Marketing', totalBudget: 18000, allocated: 12000, remaining: 6000 },
    { department: 'Logistics', totalBudget: 22000, allocated: 16000, remaining: 6000 }
  ];

  // Supply Monitoring Data
  supplyMonitoring = [
    { item: 'Laptops', available: 50, used: 30, remaining: 20 },
    { item: 'Office Chairs', available: 100, used: 60, remaining: 40 },
    { item: 'Whiteboards', available: 40, used: 20, remaining: 20 },
    { item: 'Printers', available: 30, used: 15, remaining: 15 },
    { item: 'Projectors', available: 25, used: 10, remaining: 15 }
  ];

  // Budget Allocation Chart (Fixed Types)
  public budgetChartOptions = {
    series: [
      { name: 'Total Budget', data: this.budgetAllocations.map(b => b.totalBudget) },
      { name: 'Allocated', data: this.budgetAllocations.map(b => b.allocated) },
      { name: 'Remaining', data: this.budgetAllocations.map(b => b.remaining) }
    ],
    chart: { type: "line" as ApexChart["type"], height: 330 },
    xaxis: { categories: this.budgetAllocations.map(b => b.department) } as ApexXAxis,
    yaxis: { title: { text: 'Budget ($)' } } as ApexYAxis,
    stroke: { curve: "smooth" as ApexStroke["curve"] },
    title: { text: 'Budget Allocation Overview', align: "left" as ApexTitleSubtitle["align"] }
  };

  // Supply Monitoring Chart (Fixed Types)
  public supplyChartOptions = {
    series: [
      { name: 'Stock Available', data: this.supplyMonitoring.map(s => s.available) },
      { name: 'Stock Used', data: this.supplyMonitoring.map(s => s.used) }
    ],
    chart: { type: "bar" as ApexChart["type"], height: 330 },
    xaxis: { categories: this.supplyMonitoring.map(s => s.item) } as ApexXAxis,
    yaxis: { title: { text: 'Stock Quantity' } } as ApexYAxis,
    stroke: { curve: "smooth" as ApexStroke["curve"] },
    title: { text: 'Supply Monitoring', align: "left" as ApexTitleSubtitle["align"] }
  };

  constructor() {}

  ngOnInit() {}

  // Get Status Class for Badge Colors
  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
}
