import { Component, OnInit } from '@angular/core';

import {AngularFireDatabase } from "angularfire2/database";
import {FirebaseApp} from 'angularfire2';

import {Observable} from "rxjs";
import {Song} from "../../Models/Song";
import {forEach} from "@angular/router/src/utils/collection";
import {Router} from "@angular/router";
@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  songs : Observable<any[]>;
  songsList : Song [];
  constructor(private db:AngularFireDatabase , fb: FirebaseApp,private router:Router) {

    this.songs = db.list('songs').valueChanges();
    this.songs.subscribe(data =>{
      this.songsList = data;
      console.log(this.songsList)
    });

  }


  ngOnInit() {
  }

}
