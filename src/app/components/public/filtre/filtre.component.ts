import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Associatif } from 'src/app/services/types/associatif';
import { Filter } from 'src/app/services/types/filter';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.css']
})
export class FiltreComponent implements OnInit {

  @Output() buttonClicked = new EventEmitter();

  filterValue:Filter| undefined
  myForm!:NodeListOf<ChildNode> | undefined
  searchForm!:FormGroup
  constructor(private formBuilder:FormBuilder) {
    this.searchForm=formBuilder.group({
      search:['',[]],
      attribute:['',[]],
      order:['',[]]
    })
  }

  ngOnInit(): void {

  }

  public get getFilter() :Filter | undefined{
    return this.filterValue
  }

  public onSearch()
  {
    this.filterValue={search:this.searchValue?.value,order:{key:this.attributeValue?.value,value:this.orderValue?.value}}
    this.buttonClicked.emit(this.filterValue)
  }

  public get searchValue() : AbstractControl | null {
    return this.searchForm.get('search')
  }
  public get attributeValue() : AbstractControl | null {
    return this.searchForm.get('attribute')
  }
  public get orderValue() : AbstractControl | null {
    return this.searchForm.get('order')
  }


  show()
  {

    if (document.querySelector("form")?.childElementCount==0) {

      console.log(this.myForm);
      this.myForm?.forEach(e=>{
        document.querySelector("form")?.appendChild(e)

      })
      return;
    }

    this.myForm =document.querySelector("form")?.childNodes

    document.querySelector("form")?.childNodes?.forEach(e=>{
      e.remove()
    })
  }


}
