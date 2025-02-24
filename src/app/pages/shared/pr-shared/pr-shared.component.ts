import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PurchaseRequestService, PurchaseRequest } from 'src/app/services/purchase-request.service';

@Component({
  selector: 'app-pr-shared',
  templateUrl: './pr-shared.component.html',
  styleUrls: ['./pr-shared.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    FormsModule
  ]
})
export class PrSharedComponent implements OnInit {
  purchaseRequests: PurchaseRequest[] = [];
  filteredRequests: PurchaseRequest[] = [];
  loading = false;
  searchQuery = '';

  constructor(
    private prService: PurchaseRequestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPurchaseRequests();
  }

  async loadPurchaseRequests() {
    try {
      this.loading = true;
      this.purchaseRequests = await this.prService.getAll();
      this.filteredRequests = [...this.purchaseRequests];
    } catch (error) {
      console.error('Error loading purchase requests', error);
    } finally {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status pending';
      case 'approved':
        return 'status approved';
      case 'rejected':
        return 'status rejected';
      default:
        return 'status default';
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(value: number): string {
    return '₱ ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  viewRequest(request: PurchaseRequest) {
    this.router.navigate(['/inspection/purchase-request'], { 
      queryParams: { 
        prNo: request.prNo,
        view: 'true'
      }
    });
  }

  selectRequest(request: PurchaseRequest) {
    this.viewRequest(request);
  }

  searchRequests() {
    if (!this.searchQuery) {
      this.filteredRequests = [...this.purchaseRequests];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredRequests = this.purchaseRequests.filter((pr: PurchaseRequest) =>
      pr.prNo.toLowerCase().includes(query) ||
      pr.requisitioningOffice.toLowerCase().includes(query) ||
      (pr.purpose && pr.purpose.toLowerCase().includes(query))
    );
  }
}