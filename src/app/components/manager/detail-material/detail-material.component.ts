import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notify, Report } from 'notiflix';
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
  constructor(
    private serviceMaterial: EquipmentService,
    private route: ActivatedRoute
  ) {
      this.serviceMaterial.showMaterial(String(this.route.snapshot.paramMap.get("id"))).subscribe((m: IMaterial) => {
      this.material = m;
      if (this.material.status == 'en panne') {
        this.btn == 'materiel reparé';
      }
      if (this.material.status == 'en bonne condtion') {
        this.btn == 'mettre en panne';
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
      ,this.material.dateOfPurshase,this.material.status)
    if (this.btn == 'materiel reparé') {


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

      this.btn = 'mettre en panne';
      return;
    }
    if (this.btn == 'mettre en panne') {
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

      this.btn = 'materiel reparé';
      return;
    }
  }
}
