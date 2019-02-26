import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../../models/users';

/*
  Generated class for the RegisterServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegisterServiceProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
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

  createUser(user: User){
    console.log(user);
    
    this.db.collection('users').doc(user.email).set({
      email: user.email,
      name: user.name,
      password: user.password,
      photo: user.photo,
      registime: firebase.firestore.FieldValue.serverTimestamp()
    }).then(data => {
      console.log(data);
      alert(JSON.stringify(data))
    }).catch(err=>{
      console.log(err);
      alert(JSON.stringify(err))
    })
  }

}
