// app-sequence.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementService } from '../../../services/procurement.service';
import { DocumentMetadata, ProcurementCategory, ProcurementItem } from './procurement.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-app-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-shared.component.html',
  styleUrl: './app-shared.component.scss'
})
export class AppSharedComponent implements OnInit {
  documentData: any;
  editMode = false;
  selectedItem: ProcurementItem | null = null;
  currentYear: number = new Date().getFullYear();
  isEditing = false;
  categories: ProcurementCategory[] = [];
  quarter: any;
  fiscalYear: any;
  preparedBy: any;
  approvedBy: any;
  committeeMembers: any[] = [];

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getDocumentData().subscribe(data => {
      this.documentData = data;
      this.preparedBy = data.metadata.preparedBy;
      this.approvedBy = data.metadata.approvedBy;
      this.committeeMembers = data.metadata.committeeMembers;
      this.categories = data.categories;
      this.fiscalYear = data.metadata.fiscalYear;
      this.quarter = data.metadata.quarter;
    });

    this.procurementService.getEditMode().subscribe(mode => {
      this.editMode = mode;
      this.isEditing = mode;
    });
  }
 
  getTotalBudget(): number {
    return this.categories.reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.totalBudget, 0), 0);
  }

  getTotalMOOE(): number {
    return this.categories.reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.mooe, 0), 0);
  }

  getTotalCO(): number {
    return this.categories.reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.co, 0), 0);
  }

  toggleEditMode(): void {
    this.procurementService.toggleEditMode();
  }

  onItemClick(category: number, item: number): void {
    if (this.editMode) {
      this.selectedItem = this.documentData.categories[category].items[item];
    }
  }

  calculateCategoryTotals(category: ProcurementCategory) {
    const totals = {
      totalBudget: 0,
      totalMOOE: 0,
      totalCO: 0
    };

    if (category && category.items) {
      category.items.forEach(item => {
        totals.totalBudget += item.totalBudget || 0;
        totals.totalMOOE += item.mooe || 0;
        totals.totalCO += item.co || 0;
      });
    }

    return totals;
  }

  calculateGrandTotal() {
    return {
      totalBudget: this.getTotalBudget(),
      totalMOOE: this.getTotalMOOE(),
      totalCO: this.getTotalCO()
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value || 0);
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-PH', {
      month: 'short',
      year: 'numeric'
    });
  }

  get formattedQuarter(): string {
    if (!this.quarter) return '';
    
    const num = parseInt(this.quarter);
    if (isNaN(num)) return '';
  
    switch (num) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      case 4:
        return '4th';
      default:
        return '';
    }
  }

  async exportToPDF(): Promise<void> {
    const element = document.querySelector('.app-document');
    if (!element) return;
  
    try {
      // Hide export button before capturing
      const exportBtn = document.querySelector('.export-button-container');
      if (exportBtn) {
        (exportBtn as HTMLElement).style.display = 'none';
      }
  
      // Set background color
      const originalBackground = (element as HTMLElement).style.background;
      (element as HTMLElement).style.background = 'white';
  
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
  
      // Restore styles
      (element as HTMLElement).style.background = originalBackground;
      if (exportBtn) {
        (exportBtn as HTMLElement).style.display = 'flex';
      }
  
      // Calculate dimensions for landscape A4
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = 210; // A4 landscape height in mm
      const aspectRatio = canvas.height / canvas.width;
      const pdfWidth = imgWidth;
      const pdfHeight = pdfWidth * aspectRatio;
  
      // Create PDF in landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
  
      // Handle multiple pages if content is too long
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      while (position < pdfHeight) {
        // Add new page if needed, but not for first page
        if (position > 0) {
          pdf.addPage();
        }
  
        // Calculate remaining height
        const remainingHeight = pdfHeight - position;
        const currentHeight = Math.min(pageHeight, remainingHeight);
  
        // Add portion of image to current page
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
  
        // Move to next portion
        position += pageHeight;
      }
  
      // Save the PDF
      pdf.save(`procurement-plan-${this.formattedQuarter}-quarter-${this.currentYear}.pdf`);
  
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}