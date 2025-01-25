//src/app/services/departments.service.ts

import { Injectable } from '@angular/core';
import { z } from 'zod';

// Define schemas
export const officeSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Office name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  floor: z.number().int().min(0, "Floor must be non-negative"),
  extension: z.string().optional(),
  buildingId: z.string().length(32, "Building ID must be exactly 32 characters"),
  departmentId: z.string().length(32, "Department ID must be exactly 32 characters"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()
});

export const buildingSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Building name is required"),
  address: z.string().min(1, "Address is required"),
  numberOfFloors: z.number().int().min(1, "Must have at least one floor"),
  dateConstructed: z.date().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const departmentSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(2, "Department code must be at least 2 characters"),
  head: z.string().min(1, "Department head is required"),
  budget: z.number().min(0, "Budget must be non-negative"),
  dateEstablished: z.date(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Contact number must be at least 10 digits"),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional()
});

export type Office = z.infer<typeof officeSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type Department = z.infer<typeof departmentSchema>;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly DEPARTMENTS_KEY = 'departments';
  private readonly BUILDINGS_KEY = 'buildings';
  private readonly OFFICES_KEY = 'offices';

  private departments: Department[] = [];
  private buildings: Building[] = [];
  private offices: Office[] = [];

  constructor() {
    this.loadFromLocalStorage();
    if (!this.departments.length) this.loadDummyData();
  }

  private loadFromLocalStorage(): void {
    const storedDepartments = localStorage.getItem(this.DEPARTMENTS_KEY);
    const storedBuildings = localStorage.getItem(this.BUILDINGS_KEY);
    const storedOffices = localStorage.getItem(this.OFFICES_KEY);

    this.departments = storedDepartments ? JSON.parse(storedDepartments) : [];
    this.buildings = storedBuildings ? JSON.parse(storedBuildings) : [];
    this.offices = storedOffices ? JSON.parse(storedOffices) : [];
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.DEPARTMENTS_KEY, JSON.stringify(this.departments));
    localStorage.setItem(this.BUILDINGS_KEY, JSON.stringify(this.buildings));
    localStorage.setItem(this.OFFICES_KEY, JSON.stringify(this.offices));
  }

  private generate32DigitId(): string {
    return Array(32)
      .fill(null)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  }

  private loadDummyData(): void {
    const dummyDepartments: Department[] = [
      {
        id: this.generate32DigitId(),
        name: 'HR',
        code: 'HR',
        head: 'Alice Johnson',
        budget: 100000,
        dateEstablished: new Date('2020-01-15'),
        contactEmail: 'hr@example.com',
        contactPhone: '1234567890',
        description: 'Handles recruitment and employee relations.'
      },
      {
        id: this.generate32DigitId(),
        name: 'IT',
        code: 'IT',
        head: 'Bob Smith',
        budget: 250000,
        dateEstablished: new Date('2018-06-10'),
        contactEmail: 'it@example.com',
        contactPhone: '0987654321',
        description: 'Manages IT support and systems.'
      }
    ];

    const dummyBuildings: Building[] = [
      {
        id: this.generate32DigitId(),
        name: 'Main Office',
        address: '123 Main St',
        numberOfFloors: 5,
        dateConstructed: new Date('2015-05-20'),
        notes: 'Main building for corporate operations.'
      },
      {
        id: this.generate32DigitId(),
        name: 'Tech Center',
        address: '456 Tech St',
        numberOfFloors: 10,
        dateConstructed: new Date('2017-11-10'),
        notes: 'Building for technical teams and R&D.'
      }
    ];

    const dummyOffices: Office[] = [
      {
        id: this.generate32DigitId(),
        name: 'Recruitment Office',
        roomNumber: '101',
        capacity: 5,
        floor: 1,
        extension: '1101',
        buildingId: dummyBuildings[0]?.id || '',
        departmentId: dummyDepartments[0]?.id || '',
        notes: 'Handles walk-in interviews.'
      },
      {
        id: this.generate32DigitId(),
        name: 'Support Room',
        roomNumber: '302',
        capacity: 10,
        floor: 3,
        extension: '2302',
        buildingId: dummyBuildings[1]?.id || '',
        departmentId: dummyDepartments[1]?.id || '',
        notes: 'Support for technical issues.'
      }
    ];

    this.departments = dummyDepartments;
    this.buildings = dummyBuildings;
    this.offices = dummyOffices;
    this.saveToLocalStorage();
  }

  // CRUD methods for departments
  async getAllDepartments(): Promise<Department[]> {
    return this.departments;
  }

  async addDepartment(department: Omit<Department, 'id'>): Promise<void> {
    const newDepartment = { ...department, id: this.generate32DigitId() };
    this.departments.push(newDepartment);
    this.saveToLocalStorage();
  }

  async editDepartment(department: Department): Promise<void> {
    const index = this.departments.findIndex(d => d.id === department.id);
    if (index !== -1) {
      this.departments[index] = department;
      this.saveToLocalStorage();
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    this.departments = this.departments.filter(d => d.id !== id);
    this.offices = this.offices.filter(o => o.departmentId !== id);
    this.saveToLocalStorage();
  }

  // CRUD methods for buildings
  async getAllBuildings(): Promise<Building[]> {
    return this.buildings;
  }

  async addBuilding(building: Omit<Building, 'id'>): Promise<void> {
    const newBuilding = { ...building, id: this.generate32DigitId() };
    this.buildings.push(newBuilding);
    this.saveToLocalStorage();
  }

  async editBuilding(building: Building): Promise<void> {
    const index = this.buildings.findIndex(b => b.id === building.id);
    if (index !== -1) {
      this.buildings[index] = building;
      this.saveToLocalStorage();
    }
  }

  async deleteBuilding(id: string): Promise<void> {
    this.buildings = this.buildings.filter(b => b.id !== id);
    this.offices = this.offices.filter(o => o.buildingId !== id);
    this.saveToLocalStorage();
  }

  // CRUD methods for offices
  async getAllOffices(): Promise<Office[]> {
    return this.offices;
  }

  async addOffice(office: Omit<Office, 'id'>): Promise<void> {
    const newOffice = { ...office, id: this.generate32DigitId() };
    this.offices.push(newOffice);
    this.saveToLocalStorage();
  }

  async editOffice(office: Office): Promise<void> {
    const index = this.offices.findIndex(o => o.id === office.id);
    if (index !== -1) {
      this.offices[index] = office;
      this.saveToLocalStorage();
    }
  }

  async deleteOffice(id: string): Promise<void> {
    this.offices = this.offices.filter(o => o.id !== id);
    this.saveToLocalStorage();
  }
}
