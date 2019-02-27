import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the FirebaseStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseStorageProvider {



  constructor(public http: HttpClient) {
    console.log('Hello FirebaseStorageProvider Provider');
  }

  getURLImg(email, photo) {
    return firebase.storage().ref('profile/' + email + '/' + photo).getDownloadURL();
  }

}
