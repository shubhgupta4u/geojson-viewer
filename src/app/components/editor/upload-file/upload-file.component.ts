import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import * as $ from 'jquery';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.less']
})
export class UploadFileComponent implements OnInit {
  geoJsonUrl: string;
  @Output() onfileUploaded = new EventEmitter<string>();
  @Output() onResetRequested = new EventEmitter();
  dropArea:any;

  constructor(private httpService: HttpServiceService) { }
  initialize(){
    if(!this.dropArea){
      var self = this;
      self.dropArea = $('#droparea')[0];
      ;['dragenter', 'dragover'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, (e)=>{
          e.preventDefault();
          e.stopPropagation();
          self.dropArea.classList.add('highlight');
        }, false)
      });
      ;['dragleave'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, (e)=>{
          e.preventDefault();
          e.stopPropagation();
          self.dropArea.classList.remove('highlight');
        }, false)
      })
      ;['drop'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, (e)=>{
          e.preventDefault();
          e.stopPropagation();
          self.dropArea.classList.remove('highlight');
          let dt = e.dataTransfer
          let files = dt.files
          self.readUploadedFile(files[0]);
        }, false)
      });
    }
  }
  validURL(myURL) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
      '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(myURL);
  }
  ngOnInit() {
    
  }
  preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  getGeoJSONByUrl() {
    if (this.validURL(this.geoJsonUrl)) {
      if (!this.geoJsonUrl.startsWith("http://") && !this.geoJsonUrl.startsWith("https://") && this.geoJsonUrl.startsWith("www.")) {
        this.geoJsonUrl = "http://" + this.geoJsonUrl;
      }
      else if (!this.geoJsonUrl.startsWith("http://") && !this.geoJsonUrl.startsWith("https://") && !this.geoJsonUrl.startsWith("www.")) {
        this.geoJsonUrl = "http://www." + this.geoJsonUrl;
      }
      this.httpService.getGeoJSONByUrl(this.geoJsonUrl).subscribe(
        (data: string) => {
          let geojson: string =JSON.stringify(data, null, "\t");
          this.onfileUploaded.emit(geojson);
        }, // success path
        error => { 
          if(error && error instanceof HttpErrorResponse && error.status == 0){
            alert('We are not able to access the requested resource due to CORS Policy at the target server.'); 
          } else if(error && error instanceof HttpErrorResponse && error.status == 404){
            alert('Requested resource is not available. Kindly verify your entered URL.'); 
          }else{
            alert('We are not able to access the requested resource'); 
          }       
        }// error path
      );
    }
    else {
      alert('Invalid URL');
    }
  }
  openFileDialog() {
    $('#geojsonFileInput').trigger('click');
  }
  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.readUploadedFile(file);
    }
  }
  readUploadedFile(file:any){
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let geojsonObj:any = JSON.parse(fileReader.result.toString());
      if(geojsonObj){
        // this.addCovidUSData(geojsonObj);
        // this.addCovidIndiaData(geojsonObj);
        //  this.addCovidCountryData(geojsonObj);
        let geojson: string =JSON.stringify(geojsonObj, null, "\t");
        this.onfileUploaded.emit(geojson);
      }        
    }
    fileReader.readAsText(file);
    $('#geojsonFileInput').val(''); 
  }
  removedUnsusedProperties(properties){
    Object.keys(properties).forEach(key=>{
      if(key != 'name' && key != 'pop_est' && key != 'gdp_md_est' && key != 'economy' && key != 'income_grp' && key != 'iso_a2' && key != 'iso_a3' && key != 'continent')
        delete properties[key]
    });
  }
  addCovidCountryData(geojsonObj:any){
    this.httpService.getCovidWorldData().subscribe((data:any)=>{
      if(data && data){
        var covidData:any[] = data;
        geojsonObj.features.forEach((geometry) => {
          this.removedUnsusedProperties(geometry.properties);
          let iso_a2 = geometry.properties.iso_a2;
          let stateCovidData = covidData.find(d=>  d["countrycode"] == iso_a2 );
          if(stateCovidData){        
            geometry.properties["latitude"] = stateCovidData.latitude;
            geometry.properties["longitude"] = stateCovidData.longitude;
            geometry.properties["confirmed"] = stateCovidData.confirmed;
            geometry.properties["deaths"] = stateCovidData.deaths;
            geometry.properties["active"] = stateCovidData.active;
            geometry.properties["recovered"] = stateCovidData.recovered;
          }
          else{
            geometry.properties["latitude"] = "";
            geometry.properties["longitude"] = "";
            geometry.properties["confirmed"] = "0";
            geometry.properties["deaths"] = "0";
            geometry.properties["active"] = "0";
            geometry.properties["recovered"] = "0";
          }          
        });
      }
      let geojson: string =JSON.stringify(geojsonObj);
      // let geojson: string =JSON.stringify(geojsonObj, null, "\t");
      this.onfileUploaded.emit(geojson);
    });
    
  }
  addCovidIndiaData(geojsonObj:any){
    this.httpService.getCovidIndiaData().subscribe((data:any)=>{
      if(data && data){
        var covidData:any[] = data;
        geojsonObj.features.forEach((geometry) => {
          let state = geometry.properties.name
          let stateCovidData = covidData.filter(d=> {
            return (state == "Andhra Pradesh" && (d["state"] =="Andhra Pradesh" || d["state"] == "Telengana") )
            || (state == "Jammu and Kashmir" && (d["state"] =="Jammu and Kashmir" || d["state"] == "Ladakh") )
            || d["state"] == state
            || (state== "Andaman and Nicobar" &&  d["state"] == "Andaman and Nicobar Islands") 
            || (state == "Orissa" &&  d["state"] == "Odisha");
          });
          if(stateCovidData && stateCovidData.length == 1){        
            geometry.properties.name = stateCovidData[0].state;
            geometry.properties["latitude"] = stateCovidData[0].latitude;
            geometry.properties["longitude"] = stateCovidData[0].longitude;
            geometry.properties["confirmed"] = stateCovidData[0].confirmed;
            geometry.properties["deaths"] = stateCovidData[0].deaths;
            geometry.properties["active"] = stateCovidData[0].active;
            geometry.properties["recovered"] = stateCovidData[0].recovered;
          }
          else if(stateCovidData && stateCovidData.length == 2){
            geometry.properties.name = stateCovidData[0].state + ' & ' +stateCovidData[1].state;
            geometry.properties["latitude"] = stateCovidData[0].latitude;
            geometry.properties["longitude"] = stateCovidData[0].longitude;
            geometry.properties["confirmed"] = stateCovidData[0].confirmed + stateCovidData[1].confirmed;
            geometry.properties["deaths"] = stateCovidData[0].deaths + stateCovidData[1].deaths;
            geometry.properties["active"] = stateCovidData[0].active + stateCovidData[1].active;
            geometry.properties["recovered"] = stateCovidData[0].recovered + stateCovidData[1].recovered;
          }
          else{
            geometry.properties["latitude"] = "";
            geometry.properties["longitude"] = "";
            geometry.properties["confirmed"] = "0";
            geometry.properties["deaths"] = "0";
            geometry.properties["active"] = "0";
            geometry.properties["recovered"] = "0";
          }          
        });
      }
      let geojson: string =JSON.stringify(geojsonObj);
      // let geojson: string =JSON.stringify(geojsonObj, null, "\t");
      this.onfileUploaded.emit(geojson);
    });
    
  }
  addCovidUSData(geojsonObj:any){
    this.httpService.getCovidUSData().subscribe((data:any)=>{
      if(data && data){
        var covidData:any[] = data.list;
        geojsonObj.features.forEach((geometry) => {
          let state = geometry.properties.NAME;
          let stateCovidData = covidData.filter(d=> {
            return (d["state"] == state);
          });
          if(stateCovidData && stateCovidData.length == 1){        
            geometry.properties["geo_id"] = geometry.properties["GEO_ID"];
            geometry.properties["name"] = stateCovidData[0].state;
            geometry.properties["censusarea"] = geometry.properties["CENSUSAREA"];
            geometry.properties["latitude"] = stateCovidData[0].latitude;
            geometry.properties["longitude"] = stateCovidData[0].longitude;
            geometry.properties["confirmed"] = stateCovidData[0].confirmed;
            geometry.properties["deaths"] = stateCovidData[0].deaths;
          }
          else{
            geometry.properties["geo_id"] = geometry.properties["GEO_ID"];
            geometry.properties["name"] = stateCovidData[0].state;
            geometry.properties["censusarea"] = geometry.properties["CENSUSAREA"];
            geometry.properties["latitude"] = "";
            geometry.properties["longitude"] = "";
            geometry.properties["confirmed"] = "0";
            geometry.properties["deaths"] = "0";
          }          
          delete geometry.properties["GEO_ID"]
          delete geometry.properties["STATE"]
          delete geometry.properties["NAME"]
          delete geometry.properties["LSAD"]
          delete geometry.properties["CENSUSAREA"]
        });
      }
      
      let geojson: string =JSON.stringify(geojsonObj);
      // let geojson: string =JSON.stringify(geojsonObj, null, "\t");
      this.onfileUploaded.emit(geojson);
    });
    
  }
  resetEditornClearMap() {
    this.onResetRequested.emit();
  }
}
