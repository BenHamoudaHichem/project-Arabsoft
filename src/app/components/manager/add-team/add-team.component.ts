import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
})
export class AddTeamComponent implements OnInit {
  membersSelect:any
  teamForm!: FormGroup;
  selectedlist: any[] = [];
  constructor(private formBuilder: FormBuilder) {
    this.teamForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      membres: ['', [Validators.required]]
    });
  }

  dropdownList: { id: number; firstName: string }[] = [];
  selectedItems: { item_id: number; item_text: string }[] = [];
  dropdownSettings!: {};
  ngOnInit() {
    this.dropdownList = [
      { id: 1, firstName: 'employe 1' },
      { id: 2, firstName: 'employe 2' },
      { id: 3, firstName: 'employe 3' },
      { id: 4, firstName: 'employe 4' },
      { id: 5, firstName: 'employe 5' },
    ];

    // Setting of dropdown multiselect
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    this.selectedlist.push(item);
    console.log(this.selectedlist);
  }
  onSelectAll(items: any) {
    console.log(items);
    this.membersSelect=items
  }




  AddTeam() {
    let team = new Team(String(this.titre?.value),'',this.membres?.value);
    console.log(team);
  }
  get titre() {
    return this.teamForm.get('titre');
  }
  get membres() {
    return this.teamForm.get('membres');
  }
}
