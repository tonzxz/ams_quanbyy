import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-plan-tracking',
  standalone: true,
  imports: [TableModule, CardModule],
  templateUrl: './plan-tracking.component.html',
  styleUrl: './plan-tracking.component.scss',
})
export class PlanTrackingComponent {
  plans = [
    { id: 1, title: 'Plan 1', status: 'Approved' },
    { id: 2, title: 'Plan 2', status: 'Pending' },
  ];
}