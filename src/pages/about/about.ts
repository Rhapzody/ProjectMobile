import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Room } from '../../models/rooms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { Storage } from '@ionic/storage';
import { User } from '../../models/users';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  user: User;
  rooms: Array<Room>

  constructor(public navCtrl: NavController, private param: NavParams, private chatService: ChatServiceProvider, private userService: UserServiceProvider,
    private firebaseSto: FirebaseStorageProvider, public loadingCtrl: LoadingController, private storage: Storage, public app: App) {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log(this.param.data);
    if (this.param.data.email) {
      this.loadData(this.param.data)
    } else {
      this.storage.get('authChat').then((value) => {
        if (value) {
          this.userService.checkEmailUser(value).then((docUser) => {
            if (!docUser.empty) {
              docUser.forEach(async data => {
                let usertemp = <User>data.data();
                if (usertemp.photo != '') {
                  let url = await this.firebaseSto.getURLImg(usertemp.email, usertemp.photo)
                  usertemp.photo = url;
                  // loading.dismiss()
                } else {
                  usertemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
                  // loading.dismiss()

                }
                this.loadData(usertemp)
              })
            }
          })
        }
      })
    }
  }

  onClickOpenChat(room) {
    this.navCtrl.push(ChatPage, { room: room, user: this.user })
  }

  loadData(usertemp) {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    })

    loading.present().then(() => {
      this.user = usertemp;
      this.chatService.getRoomChat(this.user.email).onSnapshot(async data => {
        let roomtemp = [];
        await data.forEach((room) => {
          this.userService.checkEmailUser(room.data().user2).then(user2 => {
            let dataTemp = user2.docs[0].data()
            if (dataTemp.photo != '') {
              this.firebaseSto.getURLImg(dataTemp.email, dataTemp.name).then(url => {
                dataTemp.photo = url;
                let msgTemp = [];
                this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
                  if (chat.docs.length > 0) {
                    chat.docChanges.forEach(data => {
                      msgTemp.push(data.doc.data())
                    })
                  }
                })
                roomtemp.push({ friend: dataTemp, messages: msgTemp });
                this.rooms = roomtemp;
              })
            } else {
              dataTemp.photo = "https://png.pngtree.com/svg/20170827/people_106508.png";
              let msgTemp = [];
              this.chatService.getChat(this.user.email, dataTemp.email).onSnapshot(chat => {
                if (chat.docs.length > 0) {
                  chat.docChanges.forEach(data => {
                    msgTemp.push(data.doc.data())
                  })
                }
              })
              roomtemp.push({ friend: dataTemp, messages: msgTemp });
              this.rooms = roomtemp;
            }
          })
        })
        loading.dismiss()
      })
    })
  }

  signout() {
    console.log('135');
    this.storage.remove('authChat');
    this.app.getRootNav().setRoot(LoginPage)
  }

}
