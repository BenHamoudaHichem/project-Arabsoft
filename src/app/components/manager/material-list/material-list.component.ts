import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css'],
})
export class MaterialListComponent implements OnInit {
  materialList!: IMaterial[];
  constructor(private serviceMaterial: EquipmentService) {
    this.showAll();
  }

  ngOnInit(): void {}

  //Demands
  showAll() {
    this.serviceMaterial.all().subscribe((IM: IMaterial[]) => {
      this.materialList = IM;
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }
}
