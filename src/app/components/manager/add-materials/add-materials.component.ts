import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Location } from 'src/app/models/Location';

import { Material } from 'src/app/models/resources/Material';
import { EquipmentService } from 'src/app/services/resources/material/material.service';

@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  formAddMaterials!: FormGroup;
  lat!: number;
  long!: number;
  zoom!: number;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private formBuilder: FormBuilder,
    private materialService: EquipmentService,
    private router: Router
  ) {
    this.formAddMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

      dateOfPurshase: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
      ],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    //Load map
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }

  addMaterial() {
    let location = new Location(this.latitude?.value, this.longitude?.value);
    //  console.log(location)
    let material = new Material(
    String(this.name?.value),
    String(this.description?.value),
      location,
      this.dateOfPurshase?.value,
      String(this.status?.value)
    );
    console.log(material);
    this.materialService.create(material).subscribe((data) => {
      this.router.navigate(['manager/materialList']);
    }),
      (error: HttpErrorResponse) => {
        alert(error.message);
      };
  }

  /*---- maker drag-----*/
  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.lat = $event.latLng.lat();
    this.long = $event.latLng.lng();
  }

  get name() {
    return this.formAddMaterials.get('name');
  }
  get status() {
    return this.formAddMaterials.get('status');
  }
  get dateOfPurshase() {
    return this.formAddMaterials.get('dateOfPurshase');
  }
  get description() {
    return this.formAddMaterials.get('description');
  }
  get latitude() {
    return this.formAddMaterials.get('latitude');
  }
  get longitude() {
    return this.formAddMaterials.get('longitude');
  }

  /*
// Method for Geocod reverse

  getReverseGeocodingData(lat: number, lng: number) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results);
        var address = results[0].formatted_address;
      }
    });
  }
*/
}
