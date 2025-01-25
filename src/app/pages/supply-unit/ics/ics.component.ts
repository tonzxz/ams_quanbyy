import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ics',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, CardModule, ReactiveFormsModule],
  templateUrl: './ics.component.html',
  styleUrls: ['./ics.component.scss'],
})
export class IcsComponent {
  icsForm: FormGroup;
  displayDialog: boolean = false;
  sampleICSs = [
    {
      icsNo: 'ICS-2023-001',
      entityName: 'DepEd Central Office',
      fundCluster: 'FC-1001',
      date: '2023-10-15'
    },
    {
      icsNo: 'ICS-2023-002',
      entityName: 'DepEd Regional Office',
      fundCluster: 'FC-2001',
      date: '2023-10-20'
    }
  ];

  mockData = {
    items: [
      {
        description: 'Laptop Computer (Serial: XPS-12345)',
        quantity: 5,
        unit: 'Units',
        unitCost: 45000,
        totalCost: 225000,
        inventoryItemNo: 'INV-IT-001',
        estimatedUsefulLife: '5 years'
      },
      {
        description: 'Office Chairs (Brand: Ergomech)',
        quantity: 10,
        unit: 'Pieces',
        unitCost: 3500,
        totalCost: 35000,
        inventoryItemNo: 'INV-IT-002',
        estimatedUsefulLife: '7 years'
      }
    ]
  };

  constructor(private fb: FormBuilder) {
    this.icsForm = this.fb.group({
      entityName: ['', Validators.required],
      fundCluster: ['', Validators.required],
      icsNo: ['', Validators.required],
      date: ['', Validators.required],
      inventoryItemNo: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      unitCost: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      estimatedUsefulLife: ['', Validators.required]
    });
  }

  showDialog() {
    this.displayDialog = true;
  }

  exportPdf() {
    if (this.icsForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const formValues = this.icsForm.value;
    const totalCost = formValues.quantity * formValues.unitCost;

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-8 bg-white shadow-lg rounded-lg">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">INVENTORY CUSTODIAN SLIP</h1>
          <h2 class="text-xl text-gray-600">Department of Education</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div class="border p-3 rounded">
            <p class="font-semibold">Entity Name: <span class="font-normal">${formValues.entityName}</span></p>
            <p class="font-semibold mt-2">Fund Cluster: <span class="font-normal">${formValues.fundCluster}</span></p>
          </div>
          <div class="border p-3 rounded">
            <p class="font-semibold">ICS No.: <span class="font-normal">${formValues.icsNo}</span></p>
            <p class="font-semibold mt-2">Date: <span class="font-normal">${formValues.date}</span></p>
          </div>
        </div>

        <table class="w-full border-collapse border border-gray-300 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 border">Description</th>
              <th class="p-3 border">Inventory Item No.</th>
              <th class="p-3 border">Quantity</th>
              <th class="p-3 border">Unit</th>
              <th class="p-3 border">Unit Cost</th>
              <th class="p-3 border">Total Cost</th>
              <th class="p-3 border">Estimated Useful Life</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 border">${formValues.description}</td>
              <td class="p-3 border">${formValues.inventoryItemNo}</td>
              <td class="p-3 border text-right">${formValues.quantity}</td>
              <td class="p-3 border">${formValues.unit}</td>
              <td class="p-3 border text-right">₱${formValues.unitCost.toLocaleString()}</td>
              <td class="p-3 border text-right">₱${totalCost.toLocaleString()}</td>
              <td class="p-3 border">${formValues.estimatedUsefulLife}</td>
            </tr>
            ${this.mockData.items.map(item => `
              <tr>
                <td class="p-3 border">${item.description}</td>
                <td class="p-3 border">${item.inventoryItemNo}</td>
                <td class="p-3 border text-right">${item.quantity}</td>
                <td class="p-3 border">${item.unit}</td>
                <td class="p-3 border text-right">₱${item.unitCost.toLocaleString()}</td>
                <td class="p-3 border text-right">₱${item.totalCost.toLocaleString()}</td>
                <td class="p-3 border">${item.estimatedUsefulLife}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="mt-6 text-sm space-y-2">
          <p class="font-semibold">Certified Correct:</p>
          <div class="border-t-2 pt-2">
            <p class="mb-4">Signature over Printed Name of Supply/Property Custodian</p>
            <p>Date: _________________________</p>
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
      pdf.save('ics-report.pdf');
      document.body.removeChild(content);
    });
  }
}