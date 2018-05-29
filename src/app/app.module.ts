import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SongComponent } from './components/song/song.component';

import {environment} from "../environments/environment";
//angularfire2
import {AngularFireModule } from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import { SongItemComponent } from './components/song/song-item/song-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterModule, Routes} from "@angular/router";
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AddSongComponent } from './components/song/add-song/add-song.component';
import {AngularFireStorageModule} from "angularfire2/storage";

const appRoutes: Routes =[
  {path:'', component: SongComponent},
  {path:'addsong', component: AddSongComponent},
 // {path:'facebook', component: FacebookComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    SongItemComponent,
    FooterComponent,
    NavbarComponent,
    GoogleMapsComponent,
    AddSongComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyB3YN-E65c4Zc2ZAQcj1HOKSHmpcq7Jq1Q'}),
    AgmDirectionModule,
    FormsModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
