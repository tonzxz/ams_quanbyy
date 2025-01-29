import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  standalone: true,
  imports: [CommonModule, CardModule, FormsModule, NgApexchartsModule, MaterialModule, ButtonModule]
})
export class StarterComponent implements OnInit {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: number[] = [];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Purchase Request Data
  purchaseRequest = {
    name: 'Procurement of IT Equipments',
    department: 'IT Department',
    amount: 5000,
    status: 'Pending',
    date: '2024-01-05'
  };

  // Events
  events = [
    { title: 'Inspection Review', date: new Date(2025, 0, 5) },
    { title: 'Supply Order Submission', date: new Date(2025, 0, 10) },
    { title: 'Purchase Requests Approval', date: new Date(2025, 0, 15) },
    { title: 'Inventory Audit', date: new Date(2025, 0, 20) }
  ];

  filteredEvents: any[] = [];

  // Budget Allocation Chart
  public budgetChartOptions = {
    series: [
      { name: 'Total Budget', data: [20000, 15000, 25000, 18000, 22000] },
      { name: 'Allocated', data: [15000, 8000, 20000, 12000, 16000] },
      { name: 'Remaining', data: [5000, 7000, 5000, 6000, 6000] }
    ],
    chart: { type: "line" as ApexChart["type"], height: 330 },
    xaxis: { categories: ['IT', 'HR', 'Finance', 'Marketing', 'Logistics'] } as ApexXAxis,
    yaxis: { title: { text: 'Budget ($)' } } as ApexYAxis,
    stroke: { curve: "smooth" as ApexStroke["curve"] },
    title: { text: 'Budget Allocation Overview', align: "left" as ApexTitleSubtitle["align"] }
  };

  // Supply Monitoring Chart
  public supplyChartOptions = {
    series: [
      { name: 'Stock Available', data: [50, 100, 40, 30, 25] },
      { name: 'Stock Used', data: [30, 60, 20, 15, 10] }
    ],
    chart: { type: "bar" as ApexChart["type"], height: 330 },
    xaxis: { categories: ['Laptops', 'Office Chairs', 'Whiteboards', 'Printers', 'Projectors'] } as ApexXAxis,
    yaxis: { title: { text: 'Stock Quantity' } } as ApexYAxis,
    stroke: { curve: "smooth" as ApexStroke["curve"] },
    title: { text: 'Supply Monitoring', align: "left" as ApexTitleSubtitle["align"] }
  };

  ngOnInit() {
    this.generateCalendar();
    this.filterEventsByMonth();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    this.calendarDays = new Array(firstDay).fill(0).concat([...Array(totalDays).keys()].map(d => d + 1));
  }

  changeMonth(direction: number) {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
    this.filterEventsByMonth();
  }

  isEventDate(day: number): boolean {
    return this.events.some(event => 
      event.date.getFullYear() === this.currentYear &&
      event.date.getMonth() === this.currentMonth &&
      event.date.getDate() === day
    );
  }

  filterEventsByMonth() {
    this.filteredEvents = this.events.filter(event => 
      event.date.getFullYear() === this.currentYear &&
      event.date.getMonth() === this.currentMonth
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
}
