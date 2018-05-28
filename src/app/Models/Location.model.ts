
export class Location {
  sid: string;
  startLatitude: string;
  startLongitude: string;
  //song: string ;
  endLatitude: string;
  endLongitude: string;
  lastUpdate: string;


  constructor(sid: string,lastUpdate :string, startLatitude: string, startLongitude: string, endLatitude: string, endLongitude: string) {
    this.sid = sid;
    this.lastUpdate = lastUpdate;
    this.startLatitude = startLatitude;
    this.startLongitude = startLongitude;
    this.endLatitude = endLatitude;
    this.endLongitude = endLongitude;


  }
}
