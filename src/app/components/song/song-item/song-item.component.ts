import {Component, Input, OnInit, Output} from '@angular/core';
import {Song} from "../../../Models/Song";
import {Location} from "../../../Models/Location.model";
import {Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/index";
import {FirebaseApp} from "angularfire2";
//import {Location} from "../../Models/Location.model";

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.css']
})
export class SongItemComponent implements OnInit {

  lat: string;
  lon : string;
  @Input() song: Song;
  @Output() locationsCordinate: Location;
  location : Observable<any>;



    constructor(private db:AngularFireDatabase , fb: FirebaseApp,private router:Router) {

    }

  ngOnInit() {
    console.log(this.song);
    this.location = this.db.object('locations/' + this.song.sid).valueChanges();
    this.location.subscribe(data =>{
      this.locationsCordinate = data;
      console.log(this.song.sid , this.locationsCordinate )

    });

  }

}
