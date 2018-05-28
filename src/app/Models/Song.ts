
export class Song {
  sid : string ;
  album: string ;
  artistId: string ;
  length: string ;
  listens : string ;
  lastUpdate : string;
  name: string ;
  songImage: string ;

  constructor( sid: string, artistId: string,listens : string, album: string,lastUpdate : string, length: string, name : string, songImage: string) {
    this.sid = sid;
    this.album = album;
    this.artistId = artistId;
    this.listens = listens;
    this.lastUpdate = lastUpdate;
    this.length = length;
    this.name = name;
    this.songImage = songImage;
  }
}
