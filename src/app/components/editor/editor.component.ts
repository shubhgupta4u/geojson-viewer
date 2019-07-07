import { Component, OnInit ,ViewChild, Output, EventEmitter} from '@angular/core';
import { FeatureCollection } from 'geojson-parser-js/models/geojson';
import {Geojson} from 'geojson-parser-js';
import * as $ from 'jquery';
import * as defaultGeojson from '../../../assets/defaultGeojson.json';
import { UploadFileComponent } from './upload-file/upload-file.component.js';
//import * as CodeMirror from 'codemirror/lib/codemirror.js';

declare var CodeMirror;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})

export class EditorComponent implements OnInit{
  editor:any;
  code:string ='';
  selectedTabIndex:number = 0;
  @Output() onGeoJsonChange = new EventEmitter<FeatureCollection>();
  @Output() onResetRequest = new EventEmitter();
  @ViewChild('uploadFileComponent',{static:false}) uploadFileComponent:UploadFileComponent;
  constructor() { 
    this.code=JSON.stringify(defaultGeojson, null, "\t");
  }
  selectedTabChange(e){
    if(e.index == 1){
      this.uploadFileComponent.initialize();
    }
  }
  onfileUploaded(geojson){
    this.code =geojson;
    this.editor.setValue(this.code);   
    this.selectedTabIndex = 0;
  }
  geoJsonChanged(features:FeatureCollection){
      this.onGeoJsonChange.emit(features);
  }
  onResetRequested(){
    this.code =JSON.stringify(defaultGeojson, null, "\t");
    this.editor.setValue(this.code);
    this.onResetRequest.emit();
    this.selectedTabIndex = 0;
  }
  ngOnInit() {
    var self=this;
    $(document).ready(function(){     
      var te = $('#code')[0];
      self.editor = CodeMirror.fromTextArea(te, {
        mode: {name: "javascript", json: true},
        theme:"eclipse",
        lineNumbers: true, 
        styleActiveLine: true,
        matchBrackets: true,
        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor(), CodeMirror.braceRangeFinder); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });
      self.editor.foldCode(CodeMirror.Pos(0, 0));
      self.editor.setValue(self.code);
      self.editor.on('change',function(cMirror){
        // get value right from instance
        self.code = cMirror.getValue();
        let features:FeatureCollection = Geojson.parse(self.code);
        self.geoJsonChanged(features);
      });
    });
  }
}
