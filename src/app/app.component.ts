import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';

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
  ngOnInit() {
    let mapOptions: google.maps.MapOptions = { center: { lat: -25.363, lng: 131.044 }, zoom: 4};
    let mapOptions1: google.maps.MapOptions = {
      backgroundColor: '#fff',
      center: { lat: -25.363, lng: 131.044 },
      clickableIcons: true,
      controlSize: 30,
      draggable: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      gestureHandling: 'cooperative',
      scrollwheel: true,
      styles: [
        {
          elementType: 'geometry',
          featureType: 'water',
          stylers: [
            {
              color: '#00bdbd'
            }
          ]
        },
        {
          elementType: 'geometry',
          featureType: 'landscape.man_made',
          stylers: [
            {
              color: '#f7f1df'
            }
          ]
        }
      ],
      zoom: 4
    };
    /***** Create map *****/
    let map: google.maps.Map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  onSpilterDragStart(event){
    if(this.isMapMinimize)
    {
      this.isMapMinimize = false;
    }
    if(this.isEditorMinimize){
      this.isEditorMinimize = false;
    }
    console.log('onSpilterDragStart');
    console.log(event);
  }
  onSpilterDragEnd(event){
    console.log('onSpilterDragEnd');
    console.log(event);
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
}
