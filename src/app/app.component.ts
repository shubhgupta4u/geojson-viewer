import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { MapComponent } from './components/map/map.component';
import { FeatureCollection } from 'geojson-parser-js/models/geojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'geojson-viewer';
  private defaultRightAreaSize = 40;
  private defaultLeftAreaSize = 60;
  minAreaSize:number = 2.3;
  maxAreaSize:number = 97.7;
  rightAreaSize:number=this.defaultRightAreaSize;
  leftAreaSize:number=this.defaultLeftAreaSize;
  isEditorMinimize:boolean = false;
  isMapMinimize:boolean=false;

  @ViewChild('mapView',{static:false}) mapView:MapComponent;

  ngOnInit() {   
  }
  onSpilterDragStart(event){
    if(this.isMapMinimize)
    {
      this.isMapMinimize = false;
    }
    if(this.isEditorMinimize){
      this.isEditorMinimize = false;
    }
  }
  onSpilterDragEnd(event){
    this.leftAreaSize=event.sizes[0];
    this.rightAreaSize=event.sizes[1];
    if(event.sizes[0] == this.minAreaSize && !this.isMapMinimize){
      this.isMapMinimize = true;
    }
    if(event.sizes[1] == this.minAreaSize && !this.isEditorMinimize){
      this.isEditorMinimize = true;
    }
  }
  onMapCollapeBtnClicked(){
    this.isMapMinimize=!this.isMapMinimize;
    if(this.isMapMinimize){
      this.rightAreaSize = this.maxAreaSize;
      this.leftAreaSize = this.minAreaSize;
      this.isEditorMinimize = false;
    }
    else{
      this.rightAreaSize = this.defaultRightAreaSize;
      this.leftAreaSize = this.defaultLeftAreaSize;
    }
  }
  onEditorCollapeBtnClicked(){
    this.isEditorMinimize=!this.isEditorMinimize;
    if(this.isEditorMinimize){
      this.rightAreaSize = this.minAreaSize;
      this.leftAreaSize =this.maxAreaSize;
      this.isMapMinimize = false;
    }
    else{
      this.rightAreaSize = this.defaultRightAreaSize;
      this.leftAreaSize = this.defaultLeftAreaSize;
    }
  }
  onGeoJsonChange(features:FeatureCollection){
    this.mapView.onGeoJsonChange(features);
  }
  onResetRequest(){
    this.rightAreaSize=this.defaultRightAreaSize;
    this.leftAreaSize=this.defaultLeftAreaSize;
    this.isEditorMinimize = false;
    this.isMapMinimize = false;
    this.mapView.onMapViewResest();
  }
}
