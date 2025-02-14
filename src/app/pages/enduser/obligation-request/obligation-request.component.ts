import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
  selector: 'app-obligation-request',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    CommonModule,
    InputTextModule,
    TextareaModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    FileUploadModule,
    FormsModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './obligation-request.component.html',
  styleUrl: './obligation-request.component.scss',
  providers: [MessageService]
})
export class ObligationRequestComponent {

  searchQuery = '';
  displayDialog = false;
  
  orsList = [
    { id: 'ORS-2024-001', requestingOffice: 'Procurement Unit', payee: 'XYZ Supplies', particulars: 'Purchase of office supplies', fundSource: 'General Fund', accountCode: '50203010', amount: 5000, supportingDocs: true, status: 'Pending', date: '2025-02-10' },
    { id: 'ORS-2024-002', requestingOffice: 'IT Department', payee: 'ABC Technologies', particulars: 'Procurement of laptops', fundSource: 'Special Fund', accountCode: '50604020', amount: 75000, supportingDocs: true, status: 'Approved', date: '2025-02-08' },
    { id: 'ORS-2024-003', requestingOffice: 'HR Department', payee: 'Payroll Services Inc.', particulars: 'Employee Benefits Payment', fundSource: 'Trust Fund', accountCode: '50102030', amount: 320000, supportingDocs: false, status: 'Rejected', date: '2025-02-05' }
  ];

  filteredORSList = [...this.orsList];

  constructor(private messageService: MessageService) {}

  filterRequests(){
    this.filteredORSList = this.orsList.filter(ors =>
      Object.values(ors).some(value =>
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
  }

  ors = {
    requestingOffice: '',
    payee: '',
    particulars: '',
    amount: null as number | null,
    fundSource: null as { name: string } | null, // Explicit type
    accountCode: '',
    requestDate: new Date()
  };
  

  fundSources = [
    { name: 'General Fund', code: 'GF' },
    { name: 'Special Fund', code: 'SF' },
    { name: 'Trust Fund', code: 'TF' }
  ];

  

  showDialog() {
    this.displayDialog = true;
  }

  submitORS() {
    const newORS = {
      id: `ORS-${new Date().getTime()}`, // Unique ID
      requestingOffice: this.ors.requestingOffice,
      payee: this.ors.payee,
      particulars: this.ors.particulars,
      fundSource: this.ors.fundSource ? this.ors.fundSource.name : '', // Ensure string format
      accountCode: this.ors.accountCode,
      amount: this.ors.amount ?? 0, // Default to 0 if null
      supportingDocs: false, // Adjust based on file upload
      status: 'Pending', // Default status
      date: new Date().toISOString().split('T')[0]
    };
  
    // Add the new ORS to the list
    this.orsList.unshift(newORS);
  
    // Update the filtered list
    this.filterRequests();
  
    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'ORS Created',
      detail: 'Your ORS request has been submitted successfully.',
    });
  
    // Reset the form
    this.ors = {
      requestingOffice: '',
      payee: '',
      particulars: '',
      amount: null,
      fundSource: null,
      accountCode: '',
      requestDate: new Date()
    };
  
    // Close the dialog
    this.displayDialog = false;
  }
  

  onFileUpload(event: any) {
    console.log('File Uploaded:', event);

    // Show File Upload Success Toast
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: 'Supporting document uploaded successfully.',
    });
  }

  
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-300';
      case 'Approved': return 'bg-green-300';
      case 'Rejected': return 'bg-red-300';
      default: return 'bg-gray-500';
    }
  }
}
