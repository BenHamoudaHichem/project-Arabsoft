import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style';
import OSM from 'ol/source/OSM';
import { Geometry } from 'ol/geom';
import * as olProj from 'ol/proj';
import BaseLayer from 'ol/layer/Base';
import { plainToClass } from 'class-transformer';
import { Location } from 'src/app/models/Location';
import { Overlay } from 'ol';
import 'ol/ol.css';
import { Address } from 'src/app/models/Address';
import {FullScreen, defaults as defaultControls} from 'ol/control';

let style=new Style({
  image: new Circle({
    fill: new Fill({
      color: 'red',
    }),
    stroke: new Stroke({
      color: 'yellow',
      width: 2,
    }),
    radius: 7,
  }),
  text: new Text({

    offsetY: 15,
    font: '20px Calibri,sans-serif',
    fill: new Fill({
      color: "red",
    }),
    stroke: new Stroke({
      color: "#ffffff",
      width: 10
    }),


  })
});
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
  overlay!: Overlay;

  get styleCircle() {
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: 'red',
        }),
        stroke: new Stroke({
          color: 'yellow',
          width: 2,
        }),
        radius: 7,
      }),
    });
  }

  findLocation(Data: Location) {


    //  Data
    var res = plainToClass(Location, Data);
    var coordinates = olProj.fromLonLat([
      parseFloat(res.Longitude.toFixed(5)),
      parseFloat(res.Latitude.toFixed(5)),
    ]);
    this.feature = new Feature(
      new Point(
        olProj.fromLonLat([
          parseFloat(res.Longitude.toFixed(5)),
          parseFloat(res.Latitude.toFixed(5)),
        ])
      )
    );
    this.vectorSource = new VectorSource({
      features: [this.feature],
    });
    // console.log(this.vectorSource.getView());

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.styleCircle,
    });
    //console.log(this.vectorLayer.dispose())
    return (this.map = new Map({
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
    }));
  }
  initilizeMap(Data: Address[]) {
    for (var i = 0; i < Data.length; i++) {
      var res = plainToClass(Address, Data);
      var l=plainToClass(Location,res[i].Location())
      console.log(l)
      var coordinates = olProj.fromLonLat([
        parseFloat(l.Longitude.toFixed(5)),
        parseFloat(l.Latitude.toFixed(5)),
      ]);
      this.feature = new Feature(
        {geometry: new Point(coordinates), label: res[i].State.concat(" ",res[i].Street," ").concat(res[i].City)}
        );

      this.tunisie.push(this.feature);

    }

    this.vectorSource = new VectorSource({
      features: this.tunisie,
    });
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style:this.styleCircle
      /* function (feature) {
           style.getText().setText(feature.get('label'));
        return style
      }*/
    });

    this.map = new Map({
      controls: defaultControls().extend([new FullScreen()]),

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
    return this.map;
  }

 /* getCoord(event: any) {
    this.coord = this.map.getEventCoordinate(event);
    this.res = olProj.transform(this.coord, 'EPSG:3857', 'EPSG:4326');
  }*/
}
