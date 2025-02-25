import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DepartmentService, Department, Building, Office } from 'src/app/services/departments.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    TabViewModule,
    DropdownModule,
    ToastModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  buildings: Building[] = [];
  offices: Office[] = [];
  filteredBuildings: Building[] = [];

  departmentForm!: FormGroup;
  buildingForm!: FormGroup;
  officeForm!: FormGroup;

  departmentDialog = false;
  buildingDialog = false;
  officeDialog = false;

  departmentSubmitted = false;
  buildingSubmitted = false;
  officeSubmitted = false;

  isEditingDepartment = false;
  isEditingBuilding = false;
  isEditingOffice = false;

  loading = false;

  deleteDialogVisible: boolean = false;
  deleteItemId: string | null = null;
  deleteItemType: 'department' | 'building' | 'office' | null = null;

  
  currentDepartmentId: string | null = null;
  currentBuildingId: string | null = null;
  currentOfficeId: string | null = null;

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.initializeForms();
  }

  async loadAll(): Promise<void> {
    this.loading = true;
    try {
      this.departments = await this.departmentService.getAllDepartments() || [];
      this.buildings = await this.departmentService.getAllBuildings() || [];
      this.offices = await this.departmentService.getAllOffices() || [];
    } finally {
      this.loading = false;
    }
  }

  initializeForms(): void { 
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    // this.buildingForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   address: ['', Validators.required],
    //   numberOfFloors: [1, [Validators.required, Validators.min(1)]],
    //   notes: ['']
    // });
    this.officeForm = this.formBuilder.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }


  openNewDepartment(): void {
    this.departmentForm.reset({ budget: 0 });
    this.isEditingDepartment = false;
    this.currentDepartmentId = null;
    this.departmentSubmitted = false;
    this.departmentDialog = true;
  }

  editDepartment(department: Department): void {
    this.isEditingDepartment = true;
    this.currentDepartmentId = department.id ?? null;
    this.departmentForm.patchValue(department);
    this.departmentDialog = true;
  }

  async saveDepartment(): Promise<void> {
    this.departmentSubmitted = true;
    if (this.departmentForm.invalid) return;

    const departmentData = {
      ...this.departmentForm.value,
      dateEstablished: new Date(),
    };

    try {
      if (this.isEditingDepartment && this.currentDepartmentId) {
        await this.departmentService.editDepartment({
          ...departmentData,
          id: this.currentDepartmentId,
        });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department updated successfully' });
      } else {
        await this.departmentService.addDepartment(departmentData);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department added successfully' });
      }
      this.departmentDialog = false;
      this.loadAll();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save department' });
    }
  }

  // openNewBuilding(): void {
  //   this.buildingForm.reset({ numberOfFloors: 1 });
  //   this.isEditingBuilding = false;
  //   this.currentBuildingId = null;
  //   this.buildingSubmitted = false;
  //   this.buildingDialog = true;
  // }

  // editBuilding(building: Building): void {
  //   this.isEditingBuilding = true;
  //   this.currentBuildingId = building.id ?? null;
  //   this.buildingForm.patchValue(building);
  //   this.buildingDialog = true;
  // }

  // async saveBuilding(): Promise<void> {
  //   this.buildingSubmitted = true;
  //   if (this.buildingForm.invalid) return;

  //   const buildingData = {
  //     ...this.buildingForm.value,
  //     dateConstructed: new Date(),
  //   };

  //   try {
  //     if (this.isEditingBuilding && this.currentBuildingId) {
  //       await this.departmentService.editBuilding({
  //         ...buildingData,
  //         id: this.currentBuildingId,
  //       });
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Building updated successfully' });
  //     } else {
  //       await this.departmentService.addBuilding(buildingData);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Building added successfully' });
  //     }
  //     this.buildingDialog = false;
  //     this.loadAll();
  //   } catch (error) {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save building' });
  //   }
  // }

  openNewOffice(): void {
    this.officeForm.reset({
      name: '',
      departmentId: ''
    });
    this.isEditingOffice = false;
    this.currentOfficeId = null;
    this.officeSubmitted = false;
    this.officeDialog = true;
  }

  editOffice(office: Office): void {
    this.isEditingOffice = true;
    this.currentOfficeId = office.id ?? null;
    this.officeForm.patchValue({
      name: office.name,
      departmentId: office.departmentId  // Changed to match form control name
    });
    this.officeDialog = true;
  }


  async saveOffice(): Promise<void> {
    this.officeSubmitted = true;
    
    console.log('Form value:', this.officeForm.value);  // Debug log
    console.log('Form valid:', this.officeForm.valid);  // Debug log
    
    if (this.officeForm.invalid) {
      console.log('Form errors:', this.officeForm.errors);  // Debug log
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation Error', 
        detail: 'Please fill in all required fields' 
      });
      return;
    }
  
    const officeData = {
      ...this.officeForm.value,
      department_id: this.officeForm.value.departmentId  // Map to correct API field name
    };
  
    try {
      if (this.isEditingOffice && this.currentOfficeId) {
        await this.departmentService.editOffice({
          ...officeData,
          id: this.currentOfficeId
        });
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Office updated successfully' 
        });
      } else {
        await this.departmentService.addOffice(officeData);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Office added successfully' 
        });
      }
      this.officeDialog = false;
      this.loadAll();
    } catch (error: any) {
      console.error('Save office error:', error);  // Debug log
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to save office: ' + (error.message || 'Unknown error') 
      });
    }
  }

  // confirmDelete(type: 'department' | 'building' | 'office', id: string): void {
  //   this.confirmationService.confirm({
  //     message: `Are you sure you want to delete this ${type}?`,
  //     accept: () => this.delete(type, id),
  //   });
  // }

  confirmDelete(type: 'department' | 'building' | 'office', id: string): void {
  this.confirmationService.confirm({
    message: `Are you sure you want to delete this ${type}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-text',
    accept: () => this.delete(type, id),
  });
}


  private async delete(type: 'department' | 'building' | 'office', id: string): Promise<void> {
    try {
      switch (type) {
        case 'department':
          await this.departmentService.deleteDepartment(id);
          break;
        case 'building':
          await this.departmentService.deleteBuilding(id);
          break;
        case 'office':
          await this.departmentService.deleteOffice(id);
          break;
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `${type} deleted successfully` });
      this.loadAll();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to delete ${type}` });
    }
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department?.name || 'N/A';
  }

  getBuildingName(buildingId: string): string {
    const building = this.buildings.find(b => b.id === buildingId);
    return building?.name || 'N/A';
  }

  showDeleteDialog(type: 'department' | 'building' | 'office', id: string): void {
  this.deleteDialogVisible = true;
  this.deleteItemType = type;
  this.deleteItemId = id;
}



deleteType: 'department' | 'building' | 'office' | null = null;
deleteId: string | null = null;

openDeleteDialog(type: 'department' | 'building' | 'office', id: string): void {
  this.deleteDialogVisible = true;
  this.deleteType = type;
  this.deleteId = id;
}

confirmDeleteAction(): void {
  if (this.deleteType && this.deleteId) {
    this.delete(this.deleteType, this.deleteId);
  }
  this.deleteDialogVisible = false;
  this.deleteType = null;
  this.deleteId = null;
}

}
