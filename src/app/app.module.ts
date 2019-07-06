import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularSplitModule } from 'angular-split';
import { MapComponent } from './components/map/map.component';
import { EditorComponent } from './components/editor/editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularSplitModule.forRoot(),
    BrowserAnimationsModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
