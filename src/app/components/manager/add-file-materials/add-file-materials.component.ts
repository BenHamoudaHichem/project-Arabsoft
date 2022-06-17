import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-file-materials',
  templateUrl: './add-file-materials.component.html',
  styleUrls: ['./add-file-materials.component.css']
})
export class AddFileMaterialsComponent implements OnInit {
  fileLoad!:FormGroup
  constructor(private formBuilder: FormBuilder) {
    this.fileLoad = this.formBuilder.group({
      file: [
        '',
        [Validators.required],
      ]
    });
   }

   get file(){
    return this.fileLoad.get('file')
   }
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
