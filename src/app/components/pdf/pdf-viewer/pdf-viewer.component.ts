import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare const WebViewer: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit , AfterViewInit {

  constructor() { }
  @ViewChild( 'viewer', {static: true }) viewer!: ElementRef;
  wvInstance: any;

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    const { documentViewer, annotationManager, Annotations } = this.wvInstance.Core;
    const rectangle = new Annotations.RectangleAnnotation();
    rectangle.PageNumber = 1;
    rectangle.X = 100;
    rectangle.Y = 100;
    rectangle.Width = 250;
    rectangle.Height = 250;
    rectangle.StrokeThickness = 5;
    rectangle.Author = annotationManager.getCurrentUser();
    annotationManager.addAnnotation(rectangle);
    annotationManager.drawAnnotations(rectangle.PageNumber);
  }

  ngAfterViewInit(): void {
    WebViewer({
      path: '../../../wv-resources/lib',
      initialDoc: '../../../assets/files/report2.pdf'
    }, this.viewer.nativeElement).then((instance:any) => {
      this.wvInstance = instance;
      instance.UI.openElement('notesPanel');
      instance.Core.documentViewer.addEventListener('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      instance.Core.documentViewer.addEventListener('documentLoaded', this.wvDocumentLoadedHandler)
      console.log( instance.Core.documentViewer);

    })

  }
  test()
  {
  }

}
