import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import OSM from 'ol/source/OSM';
import { Geometry } from 'ol/geom';
import MousePosition from 'ol/control/MousePosition';
import * as olProj from 'ol/proj';

import BaseLayer from 'ol/layer/Base';
import { createStringXY } from 'ol/coordinate';
@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}
  map!: Map;
  tunisie: Feature<Geometry>[] = [];
  vectorSource!: VectorSource<Geometry>;
  vectorLayer!: BaseLayer;
  rasterLayer: any;
  coord!: any;
  res: any;
  feature!: any;

  get style() {
    return new Style({
      image: new Icon({
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: 'assets/vectorpoint.svg',
        imgSize: [30, 30],
      }),
    });
  }

  initilizeMap(Data: any) {
    for (var i = 0; i < Data.length; ++i) {
      var coordinates = fromLonLat([Data[i].longitude, Data[i].latitude]);
      this.feature = new Feature(new Point(coordinates));
      this.feature.set('name', Data[i].address);
      this.feature.setStyle(this.style);
      this.tunisie.push(this.feature);
    }

    this.vectorSource = new VectorSource({
      features: this.tunisie,
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: fromLonLat([9.537499, 33.886917]),
        zoom: 7,
      }),
    });
    let mouse = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;',
      target: 'mouse',
    });

    this.map.addControl(mouse);
    //console.log(mouse)
  }

  //trnsform coordinte

  getCoord(event: any) {
    this.coord = this.map.getEventCoordinate(event);
    this.res = olProj.transform(this.coord, 'EPSG:3857', 'EPSG:4326');
  }
}
