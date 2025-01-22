// models/delivered-items.interface.ts
export interface DeliveryItem {
    id: string;
    name: string;
    quantity: number;
    status: 'pending' | 'delivered' | 'missing';
    isDelivered: boolean;
  }
  
  export interface DeliveredItem {
    id: string;
    supplierName: string;
    supplierId: string;
    dateDelivered: Date;
    department: string;
    documentUrl: string;
    status: 'pending' | 'accepted' | 'rejected';
    items: DeliveryItem[];
  }