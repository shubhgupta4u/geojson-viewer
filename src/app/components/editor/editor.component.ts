import { Component, OnInit ,ViewChild} from '@angular/core';
import * as $ from 'jquery';
//import * as CodeMirror from 'codemirror/lib/codemirror.js';
import * as defaultGeojson from '../../../assets/defaultGeojson.json';
declare var InitializeEditor;
declare var CodeMirror;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})

export class EditorComponent implements OnInit{
  editor:any;
  code:string ='';
  constructor() { 
    this.code=JSON.stringify(defaultGeojson, null, "\t");
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
    });
  }
}
