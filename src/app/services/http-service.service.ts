import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) { }
  getCovidGeoJSONByUrl(url: string) {
    return this.http.get(url
      , {
        headers: {
          "x-rapidapi-host": "covid19-data.p.rapidapi.com",
          "x-rapidapi-key": "S1lPd3tDJgmshwvS3P2ijOpXs1tpp15vp7OjsnlVONTrdpBH7T"
        }
      }
    );
  }
  getGeoJSONByUrl(url:string) {
    return this.http.get(url);
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
