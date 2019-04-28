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

  checkRoomChat(email, email_friend) {
    return firebase.firestore().collection('rooms').doc(email + '_' + email_friend).get()
  }

  createRoomChat(email, email_friend) {
    return this.db.collection('rooms').doc(email + '_' + email_friend).set({
      user1: email,
      user2: email_friend
    })
  }

  getRoomChat(email) {
    return firebase.firestore().collection('rooms').where('user1', '==', email)
  }

  createChat(email, email_friend, date, input) {
    return this.db.collection('rooms').doc(email + '_' + email_friend).collection('messages').add({
      sender: email,
      type: 'text',
      date: date,
      content: input
    })
  }

  createChatFriend(email, email_friend, date, input) {
    return this.db.collection('rooms').doc(email_friend + '_' + email).collection('messages').add({
      sender: email,
      type: 'text',
      date: date,
      content: input
    })
  }

  getChat(email, email_friend) {
    return firebase.firestore().collection('rooms').doc(email + '_' + email_friend).collection('messages').orderBy("date")
  }

  deleteMsg(email, email_friend, message) {
    return firebase.firestore().collection('rooms').doc(email + '_' + email_friend).collection('messages').where('sender', '==', message.sender).where('type', '==', message.type).where('date', '==', message.date).where('content', '==', message.content).get().then(doc => {
      firebase.firestore().collection('rooms/' + email + '_' + email_friend + '/messages').doc(doc.docs[0].id).delete()
    })
  }

}
