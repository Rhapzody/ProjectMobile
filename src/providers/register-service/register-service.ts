import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../../models/users';
import { AngularFireStorage } from 'angularfire2/storage';

/*
  Generated class for the RegisterServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegisterServiceProvider {

  constructor(public http: HttpClient, private db: AngularFirestore, private fstorage: AngularFireStorage) {
    console.log('Hello RegisterServiceProvider Provider');
  }

  createUser(user: User) {
    console.log(user);

    return this.db.collection('users', ref => ref.where('email', '==', user.email)).doc(user.email).set({
      email: user.email,
      name: user.name,
      password: user.password,
      photo: user.photo,
      registime: firebase.firestore.FieldValue.serverTimestamp(),
      friends: new Array(),
      tel: user.tel
    })
    // .then(data => {
    //   console.log(data);
    //   alert(JSON.stringify(data))
    // }).catch(err => {
    //   console.log(err);
    //   alert(JSON.stringify(err))
    // })
  }

  uploadImg(user: User) {
    return this.fstorage.ref('profile/' + user.email + '/' + user.name).putString(user.photo, firebase.storage.StringFormat.DATA_URL)
    // .then(d => {
    //   alert(JSON.stringify(d))
    // }).catch(err => {
    //   alert(JSON.stringify(err))
    // })
  }

  checkEmailDuplicate(email) {
    console.log('50 service');

    return firebase.firestore().collection('users').doc(email).get()

  }

}
