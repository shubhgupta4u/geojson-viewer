import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import * as $ from 'jquery';

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
        error => { console.log(error); alert('File not found'); }// error path
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
        let geojson: string =JSON.stringify(geojsonObj, null, "\t");
        this.onfileUploaded.emit(geojson);
      }        
    }
    fileReader.readAsText(file);
  }
  resetEditornClearMap() {
    this.onResetRequested.emit();
  }
}
