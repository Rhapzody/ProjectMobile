import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatServiceProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
    console.log('Hello ChatServiceProvider Provider');
  }

  checkRoomChat(email, email_friend){
    if (email < email_friend) {
      return firebase.firestore().collection('rooms').doc(email_friend + '_' + email).get()
    }else{
      return firebase.firestore().collection('rooms').doc(email + '_' + email_friend).get()
    }

  }

  createRoomChat(email, email_friend) {
    if (email < email_friend) {
      return this.db.collection('rooms').doc(email_friend + '_' + email).set({
        user1: email_friend,
        user2: email
      })
    } else {
      return this.db.collection('rooms').doc(email + '_' + email_friend).set({
        user1: email,
        user2: email_friend
      })
    }
  }

  createChat(){
    
  }



}
