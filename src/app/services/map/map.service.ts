import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import OSM from 'ol/source/OSM';
import { Geometry } from 'ol/geom';
import * as olProj from 'ol/proj';
import BaseLayer from 'ol/layer/Base';
import { plainToClass } from 'class-transformer';
import { Location } from 'src/app/models/Location';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}
  map!: Map;
  tunisie: Feature<Geometry>[] = [];
  vectorSource!: VectorSource<Geometry>;
  vectorLayer!: BaseLayer;
  coord!: any;
  res: any;
  feature!: any;

  get style() {
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: 'red'
        }),
        stroke: new Stroke({
          color: 'yellow',
          width: 2
        }),
        radius: 7
      })


    });
  }

 findLocation(Data: Location) {
    //  Data
    var res = plainToClass(Location, Data);
    var coordinates = olProj.fromLonLat([parseFloat(res.Longitude.toFixed(5)),parseFloat(res.Latitude.toFixed(5))]);
    this.feature = new Feature(new Point(olProj.fromLonLat([parseFloat(res.Longitude.toFixed(5)),parseFloat(res.Latitude.toFixed(5))])));
   // console.log(this.feature.getGeometry().getCoordinates());
 this.vectorSource = new VectorSource({
    features:  [this.feature]
  });
 // console.log(this.vectorSource.getView());

  this.vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: this.style,
  })
  //console.log(this.vectorLayer.dispose())
return  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      this.vectorLayer,
    ],
    view: new View({
      center: coordinates,
      zoom: 13,
      maxZoom: 30,
    }),
  });
}
  initilizeMap(Data: Location[]) {
    for (var i = 0; i < Data.length; i++) {
      //  Data
      var res = plainToClass(Location, Data);
      var coordinates = olProj.fromLonLat(
        [
          parseFloat(res[i].Longitude.toFixed(5)),
          parseFloat(res[i].Latitude.toFixed(5)),
        ],

      );
      this.feature = new Feature(new Point(coordinates));
      console.log(this.feature.getGeometry().getCoordinates());

      this.tunisie.push(this.feature);
    }

    this.vectorSource = new VectorSource({
      features: this.tunisie,
    });
   // console.log(this.vectorSource.getView());

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.style,
    })
    //console.log(this.vectorLayer.dispose())
  return  this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: olProj.fromLonLat([9.537499, 33.886917]),
        zoom: 7,
        maxZoom: 30,
      }),
    });
  }



  getCoord(event: any) {
    this.coord = this.map.getEventCoordinate(event);
    this.res = olProj.transform(this.coord, 'EPSG:3857', 'EPSG:4326');
  }
}
