import { Component, OnInit, ViewChild } from '@angular/core';
import { FeatureCollection } from 'geojson-parser-js/models/geojson';
import { FeatureProperty, Coordinate, Geometry, Point, LineString, Polygon, PolygonWithHole, MultiPoint, MultiLineString, MultiPolygon } from 'geojson-parser-js/models/geojson';
import { AgGridAngular } from 'ag-grid-angular';

import * as $ from 'jquery';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  defaultMapLoc:any ={lat:37.0902,lng: -95.7129};
  defaultZoom:number=4;

  defaultColDef: any = {
                        filter: true,
                        resetButton: true,
                        applyButton: true,
                        debounceMs: 200,sortable: true, editable: false
                       }
  drawnShapes: Array<any>;
  map: any; //google.maps.Map;
  bounds: any; // google.maps.LatLngBounds;
  mapOptions:any;
  markerOption: any = {
  };
  polygonOption: any = {
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  };
  polylineOption: any = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35
  };
  showDataGrid:boolean=false;

  columnDefs: any = [];
  rowData: any = [];

  constructor() { }

  ngOnInit() {    
    /***** Create map *****/
    let self = this;
    $(document).ready(()=>{
      self.initialiseMap(self);
    })
  }
  initialiseMap(self){
    if(!self){
      self = this;
    }
    self.mapOptions = {
      center: this.defaultMapLoc,
      zoom: this.defaultZoom, controlSize: 25,
      fullscreenControl: false,
      signInControl: false,
      streetViewControl: false,
      rotateControl: false,
      gestureHandling: 'cooperative',
      scrollwheel: true,
      zoomControl: true,
      minZoom:2,
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
    self.map = new google.maps.Map(document.getElementById('map'), self.mapOptions);
  }
  onGeoJsonChange(features: FeatureCollection) {
    if (this.drawnShapes && this.drawnShapes.length > 0) {
      this.drawnShapes.forEach((shape) => {
        shape.setMap(null);
      });
    }
    this.drawnShapes = new Array<any>();
    this.rowData = [];
    this.populateAttributes(features.geometries);
    this.drawShape(features.geometries);
    
    this.rearrangeLayout();       
  }
  rearrangeLayout(){
    if(this.rowData && this.rowData.length > 0){
      // $('#map').css('height','calc(100vh - 200px)');
      // $('#agGrid').css('display','block')
      // $('.data-grid-container').css('display','block')
      this.showDataGrid = true;
    }else{
      // $('#map').css('height','100vh');
      // $('#agGrid').css('display','none')
      // $('.data-grid-container').css('display','none')
      this.showDataGrid = false;
    }
    // $('.data-grid-container').css('height','200px'); 
    if(!this.drawnShapes || this.drawnShapes.length == 0){
      this.map.setZoom(this.defaultZoom);
      this.map.setCenter(this.defaultMapLoc);
    }
  }
  toggleDataGrid(){
    this.showDataGrid = !this.showDataGrid;
    // let height = $('.data-grid-container').height();
    // let mapheight = $('#map').height();
    // $('#agGrid').slideToggle('slow');
    // if(height == 30){     
    //   $('.data-grid-container').animate({height: "200px"},'slow');
    //   $('#map').animate({height: (mapheight - 170) + 'px'},'slow');
    //   this.showDataGrid = true;
    // }else{
    //   $('.data-grid-container').animate({height: "30px"},'slow');
    //   $('#map').animate({height: (mapheight + 170) + 'px'},'slow');
    //   this.showDataGrid = false;
    // }
  }
  populateAttributes(geometries: Array<Geometry>) {
    let _columnDefs = [];
    let _rowDataArray = [];
    if (geometries && geometries.length) {
      _columnDefs.push({ headerName: 'Id', field: 'Id', sortable: true, filter: true, width: 70 });
      let index = 0;
      geometries.forEach((geometry: Geometry) => {
        if (geometry.featureProperties && geometry.featureProperties.length > 0) {   
            let _rowData = {};
            geometry['shapeId'] = index + 1;
            _rowData['Id'] = index + 1;
            geometry.featureProperties.forEach((property: FeatureProperty) => {
              let field: string = property.key.replace(' ', '');
              if (index == 0) {
                _columnDefs.push({ headerName: property.key, field: field });
              }
              _rowData[field] = property.value;
            });
            index = index + 1;
            _rowDataArray.push(_rowData);    
        }
      });
    }
    this.columnDefs = _columnDefs;
    this.rowData = _rowDataArray;
  }
  populateAttributes_Old(geometries: Array<Geometry>) {
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
    this.rearrangeLayout();  
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
      marker.set('shapeId',point['shapeId']);
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
      polyLine.set('shapeId',line['shapeId']);
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
      polygonShape.set('shapeId',polygon['shapeId']);
      polygonShape.setMap(this.map);
      this.setBound(latLngs);
      this.addShape(polygonShape);
    }
  }
  drawMultiLine(multiLine: MultiLineString) {
    if (multiLine.LinesString && multiLine.LinesString.length > 0) {
      multiLine.LinesString.forEach((line: LineString) => {
        line["shapeId"] = multiLine["shapeId"];
        this.drawLine(line);
      });
    }
  }
  drawMultiPolygon(multipolygon: MultiPolygon) {
    if (multipolygon.polygons && multipolygon.polygons.length > 0) {
      let polygonShape: google.maps.Polygon = new google.maps.Polygon(this.polygonOption);
      let latLngsList: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> = new google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>();
      multipolygon.polygons.forEach((polygon: Polygon) => {
        if (polygon.coordinates && polygon.coordinates.length > 0) {
          let latLngs: google.maps.MVCArray<google.maps.LatLng> = new google.maps.MVCArray<google.maps.LatLng>();
          polygon.coordinates.forEach((cord: Coordinate) => {
            latLngs.push(new google.maps.LatLng(cord.lat, cord.lng));
          });
          this.setBound(latLngs);
          latLngsList.push(latLngs);
        }
      });
      polygonShape.setPaths(latLngsList)
      polygonShape.set('shapeId',multipolygon['shapeId']);
      polygonShape.setMap(this.map);
      this.addShape(polygonShape);
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
      let shapeId = this.get("shapeId");
      let index =0;
      if (shapeId >= 0 && self.agGrid && self.rowData) {
        self.agGrid.api.forEachNode(node => {
          if(node.data["Id"] == shapeId) {
            node.setSelected(true);
            index=node.rowIndex;
            self.agGrid.api.ensureIndexVisible(index, 'top');
           }
        });
      }
    });

    this.drawnShapes.push(shape);
  }
  dataRowClicked(event){
    if(event && event.data && event.data.Id > 0){
      let shapeid = event.data.Id;
      let selectedShapes = this.drawnShapes.filter(s=>s.get("shapeId") == shapeid);
      if(selectedShapes && selectedShapes.length > 0){
        this.bounds = new google.maps.LatLngBounds();
        selectedShapes.forEach(s=>{
          if(s instanceof google.maps.Marker){
            let latLngs: google.maps.MVCArray<google.maps.LatLng> = new google.maps.MVCArray<google.maps.LatLng>();
            latLngs.push(s.getPosition());
            this.setBound(latLngs);
          }           
          else  if(s instanceof google.maps.Polygon){
            let latLngsList: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> = s.getPaths();
            if(latLngsList && latLngsList.getLength() > 0){
              latLngsList.forEach(l=>{
                this.setBound(l);
              });
            }            
          }
          else  if(s instanceof google.maps.Polyline){
                this.setBound(s.getPath());       
          }
        })
        this.map.fitBounds(this.bounds);
      }
     
    }
    
  }
}
