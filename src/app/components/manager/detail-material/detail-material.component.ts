import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { Notify, Report } from 'notiflix';
import { Address } from 'src/app/models/Address';
import { Material } from 'src/app/models/resources/Material';
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
  textEnPanne:string="Ce materiel est reparé ?"
  textFonctionnel:string="Ce materiel est en panne ?"
  constructor(
    private serviceMaterial: EquipmentService,
    private route: ActivatedRoute
  ) {
      this.serviceMaterial.showMaterial(String(this.route.snapshot.paramMap.get("id"))).subscribe((m: IMaterial) => {
      this.material = m;
      this.material.address=plainToClass(Address,this.material.address)
      console.log(this.material)
      if (this.material.status == 'Broken_down') {
        this.btn = this.textEnPanne
      }
      if (this.material.status == 'Functional') {
        this.btn = this.textFonctionnel
      }
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');

        console.log(error.message);
      };
  }

  ngOnInit(): void {}

  changeStatus() {
    let newMaterial:Material=new Material(this.material.name,this.material.description,this.material.address
      ,this.material.dateOfPurchase,this.material.status)
    if (this.btn == this.textEnPanne) {


      newMaterial.setStatus('Functional')
      this.serviceMaterial
        .update(this.material.id, newMaterial)
        .subscribe((data: any) => {
          if (data.status) {
            Notify.info(data.message);
          }
        }),
        (error: HttpErrorResponse) => {
          Report.failure('erreur', error.message, 'ok');
        };

      this.btn = this.textFonctionnel;
      return;
    }
    if (this.btn == this.textFonctionnel) {
      newMaterial.setStatus('Broken_down')

      this.serviceMaterial
        .update(this.material.id, newMaterial)
        .subscribe((data: any) => {
          if (data.status) {
            Notify.info(data.message);
          }
        }),
        (error: HttpErrorResponse) => {
          Report.failure('erreur', error.message, 'ok');
        };

      this.btn = this.textEnPanne;
      return;
    }
  }
}
