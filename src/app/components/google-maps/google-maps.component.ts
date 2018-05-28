import { Component, OnInit } from '@angular/core';
import {Input} from "@angular/core";
import {Location} from "../../Models/Location.model";
import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';

//import {Locations} from "../../../Models/Location";

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  @Input() location: Location;
  @Input() zoom: number = 14;

//default - college
  lat: Number = 31.970579;
  lon: Number = 34.772462;

  dir = undefined;

  constructor() {

  }

  ngOnInit() {
    //console.log(Number(this.location.startLatitude));


    this.lat = (Number(this.location.startLatitude)+Number(this.location.endLatitude)) /2;
    this.lon =  (Number(this.location.startLongitude)+Number(this.location.endLongitude)) /2;
    //this.getDirection();
  }
  getDirection() {
    if(this.dir == undefined) {
      this.dir = {
        origin: {lat: Number(this.location.startLatitude), lng: Number(this.location.startLongitude)},
        destination: {lat: Number(this.location.endLatitude), lng: Number(this.location.endLongitude)},
        travelMode: 'WALKING'
      }
    }
  }
}
