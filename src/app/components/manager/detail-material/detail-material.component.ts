import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { MapService } from 'src/app/services/map/map.service';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-detail-material',
  templateUrl: './detail-material.component.html',
  styleUrls: ['./detail-material.component.css'],
})
export class DetailMaterialComponent implements OnInit {
  btn!: string;
  status = 'panne';
  material!: IMaterial;
  id!: string;
  textEnPanne: string = 'Ce materiel est reparé ?';
  textFonctionnel: string = 'Ce materiel est en panne ?';
  constructor(
    private serviceMaterial: EquipmentService,
    private route: ActivatedRoute,
    private AuthenticateService: AuthenticateService,
    private servMap: MapService
  ) {
    this.serviceMaterial
      .findMaterial(String(this.route.snapshot.paramMap.get('id')))
      .subscribe((m: IMaterial) => {
        this.material = m;
        this.material.address = plainToClass(Address, this.material.address);
        this.servMap.findLocation(this.material.address.Location());
        console.log(this.material);
        if (this.material.status == 'Broken_down') {
          this.btn = this.textEnPanne;
        }
        if (this.material.status == 'Functional') {
          this.btn = this.textFonctionnel;
        }
      }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }

  ngOnInit(): void {}

  changeStatus() {
    let newMaterial: Material = new Material(
      this.material.name,
      this.material.description,
      this.material.totalQuantity,
      this.material.dateOfPurchase,

      this.material.address,
      this.material.category,
      this.material.status
    );
    if (this.btn == this.textEnPanne) {
      newMaterial.setStatus('Functional');
      this.serviceMaterial
        .update(this.material.id, newMaterial)
        .subscribe((data: any) => {
          if (data.status) {
            Notify.info(data.message);
          }
        }),
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.AuthenticateService.redirectIfNotAuth();
          } else {
            Report.failure('Erreur', error.message, 'OK');
          }
        };

      this.btn = this.textFonctionnel;
      return;
    }
    if (this.btn == this.textFonctionnel) {
      newMaterial.setStatus('Broken_down');

      this.serviceMaterial
        .update(this.material.id, newMaterial)
        .subscribe((data: any) => {
          if (data.status) {
            Notify.info(data.message);
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }),
        (error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.AuthenticateService.redirectIfNotAuth();
          } else {
            Report.failure('Erreur', error.message, 'OK');
          }
        };

      this.btn = this.textEnPanne;
      return;
    }
  }


  get Status():string{
let    res="Functionnel"
    if(this.material.status=='Broken_down')
    {
res="En panne"
    }
    return res
  }
}
