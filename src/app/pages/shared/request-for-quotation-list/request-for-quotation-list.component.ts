import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { RFQ, RFQService } from 'src/app/services/rfq.service';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { Supplier, SuppliersService } from 'src/app/services/suppliers.service';
import { SelectModule } from 'primeng/select';
import { Department, DepartmentService } from 'src/app/services/departments.service';
import { User, UserService } from 'src/app/services/user.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TabsModule } from 'primeng/tabs';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { Requisition, RequisitionService } from 'src/app/services/requisition.service';
import { ApprovalSequenceService } from 'src/app/services/approval-sequence.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notifications.service';
import { RequestQuotationComponent } from '../request-quotation/request-quotation.component';
import { AoqComponent } from '../aoq/aoq.component';

@Component({
  selector: 'app-rfq',
  standalone: true,
  imports: [MaterialModule, CommonModule, StepperModule, TableModule, ButtonModule, ButtonGroupModule, TabsModule, OverlayBadgeModule, BadgeModule,
    InputTextModule, FormsModule, SelectModule, FileUploadModule, DatePickerModule, InputNumberModule, ToastModule, ReactiveFormsModule, TextareaModule, LottieAnimationComponent,
    FluidModule, TooltipModule, DialogModule, ConfirmPopupModule, IconFieldModule, InputIconModule, DividerModule, RequestQuotationComponent, AoqComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './request-for-quotation-list.component.html',
  styleUrls: ['./request-for-quotation-list.component.scss']
})
export class RequestForQuotationListComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;

  activeStep: number = 1;
  rfqs: RFQ[] = [];
  filteredRFQs: RFQ[] = [];
  suppliers: Supplier[] = [];
  requisitions: Requisition[] = [];
  allRequisitions: Requisition[] = [];
  departments: Department[] = [];
  searchValue: string = '';

  showRFQModal: boolean = false;
  showSupplierModal: boolean = false;
  showAwardModal: boolean = false;

  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  files: File[] = [];

  form = new FormGroup({
    purchase_order: new FormControl<Requisition | null>(null, [Validators.required])
  });

  supplier_form = new FormGroup({
    supplier: new FormControl<Supplier | null>(null, [Validators.required])
  });
  award_form = new FormGroup({
    supplier: new FormControl<Supplier | null>(null, [Validators.required])
  });
  supplier_upload_form = new FormGroup({
    upload: new FormControl('', [Validators.required])
  });
  reject_form = new FormGroup({
    notes: new FormControl('', [Validators.required])
  });
  constructor(
    private router: Router,
    private userService: UserService,
    private departmentService: DepartmentService,
    private supplierService: SuppliersService,
    private rfqService: RFQService,
    private requisitionService: RequisitionService,
    private approvalSequenceService: ApprovalSequenceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private notifService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.fetchItems();
  }

  openRFQModal() {
    this.form.reset();
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.showRFQModal = true;
  }


  currentUser?: User;

  selectedRFQ?: RFQ;

  openSupplierModal(rfq: RFQ) {
    this.supplier_form.reset();
    this.selectedRFQ = rfq;
    this.showSupplierModal = true;
  }

  isModalVisible = false; // Controls modal visibility

  selectedRequisitionId: string = '';

  openRFQDocument(requisitionId?: string): void {
    if (requisitionId) {
      this.selectedRequisitionId = requisitionId; // Ensure it's valid
      this.isModalVisible = true;
    } else {
      console.error('Requisition ID is null or undefined');
    }
  }


  openAwardModal(rfq: RFQ) {
    this.award_form.reset();
    this.selectedRFQ = rfq;
    this.showAwardModal = true;
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles ?? []
  }

  showUploadSupplier: boolean = false;

  selectedSupplier?: Supplier;

  openUploadSupplier(supplier: Supplier) {
    this.files = [];
    this.supplier_upload_form.reset();
    this.selectedSupplier = supplier;
    this.showUploadSupplier = true;
  }

  openEditRFQModal(rfq: RFQ) {
    this.form.reset();
    if (this.fileUpload) {
      this.fileUpload.clear();
    }

    this.form.patchValue({
      purchase_order: this.requisitions.find(r => r.id == rfq.purchase_order),
    });
    this.selectedRFQ = rfq;
    this.showRFQModal = true;
  }

  async addSupplier() {
    const supplier = this.supplier_form.value;
    await this.rfqService.editRFQ({
      ...this.selectedRFQ!,
      suppliers: [...this.selectedRFQ!.suppliers, {
        supplierId: supplier.supplier!.id!,
        supplierName: supplier.supplier!.name,
        biddingPrice: undefined,

      }]
    })
    this.form.reset();
    this.showSupplierModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully added supplier on RFQ No. ${this.selectedRFQ!.id}` });
    await this.fetchItems();
    this.activeStep = 1;
  }


  showReject: boolean = false;

  openReject(rfq: RFQ) {
    this.reject_form.reset();
    this.showReject = true;
    this.selectedRFQ = rfq;
  }



  async addRFQ() {
    const rfq = this.form.value;
    const id = `RFQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
    await this.rfqService.addRFQ({
      id: id,
      purchase_order: rfq.purchase_order?.id,
      suppliers: [],
      status: 'new',
    });
    this.form.reset();
    this.showRFQModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully added RFQ No. ${id}` });
    await this.fetchItems();
    this.activeStep = 1;
  }


  filterByStatus(status: 'new' | 'canvasing' | 'approved') {
    this.filteredRFQs = this.rfqs.filter(rfq => rfq.status == status);
  }

  nextStep() {
    this.activeStep++;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('new');
        break;
      case 2:
        this.filterByStatus('canvasing');
        break;
      case 3:
        this.filterByStatus('approved');
        break;
    }
  }

  countRFQ(status: 'new' | 'canvasing' | 'approved') {
    return this.rfqs.filter(rfq => rfq.status == status).length;
  }

  backStep() {
    this.activeStep--;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('new');
        break;
      case 2:
        this.filterByStatus('canvasing');
        break;
      case 3:
        this.filterByStatus('approved');
        break;

    }
  }

  switchTab(number: 1 | 2 | 3) {
    this.activeStep = number;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('new');
        break;
      case 2:
        this.filterByStatus('canvasing');
        break;
      case 3:
        this.filterByStatus('approved');
        break;

    }
  }

  async confirmDeleteRFQ(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this RFQ?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: async () => {
        await this.rfqService.deleteRFQ(id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully deleted RFQ.` });
        await this.fetchItems();
        this.activeStep = 1;
      },
      reject: () => { },
    });
  }



  async confirmDeleteSupplier(event: Event, rfq: RFQ, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to remove this supplier?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: async () => {
        await this.rfqService.editRFQ({
          ...rfq,
          suppliers: rfq.suppliers.filter(s => s.supplierId != id)
        })



        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully removed supplier.` });
        await this.fetchItems();
        this.activeStep = 1;
      },
      reject: () => { },
    });
  }


  async confirmSubmitToCanvasing(event: Event, rfq: RFQ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to submit this RFQ for canvasing?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: async () => {
        await this.rfqService.editRFQ({
          ...rfq,
          status: 'canvasing',
        })
        const users = await firstValueFrom(this.userService.getAllUsers());
        const po = this.allRequisitions.find(r => r.id == rfq.purchase_order);
        for (let user of users) {
          if (user.role == 'bac' || user.id == po?.createdByUserId) {
            this.notifService.addNotification(
              `RFQ No. ${rfq.id} has been submitted for end-user canvasing.`,
              'info',
              user.id
            )
          }
        }

        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully submitted RFQ for End User Canvasing.` });
        await this.fetchItems();
        this.filterByStatus('canvasing');
        this.activeStep = 2;
      },
      reject: () => { },
    });
  }



  async confirmApprove(rfq: RFQ) {
    const supplier = this.award_form.value;
    await this.rfqService.editRFQ({
      ...rfq,
      status: 'approved',
      supplier: supplier.supplier!.id
    })
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully approved RFQ.` });
    const users = await firstValueFrom(this.userService.getAllUsers());
    for (let user of users) {
      if (user.role == 'bac') {
        this.notifService.addNotification(
          `RFQ No. ${rfq.id} has been approved on end-user canvasing.`,
          'info',
          user.id
        )
      }
    }
    await this.fetchItems();
    this.filterByStatus('canvasing');
    this.activeStep = 2;
    this.showAwardModal = false;
  }
  getSupplierName(id?: string) {
    return this.suppliers.find(s => s.id == id)?.name ?? 'N/A';
  }

  async rejectRFQ(rfq: RFQ) {
    await this.rfqService.editRFQ({
      ...rfq,
      status: 'new',
    })
    this.showReject = false;
    const users = await firstValueFrom(this.userService.getAllUsers());
    for (let user of users) {
      if (user.role == 'bac') {
        this.notifService.addNotification(
          `RFQ No. ${rfq.id} has been rejected on end-user canvasing.`,
          'info',
          user.id
        )
      }
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully rejected RFQ.` });
    await this.fetchItems();
    this.filterByStatus('canvasing');
    this.activeStep = 2;
  }

  getPR(id?: string) {
    return this.allRequisitions.find(r => r.id == id);
  }

  getPRTotal(id: string) {
    const req = this.allRequisitions.find(r => r.id == id);
    return req?.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) ?? 0
  }

  getUntakenSuppliers(rfq: RFQ) {
    return this.suppliers.filter(s => !rfq?.suppliers.map(t => t.supplierId).includes(s.id!))
  }

  getTakenSuppliers(rfq: RFQ) {
    return this.suppliers.filter(s => rfq?.suppliers.map(t => t.supplierId).includes(s.id!))
  }

  async fetchItems() {
    this.currentUser = this.userService.getUser();
    this.allRequisitions = await this.requisitionService.getAllRequisitions();
    this.rfqs = await this.rfqService.getAll();
    this.rfqs = this.rfqs.filter(r => this.getPR(r.purchase_order));
    this.suppliers = await this.supplierService.getAll();
    this.departments = await this.departmentService.getAllDepartments();
    const allSequences = await firstValueFrom(this.approvalSequenceService.getAllSequences());

    this.requisitions = this.allRequisitions
      .map((req) => {
        // const typeSequences = allSequences.filter(
        //   (seq) => seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
        // );

        const currentSequence = allSequences.find(
          (seq) => seq.id === req.approvalSequenceId
        );

        return {
          ...req,
          approvalSequenceDetails: currentSequence
          ,
        };
      })
      .filter((req) => {
        if (this.rfqs.find(dr => dr.purchase_order == req.id)) {
          return false;
        }
        return req.approvalSequenceDetails && (req.approvalSequenceDetails?.roleCode == 'bac')
      });
    if (this.currentUser?.role == 'end-user') {
      this.filterByStatus('canvasing');
      this.activeStep = 2;
    } else {
      this.filterByStatus('new');
    }
  }


  showAOQModal: boolean = false; // Modal visibility control
  selectedRFQId: string | null = null; // Selected RFQ ID for AOQ

  generateAOQ(rfqId: string): void {
    this.selectedRFQId = rfqId; // Set the RFQ ID to pass to AoqComponent
    this.showAOQModal = true; // Show the modal
  }


}
