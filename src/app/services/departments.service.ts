import { Injectable } from '@angular/core';
import { z } from 'zod';

// Define the office schema
export const officeSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Office name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  floor: z.number().int().min(0, "Floor must be non-negative"),
  extension: z.string().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()
});

// Define the building schema with offices
export const buildingSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Building name is required"),
  address: z.string().min(1, "Address is required"),
  numberOfFloors: z.number().int().min(1, "Must have at least one floor"),
  offices: z.array(officeSchema).optional(),
  dateConstructed: z.date().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()
});

// Define the department schema with buildings
export const departmentSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(2, "Department code must be at least 2 characters"),
  head: z.string().min(1, "Department head is required"),
  buildings: z.array(buildingSchema),
  budget: z.number().min(0, "Budget must be non-negative").optional(),
  dateEstablished: z.date().optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  contactPhone: z.string().min(10, "Contact number must be at least 10 digits").optional(),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional()
});

// TypeScript types inferred from the Zod schemas
export type Office = z.infer<typeof officeSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type Department = z.infer<typeof departmentSchema>;

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {


  private departmentData: Department[] = [
  {
    id: '12345678901234567890123456789012',
    name: 'College of Information Technology',
    code: 'CIT',
    head: 'Dr. Juan Dela Cruz',
    contactEmail: 'cit@ddosc.edu.ph',
    contactPhone: '0912345678',
    dateEstablished: new Date('2010-06-15'),
    description: 'The College of Information Technology is committed to providing quality education in computer science and information technology.',
    budget: 5000000,
    buildings: [
      {
        id: '23456789012345678901234567890123',
        name: 'IT Building',
        address: 'DDOSC Main Campus, Montevista',
        numberOfFloors: 3,
        dateConstructed: new Date('2015-03-20'),
        notes: 'Main IT building with computer laboratories',
        offices: [
          {
            id: '34567890123456789012345678901234',
            name: 'Dean\'s Office',
            roomNumber: 'IT-301',
            capacity: 4,
            floor: 3,
            extension: '101',
            notes: 'Dean and staff offices'
          },
          {
            id: '45678901234567890123456789012345',
            name: 'Computer Laboratory 1',
            roomNumber: 'IT-201',
            capacity: 40,
            floor: 2,
            extension: '102',
            notes: 'Programming laboratory'
          },
          {
            id: '56789012345678901234567890123456',
            name: 'Faculty Room',
            roomNumber: 'IT-202',
            capacity: 15,
            floor: 2,
            extension: '103',
            notes: 'IT Faculty workspace'
          }
        ]
      }
    ]
  },
  {
    id: '67890123456789012345678901234567',
    name: 'College of Education',
    code: 'COED',
    head: 'Dr. Maria Santos',
    contactEmail: 'coed@ddosc.edu.ph',
    contactPhone: '0923456789',
    dateEstablished: new Date('2010-06-15'),
    description: 'The College of Education is dedicated to developing future educators and leaders in education.',
    budget: 4500000,
    buildings: [
      {
        id: '78901234567890123456789012345678',
        name: 'Education Building',
        address: 'DDOSC Main Campus, Montevista',
        numberOfFloors: 4,
        dateConstructed: new Date('2016-07-10'),
        notes: 'Main building for College of Education',
        offices: [
          {
            id: '89012345678901234567890123456789',
            name: 'Dean\'s Office',
            roomNumber: 'ED-401',
            capacity: 4,
            floor: 4,
            extension: '201',
            notes: 'Education Dean\'s office'
          },
          {
            id: '90123456789012345678901234567890',
            name: 'Teaching Laboratory',
            roomNumber: 'ED-301',
            capacity: 30,
            floor: 3,
            extension: '202',
            notes: 'Practice teaching facility'
          }
        ]
      }
    ]
  },
  {
    id: '01234567890123456789012345678901',
    name: 'College of Agriculture',
    code: 'CA',
    head: 'Dr. Roberto Reyes',
    contactEmail: 'ca@ddosc.edu.ph',
    contactPhone: '0934567890',
    dateEstablished: new Date('2010-06-15'),
    description: 'The College of Agriculture focuses on agricultural sciences and sustainable farming practices.',
    budget: 6000000,
    buildings: [
      {
        id: 'abcdef1234567890123456789012345',
        name: 'Agriculture Building',
        address: 'DDOSC Extension Campus, Montevista',
        numberOfFloors: 2,
        dateConstructed: new Date('2017-01-15'),
        notes: 'Main agriculture building with research facilities',
        offices: [
          {
            id: 'bcdef12345678901234567890123456',
            name: 'Dean\'s Office',
            roomNumber: 'AG-201',
            capacity: 4,
            floor: 2,
            extension: '301',
            notes: 'Agriculture Dean\'s office'
          },
          {
            id: 'cdef123456789012345678901234567',
            name: 'Research Laboratory',
            roomNumber: 'AG-101',
            capacity: 25,
            floor: 1,
            extension: '302',
            notes: 'Agricultural research facility'
          }
        ]
      },
      {
        id: 'defgh1234567890123456789012345',
        name: 'Greenhouse Complex',
        address: 'DDOSC Extension Campus, Montevista',
        numberOfFloors: 1,
        dateConstructed: new Date('2018-03-20'),
        notes: 'Modern greenhouse facility for agricultural research',
        offices: [
          {
            id: 'efghi12345678901234567890123456',
            name: 'Control Room',
            roomNumber: 'GH-101',
            capacity: 5,
            floor: 1,
            extension: '303',
            notes: 'Greenhouse monitoring and control center'
          }
        ]
      }
    ]
  },
  {
    id: 'fghij1234567890123456789012345',
    name: 'College of Business',
    code: 'COB',
    head: 'Dr. Patricia Lim',
    contactEmail: 'cob@ddosc.edu.ph',
    contactPhone: '0945678901',
    dateEstablished: new Date('2012-06-15'),
    description: 'The College of Business provides comprehensive education in business administration and management.',
    budget: 4800000,
    buildings: [
      {
        id: 'ghijk1234567890123456789012345',
        name: 'Business Building',
        address: 'DDOSC Main Campus, Montevista',
        numberOfFloors: 3,
        dateConstructed: new Date('2019-08-10'),
        notes: 'Modern business education facility',
        offices: [
          {
            id: 'hijkl12345678901234567890123456',
            name: 'Dean\'s Office',
            roomNumber: 'BS-301',
            capacity: 4,
            floor: 3,
            extension: '401',
            notes: 'Business Dean\'s office'
          },
          {
            id: 'ijklm12345678901234567890123456',
            name: 'Business Innovation Hub',
            roomNumber: 'BS-201',
            capacity: 35,
            floor: 2,
            extension: '402',
            notes: 'Student entrepreneurship center'
          },
          {
            id: 'jklmn12345678901234567890123456',
            name: 'Faculty Room',
            roomNumber: 'BS-202',
            capacity: 12,
            floor: 2,
            extension: '403',
            notes: 'Business faculty workspace'
          }
        ]
      }
    ]
  }
];

  private readonly STORAGE_KEY = 'departments';

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Convert ISO date strings back to Date objects
        this.departmentData = parsedData.map((dept: any) => ({
          ...dept,
          dateEstablished: dept.dateEstablished ? new Date(dept.dateEstablished) : undefined,
          buildings: dept.buildings.map((building: any) => ({
            ...building,
            dateConstructed: building.dateConstructed ? new Date(building.dateConstructed) : undefined
          }))
        }));
      } catch (error) {
        console.error('Error parsing stored departments:', error);
        this.departmentData = [];
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.departmentData));
  }

  private generateId(): string {
    return (Math.random() + 1).toString(36).substring(2) + Date.now().toString(36);
  }

  // Department CRUD operations
  async getAllDepartments(): Promise<Department[]> {
    return this.departmentData;
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return this.departmentData.find(dept => dept.id === id);
  }

  async addDepartment(department: Omit<Department, 'id'>): Promise<void> {
    const newDepartment: Department = {
      ...department,
      id: this.generateId(),
      dateEstablished: department.dateEstablished || new Date()
    };
    this.departmentData.push(newDepartment);
    this.saveToLocalStorage();
  }

  async updateDepartment(department: Department): Promise<void> {
    const index = this.departmentData.findIndex(dept => dept.id === department.id);
    if (index !== -1) {
      this.departmentData[index] = department;
      this.saveToLocalStorage();
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    this.departmentData = this.departmentData.filter(dept => dept.id !== id);
    this.saveToLocalStorage();
  }

  // Building operations within a department
  async addBuildingToDepartment(departmentId: string, building: Omit<Building, 'id'>): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      const newBuilding: Building = {
        ...building,
        id: this.generateId(),
        offices: building.offices || []
      };
      department.buildings.push(newBuilding);
      this.saveToLocalStorage();
    }
  }

  async updateBuilding(departmentId: string, building: Building): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      const buildingIndex = department.buildings.findIndex(b => b.id === building.id);
      if (buildingIndex !== -1) {
        department.buildings[buildingIndex] = building;
        this.saveToLocalStorage();
      }
    }
  }

  async deleteBuilding(departmentId: string, buildingId: string): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      department.buildings = department.buildings.filter(b => b.id !== buildingId);
      this.saveToLocalStorage();
    }
  }

  // Office operations within a building
  async addOfficeToBuilding(departmentId: string, buildingId: string, office: Omit<Office, 'id'>): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      const building = department.buildings.find(b => b.id === buildingId);
      if (building) {
        const newOffice: Office = {
          ...office,
          id: this.generateId()
        };
        building.offices = building.offices || [];
        building.offices.push(newOffice);
        this.saveToLocalStorage();
      }
    }
  }

  async updateOffice(departmentId: string, buildingId: string, office: Office): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      const building = department.buildings.find(b => b.id === buildingId);
      if (building && building.offices) {
        const officeIndex = building.offices.findIndex(o => o.id === office.id);
        if (officeIndex !== -1) {
          building.offices[officeIndex] = office;
          this.saveToLocalStorage();
        }
      }
    }
  }

  async deleteOffice(departmentId: string, buildingId: string, officeId: string): Promise<void> {
    const department = this.departmentData.find(dept => dept.id === departmentId);
    if (department) {
      const building = department.buildings.find(b => b.id === buildingId);
      if (building && building.offices) {
        building.offices = building.offices.filter(o => o.id !== officeId);
        this.saveToLocalStorage();
      }
    }
  }

  // Reset all data
  async resetData(): Promise<void> {
    this.departmentData = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}