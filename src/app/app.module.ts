import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularSplitModule } from 'angular-split';
import { MapComponent } from './components/map/map.component';
import { EditorComponent } from './components/editor/editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import { UploadFileComponent } from './components/editor/upload-file/upload-file.component';
import { AgGridModule } from 'ag-grid-angular';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EditorComponent,
    UploadFileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AngularSplitModule.forRoot(),
    BrowserAnimationsModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatSnackBarModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
