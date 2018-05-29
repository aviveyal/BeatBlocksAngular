import { Component, OnInit } from '@angular/core';
import {Song} from "../../../Models/Song";
import {AngularFireDatabase } from "angularfire2/database";
import {FirebaseApp} from 'angularfire2';
import { AngularFireStorage } from 'angularfire2/storage';
import *as firebase from 'firebase'


import {Observable} from "rxjs";

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
  photo: File
  mp3 : File
  lat: Number = 31.970579;
  lon: Number = 34.772462;
  originLat : Number;
  originLon : Number;
  destLat : Number;
  destLon : Number;
  dir = undefined;
  count =0;
  ImageUrl ;
  constructor(private db:AngularFireDatabase , fb: FirebaseApp,private FBstorgae: AngularFireStorage) {
    this.songsRef = this.db.list('songs');
    this.locationRef = this.db.list('locations');
  }

  ngOnInit() {

  }

  addSong(){

    const newSid = this.songsRef.push(
      {artistId:this.artistName ,
        name:this.name,
        album:this.album,
        length:this.length,
        songImage: "",
        lastUpdate:new Date().getTime(),
        listens: (Math.floor(Math.random() * (1000 - 1 + 1)) + 1)+""
      }
      ).key

      this.songsRef.update(newSid, {sid : newSid})

      this.FBstorgae.upload('/SongImages/'+newSid+".jpg",this.photo ).then(
        snapshot =>
        {
          const ref = this.FBstorgae.ref('/SongImages/'+newSid+".jpg");
          const downloadURL = ref.getDownloadURL();

            downloadURL.subscribe(url =>{
              if(url){
                this.ImageUrl = url;
                console.log(this.ImageUrl);
                this.songsRef.update(newSid,{songImage: this.ImageUrl});
              }
            });

        }
      );
      this.FBstorgae.upload('/'+newSid+".mp3",this.mp3 );

    const location =this.locationRef.update(newSid,
      {   startLatitude:this.originLat+"" ,
        startLongitude:this.originLon+"",
        endLatitude:this.destLat+"",
        endLongitude:this.destLon+"",
        lastUpdate:new Date().getTime(),
        sid: newSid
      }
    )
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
