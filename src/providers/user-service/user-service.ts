import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase, { firestore } from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { User } from '../../models/users';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  private userSource = new BehaviorSubject(new User);
  userCurrent = this.userSource.asObservable();

  constructor(public http: HttpClient, private db: AngularFirestore) {
    console.log('Hello UserServiceProvider Provider');
  }

  changeUser(user: User) {
    this.userSource.next(user);
  }

  checkEmailUser(email: string) {
    console.log(email);

    return firebase.firestore().collection('users').where('email', '==', email).get()
  }

  addFriend(email, email_friend, status, userTemp: User) {
    return this.checkEmailUser(email).then(user => {
      (user.docs.forEach(data => {
        let friendsTemp = data.data().friends;
        friendsTemp.push({ email: email_friend });
        this.updateFriendsUser(email, friendsTemp).then(() => {
          userTemp.friends = friendsTemp
          this.changeUser(userTemp)
          if (status == 1) {
            this.setRequestUser(email, email_friend)
          } else {
            this.deleteRequestFriend(email, email_friend)
          }

        });
      }))
    })
  }

  // เพิ่ม friend ใน user
  updateFriendsUser(email, friendsTemp) {
    return this.db.collection('users').doc(email).update(
      {
        friends: friendsTemp
      }
    )
  }

  // เก็บ status การ add friend user
  setRequestUser(email, email_friend) {
    if (email < email_friend) {
      return this.db.collection('request').doc(email_friend + '_' + email).set({
        user_req: email,
        user_rec: email_friend,
        date: new Date().getTime()
      })
    } else {
      return this.db.collection('request').doc(email + '_' + email_friend).set({
        user_req: email,
        user_rec: email_friend,
        date: new Date().getTime()
      })
    }
  }

  getRequestFriend(email) {
    return firebase.firestore().collection('request').where('user_rec', '==', email).orderBy('date', 'desc')

  }

  deleteRequestFriend(email, email_friend) {
    if (email < email_friend) {
      return this.db.collection('request').doc(email_friend + '_' + email).delete()
    } else {
      return this.db.collection('request').doc(email + '_' + email_friend).delete()
    }
  }

}
