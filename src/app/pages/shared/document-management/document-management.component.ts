import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';

interface Document {
  id: number;
  procurementProcessName: string;
  entityName: string;
  recordName: string;
  filePath: string;
  uploadedByName: string; // Ensure this is not nullable
  uploadDate: Date;
  file?: File; // Store the uploaded file
}

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    CalendarModule,
    FileUploadModule,
    DropdownModule,
  ],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss',
  providers: [MessageService],
})
export class DocumentManagementComponent implements OnInit {
  searchQuery = '';
  displayDialog = false;

  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  newDocument: Document = {
    id: 0,
    procurementProcessName: '',
    entityName: '',
    recordName: '',
    filePath: '',
    uploadedByName: '', // Initialize as an empty string
    uploadDate: new Date(),
  };

  // Dropdown options
  procurementProcessOptions = ['Public Bidding', 'Alternative Mode', 'Direct Contracting'];
  entityOptions = ['PPMP', 'PurchaseRequest', 'Contract', 'InspectionAcceptance', 'Payment'];
  recordOptions: string[] = []; // Dynamically populated based on selected entity

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      this.documents = JSON.parse(storedDocuments);
      this.filteredDocuments = [...this.documents];
    } else {
      // Initialize with default data if no data is found in localStorage
      this.documents = [
        {
          id: 1,
          procurementProcessName: 'Public Bidding',
          entityName: 'PPMP',
          recordName: 'PPMP-2024-001',
          filePath: '/documents/ppmp-2024-001.pdf',
          uploadedByName: 'John Doe', // Ensure uploadedByName is present
          uploadDate: new Date('2024-01-15'),
        },
        {
          id: 2,
          procurementProcessName: 'Alternative Mode',
          entityName: 'PurchaseRequest',
          recordName: 'PR-2024-002',
          filePath: '/documents/pr-2024-002.pdf',
          uploadedByName: 'Jane Smith', // Ensure uploadedByName is present
          uploadDate: new Date('2024-02-10'),
        },
        {
          id: 3,
          procurementProcessName: 'Public Bidding',
          entityName: 'Contract',
          recordName: 'Contract-2024-003',
          filePath: '/documents/contract-2024-003.pdf',
          uploadedByName: 'Alice Johnson', // Ensure uploadedByName is present
          uploadDate: new Date('2024-03-05'),
        },
      ];
      this.filteredDocuments = [...this.documents];
      this.saveDocuments();
    }
  }

  saveDocuments() {
    localStorage.setItem('documents', JSON.stringify(this.documents));
  }

  filterDocuments() {
    this.filteredDocuments = this.documents.filter((doc) =>
      Object.values(doc).some((value) =>
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
  }

  showDialog() {
    this.displayDialog = true;
    this.newDocument = {
      id: 0,
      procurementProcessName: '',
      entityName: '',
      recordName: '',
      filePath: '',
      uploadedByName: '', // Initialize as an empty string
      uploadDate: new Date(),
    };
  }

  submitDocument() {
    if (
      !this.newDocument.procurementProcessName ||
      !this.newDocument.entityName ||
      !this.newDocument.recordName ||
      !this.newDocument.uploadedByName // Ensure uploadedByName is not empty
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
      });
      return;
    }

    const document = {
      ...this.newDocument,
      id: this.documents.length + 1,
    };

    this.documents.unshift(document);
    this.filterDocuments();
    this.saveDocuments();

    this.messageService.add({
      severity: 'success',
      summary: 'Document Created',
      detail: 'Document has been created successfully.',
    });

    this.displayDialog = false;
  }

  onFileUpload(event: any) {
    if (event.files && event.files.length > 0) {
      this.newDocument.filePath = event.files[0].name;
      this.messageService.add({
        severity: 'info',
        summary: 'File Uploaded',
        detail: `File "${event.files[0].name}" uploaded successfully.`,
      });
    }
  }

  // Update record options based on selected entity
  updateRecordOptions() {
    switch (this.newDocument.entityName) {
      case 'PPMP':
        this.recordOptions = ['PPMP-2024-001', 'PPMP-2024-002', 'PPMP-2024-003'];
        break;
      case 'PurchaseRequest':
        this.recordOptions = ['PR-2024-001', 'PR-2024-002', 'PR-2024-003'];
        break;
      case 'Contract':
        this.recordOptions = ['Contract-2024-001', 'Contract-2024-002', 'Contract-2024-003'];
        break;
      case 'InspectionAcceptance':
        this.recordOptions = ['IA-2024-001', 'IA-2024-002', 'IA-2024-003'];
        break;
      case 'Payment':
        this.recordOptions = ['Payment-2024-001', 'Payment-2024-002', 'Payment-2024-003'];
        break;
      default:
        this.recordOptions = [];
    }
  }

  // Delete a document
  deleteDocument(document: Document) {
    this.documents = this.documents.filter((doc) => doc.id !== document.id);
    this.filterDocuments();
    this.saveDocuments();
    this.messageService.add({
      severity: 'success',
      summary: 'Document Deleted',
      detail: 'Document has been deleted successfully.',
    });
  }

  // View a document
  viewDocument(document: Document) {
    if (document.filePath) {
      // Open the file in a new tab (for demonstration purposes)
      window.open(document.filePath, '_blank');
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'View Error',
        detail: 'File not found.',
      });
    }
  }
}