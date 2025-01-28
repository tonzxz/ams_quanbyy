import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StocksService, Stock } from 'src/app/services/stocks.service';
import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { MatCardModule } from '@angular/material/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-requisition-and-issue-slip',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    InputNumberModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    TabsModule,
    DialogModule
  ],
  templateUrl: './requisition-and-issue-slip.component.html',
  styleUrls: ['./requisition-and-issue-slip.component.scss']
})
export class RequisitionAndIssueSlipComponent implements OnInit {
  activeTab: string = 'create';
  issuanceForm: FormGroup;
  requisitionForm: FormGroup;
  items: Stock[] = [];
  userRequisitions: Requisition[] = [];
  selectedRequisitionItems: Stock[] = [];
  pendingIssuances = [
    { requisition: { title: 'Office Supplies Request' }, item: { name: 'Paper' }, quantity: 10, purpose: 'Office work', status: 'Waiting for Approval' },
    { requisition: { title: 'Electronics Request' }, item: { name: 'Laptop' }, quantity: 2, purpose: 'Work', status: 'Waiting for Approval' }
  ];
  showRequisitionDialog: boolean = false;

  constructor(private fb: FormBuilder, private stocksService: StocksService, private requisitionService: RequisitionService) {
    this.issuanceForm = this.fb.group({
      requisition: [null, Validators.required],
      item: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      purpose: ['', Validators.required]
    });

    this.requisitionForm = this.fb.group({
      title: ['', Validators.required],
      purpose: ['', Validators.required],
      item: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  async ngOnInit() {
    this.items = await this.stocksService.getAll();
    this.userRequisitions = await this.requisitionService.getAllRequisitions();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  submitIssuance(): void {
    if (this.issuanceForm.valid) {
      const issuance = {
        requisition: this.issuanceForm.value.requisition,
        item: this.issuanceForm.value.item,
        quantity: this.issuanceForm.value.quantity,
        purpose: this.issuanceForm.value.purpose,
        status: 'Waiting for Approval'
      };
      this.pendingIssuances.push(issuance);
      this.issuanceForm.reset();
    }
  }

  cancelIssuance(): void {
    this.issuanceForm.reset();
  }

  openRequisitionDialog(): void {
    this.showRequisitionDialog = true;
  }

  closeRequisitionDialog(): void {
    this.showRequisitionDialog = false;
    this.requisitionForm.reset();
  }

  async submitRequisition(): Promise<void> {
    if (this.requisitionForm.valid) {
      const requisition = {
        title: this.requisitionForm.value.title,
        purpose: this.requisitionForm.value.purpose,
        item: this.requisitionForm.value.item,
        quantity: this.requisitionForm.value.quantity,
        status: 'Pending',
        classifiedItemId: 'defaultClassifiedItemId',
        group: 'defaultGroup',
        products: [],
        currentApprovalLevel: 1,
        approvalStatus: 'Pending',
        approvalHistory: [],
        createdByUserId: 'currentUserId',
        createdByUserName: 'currentUserName',
      };

      console.log('Requisition Created:', requisition);
      
      this.userRequisitions = await this.requisitionService.getAllRequisitions();
      this.closeRequisitionDialog();
    }
  }
}