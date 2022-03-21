import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-manager',
  templateUrl: './select-manager.component.html',
  styleUrls: ['./select-manager.component.css']
})
export class SelectManagerComponent implements OnInit {
  teamM !: FormGroup
  constructor(private formBuilder: FormBuilder) {
    this.teamM = this.formBuilder.group({
      teamManager: ['', [Validators.required]],

    });
  }
  get teamManager(){return this.teamM.get('teamManager')}

  ngOnInit(): void {
  }
  validat(){

  }
}
