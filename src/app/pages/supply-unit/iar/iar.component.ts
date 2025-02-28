import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-iar',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, CardModule, ReactiveFormsModule, CommonModule],
  templateUrl: './iar.component.html',
  styleUrls: ['./iar.component.scss'],
})
export class IarComponent {
  iarForm: FormGroup;
  displayDialog: boolean = false;
  editingIndex: number = -1;

  // Mock data for IAR reports
  iarReports = [
    {
      iarNo: 'IAR-2024-001',
      poNo: 'PO-2024-001',
      supplier: 'Tech Solutions Inc.',
      date: new Date('2024-03-01'),
      invoiceNo: 'INV-001',
      totalAmount: 150000,
      status: 'Accepted',
      remarks: 'All items in good condition'
    },
    {
      iarNo: 'IAR-2024-002',
      poNo: 'PO-2024-002',
      supplier: 'Office Supplies Co.',
      date: new Date('2024-03-05'),
      invoiceNo: 'INV-002',
      totalAmount: 75000,
      status: 'Pending Inspection',
      remarks: 'Scheduled for inspection'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.iarForm = this.fb.group({
      iarNo: ['', Validators.required],
      poNo: ['', Validators.required],
      supplier: ['', Validators.required],
      date: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      remarks: [''],
      items: this.fb.array([])
    });
  }

  showDialog() {
    this.displayDialog = true;
    this.editingIndex = -1;
    this.iarForm.reset();
  }

  editIAR(iar: any) {
    this.editingIndex = this.iarReports.indexOf(iar);
    this.iarForm.patchValue({
      ...iar,
      date: iar.date.toISOString().split('T')[0]
    });
    this.displayDialog = true;
  }

  deleteIAR(iar: any) {
    const index = this.iarReports.indexOf(iar);
    if (index !== -1) {
      this.iarReports.splice(index, 1);
    }
  }

  saveIAR() {
    if (this.iarForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const newIAR = {
      ...this.iarForm.value,
      date: new Date(this.iarForm.value.date)
    };

    if (this.editingIndex === -1) {
      this.iarReports.push(newIAR);
    } else {
      this.iarReports[this.editingIndex] = newIAR;
    }

    this.displayDialog = false;
    this.iarForm.reset();
  }

  exportPdf() {
    const content = document.createElement('div');
    const formValues = this.iarForm.value;

    content.innerHTML = `
      <div class="p-8 bg-white shadow-lg rounded-lg">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">INSPECTION AND ACCEPTANCE REPORT</h1>
          <h2 class="text-xl text-gray-600">Department of Education</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div class="border p-3 rounded">
            <p class="font-semibold">IAR No.: <span class="font-normal">${formValues.iarNo}</span></p>
            <p class="font-semibold mt-2">Date: <span class="font-normal">${formValues.date}</span></p>
          </div>
          <div class="border p-3 rounded">
            <p class="font-semibold">PO No.: <span class="font-normal">${formValues.poNo}</span></p>
            <p class="font-semibold mt-2">Invoice No.: <span class="font-normal">${formValues.invoiceNo}</span></p>
          </div>
        </div>

        <div class="mb-6 border p-3 rounded">
          <p class="font-semibold">Supplier: <span class="font-normal">${formValues.supplier}</span></p>
          <p class="font-semibold mt-2">Total Amount: <span class="font-normal">₱${formValues.totalAmount.toLocaleString()}</span></p>
        </div>

        <div class="mb-6">
          <p class="font-semibold">Status: <span class="font-normal">${formValues.status}</span></p>
          <p class="font-semibold mt-2">Remarks: <span class="font-normal">${formValues.remarks || 'N/A'}</span></p>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-8">
          <div class="text-center">
            <div class="border-t-2 pt-2">
              <p class="font-semibold">Inspection</p>
              <p class="mt-4">Date: _________________</p>
              <p class="mt-4">_______________________</p>
              <p>Inspection Officer/Committee</p>
            </div>
          </div>
          <div class="text-center">
            <div class="border-t-2 pt-2">
              <p class="font-semibold">Acceptance</p>
              <p class="mt-4">Date: _________________</p>
              <p class="mt-4">_______________________</p>
              <p>Supply Officer/Property Custodian</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('iar-report.pdf');
      document.body.removeChild(content);
    });
  }
} 