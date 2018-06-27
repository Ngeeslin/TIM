import { Component } from '@angular/core';
import { UberQueryService } from "../uber-query.service";


@Component({
  selector: 'app-searchBar',
  template: `
    <input #location
      (keyup.enter)="addLocation(location.value)"
      (blur)="addLocation(location.value); location.value='' ">

    <button (click)="addLocation(location.value)">Set Location</button>

    <p>{{locationSet}}</p>
    <input #destination
           (keyup.enter)="addDestination(destination.value)"
           (blur)="addDestination(destination.value); destination.value='' ">

    <button (click)="addDestination(destination.value)">Set Destination</button>

    <p>{{destinationSet}}</p>
    <button (click) = "uQuery()">Should I Uber?</button>
    <p>{{answer.text}}</p>
    <style>
      button{
        background-color: white;
        border: none;
        color: black;
        padding: 1px 30px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 2px 2px;
        cursor: pointer;
      }
    </style>
  `
})
export class SearchBarComponent {
  answer;
  locationSet;
  destinationSet;

  constructor(private uber: UberQueryService) {}

  addLocation(place: string) {
    if (place) {
      this.uber.getLocationAddress(place).subscribe(
        uber => {this.locationSet = uber},
        err => {console.error(err)},
        () => {console.log("address Formatted")}
      );
    }
  }
  addDestination(place: string) {
    if (place) {
      this.uber.getLocationAddress(place).subscribe(
        uber => {this.destinationSet = uber},
        err => {console.error(err)},
        () => {console.log("address Formatted")}
      );
    }
  }
  uQuery() {
    if (this.locationSet && this.destinationSet) {
      this.uber.uberQ(this.locationSet, this.destinationSet).subscribe(
        uber => {
          this.answer = uber
        },
        err => {
          console.error(err);
          this.uQuery()   //the Uber API is a bit finicky and only works after a few queries, this ensures the button only needs to be pressed once.
        },
        () => {
          console.log("query answered")
        }
      );
    }
    else{
      this.answer = 'please input a location and a destination'
    }
  }
}
