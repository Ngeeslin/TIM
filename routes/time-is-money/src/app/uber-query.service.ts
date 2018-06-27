import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UberQueryService {

  constructor(private http: HttpClient) { }

  uberQ(address1, address2){
    return this.http.get('http://localhost:3000/api/query/' + address1 + '/' + address2)
  }
  getLocationAddress(place) {
    return this.http.get('http://localhost:3000/api/formatAddress/' + place)
  }
}
