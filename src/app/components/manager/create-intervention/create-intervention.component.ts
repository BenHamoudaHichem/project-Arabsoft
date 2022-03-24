import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Intervention } from 'src/app/models/works/intervention';
import { Confirmed } from 'src/app/services/validation/Confirmed';
import { DateValidation } from 'src/app/services/validation/DateValidation';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.css'],
})
export class CreateInterventionComponent implements OnInit {
  createInterventionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private interventionService:InterventionService) {
    this.createInterventionForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{10,}$')],
      ],
      category: ['', [Validators.required]],
      date: ['', [Validators.required]],
      team: ['', [Validators.required]],
      Materiel: ['', [Validators.required]],
    },{
      validators:DateValidation.DateConfirmation('date',new Date('2019-12-07'))
    });
  }

  dropdownList: { item_id: number; item_text: string }[] = [];
  selectedItems: { item_id: number; item_text: string }[] = [];
  dropdownSettings!: {};
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'materiels 1' },
      { item_id: 2, item_text: 'materiels 2' },
      { item_id: 3, item_text: 'materiels 3' },
      { item_id: 4, item_text: 'materiels 4' },
      { item_id: 5, item_text: 'materiels 5' },
    ];
    this.selectedItems = [
      { item_id: 2, item_text: 'materiels 2' },
      { item_id: 3, item_text: 'materiels 3' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  Creer() {
    // console.log(this.createInterventionForm.value);

    let intervention = new Intervention(
      this.title?.value,
      this.description?.value,
      this.category?.value,
      this.team?.value,
      this.date?.value,
      this.date?.value,
      this.Materiel?.value
    );

//console.log(intervention);
    this.interventionService.create(intervention).subscribe((data:any)=>{
      console.log(data)
alert("intervention crée")
    }),(error:HttpErrorResponse)=>
    {
alert(error.message)
    }
    }
  get title() {
    return this.createInterventionForm.get('title');
  }
  get description() {
    return this.createInterventionForm.get('description');
  }
  get category() {
    return this.createInterventionForm.get('category');
  }
  get date() {
    return this.createInterventionForm.get('date');
  }
  get team() {
    return this.createInterventionForm.get('team');
  }
  get Materiel() {
    return this.createInterventionForm.get('Materiel');
  }
}
