import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../../models/users';
import firebase from 'firebase';

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
    console.log('Hello LoginServiceProvider Provider');
  }

  login() {

  }

  checkEmailAndPassword(email: string, password: string) {
    console.log('23 loginservice');

    return firebase.firestore().collection('users').where('email', '==', email).where('password', '==', password).get()
  }

}
