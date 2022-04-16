import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { Location } from 'src/app/models/Location';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import moment from 'moment';
import { plainToClass } from 'class-transformer';
import { Associatif } from 'src/app/services/types/associatif';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';


@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css'],
})
export class UpdateMaterialComponent implements OnInit {
  public statusList:Associatif[]=[]
  id!: string;
  formupdateMaterials!: FormGroup;
  material!: IMaterial;
  states!:string[]
  cities!:string[]
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private addressService:AddressService,
    private router: Router,
    private AuthenticateService:AuthenticateService
  ) {
    this.formupdateMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

      dateOfPurshase: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      street: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      country: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
    this.counrty?.setValue("Tunisie")
    this.statusList.push({key:"Fonctionnel",value:"Functional"})
    this.statusList.push({key:"En panne",value:"Broken_down"})
    this.statusList.push({key:"Hors service",value:"Expired"})
    this.statusList.push({key:"Volé",value:"Stoled"})

    this.city?.disable()
    this.collectStates()
  }


  ngOnInit() {
    this.show();
  }
  show() {
    this.counrty?.setValue('Tunisie')
    this.id=this.ActivatedRoute.snapshot.paramMap.get("id")!



    if (this.id != null) {
      this.materialService
        .showMaterial(this.id)
        .subscribe((data: IMaterial) => {
          this.material=data
          this.material.address=plainToClass(Address,data.address)

          console.log(this.material)

          this.name?.setValue(data.name);
          this.description?.setValue(data.description);
          this.dateOfPurshase?.setValue(moment(data.dateOfPurchase).format('yyyy-MM-DD'));
          this.city?.setValue(this.material.address.City);
          this.counrty?.setValue(data.address.Country);
          this.street?.setValue(data.address.Street);
          this.zipCode?.setValue(data.address.ZipCode);
          this.state?.setValue(data.address.State);
          this.statusList.forEach(element => {
            if (element.value==this.material.status) {
              this.status?.setValue(element.value);
            }
          });
        //  this.status?.setValue(data.status);
        });
    }
  }
updateMaterial() {
    let address = new Address(
      this.zipCode?.value,
      this.street?.value,
      this.city?.value,
      this.state?.value,
      this.counrty?.value,
      new Location(1, 1)
    );
    //  console.log(location)
    let newMaterial = new Material(
      String(this.name?.value),
      String(this.description?.value),
      address,
      this.dateOfPurshase?.value,
      String(this.status?.value)
    );
    this.materialService.update(this.material.id,newMaterial).subscribe((data:any) => {
      console.log(data);
      if(data.status)
      {Notify.success('Materiel est modifié avec succès');
      this.router.navigate(['manager/materialList']);}else{Notify.failure(data.message)}
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        } else{
          Report.failure('Erreur', error.message,'OK')

        }         };
  }
  collectStates()
  {

    this.addressService.allTNStates.subscribe((res:string[])=>{
      this.states=res
    })
  }
  collectCitiesBystates(state:string)
  {
    this.addressService.allTNCitiesByState(state).subscribe((res:string[])=>{
      this.cities=res
    })
  }
  loadCities(){
    if (this.city?.disabled) {
      this.city?.enable()
    }

    this.collectCitiesBystates(this.state?.value)
  }
  get name() {
    return this.formupdateMaterials.get('name');
  }
  get status() {
    return this.formupdateMaterials.get('status');
  }
  get dateOfPurshase() {
    return this.formupdateMaterials.get('dateOfPurshase');
  }
  get description() {
    return this.formupdateMaterials.get('description');
  }
  get city() {
    return this.formupdateMaterials.get('city');
  }
  get state() {
    return this.formupdateMaterials.get('state');
  }
  get street() {
    return this.formupdateMaterials.get('street');
  }
  get counrty() {
    return this.formupdateMaterials.get('country');
  }
  get zipCode() {
    return this.formupdateMaterials.get('zipCode');
  }

}
