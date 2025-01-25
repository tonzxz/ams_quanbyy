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
  selector: 'app-par',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, CardModule, ReactiveFormsModule],
  templateUrl: './par.component.html',
  styleUrls: ['./par.component.scss'],
})
export class ParComponent {
  parForm: FormGroup;
  displayDialog: boolean = false;
  samplePARs = [
    {
      parNo: 'PAR001',
      entityName: 'DepEd-Division of Antipolo City',
      fundCluster: 'Fund Cluster A',
      date: '2023-10-15',
    },
    {
      parNo: 'PAR002',
      entityName: 'DepEd-Division of Antipolo City',
      fundCluster: 'Fund Cluster B',
      date: '2023-10-20',
    },
  ];

  // Mock data for items
  mockData = {
    items: [
      {
        quantity: 10,
        unit: 'Pieces',
        description: 'Office Chairs',
        propertyNo: 'PROP001',
      },
      {
        quantity: 5,
        unit: 'Units',
        description: 'Printers',
        propertyNo: 'PROP002',
      },
    ],
    receivedBy: 'John Doe',
    receivedFrom: 'DR. ROMMEL C. BAUTISTA, CESO V',
    date: '2023-10-25',
  };

  constructor(private fb: FormBuilder) {
    this.parForm = this.fb.group({
      entityName: ['', Validators.required],
      fundCluster: ['', Validators.required],
      parNo: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      description: ['', Validators.required],
      propertyNo: ['', Validators.required],
      receivedBy: ['', Validators.required],
      receivedFrom: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  showDialog() {
    this.displayDialog = true;
  }

  exportPdf() {
    if (this.parForm.invalid) {
      alert('Please fill out all fields in the form.');
      return;
    }

    const formValues = this.parForm.value;

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 bg-white shadow-md rounded-lg">
        <h1 class="text-4xl font-bold mb-4 flex justify-center">PROPERTY ACKNOWLEDGEMENT RECEIPT</h1>
        
        <!-- Entity Name, Fund Cluster, PAR No., and Date -->
        <div class="mb-4 text-2xl">
          <div class="flex flex-row justify-between">
            <p><strong>Entity Name:</strong> ${formValues.entityName}</p>
            <p><strong>Fund Cluster:</strong> ${formValues.fundCluster}</p>
          </div>
          <div class="flex flex-row justify-between">
            <p><strong>PAR No.:</strong> ${formValues.parNo}</p>
            <p><strong>Date:</strong> ${formValues.date}</p>
          </div>
        </div>

        <!-- Items Table -->
        <h2 class="text-2xl font-bold mb-2">Items</h2>
        <table class="w-full border-collapse border border-gray-300 text-2xl">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-4">Quantity</th>
              <th class="border border-gray-300 p-4">Unit</th>
              <th class="border border-gray-300 p-4">Description</th>
              <th class="border border-gray-300 p-4">Property No.</th>
            </tr>
          </thead>
          <tbody>
            ${this.mockData.items
              .map(
                (item) => `
              <tr>
                <td class="border border-gray-300 p-4">${item.quantity}</td>
                <td class="border border-gray-300 p-4">${item.unit}</td>
                <td class="border border-gray-300 p-4">${item.description}</td>
                <td class="border border-gray-300 p-4">${item.propertyNo}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <!-- Signatures -->
        <div class="mt-6 text-2xl">
          <p><strong>Received by:</strong> ${formValues.receivedBy}</p>
          <p><strong>Received from:</strong> ${formValues.receivedFrom}</p>
          <p><strong>Date:</strong> ${formValues.date}</p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('par-report.pdf');

      document.body.removeChild(content);
    });
  }
}