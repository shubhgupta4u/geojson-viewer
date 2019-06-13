import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'geojson-viewer';

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
}
