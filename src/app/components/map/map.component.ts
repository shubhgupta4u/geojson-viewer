import { Component, OnInit, ViewChild } from '@angular/core';
import { FeatureCollection } from 'geojson-parser-js/models/geojson';
import { GeometryType, FeatureProperty, Coordinate, Geometry, Point, LineString, Polygon, PolygonWithHole, MultiPoint, MultiLineString, MultiPolygon } from 'geojson-parser-js/models/geojson';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  drawnShapes: Array<any>;
  map: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  mapOptions:any = {
    center: { lat: -25.363, lng: 131.044 },
    zoom: 4, controlSize: 25,
    fullscreenControl: false,
    signInControl: false,
    streetViewControl: false,
    rotateControl: false,
    gestureHandling: 'cooperative',
    scrollwheel: true,
    zoomControl: true,
    minZoom:3,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
      style: google.maps.ZoomControlStyle.SMALL
    },
    restriction:{
      latLngBounds:{
        north:85,
        south:-85,
        west:-179.9,
        east:179.9
      }
    }
  };
  markerOption: google.maps.MarkerOptions = {
  };
  polygonOption: google.maps.PolygonOptions = {
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  };
  polylineOption: google.maps.PolygonOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35
  };

  columnDefs: any = [];
  rowData: any = [];

  constructor() { }

  ngOnInit() {    
    /***** Create map *****/
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
  }
  onGeoJsonChange(features: FeatureCollection) {
    console.log(features);
    if (this.drawnShapes && this.drawnShapes.length > 0) {
      this.drawnShapes.forEach((shape) => {
        shape.setMap(null);
      });
    }
    this.drawnShapes = new Array<any>();
    this.drawShape(features.geometries)
    this.populateAttributes(features.geometries);
  }
  populateAttributes(geometries: Array<Geometry>) {
    let _columnDefs = [];
    let _rowDataArray = [];
    if (geometries && geometries.length) {
      _columnDefs.push({ headerName: 'Id', field: 'Id', sortable: true, filter: true, width: 70 });
      let index = 0;
      geometries.forEach((geometry: Geometry) => {
    
        if (geometry.featureProperties && geometry.featureProperties.length > 0) {      
          let count = 1;
          if (geometry instanceof MultiPolygon && geometry.polygons.length > 0){
            count = geometry.polygons.length;
          } else if(geometry instanceof MultiLineString && geometry.LinesString.length > 0) {
            count = geometry.LinesString.length;
          }
          while(count > 0){
            let _rowData = {};
            _rowData['Id'] = index + 1;
            geometry.featureProperties.forEach((property: FeatureProperty) => {
              let field: string = property.key.replace(' ', '');
              if (index == 0) {
                _columnDefs.push({ headerName: property.key, field: field, sortable: true, filter: true });
              }
              _rowData[field] = property.value;
            });
            index = index + 1;
            _rowDataArray.push(_rowData);
            count =count-1;
          }         
        }
      });
    }
    this.columnDefs = _columnDefs;
    this.rowData = _rowDataArray;
  }
  onMapViewResest() {
    if (this.drawnShapes && this.drawnShapes.length > 0) {
      this.drawnShapes.forEach((shape) => {
        shape.setMap(null);
      });
    }
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
    this.drawnShapes = new Array<any>();
    this.rowData = [];
  }
  drawShape(geometries: Array<Geometry>) {
    this.bounds = new google.maps.LatLngBounds();
    geometries.forEach((geometry: Geometry) => {
      if (geometry instanceof Point) {
        this.drawPoint(geometry);
      } else if (geometry instanceof Polygon) {
        this.drawPolygon(geometry);
      } else if (geometry instanceof LineString) {
        this.drawLine(geometry);
      }
      else if (geometry instanceof MultiPolygon) {
        this.drawMultiPolygon(geometry);
      }
      else if (geometry instanceof MultiLineString) {
        this.drawMultiLine(geometry);
      }
    });
    this.map.fitBounds(this.bounds);
  }
  drawPoint(point: Point) {
    if (point.coordinate) {
      let marker: google.maps.Marker = new google.maps.Marker(this.markerOption);
      marker.setPosition(new google.maps.LatLng(point.coordinate.lat, point.coordinate.lng));
      marker.setMap(this.map);
      let latLngs: google.maps.MVCArray<google.maps.LatLng> = new google.maps.MVCArray<google.maps.LatLng>();
      latLngs.push(new google.maps.LatLng(point.coordinate.lat, point.coordinate.lng));
      this.setBound(latLngs);
      this.addShape(marker);
    }
  }
  drawLine(line: LineString) {
    if (line.coordinates && line.coordinates.length > 0) {
      let latLngs: google.maps.MVCArray<google.maps.LatLng> = new google.maps.MVCArray<google.maps.LatLng>();
      line.coordinates.forEach((cord: Coordinate) => {
        latLngs.push(new google.maps.LatLng(cord.lat, cord.lng));
      });
      let polyLine: google.maps.Polyline = new google.maps.Polyline(this.polylineOption);
      polyLine.setPath(latLngs)
      polyLine.setMap(this.map);
      this.setBound(latLngs);
      this.addShape(polyLine);
    }
  }
  drawPolygon(polygon: Polygon) {
    if (polygon.coordinates && polygon.coordinates.length > 0) {
      let latLngs: google.maps.MVCArray<google.maps.LatLng> = new google.maps.MVCArray<google.maps.LatLng>();
      polygon.coordinates.forEach((cord: Coordinate) => {
        latLngs.push(new google.maps.LatLng(cord.lat, cord.lng));
      });
      let polygonShape: google.maps.Polygon = new google.maps.Polygon(this.polygonOption);
      polygonShape.setPath(latLngs)
      polygonShape.setMap(this.map);
      this.setBound(latLngs);
      this.addShape(polygonShape);
    }
  }
  drawMultiLine(multiLine: MultiLineString) {
    if (multiLine.LinesString && multiLine.LinesString.length > 0) {
      multiLine.LinesString.forEach((line: LineString) => {
        this.drawLine(line);
      });
    }
  }
  drawMultiPolygon(multipolygon: MultiPolygon) {
    if (multipolygon.polygons && multipolygon.polygons.length > 0) {
      multipolygon.polygons.forEach((polygon: Polygon) => {
        this.drawPolygon(polygon);
      });
    }
  }
  setBound(latLngs: google.maps.MVCArray<google.maps.LatLng>) {
    latLngs.forEach((item) => {
      this.bounds.extend(item);
    });
  }
  onReady(params) {
    this.agGrid = params;
  }
  addShape(shape: any) {
    let self = this;
    shape.addListener('click', function () {
      let index = self.drawnShapes.indexOf(this);
      if (index >= 0 && self.agGrid && self.rowData && self.rowData.length > index) {
        self.agGrid.api.forEachNode(node => (node.rowIndex == index) ? node.setSelected(true) : 0);
        self.agGrid.api.ensureIndexVisible(index, 'top');
      }
    });

    this.drawnShapes.push(shape);
  }
}
