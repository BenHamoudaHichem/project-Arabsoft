import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from 'notiflix';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
@Component({
  selector: 'app-add-file-materials',
  templateUrl: './add-file-materials.component.html',
  styleUrls: ['./add-file-materials.component.css']
})
export class AddFileMaterialsComponent implements OnInit {
  fileLoad!:FormGroup
  output:any
  typeFile:any
  constructor(private formBuilder: FormBuilder,private materialService:EquipmentService) {
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

    ngOnInit(): void {
    }
    upload(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files as FileList;
      this.output=files[0]
      this.typeFile=files[0].type
      console.log(files);
  }
  create ()
  {
    let fd :FormData=new  FormData()
    fd.append("file",this.output)
    this.materialService.createFile(fd).subscribe((res:any)=>{
      if (res.status==true) {

        Report.success("Creation des materiels",res.message,"D'accord")

      }
    })
  }



}
