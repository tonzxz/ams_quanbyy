import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-approved-budget',
  standalone: true,
  imports: [
    TableModule, // PrimeNG table
    CardModule, // PrimeNG card
    CommonModule, // Add CommonModule for built-in pipes
  ],
  templateUrl: './approved-budget.component.html',
  styleUrl: './approved-budget.component.scss',
})
export class ApprovedBudgetComponent {
  budgets = [
    { id: 1, department: 'IT', amount: 50000 },
    { id: 2, department: 'HR', amount: 30000 },
  ];
}