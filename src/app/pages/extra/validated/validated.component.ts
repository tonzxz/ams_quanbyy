import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-validated',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './validated.component.html',
  styleUrls: ['./validated.component.scss']
})
export class ValidatedComponent {
  displayedColumns: string[] = ['number', 'requestor', 'department', 'amount', 'date'];
  validatedRequests = [
    { number: 'PR-201', requestor: 'Emily Davis', department: 'Finance', amount: 3000, date: '2025-01-15' },
    { number: 'PR-202', requestor: 'Michael Brown', department: 'IT', amount: 7500, date: '2025-01-16' },
    { number: 'PR-201', requestor: 'Emily Davis', department: 'Finance', amount: 3000, date: '2025-01-15' },
    { number: 'PR-202', requestor: 'Michael Brown', department: 'IT', amount: 7500, date: '2025-01-16' },
    { number: 'PR-201', requestor: 'Emily Davis', department: 'Finance', amount: 3000, date: '2025-01-15' },
    { number: 'PR-202', requestor: 'Michael Brown', department: 'IT', amount: 7500, date: '2025-01-16' },
    { number: 'PR-201', requestor: 'Emily Davis', department: 'Finance', amount: 3000, date: '2025-01-15' },
    { number: 'PR-202', requestor: 'Michael Brown', department: 'IT', amount: 7500, date: '2025-01-16' }
  ];
}
