import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-add-file-materials',
  templateUrl: './add-file-materials.component.html',
  styleUrls: ['./add-file-materials.component.css']
})
export class AddFileMaterialsComponent implements OnInit {

  constructor() { }

  output=""
  typeFile=""
    ngOnInit(): void {
    }
    upload(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files as FileList;
      this.output=files[0].name
      this.typeFile=files[0].type
      console.log(files);
  }


}
