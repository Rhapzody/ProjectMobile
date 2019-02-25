import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';


/*
  Generated class for the RegisterServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegisterServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RegisterServiceProvider Provider');
  }

  async upload(buffer, name) {

    alert('555')
    let blob = new Blob([buffer], { type: "image/jpeg"})

    let storage = firebase.storage();

    storage.ref('profile/' + name).put(blob).then(d => {
      alert(d)
    }).catch(err => {
      alert(JSON.stringify(err))
    })
  }

}
