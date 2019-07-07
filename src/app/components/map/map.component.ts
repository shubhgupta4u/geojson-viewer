import { Component, OnInit } from '@angular/core';
import { FeatureCollection } from 'geojson-parser-js/models/geojson';
import { GeometryType, FeatureProperty, Coordinate, Geometry, Point, LineString, Polygon, PolygonWithHole, MultiPoint, MultiLineString, MultiPolygon } from 'geojson-parser-js/models/geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  drawnShapes: Array<any>;
  map: google.maps.Map;
  bounds:google.maps.LatLngBounds;
  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.363, lng: 131.044 }, zoom: 4, fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
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
  constructor() { }

  ngOnInit() {
    let mapOptions1: google.maps.MapOptions = {
      backgroundColor: '#fff',
      center: { lat: -25.363, lng: 131.044 },
      clickableIcons: true,
      controlSize: 30,
      draggable: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
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
  }
  onMapViewResest() {
    if (this.drawnShapes && this.drawnShapes.length > 0) {
      this.drawnShapes.forEach((shape) => {
        shape.setMap(null);
      });
    }
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
    this.drawnShapes = new Array<any>();
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
      this.drawnShapes.push(marker);
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
      this.drawnShapes.push(polyLine);
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
      this.drawnShapes.push(polygonShape);
    }
  }
  setBound(latLngs: google.maps.MVCArray<google.maps.LatLng>){ 
    latLngs.forEach((item)=>{
      this.bounds.extend(item);
    });
  }
}
