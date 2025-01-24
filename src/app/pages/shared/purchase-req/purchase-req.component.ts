import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-purchase-req',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './purchase-req.component.html',
  styleUrls: ['./purchase-req.component.scss']
})
export class PurchaseReqComponent {
  @ViewChild('purchaseRequest') purchaseRequest!: ElementRef;

  exportPdf() {
    const element = this.purchaseRequest.nativeElement;

    html2canvas(element).then((canvas) => {
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

      pdf.save('purchase-request.pdf');
    });
  }
}