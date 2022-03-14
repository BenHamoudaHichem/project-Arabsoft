import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.css']
})
export class CreateInterventionComponent implements OnInit {



  dropdownList: { item_id: number; item_text: string; }[] = [];
  selectedItems: { item_id: number; item_text: string; }[] = [];
  dropdownSettings!: {};
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'materiels 1' },
      { item_id: 2, item_text: 'materiels 2' },
      { item_id: 3, item_text: 'materiels 3' },
      { item_id: 4, item_text: 'materiels 4' },
      { item_id: 5, item_text: 'materiels 5' }
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
