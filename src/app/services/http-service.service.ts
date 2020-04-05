import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) { }

  getGeoJSONByUrl(url:string) {
    return this.http.get(url
      //,{headers: {'Access-Control-Allow-Origin': '*' } }
      );
  }
  getCovidUSData(){
    return this.http.get("https://sg-covid19.herokuapp.com/api/us")
  }
  getCovidIndiaData(){
    return this.http.get("https://sg-covid19.herokuapp.com/api/india")
  }
  getCovidWorldData(){
    return this.http.get("https://sg-covid19.herokuapp.com/api/all")
  }
}
