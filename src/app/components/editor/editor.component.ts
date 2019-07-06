import { Component, OnInit ,ViewChild} from '@angular/core';
import * as $ from 'jquery';
import * as CodeMirror from 'codemirror/lib/codemirror.js';
import foldcode from  'codemirror/addon/fold/foldcode.js'
import foldgutter from  'codemirror/addon/fold/foldgutter.js'
import bracefold from  'codemirror/addon/fold/brace-fold.js'
import activeline from  'codemirror/addon/selection/active-line.js'
import matchbrackets from  'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/mode/javascript/javascript.js';
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
      var headerHeight =$('.mat-tab-header').height();
      var height = $('#map').height();
      $('.CodeMirror').css('height',height - headerHeight - 1);
    });
  }
}
