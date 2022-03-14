import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],

})
export class AddTeamComponent implements OnInit {


  dropdownList: { item_id: number; item_text: string; }[] = [];
  selectedItems: { item_id: number; item_text: string; }[] = [];
  dropdownSettings!: {};
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1,item_text: 'employe 1' },
      { item_id: 2, item_text: 'employe 2' },
      { item_id: 3, item_text: 'employe 3' },
      { item_id: 4, item_text: 'employe 4' },
      { item_id: 5, item_text: 'employe 5' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);

}
}
