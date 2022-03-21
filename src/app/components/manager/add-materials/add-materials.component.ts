import { MapsAPILoader } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from 'src/app/models/Location';

import { Material } from 'src/app/models/resources/Material';

@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  formAddMaterials!: FormGroup;
  latitude!: number;
  longitude!: number;
  zoom!: number;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private formBuilder: FormBuilder
  ) {
    this.formAddMaterials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      status: ['', [Validators.required]],

    dateOfPurshase: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      Latitude: ['', [Validators.required]],
      Longitude: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }


  addMaterial(){
    let location=new Location(this.latitude,this.longitude);
    console.log(location)
    let material=new Material(this.name?.value,this.description?.value,location,this.dateOfPurshase?.value,this.status?.value)
console.log(material)
  }

  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
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
/*  get Latitude() {
    return this.formAddMaterials.get('Latitude');
  }
  get Longitude() {
    return this.formAddMaterials.get('Longitude');
  }
*/


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

}
