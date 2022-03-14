import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-file-members',
  templateUrl: './add-file-members.component.html',
  styleUrls: ['./add-file-members.component.css']
})
export class AddFileMembersComponent implements OnInit {

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
