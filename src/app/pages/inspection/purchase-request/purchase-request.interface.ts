//purchase-request.interface
export interface Signatory {
    name: string;
    designation: string;
}

export interface PurchaseRequestItem {
    unit: string;
    description: string;
    qty: number;
    unitCost: number;
    totalCost: number;
    itemNo: string; 
}

export interface PurchaseRequest {
    id: string;
    prNo: string;
    saiNo?: string;
    alobsNo?: string;
    date: Date;
    saiDate?: Date | null;  // Made optional and nullable
    alobsDate?: Date | null;  // Made optional and nullable
    requisitioningOffice: string;
    items: PurchaseRequestItem[];
    totalAmount: number;
    purpose: string;
    status: PurchaseRequestStatus;
    requestedBy: Signatory;
    recommendedBy: Signatory;
    approvedBy: Signatory;
    certification?: Signatory;
    ppmpId?: string;
    appId?: string;
}

export enum PurchaseRequestStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected'
}