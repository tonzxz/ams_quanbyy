declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: any;
      jsPDF?: any;
    }
  
    interface Html2Pdf {
      from: (element: HTMLElement) => {
        set: (options: Html2PdfOptions) => Html2Pdf;
        save: () => Promise<void>;
      };
    }
  
    const html2pdf: Html2Pdf;
    export default html2pdf;
  }