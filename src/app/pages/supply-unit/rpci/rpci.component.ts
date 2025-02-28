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
  selector: 'app-rpci',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, CardModule, ReactiveFormsModule, CommonModule],
  templateUrl: './rpci.component.html',
  styleUrls: ['./rpci.component.scss'],
})
export class RpciComponent {
  rpciForm: FormGroup;
  displayDialog: boolean = false;
  editingIndex: number = -1;

  // Mock data for RPCI reports
  rpciReports = [
    {
      rpciNo: 'RPCI-2024-001',
      fundCluster: 'FC-2024-001',
      date: new Date('2024-03-01'),
      department: 'Supply Unit',
      accountableOfficer: 'John Doe',
      totalValue: 500000,
      status: 'Completed',
      remarks: 'Annual inventory count completed'
    },
    {
      rpciNo: 'RPCI-2024-002',
      fundCluster: 'FC-2024-002',
      date: new Date('2024-03-05'),
      department: 'IT Department',
      accountableOfficer: 'Jane Smith',
      totalValue: 750000,
      status: 'In Progress',
      remarks: 'Quarterly inventory count ongoing'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.rpciForm = this.fb.group({
      rpciNo: ['', Validators.required],
      fundCluster: ['', Validators.required],
      date: ['', Validators.required],
      department: ['', Validators.required],
      accountableOfficer: ['', Validators.required],
      totalValue: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      remarks: [''],
      items: this.fb.array([])
    });
  }

  showDialog() {
    this.displayDialog = true;
    this.editingIndex = -1;
    this.rpciForm.reset();
  }

  editRPCI(rpci: any) {
    this.editingIndex = this.rpciReports.indexOf(rpci);
    this.rpciForm.patchValue({
      ...rpci,
      date: rpci.date.toISOString().split('T')[0]
    });
    this.displayDialog = true;
  }

  deleteRPCI(rpci: any) {
    const index = this.rpciReports.indexOf(rpci);
    if (index !== -1) {
      this.rpciReports.splice(index, 1);
    }
  }

  saveRPCI() {
    if (this.rpciForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const newRPCI = {
      ...this.rpciForm.value,
      date: new Date(this.rpciForm.value.date)
    };

    if (this.editingIndex === -1) {
      this.rpciReports.push(newRPCI);
    } else {
      this.rpciReports[this.editingIndex] = newRPCI;
    }

    this.displayDialog = false;
    this.rpciForm.reset();
  }

  exportPdf() {
    const content = document.createElement('div');
    const formValues = this.rpciForm.value;

    content.innerHTML = `
      <div class="p-8 bg-white shadow-lg rounded-lg">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">REPORT ON THE PHYSICAL COUNT OF INVENTORIES</h1>
          <h2 class="text-xl text-gray-600">Department of Education</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div class="border p-3 rounded">
            <p class="font-semibold">RPCI No.: <span class="font-normal">${formValues.rpciNo}</span></p>
            <p class="font-semibold mt-2">Date: <span class="font-normal">${formValues.date}</span></p>
          </div>
          <div class="border p-3 rounded">
            <p class="font-semibold">Fund Cluster: <span class="font-normal">${formValues.fundCluster}</span></p>
            <p class="font-semibold mt-2">Department: <span class="font-normal">${formValues.department}</span></p>
          </div>
        </div>

        <div class="mb-6 border p-3 rounded">
          <p class="font-semibold">Accountable Officer: <span class="font-normal">${formValues.accountableOfficer}</span></p>
          <p class="font-semibold mt-2">Total Value: <span class="font-normal">₱${formValues.totalValue.toLocaleString()}</span></p>
        </div>

        <div class="mb-6">
          <p class="font-semibold">Status: <span class="font-normal">${formValues.status}</span></p>
          <p class="font-semibold mt-2">Remarks: <span class="font-normal">${formValues.remarks || 'N/A'}</span></p>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-8">
          <div class="text-center">
            <div class="border-t-2 pt-2">
              <p class="font-semibold">Prepared by:</p>
              <p class="mt-4">Date: _________________</p>
              <p class="mt-4">_______________________</p>
              <p>Inventory Committee Chair</p>
            </div>
          </div>
          <div class="text-center">
            <div class="border-t-2 pt-2">
              <p class="font-semibold">Verified by:</p>
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
      pdf.save('rpci-report.pdf');
      document.body.removeChild(content);
    });
  }
} 