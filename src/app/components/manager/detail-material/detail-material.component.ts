import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notify, Report } from 'notiflix';
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
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
    });
    this.serviceMaterial.showMaterial(this.id).subscribe((m: IMaterial) => {
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
    if (this.btn == 'materiel reparé') {
      this.status = 'en bonne condition';
      this.serviceMaterial
        .updateStatus(this.id, this.status)
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
      this.status = 'materiel en panne';
      this.serviceMaterial
        .updateStatus(this.id, this.status)
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
