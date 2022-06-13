import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }
  public generateFromId(idElement:string,idIntervention:string) {
    let html: HTMLElement = document.getElementById(idElement)!;
    if (html.hasAttribute("scroll")) {
      for (let index = 0; index < html.getElementsByClassName("scroll").length; index++) {
        html.getElementsByClassName("scroll").item(index)!.className=""
      }
    }
    html2canvas(html).then((canvas) => {
      let PDF_Width = 208;

      let PDF_Height = (canvas.height * PDF_Width) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', [PDF_Width, PDF_Height]);
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, PDF_Width, PDF_Height/1.0);
      PDF.save(`interventionC-${idIntervention}.pdf`);
    });
  }
}
