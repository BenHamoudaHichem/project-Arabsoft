import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
mailForm:FormGroup
  constructor(private route:Router,@Inject(SESSION_STORAGE) private storage: StorageService,private formBuilder:FormBuilder) {
    this.mailForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email],
      ]}
    )}
check(){return this.route.url=='/register' || this.route.url=='/login'}
mail(){
this.storage.set('email',"")
}
  ngOnInit(): void {
  }

}
