import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
declare const WebViewer: any;

@Component({
  selector: 'app-home-team-manager',
  templateUrl: './home-team-manager.component.html',
  styleUrls: ['./home-team-manager.component.css']
})
export class HomeTeamManagerComponent implements OnInit , AfterViewInit {
  // Syntax if using Angular 8+
  // true or false depending on code
  @ViewChild( 'viewer', {static: true }) viewer!: ElementRef;

  // Syntax if using Angular 7 and below

  wvInstance: any;

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    // you can access docViewer object for low-level APIs
    const { documentViewer, annotationManager, Annotations } = this.wvInstance.Core;
    // and access classes defined in the WebViewer iframe
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
    // see https://www.pdftron.com/api/web/WebViewerInstance.html for the full list of low-level APIs
  }

  ngAfterViewInit(): void {
    // The following code initiates a new instance of WebViewer.

    WebViewer({
      path: '../../../wv-resources/lib',
      initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf'
    }, this.viewer.nativeElement).then((instance:any) => {
      this.wvInstance = instance;

      // now you can access APIs through this.webviewer.getInstance()
      instance.UI.openElement('notesPanel');
      // see https://www.pdftron.com/documentation/web/guides/ui/apis
      // for the full list of APIs

      // or listen to events from the viewer element


      // or from the docViewer instance
      instance.Core.documentViewer.addEventListener('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      instance.Core.documentViewer.addEventListener('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }
}
