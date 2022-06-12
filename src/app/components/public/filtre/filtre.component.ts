import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';
import { Demand } from 'src/app/models/works/demand';
import { Intervention } from 'src/app/models/works/intervention';

@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.css']
})
export class FiltreComponent implements OnInit {


  @Output() buttonClicked = new EventEmitter();

  filterValue:Map<string,any>| undefined
  myForm!:NodeListOf<ChildNode> | undefined
  searchForm!:FormGroup
  constructor(private formBuilder:FormBuilder,private router: Router, private activatedRoute: ActivatedRoute,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.searchForm=formBuilder.group({
      search:['',[]],
      propertySearch:['',[]],
      propertyOrder:['',[]],
      order:['',[]],


    })


  }

  ngOnInit(): void {


  }

  public get getFilter() :Map<string,any> | undefined{
    return this.filterValue
  }

  public onSearch()
  {
    document.getElementById("close")!.click();

    this.filterValue = new Map<string,any>()
    this.filterValue.clear()
    if (this.propertySearchValue?.value!=undefined &&this.searchValue?.value!=undefined&&
      String(this.propertySearchValue?.value).length>0 &&String(this.searchValue?.value).length>0) {
      this.filterValue?.set(this.propertySearchValue?.value,this.searchValue?.value)
    }
    if (String(this.attributeValue?.value).length!=0) {

      this.filterValue?.set("property",this.attributeValue?.value)

    }
    if (String(this.orderValue?.value).length!=0) {
      this.filterValue?.set("direction",this.orderValue?.value)
    }

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
