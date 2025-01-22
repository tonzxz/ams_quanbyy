import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToCreatePlan() {
    this.router.navigate(['/create-plan']);
  }

  navigateToPlanTracking() {
    this.router.navigate(['/plan-tracking']);
  }

  navigateToApprovedBudget() {
    this.router.navigate(['/approved-budget']);
  }
}