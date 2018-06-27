import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {

  constructor(private http: HttpClient) { }

  getLocationAddress(place) {
    return this.http.get('http://localhost:3000/api/formatAddress/' + place)
  }
}
