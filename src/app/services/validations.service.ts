import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() {
    console.log('validation Service Initialized...');
  }

  validateRegister(user) {

    if (user.name == undefined || user.email == undefined || user.username == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateTime (time){
    var m;
    const re= /^\s*([0-5]?\d|5[0-9]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
      return true;
    }
    return false;
  }

  validateUrl(url){
    var m;
    const re = /^http[^ \!@\$\^&\(\)\+\=]+(\.png|\.jpeg|\.gif|\.jpg)$/;
    if ((m = url.match(re))) {
      return true;
    }
    return false;
  }


  // validateAvailable(artistName, email ,username) {
  //   return this.http.get('/users/validation/' + artistName+'/'+ email+'/'+username).map(res => res.json());
  // }
}
