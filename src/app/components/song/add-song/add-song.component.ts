import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import {Song} from "../../../Models/Song";
import {AngularFireDatabase } from "angularfire2/database";
import {FirebaseApp} from 'angularfire2';
import { AngularFireStorage } from 'angularfire2/storage';
import {FlashMessagesService} from "angular2-flash-messages";
import *as firebase from 'firebase'
import {ValidationsService} from  '../../../services/validations.service'
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  songs : Song[];
  name : string;
  album: string;
  artistName :string;
  length: string;
  songImage: string;
  songsRef;
  locationRef;
  validataion =0;
  finishedUpload =0;


  public searchControl: FormControl;

  photo: File;
  mp3 : File;
  lat: Number = 31.970579;
  lon: Number = 34.772462;
  originLat : Number;
  originLon : Number;
  destLat : Number;
  destLon : Number;
  dir = undefined;
  count =0;
  ImageUrl ;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private router: Router, private flashMessage:FlashMessagesService,private validationsService:ValidationsService, private db:AngularFireDatabase , fb: FirebaseApp,private FBstorgae: AngularFireStorage) {
    this.songsRef = this.db.list('songs');
    this.locationRef = this.db.list('locations');
  }

  ngOnInit() {

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lon = place.geometry.location.lng();
         // this.zoom = 12;
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        //this.zoom = 12;
      });
    }
  }

  addSong() {
    this.validataion = 0;

    if (this.name == undefined || this.album == undefined || this.length == undefined || this.photo == undefined || this.mp3 == undefined) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      this.validataion = 1;
      window.scrollTo(0, 0)
    }
    if (this.originLat == undefined || this.originLon == undefined || this.destLat == undefined || this.destLat == undefined) {
      this.flashMessage.show('Please choose path on the map', {cssClass: 'alert-danger', timeout: 3000});
      this.validataion = 1;
      window.scrollTo(0, 0)
    }

    if (this.length != undefined) {
      if (!this.validationsService.validateTime(this.length)) {
      this.flashMessage.show('Please use a valid length', {cssClass: 'alert-danger', timeout: 3000});
      this.validataion = 1;
      window.scrollTo(0, 0)
    }
    }

    if(this.validataion==0) {

      const newSid = this.songsRef.push(
        {
          artistId: this.artistName,
          name: this.name,
          album: this.album,
          length: this.length,
          songImage: "",
          lastUpdate: new Date().getTime(),
          listens: (Math.floor(Math.random() * (1000 - 1 + 1)) + 1) + ""
        }
      ).key

      this.songsRef.update(newSid, {sid: newSid})

      this.FBstorgae.upload('/SongImages/' + newSid + ".jpg", this.photo).then(
        snapshot => {
          const ref = this.FBstorgae.ref('/SongImages/' + newSid + ".jpg");
          const downloadURL = ref.getDownloadURL();

          downloadURL.subscribe(url => {
            if (url) {
              this.ImageUrl = url;
              console.log(this.ImageUrl);
              this.songsRef.update(newSid, {songImage: this.ImageUrl});
            }
          });

        }
      );
      this.FBstorgae.upload('/' + newSid + ".mp3", this.mp3);

      const location = this.locationRef.update(newSid,
        {
          startLatitude: this.originLat + "",
          startLongitude: this.originLon + "",
          endLatitude: this.destLat + "",
          endLongitude: this.destLon + "",
          lastUpdate: new Date().getTime(),
          sid: newSid
        }
      )
    }
    this.flashMessage.show('You added new song successfully!', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/']);
  }

  fileChangePhoto(event) {
     this.photo= event.target.files[0];
  }
  fileChangeAudio(event) {
    this.mp3= event.target.files[0];
  }

  placeMarker($event){

      if (this.count == 0) {
        this.originLat = $event.coords.lat;
        this.originLon = $event.coords.lng;

        this.count++;
      }
      else if (this.count == 1) {
        this.destLat = $event.coords.lat;
        this.destLon = $event.coords.lng;
        this.dir = {
          origin: {lat: this.originLat, lng: this.originLon},
          destination: {lat: Number($event.coords.lat), lng: Number($event.coords.lng)},
          travelMode: 'WALKING'
        }

        this.count++;

      }
    }




}
