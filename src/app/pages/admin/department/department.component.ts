import { Component, OnInit } from '@angular/core';
import { DepartmentsService, Department, Building, Office } from 'src/app/services/departments.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})

export class DepartmentComponent implements OnInit {
  // Department Management
  departments: Department[] = [];
  departmentForm!: FormGroup;
  departmentDialog = false;
  isEditMode = false;
  currentDepartmentId: string | null = null;
  submitted = false;
  loading = false;

  // Building Management
  buildingDialog = false;
  buildingForm!: FormGroup;
  selectedDepartment: Department | null = null;
  currentBuilding: Building | null = null;
  buildingSubmitted = false;

  // Office Management
  officeDialog = false;
  officeForm!: FormGroup;
  selectedBuilding: Building | null = null;
  currentOffice: Office | null = null;
  officeSubmitted = false;

  showBuildingForm: boolean = false;
  showOfficeForm: boolean = false;

  constructor(
    private departmentsService: DepartmentsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.initializeForms();
  }

  // Form Initialization
  initializeForms(): void {
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(2)]],
      head: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      description: [''],
      budget: [0, [Validators.required, Validators.min(0)]]
    });

    this.buildingForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      numberOfFloors: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });

    this.officeForm = this.formBuilder.group({
      name: ['', Validators.required],
      roomNumber: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      floor: [0, [Validators.required, Validators.min(0)]],
      extension: [''],
      notes: ['']
    });
  }

  // Department Management Methods
  async loadDepartments(): Promise<void> {
    this.loading = true;
    try {
      this.departments = await this.departmentsService.getAllDepartments();
    } finally {
      this.loading = false;
    }
  }

  openNewDepartmentDialog(): void {
    this.departmentForm.reset({budget: 0});
    this.isEditMode = false;
    this.currentDepartmentId = null;
    this.submitted = false;
    this.departmentDialog = true;
  }

  editDepartment(department: Department): void {
    this.isEditMode = true;
    this.currentDepartmentId = department.id || null;
    this.departmentForm.patchValue({
      name: department.name,
      code: department.code,
      head: department.head,
      contactEmail: department.contactEmail,
      contactPhone: department.contactPhone,
      description: department.description,
      budget: department.budget
    });
    this.departmentDialog = true;
  }

  async saveDepartment(): Promise<void> {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      return;
    }

    const currentDepartment = this.isEditMode ? 
      this.departments.find(d => d.id === this.currentDepartmentId) : null;

    const departmentData = {
      ...this.departmentForm.value,
      buildings: currentDepartment?.buildings || [],
      dateEstablished: currentDepartment?.dateEstablished || new Date()
    };

    try {
      if (this.isEditMode && this.currentDepartmentId) {
        await this.departmentsService.updateDepartment({
          ...departmentData,
          id: this.currentDepartmentId
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Department updated successfully!'
        });
      } else {
        await this.departmentsService.addDepartment(departmentData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Department added successfully!'
        });
      }
      this.departmentDialog = false;
      this.loadDepartments();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the department.'
      });
    }
  }

  deleteDepartment(department: Department): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this department?',
      accept: async () => {
        if (department.id) {
          await this.departmentsService.deleteDepartment(department.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Department deleted successfully'
          });
          this.loadDepartments();
        }
      }
    });
  }

  // Building Management Methods
  manageBuildings(department: Department): void {
    this.selectedDepartment = department;
    this.currentBuilding = null;
    this.buildingDialog = true;
  }

openNewBuildingDialog(): void {
  this.buildingForm.reset({numberOfFloors: 1});
  this.currentBuilding = {} as Building;
  this.buildingSubmitted = false;
  this.showBuildingForm = true; // Add this
}

  editBuilding(building: Building): void {
    this.currentBuilding = building;
    this.buildingForm.patchValue({
      name: building.name,
      address: building.address,
      numberOfFloors: building.numberOfFloors,
      notes: building.notes
    });
  }

 async saveBuilding(): Promise<void> {
  this.buildingSubmitted = true;
  if (this.buildingForm.invalid || !this.selectedDepartment?.id) {
    return;
  }

  const buildingData = {
    ...this.buildingForm.value,
    offices: []  // Initialize empty offices array for new building
  };

  try {
    if (this.currentBuilding?.id) {
      // Update existing building
      await this.departmentsService.updateBuilding(
        this.selectedDepartment.id,
        {
          ...buildingData,
          id: this.currentBuilding.id,
          offices: this.currentBuilding.offices || []
        }
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Building updated successfully!'
      });
    } else {
      // Add new building
      await this.departmentsService.addBuildingToDepartment(
        this.selectedDepartment.id,
        buildingData
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Building added successfully!'
      });
    }
    await this.loadDepartments();
    this.currentBuilding = null;
    this.buildingForm.reset();
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the building.'
    });
  }
}

  async deleteBuilding(departmentId: string | undefined, buildingId: string | undefined): Promise<void> {
  if (!departmentId || !buildingId) return;

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this building?',
    accept: async () => {
      try {
        await this.departmentsService.deleteBuilding(departmentId, buildingId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Building deleted successfully'
        });
        await this.loadDepartments();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while deleting the building.'
        });
      }
    }
  });
}

  // Office Management Methods
  manageOffices(building: Building): void {
    this.selectedBuilding = building;
    this.currentOffice = null;
    this.officeDialog = true;
  }

 openNewOfficeDialog(): void {
  this.officeForm.reset({
    capacity: 1,
    floor: 0
  });
  this.currentOffice = {} as Office;
  this.officeSubmitted = false;
  this.showOfficeForm = true; // Add this
}

  editOffice(office: Office): void {
    this.currentOffice = office;
    this.officeForm.patchValue({
      name: office.name,
      roomNumber: office.roomNumber,
      capacity: office.capacity,
      floor: office.floor,
      extension: office.extension,
      notes: office.notes
    });
  }

  async saveOffice(): Promise<void> {
  this.officeSubmitted = true;
  if (this.officeForm.invalid || !this.selectedDepartment?.id || !this.selectedBuilding?.id) {
    return;
  }

  const officeData = {
    ...this.officeForm.value
  };

  try {
    if (this.currentOffice?.id) {
      // Update existing office
      await this.departmentsService.updateOffice(
        this.selectedDepartment.id,
        this.selectedBuilding.id,
        {
          ...officeData,
          id: this.currentOffice.id
        }
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Office updated successfully!'
      });
    } else {
      // Add new office
      await this.departmentsService.addOfficeToBuilding(
        this.selectedDepartment.id,
        this.selectedBuilding.id,
        officeData
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Office added successfully!'
      });
    }
    await this.loadDepartments();
    this.currentOffice = null;
    this.officeForm.reset();
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the office.'
    });
  }
}

 async deleteOffice(departmentId: string | undefined, buildingId: string | undefined, officeId: string | undefined): Promise<void> {
  if (!departmentId || !buildingId || !officeId) return;

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this office?',
    accept: async () => {
      try {
        await this.departmentsService.deleteOffice(departmentId, buildingId, officeId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Office deleted successfully'
        });
        await this.loadDepartments();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while deleting the office.'
        });
      }
    }
  });
}

  // Utility Methods
  hideDialog(): void {
    this.departmentDialog = false;
    this.buildingDialog = false;
    this.officeDialog = false;
    this.submitted = false;
    this.buildingSubmitted = false;
    this.officeSubmitted = false;
    this.departmentForm.reset();
    this.buildingForm.reset();
    this.officeForm.reset();
  }

  getBuildingCount(department: Department): number {
    return department.buildings?.length || 0;
  }

  getOfficeCount(department: Department): number {
    return department.buildings?.reduce((total, building) => 
      total + (building.offices?.length || 0), 0) || 0;
  }
}