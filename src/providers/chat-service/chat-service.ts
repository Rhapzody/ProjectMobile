import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { async } from '@firebase/util';

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
      user2: email_friend,
      time: Date.now()
    })
  }

  getRoomChat(email) {
    return firebase.firestore().collection('rooms').where('user1', '==', email).orderBy('time', 'desc')
  }

  updateRoomChat(email, email_friend, date) {
    return this.db.collection('rooms').doc(email + '_' + email_friend).update({
      time: date
    })
  }

  createChat(email, email_friend, date, input) {
    return this.db.collection('rooms').doc(email + '_' + email_friend).collection('messages').add({
      sender: email,
      type: 'text',
      date: date,
      content: input,
      status: 0
    }).then(() => {
      this.updateRoomChat(email, email_friend, date)
    })
  }

  createChatFriend(email, email_friend, date, input) {
    return this.db.collection('rooms').doc(email_friend + '_' + email).collection('messages').add({
      sender: email,
      type: 'text',
      date: date,
      content: input,
      status: 0
    })
  }

  updateStatusChat(email, email_friend, id) {
    return this.db.collection('rooms').doc(email + '_' + email_friend).collection('messages').doc(id).update({
      status: 1
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

  deleteRoomChat(email, email_friend) {
    return firebase.firestore().collection('rooms').doc(email + '_' + email_friend).collection('messages').get().then(async (docs) => {
      await docs.forEach(doc => {
        firebase.firestore().collection('rooms/' + email + '_' + email_friend + '/messages').doc(doc.id).delete().then(() => {

        })
      })

      firebase.firestore().collection('rooms').doc(email + '_' + email_friend).delete().then(() => {
        
      })
    })
  }

}
