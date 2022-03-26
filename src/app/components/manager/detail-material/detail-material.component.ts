import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'notiflix';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-detail-material',
  templateUrl: './detail-material.component.html',
  styleUrls: ['./detail-material.component.css'],
})
export class DetailMaterialComponent implements OnInit {
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
    }),
      (error: HttpErrorResponse) => {
        Report.warning('Erreur', error.message, 'OK');

        console.log(error.message);
      };
  }

  ngOnInit(): void {}
}
