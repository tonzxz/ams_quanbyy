import { Injectable } from '@angular/core';
import { z } from 'zod';

// InventoryLocation schema
export const inventoryLocationSchema = z.object({
  id: z.string().length(32).optional(),
  name: z.string().min(1, "Location name is required"),
  officeId: z.string().length(32, "Office ID must be 32 chars"),
  capacity: z.number().int().min(1, "Capacity must be >= 1"),
  notes: z.string().max(500).optional()
});

// Inventory schema
export const inventorySchema = z.object({
  id: z.string().length(32).optional(),
  itemName: z.string().min(1, "Item name is required"), // from classification
  locationId: z.string().length(32, "Location ID must be 32 chars"),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  dateAcquired: z.date().optional(),
  notes: z.string().max(1000).optional()
});

export type InventoryLocation = z.infer<typeof inventoryLocationSchema>;
export type Inventory = z.infer<typeof inventorySchema>;

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly INVENTORY_STORAGE_KEY = 'inventory_data';
  private readonly LOCATIONS_STORAGE_KEY = 'inventory_locations';

  private inventoryList: Inventory[] = [];
  private locations: InventoryLocation[] = [];

  constructor() {
    this.loadFromLocalStorage();
    if (!this.inventoryList.length && !this.locations.length) {
      this.loadDummyData();
    }
  }

  private loadFromLocalStorage() {
    const inv = localStorage.getItem(this.INVENTORY_STORAGE_KEY);
    const loc = localStorage.getItem(this.LOCATIONS_STORAGE_KEY);

    this.inventoryList = inv ? JSON.parse(inv) : [];
    this.locations = loc ? JSON.parse(loc) : [];
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.INVENTORY_STORAGE_KEY, JSON.stringify(this.inventoryList));
    localStorage.setItem(this.LOCATIONS_STORAGE_KEY, JSON.stringify(this.locations));
  }

  private generateId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private loadDummyData() {
    // create a couple of locations
    const loc1: InventoryLocation = {
      id: this.generateId(),
      name: 'Location A',
      officeId: 'ffffffffffffffffffffffffffffffff', // example office ID
      capacity: 50
    };
    const loc2: InventoryLocation = {
      id: this.generateId(),
      name: 'Location B',
      officeId: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      capacity: 30
    };

    // create sample inventory
    const inv1: Inventory = {
      id: this.generateId(),
      itemName: 'Office Supplies', // from classification
      locationId: loc1.id!,
      quantity: 500
    };
    const inv2: Inventory = {
      id: this.generateId(),
      itemName: 'Electronics', // from classification
      locationId: loc2.id!,
      quantity: 10
    };

    this.locations = [loc1, loc2];
    this.inventoryList = [inv1, inv2];
    this.saveToLocalStorage();
  }

  // CRUD for Inventory Locations
  async getAllLocations(): Promise<InventoryLocation[]> {
    return this.locations;
  }

  async addLocation(data: Omit<InventoryLocation, 'id'>): Promise<InventoryLocation> {
    const newLoc: InventoryLocation = {
      ...data,
      id: this.generateId()
    };
    inventoryLocationSchema.parse(newLoc);
    this.locations.push(newLoc);
    this.saveToLocalStorage();
    return newLoc;
  }

  async updateLocation(loc: InventoryLocation): Promise<InventoryLocation> {
    inventoryLocationSchema.parse(loc);
    const idx = this.locations.findIndex(l => l.id === loc.id);
    if (idx === -1) throw new Error('Location not found');
    this.locations[idx] = loc;
    this.saveToLocalStorage();
    return loc;
  }

  async deleteLocation(id: string): Promise<void> {
    this.locations = this.locations.filter(l => l.id !== id);
    // clear references from inventory
    this.inventoryList = this.inventoryList.map(inv =>
      inv.locationId === id ? { ...inv, locationId: '' } : inv
    );
    this.saveToLocalStorage();
  }

  // CRUD for Inventory
  async getAllInventory(): Promise<Inventory[]> {
    return this.inventoryList;
  }

  async addInventory(data: Omit<Inventory, 'id'>): Promise<Inventory> {
    const newInv: Inventory = {
      ...data,
      id: this.generateId()
    };
    inventorySchema.parse(newInv);
    this.inventoryList.push(newInv);
    this.saveToLocalStorage();
    return newInv;
  }

  async updateInventory(item: Inventory): Promise<Inventory> {
    inventorySchema.parse(item);
    const idx = this.inventoryList.findIndex(i => i.id === item.id);
    if (idx === -1) throw new Error('Item not found');
    this.inventoryList[idx] = item;
    this.saveToLocalStorage();
    return item;
  }

  async deleteInventory(id: string): Promise<void> {
    this.inventoryList = this.inventoryList.filter(i => i.id !== id);
    this.saveToLocalStorage();
  }
}
