import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { fil } from 'date-fns/locale';
import { filter } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';
import { Demand } from 'src/app/models/works/demand';
import { Intervention } from 'src/app/models/works/intervention';
import { Associatif } from 'src/app/services/types/associatif';
import { Filter } from 'src/app/services/types/filter';
import { TSMap } from 'typescript-map';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.css']
})
export class FiltreComponent implements OnInit {


  @Output() buttonClicked = new EventEmitter();

  filterValue:Map<string,any>| undefined = new Map()
  myForm!:NodeListOf<ChildNode> | undefined
  searchForm!:FormGroup
  constructor(private formBuilder:FormBuilder) {
    this.searchForm=formBuilder.group({
      search:['',[]],
      propertySearch:['',[]],
      propertyOrder:['',[]],
      order:['',[]]
    })
  }

  ngOnInit(): void {
    console.log(Intervention.name.toLowerCase())

  }

  public get getFilter() :Map<string,any> | undefined{
    return this.filterValue
  }

  public onSearch()
  {
    let m:  TSMap<string ,any>
    this.filterValue?.set(this.propertySearchValue?.value,this.searchValue?.value)
    this.filterValue?.set("property",this.attributeValue?.value)
    this.filterValue?.set("direction",this.orderValue?.value)




    this.buttonClicked.emit(Object.fromEntries(this.filterValue!))
  }

  public get propertySearchValue() : AbstractControl | null {
    return this.searchForm.get('propertySearch')
  }
  public get searchValue() : AbstractControl | null {
    return this.searchForm.get('search')
  }
  public get attributeValue() : AbstractControl | null {
    return this.searchForm.get('propertyOrder')
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


  public get getProperties() : string[] {
    let res:string[]=[]
    if (window.location.href.includes(Intervention.name.toLowerCase())) {
      res= Object.keys(Reflect.construct(Intervention, []))
    }
    if (window.location.href.includes(Material.name.toLowerCase())) {
      res= Object.keys(Reflect.construct(Material, []))
    }
    if (window.location.href.includes(Team.name.toLowerCase())) {
      res= Object.keys(Reflect.construct(Team, []))
      res.pop()
    }
    if (window.location.href.includes("reclamation")) {
      res= Object.keys(Reflect.construct(Demand, []))

    }
    if (window.location.href.includes("customer")) {
      res=Object.keys(Reflect.construct(User, []))
      res.splice(res.indexOf("password"),1)
      res[res.indexOf("identifier")]="email"


      res.pop()
    }
    if (window.location.href.includes("employee")) {
      res=Object.keys(Reflect.construct(User, []))
      res.splice(res.indexOf("password"),1)

      res[res.indexOf("identifier")]="matricule"
      res.pop()
    }

    if (res.includes("address")) {
      res.splice(res.indexOf("address"),1)
      Object.keys(Reflect.construct(Address, [])).forEach(element=>{
        res.push(element)
      })
      res.pop()
    }
    return res
  }
  changeProperty(value:string){

    this.propertySearchValue?.setValue(value)

  }



}
